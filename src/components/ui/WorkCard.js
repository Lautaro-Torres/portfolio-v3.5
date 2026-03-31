import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTransitionRouter } from "../../hooks/useTransitionRouter";
import { requestVideoPlay } from "../../utils/requestVideoPlay";

const isVideoUrl = (url) =>
  url && typeof url === "string" && /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);

/** Grid duplicado (md:hidden / hidden md:block): el oculto no tiene caja; no forzar carga ahí. */
function hasLayoutBox(el) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.width >= 4 && r.height >= 4;
}

function isNearViewport(el, marginPx) {
  if (!hasLayoutBox(el)) return false;
  const r = el.getBoundingClientRect();
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  return r.top < vh + marginPx && r.bottom > -marginPx;
}

export default function WorkCard({
  title,
  videoUrl,
  posterUrl,
  logoUrl,
  tags,
  href,
  containerClassName = "",
  /** Fila de una sola columna (card ancha en mobile): logo más chico */
  isFullWidthCard = false,
  ariaLabel,
  /**
   * Índice /projects: sin sombra (evita halo tipo borde sobre #0a0a0a) y tags en varias líneas con todas las tags.
   */
  projectsGrid = false,
}) {
  const useVideo = videoUrl && isVideoUrl(videoUrl);
  const { push, isTransitioning } = useTransitionRouter();
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const pauseMetaRef = useRef({ pausedAt: 0, pausedOnMs: 0, duration: 0 });
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasPosterError, setHasPosterError] = useState(false);

  const didMountVideoReadySkip = useRef(false);
  useEffect(() => {
    if (!useVideo) return;
    if (!didMountVideoReadySkip.current) {
      didMountVideoReadySkip.current = true;
      return;
    }
    setIsVideoReady(false);
  }, [useVideo, videoUrl]);

  const handleClick = (e) => {
    e.preventDefault();

    if (isTransitioning) return;

    push(href);
  };

  const hasLogo = logoUrl?.trim(); // logo vacío = fallback
  // Mantener siempre el póster visible como fallback; el video se superpone con fade-in
  // para evitar flashes en negro cuando cambia el estado de carga.
  const showPoster = Boolean(posterUrl && !hasPosterError);

  const PRELOAD_MARGIN_PX = 2200;

  useLayoutEffect(() => {
    if (!useVideo) return;
    const card = cardRef.current;
    if (!card || typeof window === "undefined") return;
    // /projects: la grilla visible siempre tiene caja; la duplicada (display:none) no — cargar por layout, no solo por distancia al viewport (ScrollSmoother puede desalinear la primera medición vs isNearViewport).
    if (projectsGrid && hasLayoutBox(card)) {
      setShouldLoadVideo(true);
      return;
    }
    if (isNearViewport(card, PRELOAD_MARGIN_PX)) {
      setShouldLoadVideo(true);
    }
  }, [useVideo, projectsGrid]);

  useEffect(() => {
    if (!useVideo) return;
    const card = cardRef.current;
    if (!card) return;
    if (typeof window === "undefined") {
      setShouldLoadVideo(true);
      return;
    }

    if (projectsGrid && hasLayoutBox(card)) {
      setShouldLoadVideo(true);
      return;
    }

    if (isNearViewport(card, PRELOAD_MARGIN_PX)) {
      setShouldLoadVideo(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setShouldLoadVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoadVideo(true);
        observer.disconnect();
      },
      {
        root: null,
        rootMargin: `${PRELOAD_MARGIN_PX}px 0px`,
        threshold: 0,
      }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [useVideo, projectsGrid]);

  // Tras ScrollSmoother / transición de ruta, la primera medición puede ser incorrecta: reintentar.
  // Sin caja de layout (grid duplicado oculto): no hacer rAF — el IntersectionObserver ya no aplica ahí.
  useEffect(() => {
    if (!useVideo || shouldLoadVideo) return;
    const card = cardRef.current;
    if (!card || !hasLayoutBox(card)) return;

    const tryPromote = () => {
      if (projectsGrid && hasLayoutBox(card)) {
        setShouldLoadVideo(true);
        return true;
      }
      if (isNearViewport(card, PRELOAD_MARGIN_PX)) {
        setShouldLoadVideo(true);
        return true;
      }
      return false;
    };

    const t0 = window.setTimeout(tryPromote, 0);
    const t1 = window.setTimeout(tryPromote, 80);
    const t2 = window.setTimeout(tryPromote, 320);
    const t3 = window.setTimeout(tryPromote, 750);
    const onResize = () => tryPromote();
    window.addEventListener("resize", onResize);

    let frames = 0;
    const MAX_FRAMES = 90;
    let rafId = 0;
    const rafLoop = () => {
      if (tryPromote() || frames++ >= MAX_FRAMES) return;
      rafId = requestAnimationFrame(rafLoop);
    };
    rafId = requestAnimationFrame(rafLoop);

    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, [useVideo, shouldLoadVideo, projectsGrid]);

  useEffect(() => {
    if (!useVideo) return;
    const card = cardRef.current;
    if (!card || !hasLayoutBox(card)) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShouldPlayVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShouldPlayVideo(Boolean(entry?.isIntersecting));
      },
      {
        root: null,
        rootMargin: "640px 0px",
        threshold: 0,
      }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [useVideo]);

  // Caché / carreras: si ya hay metadata, no quedar en opacity-0 esperando otro evento.
  useEffect(() => {
    if (!useVideo || !shouldLoadVideo) return;
    const v = videoRef.current;
    if (!v) return;
    const bump = () => {
      if (v.readyState >= 1) setIsVideoReady(true);
    };
    bump();
    let n = 0;
    let rafId = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      bump();
      if (n++ < 4) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [useVideo, shouldLoadVideo, videoUrl]);

  useEffect(() => {
    if (!useVideo || !shouldLoadVideo) return;
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlayVideo) {
      const { pausedAt, pausedOnMs, duration } = pauseMetaRef.current;
      if (pausedOnMs && duration > 0) {
        const elapsedSec = Math.max(0, (performance.now() - pausedOnMs) / 1000);
        video.currentTime = (pausedAt + elapsedSec) % duration;
      }
      requestVideoPlay(video);
      const onCanPlay = () => {
        if (video.paused) requestVideoPlay(video);
      };
      video.addEventListener("canplay", onCanPlay);
      return () => video.removeEventListener("canplay", onCanPlay);
    }

    if (!video.paused) {
      pauseMetaRef.current = {
        pausedAt: video.currentTime || 0,
        pausedOnMs: performance.now(),
        duration: Number.isFinite(video.duration) ? video.duration : 0,
      };
      video.pause();
    }
  }, [useVideo, shouldLoadVideo, shouldPlayVideo, videoUrl]);

  const tagList = projectsGrid ? tags : tags?.slice(0, 3);
  const tagRowClass = projectsGrid
    ? "flex flex-wrap gap-2 content-start"
    : "flex flex-nowrap gap-1 md:gap-2 overflow-hidden whitespace-nowrap max-w-full";

  return (
    <button
      ref={cardRef}
      onClick={handleClick}
      className={`
        group w-full h-full relative rounded-lg overflow-hidden bg-[#0a0a0a] flex flex-col border-0 appearance-none
        transition-all duration-300 focus:outline-none ${containerClassName}
        ${
          projectsGrid
            ? "shadow-none hover:shadow-none focus-visible:ring-0 focus-visible:shadow-none"
            : "shadow-lg hover:shadow-2xl"
        }
        ${isTransitioning ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      disabled={isTransitioning}
      tabIndex={0}
      aria-label={ariaLabel || `View details for ${title}`}
    >
      {showPoster ? (
        <img
          src={posterUrl}
          alt=""
          aria-hidden="true"
          className={
            projectsGrid
              ? "absolute inset-[-1px] w-[calc(100%+2px)] h-[calc(100%+2px)] object-cover pointer-events-none"
              : "absolute inset-0 w-full h-full object-cover pointer-events-none"
          }
          loading="lazy"
          onError={() => setHasPosterError(true)}
        />
      ) : null}

      {/* Background: video or image */}
      {useVideo ? (
        <video
          key={videoUrl}
          ref={videoRef}
          src={shouldLoadVideo ? videoUrl : undefined}
          muted
          autoPlay={false}
          loop
          playsInline
          preload={shouldLoadVideo ? "auto" : "none"}
          onLoadedMetadata={() => setIsVideoReady(true)}
          onLoadedData={() => setIsVideoReady(true)}
          onCanPlay={() => setIsVideoReady(true)}
          onPlaying={() => setIsVideoReady(true)}
          onError={() => setIsVideoReady(false)}
          className={`${
            projectsGrid
              ? "absolute inset-[-1px] w-[calc(100%+2px)] h-[calc(100%+2px)]"
              : "absolute inset-0 w-full h-full"
          } object-cover pointer-events-none transition-all duration-400 ease-ui-standard group-hover:scale-[1.03] ${
            isVideoReady ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}

      {/* Gradient */}
      <div
        className={`
          absolute inset-0 z-10 pointer-events-none
          bg-[linear-gradient(to_bottom_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.3)_40%,transparent_100%)]
          md:bg-[linear-gradient(to_top_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.3)_40%,transparent_100%)]
          transition-all duration-700 ease-ui-standard
          md:group-hover:bg-[#0a0a0a]/60
        `}
      />

      {/* ------------------------------ */}
      {/* MOBILE TOP-LEFT — pegado a esquina; logo o título si no hay logo */}
      {/* Cards anchas (full row): tope más bajo para no competir con el video */}
      {/* ------------------------------ */}
      <div
        className={`absolute left-3 top-3 z-30 md:hidden max-w-[calc(100%-1.5rem)] ${
          isFullWidthCard
            ? "w-[min(34%,8rem)]"
            : "w-[min(50%,11rem)]"
        }`}
      >
        {hasLogo ? (
          <img
            src={logoUrl}
            alt={`${title} logo`}
            className={`block h-auto w-full object-contain object-left brightness-0 invert drop-shadow-lg ${
              isFullWidthCard ? "max-h-11" : "max-h-14"
            }`}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          <span
            className={`block text-left font-anton uppercase leading-[0.95] tracking-[0.02em] text-white drop-shadow-md [text-shadow:0_1px_12px_rgba(0,0,0,0.65)] ${
              isFullWidthCard
                ? "text-[clamp(0.8rem,2.6vw,0.95rem)]"
                : "text-[clamp(0.875rem,3.8vw,1.125rem)]"
            }`}
          >
            {title}
          </span>
        )}
      </div>

      {/* MOBILE TAGS */}
      <div className="absolute bottom-3 left-3 right-3 z-20 md:hidden">
        <div className={tagRowClass}>
          {tagList?.map((tag, idx) => (
            <span
              key={tag + idx}
              className="px-[clamp(0.45rem,2.4vw,0.65rem)] py-[clamp(0.22rem,1.2vw,0.3rem)] text-[clamp(9px,2.2vw,10px)] font-general font-light uppercase text-white bg-[#0a0a0a]/40 backdrop-blur-md border border-white/20 rounded-full tracking-[0.14em] shrink-0"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ------------------------------ */}
      {/* DESKTOP CONTENT */}
      {/* ------------------------------ */}
      {/* Hover chevron - desktop, top right (evita superposiciones) */}
      <div className="absolute top-7 right-7 z-20 hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="inline-flex items-center justify-center rounded-full text-white/90">
          <svg className="w-8 h-8 drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      <div
        className={`absolute bottom-7 left-7 z-20 hidden md:flex flex-col-reverse items-start gap-y-5 ${
          projectsGrid ? "right-7 w-auto" : ""
        }`}
      >
        {/* Tags arriba, logo/título abajo; gap-y separa logo y pills (antes quedaban muy pegados). */}
        <div className={projectsGrid ? "flex flex-wrap gap-2 content-start w-full max-w-full" : tagRowClass}>
          {tagList?.map((tag, idx) => (
            <span
              key={tag + idx}
              className="px-[clamp(0.65rem,1.05vw,1rem)] py-[clamp(0.34rem,0.6vw,0.5rem)] text-[clamp(9px,0.85vw,12px)] font-general font-light uppercase text-white bg-[#0a0a0a]/40 backdrop-blur-md border border-white/20 rounded-full tracking-[0.14em] shrink-0"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center">
          {/* Logo OR Fallback Title */}
          {hasLogo ? (
            <Image
              src={logoUrl}
              alt={`${title} logo`}
              width={240}
              height={90}
              className="object-contain drop-shadow-lg transition-all duration-700 ease-ui-standard group-hover:translate-x-[38px]"
              style={{ width: "50%", height: "auto", maxHeight: "80px" }}
            />
          ) : (
            <span
              className="
                font-anton
                font-normal
                uppercase
                tracking-[0.02em]
                text-white
                text-[1.4rem]
                drop-shadow-lg
                transition-all duration-700 ease-ui-standard
                group-hover:translate-x-[38px]
              "
            >
              {title}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
