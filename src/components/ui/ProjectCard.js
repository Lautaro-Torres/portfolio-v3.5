import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { getProjectUrl } from "../../utils/projectUtils";
import { useTransitionRouter } from "../../hooks/useTransitionRouter";

const DRAG_THRESHOLD_PX = 8;

const isVideoUrl = (url) =>
  typeof url === "string" && /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);

export default function ProjectCard({
  title,
  imageUrl,
  videoUrl,
  logoUrl,
  tags,
  slug,
  index,
  activeIndex,
  hotIndices,
  className = "",
}) {
  const useVideo = videoUrl && isVideoUrl(videoUrl);
  const { push } = useTransitionRouter();
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const pauseMetaRef = useRef({ pausedAt: 0, pausedOnMs: 0, duration: 0 });
  const hasEverLoadedVideoRef = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasPosterError, setHasPosterError] = useState(false);

  const hasIndexSignal = Number.isFinite(index) && Number.isFinite(activeIndex);
  const { shouldLoadVideo, shouldPlayVideo } = useMemo(() => {
    if (!useVideo) return { shouldLoadVideo: false, shouldPlayVideo: false };
    if (!hasIndexSignal) return { shouldLoadVideo: false, shouldPlayVideo: false };

    const isHot = Array.isArray(hotIndices) ? hotIndices.includes(index) : false;
    const dist = Math.abs(index - activeIndex);
    return {
      // Cargar todo lo que esté visible en el viewport del slider (+ vecinos por seguridad)
      shouldLoadVideo: isHot || dist <= 1,
      // Reproducir lo visible (impacto). Si querés volver a "sólo activo", basta cambiar esto a dist===0.
      shouldPlayVideo: isHot || dist === 0,
    };
  }, [activeIndex, hasIndexSignal, hotIndices, index, useVideo]);
  const effectiveShouldLoadVideo = shouldLoadVideo || hasEverLoadedVideoRef.current;

  useEffect(() => {
    if (!useVideo) return;
    // Reset ready state when we unload/reload source.
    setIsVideoReady(false);
  }, [useVideo, videoUrl]);

  // Fallback: if this card is ever used outside the Swiper, load+play based on viewport proximity.
  useEffect(() => {
    if (!useVideo) return;
    if (hasIndexSignal) return;
    const card = cardRef.current;
    if (!card) return;
    if (typeof window === "undefined") {
      return;
    }

    const preloadAheadPx = window.innerWidth < 768 ? 420 : 620;
    const top = card.getBoundingClientRect().top;
    if (top <= window.innerHeight + preloadAheadPx) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      return;
    }

    // If needed later we can reintroduce IO here, but for now Projects slider uses activeIndex.
  }, [hasIndexSignal, useVideo]);

  useEffect(() => {
    if (!useVideo) return;
    const video = videoRef.current;
    if (!video) return;

    if (!effectiveShouldLoadVideo) {
      // When unloaded, pause and drop time metadata (avoid decode work).
      pauseMetaRef.current = { pausedAt: 0, pausedOnMs: 0, duration: 0 };
      if (!video.paused) video.pause();
      return;
    }
    hasEverLoadedVideoRef.current = true;

    if (shouldPlayVideo) {
      const { pausedAt, pausedOnMs, duration } = pauseMetaRef.current;
      if (pausedOnMs && duration > 0) {
        const elapsedSec = Math.max(0, (performance.now() - pausedOnMs) / 1000);
        video.currentTime = (pausedAt + elapsedSec) % duration;
      }
      const playPromise = video.play();
      if (playPromise?.catch) playPromise.catch(() => {});
      return;
    }

    if (!video.paused) {
      pauseMetaRef.current = {
        pausedAt: video.currentTime || 0,
        pausedOnMs: performance.now(),
        duration: Number.isFinite(video.duration) ? video.duration : 0,
      };
      video.pause();
    }
  }, [useVideo, effectiveShouldLoadVideo, shouldPlayVideo]);

  const handlePointerDown = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    startPos.current = { x, y };
    hasDragged.current = false;
  };

  const handlePointerMove = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaX = Math.abs(x - startPos.current.x);
    const deltaY = Math.abs(y - startPos.current.y);
    // Solo es drag si hay movimiento horizontal significativo (el swiper se mueve en X)
    if (deltaX > DRAG_THRESHOLD_PX || deltaY > DRAG_THRESHOLD_PX) {
      hasDragged.current = true;
    }
  };

  const handleClick = (e) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // Allow browser default for ctrl/cmd+click (open in new tab)
    if (e.ctrlKey || e.metaKey || e.button === 1) return;
    e.preventDefault();
    push(getProjectUrl(slug));
  };

  const url = getProjectUrl(slug);
  const showPoster = Boolean(imageUrl && !hasPosterError);

  return (
    <a
      ref={cardRef}
      href={url}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      className={`
        group block w-full h-[58vh] min-h-[360px] md:h-[52vh] md:min-h-[340px] lg:h-[50vh] lg:min-h-[320px] relative rounded-lg overflow-hidden shadow-lg bg-[#0a0a0a] flex flex-col
        transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer hover:shadow-2xl ${className}
      `}
      tabIndex={0}
      aria-label={`View details for ${title}`}
    >
      {/* Poster (siempre visible como base) */}
      {showPoster ? (
        <img
          src={imageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          loading="lazy"
          onError={() => setHasPosterError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-[#0a0a0a]" aria-hidden="true" />
      )}

      {/* Background: video or image */}
      {useVideo ? (
        <video
          ref={videoRef}
          src={effectiveShouldLoadVideo ? videoUrl : undefined}
          muted
          autoPlay={false}
          loop
          playsInline
          preload={effectiveShouldLoadVideo ? "metadata" : "none"}
          onLoadedMetadata={() => setIsVideoReady(true)}
          onCanPlay={() => setIsVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-400 ease-ui-standard group-hover:scale-[1.03] ${
            isVideoReady ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}

      {/* Gradient overlay for contrast (always visible, like WorkCard) */}
      <div
        className={`
          absolute inset-0 z-10 pointer-events-none
          bg-[linear-gradient(to_bottom_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.3)_40%,transparent_100%)]
          md:bg-[linear-gradient(to_top_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.3)_40%,transparent_100%)]
          transition-all duration-700 ease-ui-standard
          md:group-hover:bg-[#0a0a0a]/52
        `}
      >
        <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 ease-ui-standard overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/16 via-white/8 to-transparent animate-gradient-move"></div>
        </div>
      </div>

      {/* Chevron hint - desktop, top right (evita superposiciones con tags/brand) */}
      <div className="absolute top-7 right-7 z-20 hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="inline-flex items-center justify-center rounded-full text-white/90">
          <svg className="w-8 h-8 drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      {/* Card Content (desktop only) - Logo o título + Tags */}
      <div className="absolute bottom-7 left-7 z-20 hidden md:flex flex-col items-start w-auto pointer-events-none">
        <div className="flex items-center transition-all duration-700 ease-ui-standard group-hover:-translate-y-1 mb-3">
          {logoUrl?.trim() ? (
            <Image
              src={logoUrl}
              alt={`${title || "Project"} logo`}
              width={240}
              height={90}
              className="object-contain drop-shadow-lg transition-all duration-700 ease-ui-standard"
              style={{ width: "40%", maxWidth: "220px", height: "auto", maxHeight: "80px" }}
              loading="lazy"
            />
          ) : (
            <span
              className="
                font-anton uppercase tracking-[0.02em] text-white
                text-[clamp(1.25rem,2.2vw,1.75rem)] leading-tight
                drop-shadow-lg [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]
                transition-all duration-700 ease-ui-standard
              "
            >
              {title}
            </span>
          )}
        </div>
        <div className="flex flex-nowrap gap-2 items-start mt-2 transition-all duration-700 ease-ui-standard opacity-90 group-hover:opacity-100 overflow-hidden whitespace-nowrap max-w-full">
          {tags?.slice(0, 3).map((tag, idx) => (
            <span
              key={tag + idx}
              className="px-[clamp(0.65rem,1.05vw,1rem)] py-[clamp(0.34rem,0.6vw,0.5rem)] text-[clamp(9px,0.85vw,12px)] font-general font-light tracking-[0.14em] uppercase text-white bg-[#0a0a0a]/40 backdrop-blur-md border border-white/30 rounded-full shrink-0"
              style={{ letterSpacing: "0.15em" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* MOBILE BOTTOM-LEFT — logo/título justo arriba de las tags */}
      <div className="pointer-events-none absolute left-3 right-3 bottom-16 z-30 md:hidden w-[min(42%,9rem)] max-w-[calc(100%-1.5rem)]">
        {logoUrl?.trim() ? (
          <img
            src={logoUrl}
            alt={`${title || "Project"} logo`}
            className="block h-auto max-h-11 w-full object-contain object-left drop-shadow-lg"
          />
        ) : (
          <span className="block text-left font-anton uppercase leading-[0.95] tracking-[0.02em] text-white text-[clamp(0.78rem,3.2vw,1rem)] drop-shadow-md [text-shadow:0_1px_12px_rgba(0,0,0,0.65)]">
            {title}
          </span>
        )}
      </div>

      {/* MOBILE TAGS */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 md:hidden">
        <div className="flex flex-nowrap gap-1 overflow-hidden whitespace-nowrap max-w-full">
          {tags?.slice(0, 3).map((tag, idx) => (
            <span
              key={tag + idx}
              className="shrink-0 px-[clamp(0.45rem,2.4vw,0.65rem)] py-[clamp(0.22rem,1.2vw,0.3rem)] text-[clamp(9px,2.2vw,10px)] font-general font-light uppercase text-white bg-[#0a0a0a]/40 backdrop-blur-md border border-white/20 rounded-full tracking-[0.14em]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
