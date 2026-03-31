"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLoading } from "../../contexts/LoadingContext";

/**
 * Initial load: Anton + copy grande, barra indeterminada abajo (no % falso), salida slide-up.
 * Termina tras window.load + mínimo de lectura, con tope de seguridad.
 */
export default function LoadingScreen() {
  const containerRef = useRef(null);
  const exitTlRef = useRef(null);
  const hasExitedRef = useRef(false);
  const exitScheduledRef = useRef(false);
  const { isInitialLoading, completeLoading } = useLoading();

  useEffect(() => {
    if (!isInitialLoading) return;

    let cancelled = false;
    const minMs = 1600;
    const maxMs = 9000;
    const start = performance.now();

    const runExit = () => {
      if (cancelled || hasExitedRef.current || exitScheduledRef.current) return;
      exitScheduledRef.current = true;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minMs - elapsed);
      window.setTimeout(() => {
        if (cancelled || hasExitedRef.current) return;
        hasExitedRef.current = true;
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

    const onLoad = () => runExit();
    if (typeof document !== "undefined" && document.readyState === "complete") {
      runExit();
    } else if (typeof window !== "undefined") {
      window.addEventListener("load", onLoad, { once: true });
    } else {
      runExit();
    }

    const maxTimer = window.setTimeout(runExit, maxMs);

    return () => {
      cancelled = true;
      window.clearTimeout(maxTimer);
      if (typeof window !== "undefined") window.removeEventListener("load", onLoad);
      exitTlRef.current?.kill();
    };
  }, [isInitialLoading, completeLoading]);

  if (!isInitialLoading) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[2147483600] bg-[#0a0a0a] flex flex-col justify-between"
      style={{ isolation: "isolate" }}
    >
      <div className="flex flex-1 items-center justify-center px-[5%] pt-[12vh]">
        <p
          className="font-anton text-white uppercase text-center leading-[0.92] tracking-[0.02em]"
          style={{
            fontSize: "clamp(2.75rem, 12vw, 7.5rem)",
          }}
        >
          Loading
        </p>
      </div>

      <div className="w-full px-[5%] pb-8 md:pb-10">
        <div className="h-1 w-full max-w-3xl mx-auto rounded-full bg-white/10 route-loader-track overflow-hidden">
          <div className="route-loader-indeterminate" />
        </div>
      </div>
    </div>
  );
}
