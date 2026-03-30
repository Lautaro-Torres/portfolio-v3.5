"use client";

import { useEffect, useRef, useState } from "react";

export default function ProjectDetailLoading() {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const minVisualTimeMs = 1200;

    const tick = (now) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / minVisualTimeMs);
      // Ease-out so the counter feels smooth and premium.
      const eased = 1 - Math.pow(1 - ratio, 2);
      setProgress(Math.round(eased * 100));

      if (ratio < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[2147483500] bg-[#0a0a0a] text-white flex items-center justify-center"
      style={{ isolation: "isolate" }}
    >
      <div
        className="pointer-events-none select-none font-anton text-white uppercase leading-none tracking-[0.02em] text-[clamp(2.25rem,8vw,6.2rem)]"
        aria-live="polite"
      >
        <span
          style={{
            fontFamily: "'Anton', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            fontWeight: 400,
            fontSize: "min(30vh, 30vw)",
            lineHeight: 0.9,
          }}
        >
          {`${Math.min(100, Math.max(0, progress))}%`}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/18 overflow-hidden">
        <div
          className="h-full bg-white transition-[width] duration-150 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
