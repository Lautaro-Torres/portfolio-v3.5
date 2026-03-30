// LoadingScreen.js
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useLoading } from "../../contexts/LoadingContext";
import { useSmartLoader } from "../../hooks/useAssetPreloader";

/**
 * Full-screen loader with:
 * - Real preload progress (0-100)
 * - Centered Anton counter
 * - Full-width bottom loading line
 * - Slide-up exit once complete
 */
export default function LoadingScreen() {
  const containerRef = useRef(null);
  const progressObjRef = useRef({ value: 0 });
  const progressTweenRef = useRef(null);
  const exitTlRef = useRef(null);
  const hasExitedRef = useRef(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const { isInitialLoading, completeLoading } = useLoading();
  const { isLoading, progress } = useSmartLoader({
    // Keep loader deterministic; don't block UI waiting for asset fetches.
    enablePreloading: false,
    fastMode: true,
    minLoadTime: 1200,
  });

  const percentLabel = useMemo(
    () => `${Math.min(100, Math.max(0, Math.round(displayProgress)))}%`,
    [displayProgress]
  );

  useEffect(() => {
    if (!isInitialLoading) return;
    progressTweenRef.current?.kill();
    progressTweenRef.current = gsap.to(progressObjRef.current, {
      value: progress,
      duration: 0.28,
      ease: "power2.out",
      onUpdate: () => setDisplayProgress(progressObjRef.current.value),
    });
    return () => progressTweenRef.current?.kill();
  }, [progress, isInitialLoading]);

  useEffect(() => {
    if (!isInitialLoading || isLoading) return;
    if (hasExitedRef.current) return;
    if (progress < 100) return;
    const container = containerRef.current;
    if (!container) return;

    progressTweenRef.current?.kill();
    progressObjRef.current.value = 100;
    setDisplayProgress(100);

    hasExitedRef.current = true;
    exitTlRef.current?.kill();
    exitTlRef.current = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        completeLoading();
      },
    });

    exitTlRef.current
      .to(container, {
        yPercent: -100,
        duration: 0.72,
      })
      .set(container, { autoAlpha: 0 });

    return () => exitTlRef.current?.kill();
  }, [isInitialLoading, isLoading, progress, completeLoading]);

  useEffect(() => {
    return () => {
      progressTweenRef.current?.kill();
      exitTlRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (!isInitialLoading) return;
    const fallbackTimer = window.setTimeout(() => {
      if (hasExitedRef.current) return;
      hasExitedRef.current = true;
      completeLoading();
    }, 4500);
    return () => window.clearTimeout(fallbackTimer);
  }, [isInitialLoading, completeLoading]);

  if (!isInitialLoading) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[2147483600] bg-[#0a0a0a] flex items-center justify-center"
      style={{ isolation: "isolate" }}
    >
      <div className="pointer-events-none select-none font-anton text-white uppercase leading-none tracking-[0.02em] text-[clamp(2.25rem,8vw,6.2rem)]">
        <span
          style={{
            fontFamily: "'Anton', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            fontWeight: 400,
            fontSize: "min(30vh, 30vw)",
            lineHeight: 0.9,
          }}
        >
          {percentLabel}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/18 overflow-hidden">
        <div
          className="h-full bg-white"
          style={{ width: `${Math.min(100, Math.max(0, displayProgress))}%` }}
        />
      </div>
    </div>
  );
}
