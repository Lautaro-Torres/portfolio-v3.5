// LoadingScreen.js
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLoading } from "../../contexts/LoadingContext";

/**
 * Minimal full-screen loader:
 * - Fondo negro
 * - Barra fina centrada que se llena
 * - Slide-up rápido al terminar
 */
export default function LoadingScreen() {
  const containerRef = useRef(null);
  const barRef = useRef(null);
  const { isInitialLoading, completeLoading } = useLoading();

  useEffect(() => {
    if (!isInitialLoading) return;

    const container = containerRef.current;
    const bar = barRef.current;

    if (!container || !bar) return;

    gsap.set(container, { autoAlpha: 1, yPercent: 0 });
    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        completeLoading();
      },
    });

    tl.to(bar, {
      scaleX: 1,
      duration: 1.4,
    })
      .to({}, { duration: 0.2 })
      .to(bar, {
        opacity: 0,
        duration: 0.3,
      }, "-=0.1")
      .to(container, {
        yPercent: -100,
        duration: 0.6,
      }, "-=0.2")
      .to(container, {
        autoAlpha: 0,
        duration: 0.2,
      }, "-=0.2");

    return () => {
      tl.kill();
    };
  }, [isInitialLoading, completeLoading]);

  if (!isInitialLoading) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[20000] flex items-center justify-center bg-[#050505]"
      style={{ isolation: "isolate" }}
    >
      <div className="relative w-[220px] h-[1px] md:w-[260px] md:h-[1px] bg-white/12 overflow-hidden rounded-full">
        <div
          ref={barRef}
          className="absolute inset-0 bg-white"
        />
      </div>
    </div>
  );
}
