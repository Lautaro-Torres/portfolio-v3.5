"use client";

import { useState, useRef, useCallback } from "react";
import { Maximize2 } from "lucide-react";
import { useImageLightbox, ImageLightbox } from "@/components/ui/ImageLightbox";

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
  const dragStartRef = useRef({ x: 0, y: 0, moved: false });
  const lightbox = useImageLightbox();

  const lightboxItems = [
    { src: beforeSrc, alt: beforeLabel, label: beforeLabel },
    { src: afterSrc, alt: afterLabel, label: afterLabel },
  ];

  const updatePosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition((x / rect.width) * 100);
  }, []);

  const handlePointerDown = (e) => {
    draggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY, moved: false };
    containerRef.current?.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    const dx = Math.abs(e.clientX - dragStartRef.current.x);
    const dy = Math.abs(e.clientY - dragStartRef.current.y);
    if (dx > 4 || dy > 4) dragStartRef.current.moved = true;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e) => {
    if (draggingRef.current && !dragStartRef.current.moved) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const ratio = (e.clientX - rect.left) / rect.width;
        lightbox.open(lightboxItems, ratio < position / 100 ? 0 : 1);
      }
    }
    draggingRef.current = false;
    containerRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <>
      <div className="relative">
        <div
          ref={containerRef}
          className={`relative aspect-[16/9] max-h-[70vh] w-full cursor-col-resize select-none overflow-hidden rounded-sm border border-white/[0.08] touch-none ${className}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <img
            src={afterSrc}
            alt={afterLabel}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <img
              src={beforeSrc}
              alt={beforeLabel}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            <span className="pointer-events-none absolute left-3 top-3 rounded-sm bg-black/45 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-white/75 backdrop-blur-sm">
              {beforeLabel}
            </span>
          </div>

          <span className="pointer-events-none absolute right-3 top-3 rounded-sm bg-black/45 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-white/75 backdrop-blur-sm">
            {afterLabel}
          </span>

          <div
            className="absolute bottom-0 top-0 z-10 w-px bg-white/90"
            style={{ left: `${position}%`, transform: "translateX(-50%)" }}
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md">
              <span className="text-[11px] leading-none text-black/70">↔</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => lightbox.open(lightboxItems, 1)}
          className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 font-general text-[10px] uppercase tracking-[0.12em] text-white/75 transition-colors hover:border-white/35 hover:text-white"
          title="View full size"
        >
          <Maximize2 size={12} />
          Expand
        </button>
      </div>

      <ImageLightbox
        items={lightbox.items}
        index={lightbox.index}
        onClose={lightbox.close}
        onNavigate={lightbox.go}
      />
    </>
  );
}
