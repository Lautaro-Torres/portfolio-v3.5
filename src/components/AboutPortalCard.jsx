"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { requestVideoPlay } from "../utils/requestVideoPlay";
import {
  animate,
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

const MANUAL_RETURN_SPRING = { type: "spring", stiffness: 168, damping: 28, mass: 0.55 };

export default function AboutPortalCard({
  videoSrc,
  name = "Lautaro Torres",
  className = "",
}) {
  const BASE_ROT_X = 8;
  const BASE_ROT_Y = 18;
  const TOUCH_TILT_FACTOR_X = 1.4;
  const TOUCH_TILT_FACTOR_Y = 1.25;
  /** Límite del arrastre manual (espacio libre para el wobble idle sin saturar [-1,1]). */
  const MANUAL_TILT_CLAMP = 0.68;
  const IDLE_AMP_X = 0.024;
  const IDLE_AMP_Y = 0.02;

  const manualX = useMotionValue(0);
  const manualY = useMotionValue(0);
  const idleX = useMotionValue(0);
  const idleY = useMotionValue(0);

  const combinedX = useTransform([manualX, idleX], ([m, i]) =>
    Math.max(-1, Math.min(1, m + i))
  );
  const combinedY = useTransform([manualY, idleY], ([m, i]) =>
    Math.max(-1, Math.min(1, m + i))
  );

  const pointerX = useSpring(combinedX, { stiffness: 220, damping: 32, mass: 0.56 });
  const pointerY = useSpring(combinedY, { stiffness: 220, damping: 32, mass: 0.56 });

  const springConfig = { stiffness: 108, damping: 19, mass: 0.62 };
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
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const pauseMetaRef = useRef({ pausedAt: 0, pausedOnMs: 0, duration: 0 });
  const touchStartRef = useRef(null);
  const activePointerIdRef = useRef(null);
  const didMountVideoReadySkip = useRef(false);
  const isTouchActiveRef = useRef(false);
  const isInteractiveRef = useRef(false);
  const returnAnimRef = useRef(null);

  const stopReturnAnim = useCallback(() => {
    const c = returnAnimRef.current;
    if (c) {
      c.stop();
      returnAnimRef.current = null;
    }
  }, []);

  const startManualReturn = useCallback(() => {
    stopReturnAnim();
    const ax = animate(manualX, 0, MANUAL_RETURN_SPRING);
    const ay = animate(manualY, 0, MANUAL_RETURN_SPRING);
    returnAnimRef.current = {
      stop: () => {
        ax.stop();
        ay.stop();
      },
    };
  }, [manualX, manualY, stopReturnAnim]);

  // About: vídeo crítico — en cliente siempre asignar src de inmediato (IO + primera medición
  // + ScrollTrigger podían dejar shouldLoadVideo en false hasta un segundo layout / navegación).
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    setShouldLoadVideo(true);
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
  }, [shouldLoadVideo, shouldPlayVideo, videoSrc]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(pointer:fine)");
    const sync = () => setIsInteractive(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    isInteractiveRef.current = isInteractive;
  }, [isInteractive]);

  useEffect(() => {
    if (!isInteractive) return;
    const onMove = (event) => {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const nx = (event.clientX / vw) * 2 - 1;
      const ny = (event.clientY / vh) * 2 - 1;
      stopReturnAnim();
      manualX.set(Math.max(-1, Math.min(1, nx)));
      manualY.set(Math.max(-1, Math.min(1, ny)));
    };
    const onLeave = () => {
      stopReturnAnim();
      manualX.set(0);
      manualY.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [isInteractive, manualX, manualY, stopReturnAnim]);

  // Idle wobble solo en `idleX`/`idleY`; el manual queda en 0 salvo drag / puntero fino.
  // Refs evitan condiciones de carrera con el estado de React en el mismo frame.
  useAnimationFrame((time) => {
    if (isInteractiveRef.current || isTouchActiveRef.current) {
      idleX.set(0);
      idleY.set(0);
      return;
    }
    idleX.set(Math.sin(time * 0.0004) * IDLE_AMP_X);
    idleY.set(Math.cos(time * 0.00034) * IDLE_AMP_Y);
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
      const cx = Math.max(-MANUAL_TILT_CLAMP, Math.min(MANUAL_TILT_CLAMP, start.baseX + deltaX));
      const cy = Math.max(-MANUAL_TILT_CLAMP, Math.min(MANUAL_TILT_CLAMP, start.baseY + deltaY));
      manualX.set(cx);
      manualY.set(cy);
    },
    [manualX, manualY]
  );

  const resetTouchTilt = useCallback(() => {
    isTouchActiveRef.current = false;
    touchStartRef.current = null;
    activePointerIdRef.current = null;
    startManualReturn();
  }, [startManualReturn]);

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
      className={`relative h-full w-full overflow-visible rounded-2xl select-none [perspective:1700px] ${className}`}
      style={{ touchAction: isInteractive ? "auto" : "none" }}
      onPointerDown={(e) => {
        if (isInteractive) return;
        if (e.button !== undefined && e.button !== 0) return;
        stopReturnAnim();
        isTouchActiveRef.current = true;
        activePointerIdRef.current = e.pointerId;
        touchStartRef.current = {
          clientX: e.clientX,
          clientY: e.clientY,
          baseX: manualX.get(),
          baseY: manualY.get(),
        };
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* capture not supported */
        }
        updateTouchTilt(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (isInteractive || !isTouchActiveRef.current) return;
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
        className="relative isolate h-full w-full rounded-2xl border border-white/14 bg-black/[0.38] shadow-[0_24px_48px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden [transform-style:preserve-3d] will-change-transform backdrop-blur-[3px]"
      >
        <motion.div
          style={{
            x: videoX,
            y: videoY,
            scale: 1.12,
          }}
          className="absolute inset-0 z-0 will-change-transform [transform-style:flat]"
        >
          <video
            key={videoSrc}
            ref={videoRef}
            className={`pointer-events-none h-full w-full min-h-0 min-w-0 object-cover transition-opacity duration-500 ease-out ${
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

        <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(circle_at_20%_8%,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_44%)]" />
        <div className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0.25)_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-[5] bg-white/[0.04]" />

        <div className="pointer-events-none absolute inset-0 z-20 p-3 [transform:translateZ(1px)] flex flex-col items-start gap-1 md:block">
          <span className="type-tag text-[10px] md:text-[11px] text-white/82">
            {name}
          </span>
          <span className="type-body-sm text-left text-[10px] leading-snug text-white/82 max-w-[calc(100%-0.5rem)] md:max-w-none md:text-[12px] md:leading-normal md:absolute md:left-3 md:right-3 md:bottom-3 md:whitespace-nowrap">
            Somewhere between physical and digital
          </span>
        </div>
      </motion.div>
    </div>
  );
}
