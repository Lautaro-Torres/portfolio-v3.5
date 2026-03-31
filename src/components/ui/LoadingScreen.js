"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLoading } from "../../contexts/LoadingContext";

/**
 * Carga inicial: % en Anton (escala con viewport), barra determinada 100vw (sin márgenes laterales).
 * Progreso por hitos (DOM / fuentes / window.load), solo hacia adelante. Salida tras load + mínimo + tope.
 */
export default function LoadingScreen() {
  const containerRef = useRef(null);
  const exitTlRef = useRef(null);
  const hasExitedRef = useRef(false);
  const exitScheduledRef = useRef(false);
  const progressTweenRef = useRef(null);
  const percentRef = useRef({ value: 0 });
  const [displayPercent, setDisplayPercent] = useState(0);
  const { isInitialLoading, completeLoading } = useLoading();

  useEffect(() => {
    if (!isInitialLoading) return;

    let cancelled = false;
    let innerExitTimerId = null;
    const minMs = 1600;
    const maxMs = 9000;
    const start = performance.now();

    const setShownPercent = (v) => {
      if (!cancelled) setDisplayPercent(Math.round(v));
    };

    const goToProgress = (target, duration = 0.45) => {
      const next = Math.min(100, Math.max(percentRef.current.value, target));
      if (Math.abs(next - percentRef.current.value) < 0.01) {
        setShownPercent(next);
        return;
      }
      progressTweenRef.current?.kill();
      progressTweenRef.current = gsap.to(percentRef.current, {
        value: next,
        duration,
        ease: "power2.out",
        onUpdate: () => setShownPercent(percentRef.current.value),
        onComplete: () => {
          progressTweenRef.current = null;
          setShownPercent(percentRef.current.value);
        },
      });
    };

    goToProgress(4, 0.12);

    const onDomReady = () => goToProgress(28, 0.35);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onDomReady, { once: true });
    } else {
      onDomReady();
    }

    const fontsP = document.fonts?.ready;
    if (fontsP && typeof fontsP.then === "function") {
      fontsP.then(() => {
        if (!cancelled) goToProgress(58, 0.4);
      });
    }

    const creepTimer = window.setTimeout(() => {
      if (cancelled || percentRef.current.value >= 100) return;
      goToProgress(82, 5);
    }, 3200);

    const runExit = () => {
      if (cancelled || hasExitedRef.current || exitScheduledRef.current) return;
      exitScheduledRef.current = true;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minMs - elapsed);
      innerExitTimerId = window.setTimeout(() => {
        innerExitTimerId = null;
        if (cancelled || hasExitedRef.current) return;
        hasExitedRef.current = true;
        goToProgress(100, 0.25);
        const container = containerRef.current;
        if (!container) {
          completeLoading();
          return;
        }
        exitTlRef.current?.kill();
        exitTlRef.current = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => completeLoading(),
        });
        exitTlRef.current
          .to(container, { yPercent: -100, duration: 0.7 })
          .set(container, { autoAlpha: 0 });
      }, wait);
    };

    const handleWindowLoad = () => {
      if (!cancelled) goToProgress(100, 0.55);
      runExit();
    };

    if (typeof document !== "undefined" && document.readyState === "complete") {
      goToProgress(100, 0.35);
      runExit();
    } else if (typeof window !== "undefined") {
      window.addEventListener("load", handleWindowLoad, { once: true });
    } else {
      goToProgress(100, 0.25);
      runExit();
    }

    const maxTimer = window.setTimeout(runExit, maxMs);

    return () => {
      cancelled = true;
      window.clearTimeout(creepTimer);
      window.clearTimeout(maxTimer);
      if (innerExitTimerId != null) {
        window.clearTimeout(innerExitTimerId);
        innerExitTimerId = null;
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("load", handleWindowLoad);
      }
      document.removeEventListener("DOMContentLoaded", onDomReady);
      progressTweenRef.current?.kill();
      progressTweenRef.current = null;
      percentRef.current.value = 0;
      exitTlRef.current?.kill();
      exitScheduledRef.current = false;
      hasExitedRef.current = false;
    };
  }, [isInitialLoading, completeLoading]);

  if (!isInitialLoading) return null;

  const fillScale = Math.max(0, Math.min(1, displayPercent / 100));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[2147483600] bg-[#0a0a0a] flex flex-col justify-between overflow-x-hidden"
      style={{ isolation: "isolate" }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={displayPercent}
      aria-label={`Cargando, ${displayPercent} por ciento`}
    >
      <div className="flex flex-1 min-h-0 items-center justify-center px-[4vw] pt-[8vh] pb-4">
        <p className="font-anton initial-loader-percent text-white uppercase text-center select-none">
          {displayPercent}%
        </p>
      </div>

      <div className="initial-loader-bar-track shrink-0 pb-8 md:pb-10">
        <div className="h-1 w-full bg-white/10 route-loader-track overflow-hidden rounded-none">
          <div
            className="route-loader-progress h-full w-full bg-white"
            style={{ transform: `scaleX(${fillScale})` }}
          />
        </div>
      </div>
    </div>
  );
}
