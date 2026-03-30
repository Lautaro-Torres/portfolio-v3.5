"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

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
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const pauseMetaRef = useRef({ pausedAt: 0, pausedOnMs: 0, duration: 0 });
  const touchStartRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (typeof window === "undefined") {
      setShouldLoadVideo(true);
      return;
    }

    const preloadAheadPx = 900;
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
  }, []);

  useEffect(() => {
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
        rootMargin: "420px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

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
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative h-full w-full select-none [perspective:1700px] ${className}`}
      style={{ touchAction: isInteractive ? "auto" : "none" }}
      onPointerDown={(e) => {
        if (isInteractive) return;
        setIsTouchActive(true);
        touchStartRef.current = {
          clientX: e.clientX,
          clientY: e.clientY,
          baseX: pointerX.get(),
          baseY: pointerY.get(),
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
        updateTouchTilt(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (isInteractive || !isTouchActive) return;
        updateTouchTilt(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        if (isInteractive) return;
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        resetTouchTilt();
      }}
      onPointerCancel={(e) => {
        if (isInteractive) return;
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        resetTouchTilt();
      }}
      onPointerLeave={() => {
        if (isInteractive || !isTouchActive) return;
        resetTouchTilt();
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
            ref={videoRef}
            className="h-full w-full object-cover"
            src={shouldLoadVideo ? videoSrc : undefined}
            autoPlay={false}
            muted
            loop
            playsInline
            preload={shouldLoadVideo ? "metadata" : "none"}
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
