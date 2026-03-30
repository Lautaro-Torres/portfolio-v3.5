import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getProjectUrl } from "../../utils/projectUtils";
import { useTransitionRouter } from "../../hooks/useTransitionRouter";

const DRAG_THRESHOLD_PX = 8;

const isVideoUrl = (url) =>
  typeof url === "string" && /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);

export default function ProjectCard({
  title,
  videoUrl,
  logoUrl,
  tags,
  slug,
  className = "",
}) {
  const useVideo = videoUrl && isVideoUrl(videoUrl);
  const { push } = useTransitionRouter();
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const pauseMetaRef = useRef({ pausedAt: 0, pausedOnMs: 0, duration: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(!useVideo);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(!useVideo);

  useEffect(() => {
    if (!useVideo) return;
    const card = cardRef.current;
    if (!card) return;
    if (typeof window === "undefined") {
      setShouldLoadVideo(true);
      return;
    }

    const preloadAheadPx = window.innerWidth < 768 ? 420 : 620;
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
        // Tighter play window to reduce concurrent video decode work.
        rootMargin: "220px 0px",
        threshold: 0.2,
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

  return (
    <a
      ref={cardRef}
      href={url}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      className={`
        group block w-full h-[77vh] min-h-[77vh] md:h-[65vh] md:min-h-[65vh] relative rounded-lg overflow-hidden shadow-lg bg-[#0a0a0a] flex flex-col
        transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer hover:shadow-2xl ${className}
      `}
      tabIndex={0}
      aria-label={`View details for ${title}`}
    >
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
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 ease-ui-standard group-hover:scale-[1.03]"
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

      {/* Chevron hint - desktop, bottom right */}
      <div className="absolute bottom-7 right-7 z-20 hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
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
        <div className="flex flex-wrap gap-2 items-start mt-2 transition-all duration-700 ease-ui-standard opacity-90 group-hover:opacity-100">
          {tags?.map((tag, idx) => (
            <span
              key={tag + idx}
              className="px-4 py-2 text-xs font-general font-light tracking-[0.14em] uppercase text-white bg-[#0a0a0a]/40 backdrop-blur-md border border-white/30 rounded-full"
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
        <div className="flex flex-nowrap gap-1 overflow-hidden whitespace-nowrap">
          {tags?.map((tag, idx) => (
            <span
              key={tag + idx}
              className="shrink-0 px-2 py-1 text-[10px] font-general font-light uppercase text-white bg-[#0a0a0a]/40 backdrop-blur-md border border-white/20 rounded-full tracking-[0.14em]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
