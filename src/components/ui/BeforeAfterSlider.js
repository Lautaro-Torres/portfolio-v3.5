"use client";

import { useState, useRef, useCallback } from "react";

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  className = "",
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const draggingRef = useRef(false);

  const updatePosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition((x / rect.width) * 100);
  }, []);

  const handlePointerDown = (e) => {
    draggingRef.current = true;
    containerRef.current?.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e) => {
    draggingRef.current = false;
    containerRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[16/9] max-h-[70vh] overflow-hidden rounded-sm border border-white/[0.08] cursor-col-resize select-none touch-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img
        src={afterSrc}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeSrc}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.14em] text-white/75 bg-black/45 backdrop-blur-sm px-2 py-0.5 rounded-sm pointer-events-none">
          {beforeLabel}
        </span>
      </div>

      <span className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.14em] text-white/75 bg-black/45 backdrop-blur-sm px-2 py-0.5 rounded-sm pointer-events-none">
        {afterLabel}
      </span>

      <div
        className="absolute top-0 bottom-0 w-px bg-white/90 z-10"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-black/10 flex items-center justify-center pointer-events-none">
          <span className="text-black/70 text-[11px] leading-none">↔</span>
        </div>
      </div>
    </div>
  );
}
