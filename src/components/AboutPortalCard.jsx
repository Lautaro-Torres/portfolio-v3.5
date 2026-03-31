"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

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

export default function AboutPortalCard({
  videoSrc,
  name = "Lautaro Torres",
  className = "",
}) {
  const BASE_ROT_X = 8;
  const BASE_ROT_Y = 18;
  const TOUCH_TILT_FACTOR_X = 1.4;
  const TOUCH_TILT_FACTOR_Y = 1.25;

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const pointerX = useSpring(targetX, { stiffness: 210, damping: 28, mass: 0.58 });
  const pointerY = useSpring(targetY, { stiffness: 210, damping: 28, mass: 0.58 });

  const springConfig = { stiffness: 120, damping: 16, mass: 0.62 };
  const rotateX = useSpring(
    useTransform(pointerY, [-1, 1], [BASE_ROT_X + 8, BASE_ROT_X - 8]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-1, 1], [BASE_ROT_Y - 11, BASE_ROT_Y + 11]),
    springConfig
  );
  const videoX = useSpring(useTransform(pointerX, [-1, 1], [10, -10]), springConfig);
  const videoY = useSpring(useTransform(pointerY, [-1, 1], [9, -9]), springConfig);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const pauseMetaRef = useRef({ pausedAt: 0, pausedOnMs: 0, duration: 0 });
  const touchStartRef = useRef(null);
  const activePointerIdRef = useRef(null);
  const didMountVideoReadySkip = useRef(false);

  const PRELOAD_MARGIN_PX = 2400;

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || typeof window === "undefined") return;
    if (isNearViewport(card, PRELOAD_MARGIN_PX)) {
      setShouldLoadVideo(true);
    }
  }, []);

  useEffect(() => {
    if (!didMountVideoReadySkip.current) {
      didMountVideoReadySkip.current = true;
      return;
    }
    setIsVideoReady(false);
  }, [videoSrc]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (typeof window === "undefined") {
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
  }, []);

  useEffect(() => {
    if (shouldLoadVideo) return;
    const card = cardRef.current;
    if (!card) return;

    const tryPromote = () => {
      if (isNearViewport(card, PRELOAD_MARGIN_PX)) {
        setShouldLoadVideo(true);
        return true;
      }
      return false;
    };

    const t0 = window.setTimeout(tryPromote, 0);
    const t1 = window.setTimeout(tryPromote, 100);
    const t2 = window.setTimeout(tryPromote, 400);
    const onResize = () => tryPromote();
    window.addEventListener("resize", onResize);

    let frames = 0;
    const MAX_FRAMES = 72;
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
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, [shouldLoadVideo]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShouldPlayVideo(true);
      return;
    }

    if (!hasLayoutBox(card)) {
      setShouldPlayVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShouldPlayVideo(Boolean(entry?.isIntersecting));
      },
      {
        root: null,
        rootMargin: "520px 0px",
        threshold: 0,
      }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo) return;
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
      if (n++ < 5) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [shouldLoadVideo, videoSrc]);

  useEffect(() => {
    if (!shouldLoadVideo) return;
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
  }, [shouldLoadVideo, shouldPlayVideo]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(pointer:fine)");
    const sync = () => setIsInteractive(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isInteractive) return;
    const onMove = (event) => {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const nx = (event.clientX / vw) * 2 - 1;
      const ny = (event.clientY / vh) * 2 - 1;
      targetX.set(Math.max(-1, Math.min(1, nx)));
      targetY.set(Math.max(-1, Math.min(1, ny)));
    };
    const onLeave = () => {
      targetX.set(0);
      targetY.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [isInteractive, targetX, targetY]);

  // Motion docs recommend `useAnimationFrame` for continuous per-frame animation.
  useAnimationFrame((time) => {
    if (isInteractive || isTouchActive) return;
    const idleX = Math.sin(time * 0.00055) * 0.085;
    const idleY = Math.cos(time * 0.00045) * 0.06;
    targetX.set(idleX);
    targetY.set(idleY);
  });

  const updateTouchTilt = useCallback(
    (clientX, clientY) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const start = touchStartRef.current;
      if (!start) return;
      const deltaX = (clientX - start.clientX) / Math.max(1, rect.width / TOUCH_TILT_FACTOR_X);
      const deltaY = (clientY - start.clientY) / Math.max(1, rect.height / TOUCH_TILT_FACTOR_Y);
      targetX.set(Math.max(-1, Math.min(1, start.baseX + deltaX)));
      targetY.set(Math.max(-1, Math.min(1, start.baseY + deltaY)));
    },
    [targetX, targetY]
  );

  const resetTouchTilt = useCallback(() => {
    setIsTouchActive(false);
    touchStartRef.current = null;
    activePointerIdRef.current = null;
  }, []);

  const endPointerGesture = useCallback(
    (target, pointerId) => {
      if (activePointerIdRef.current !== pointerId) return;
      try {
        target.releasePointerCapture?.(pointerId);
      } catch {
        /* already released */
      }
      resetTouchTilt();
    },
    [resetTouchTilt]
  );

  return (
    <div
      ref={cardRef}
      className={`relative h-full w-full select-none [perspective:1700px] ${className}`}
      style={{ touchAction: isInteractive ? "auto" : "none" }}
      onPointerDown={(e) => {
        if (isInteractive) return;
        if (e.button !== undefined && e.button !== 0) return;
        setIsTouchActive(true);
        activePointerIdRef.current = e.pointerId;
        touchStartRef.current = {
          clientX: e.clientX,
          clientY: e.clientY,
          baseX: pointerX.get(),
          baseY: pointerY.get(),
        };
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* capture not supported */
        }
        updateTouchTilt(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (isInteractive || !isTouchActive) return;
        if (activePointerIdRef.current !== e.pointerId) return;
        updateTouchTilt(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        if (isInteractive) return;
        endPointerGesture(e.currentTarget, e.pointerId);
      }}
      onPointerCancel={(e) => {
        if (isInteractive) return;
        endPointerGesture(e.currentTarget, e.pointerId);
      }}
      onLostPointerCapture={(e) => {
        if (isInteractive) return;
        if (activePointerIdRef.current === e.pointerId) {
          resetTouchTilt();
        }
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
        }}
        className="relative h-full w-full rounded-2xl border border-white/12 bg-black/35 shadow-[0_28px_56px_rgba(0,0,0,0.5)] overflow-hidden [transform-style:preserve-3d] will-change-transform backdrop-blur-[2px]"
      >
        <motion.div
          style={{
            x: videoX,
            y: videoY,
            scale: 1.18,
          }}
          className="absolute -inset-[14%] will-change-transform"
        >
          <video
            key={videoSrc}
            ref={videoRef}
            className={`h-full w-full object-cover transition-opacity duration-500 ease-out ${
              isVideoReady ? "opacity-100" : "opacity-0"
            }`}
            src={shouldLoadVideo ? videoSrc : undefined}
            autoPlay={false}
            muted
            loop
            playsInline
            preload={shouldLoadVideo ? "auto" : "none"}
            onLoadedMetadata={() => setIsVideoReady(true)}
            onLoadedData={() => setIsVideoReady(true)}
            onCanPlay={() => setIsVideoReady(true)}
            onPlaying={() => setIsVideoReady(true)}
            onError={() => setIsVideoReady(false)}
          />
        </motion.div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_44%)] pointer-events-none z-[9]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0.25)_100%)] pointer-events-none z-[9]" />
        <div className="absolute inset-0 bg-white/[0.04] pointer-events-none z-[6]" />

        <div className="absolute inset-0 z-10 p-3 pointer-events-none [transform:translateZ(34px)]">
          <span className="type-tag text-[10px] md:text-[11px] text-white/82">
            {name}
          </span>
          <span className="type-body-sm absolute left-3 right-3 bottom-3 text-[11px] md:text-[12px] text-white/82 whitespace-nowrap">
            Somewhere between physical and digital
          </span>
        </div>
      </motion.div>
    </div>
  );
}
