import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTransitionRouter } from "../../hooks/useTransitionRouter";

const isVideoUrl = (url) =>
  url && typeof url === "string" && /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);

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
}) {
  const useVideo = videoUrl && isVideoUrl(videoUrl);
  const { push, isTransitioning } = useTransitionRouter();
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const pauseMetaRef = useRef({ pausedAt: 0, pausedOnMs: 0, duration: 0 });
  const [shouldLoadVideo, setShouldLoadVideo] = useState(!useVideo);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(!useVideo);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasPosterError, setHasPosterError] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();

    if (isTransitioning) return;

    push(href);
  };

  const hasLogo = logoUrl?.trim(); // logo vacío = fallback
  const showPoster = Boolean(
    posterUrl &&
      !hasPosterError &&
      (!useVideo || (useVideo && shouldLoadVideo && !isVideoReady))
  );

  useEffect(() => {
    if (!useVideo) return;
    const card = cardRef.current;
    if (!card) return;
    if (typeof window === "undefined") {
      setShouldLoadVideo(true);
      return;
    }

    const preloadAheadPx = 760;
    const top = card.getBoundingClientRect().top;
    if (top <= window.innerHeight + preloadAheadPx) {
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
        rootMargin: `${preloadAheadPx}px 0px`,
        threshold: 0.01,
      }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [useVideo]);

  useEffect(() => {
    if (!useVideo) return;
    const card = cardRef.current;
    if (!card) return;
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
        // Keep playback only for cards close to viewport.
        rootMargin: "280px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [useVideo]);

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
  }, [useVideo, shouldLoadVideo, shouldPlayVideo]);

  return (
    <button
      ref={cardRef}
      onClick={handleClick}
      className={`
        group w-full h-[35vh] relative rounded-lg overflow-hidden shadow-lg bg-[#0a0a0a] flex flex-col border-0 appearance-none
        transition-all duration-300 focus:outline-none ${containerClassName}
        ${isTransitioning ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-2xl"}
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
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          loading="lazy"
          onError={() => setHasPosterError(true)}
        />
      ) : null}

      {/* Background: video or image */}
      {useVideo ? (
        <video
          ref={videoRef}
          src={shouldLoadVideo ? videoUrl : undefined}
          muted
          autoPlay={false}
          loop
          playsInline
          preload={shouldLoadVideo ? "metadata" : "none"}
          onLoadedData={() => setIsVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-700 ease-ui-standard group-hover:scale-[1.03] ${
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
        <div className="flex flex-wrap gap-1">
          {tags?.map((tag, idx) => (
            <span
              key={tag + idx}
              className="px-2 py-1 text-[10px] font-general font-light uppercase text-white bg-[#0a0a0a]/40 backdrop-blur-md border border-white/20 rounded-full tracking-[0.14em]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ------------------------------ */}
      {/* DESKTOP CONTENT */}
      {/* ------------------------------ */}
      <div className="absolute bottom-7 left-7 z-20 hidden md:flex flex-col items-start">
        <div className="flex items-center">
          {/* Chevron */}
          <span
            className={`
              inline-flex items-center justify-center text-white/90
              transition-all duration-700 ease-ui-standard
              opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0
              mr-[-30px]
            `}
          >
            <svg
              className="w-8 h-8 drop-shadow-lg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
            </svg>
          </span>

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

        {/* DESKTOP TAGS */}
        <div className="flex flex-wrap gap-2 mt-3">
          {tags?.map((tag, idx) => (
            <span
              key={tag + idx}
              className="px-4 py-2 text-[10px] md:text-xs font-general font-light uppercase text-white bg-[#0a0a0a]/40 backdrop-blur-md border border-white/20 rounded-full tracking-[0.14em]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
