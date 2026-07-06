"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * @typedef {{ src: string, alt?: string, label?: string }} LightboxItem
 */

export function useImageLightbox() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(null);

  const open = useCallback((nextItems, at = 0) => {
    if (!nextItems?.length) return;
    setItems(nextItems);
    setIndex(Math.min(Math.max(at, 0), nextItems.length - 1));
  }, []);

  const close = useCallback(() => {
    setIndex(null);
    setItems([]);
  }, []);

  const go = useCallback(
    (delta) => {
      setIndex((current) => {
        if (current === null || !items.length) return current;
        return (current + delta + items.length) % items.length;
      });
    },
    [items.length]
  );

  return {
    items,
    index,
    open,
    close,
    go,
    isOpen: index !== null && items.length > 0,
  };
}

export function ImageLightbox({ items, index, onClose, onNavigate }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (index === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(-1);
      if (e.key === "ArrowRight") onNavigate(1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [index, onClose, onNavigate]);

  if (!mounted || index === null || !items[index]) return null;

  const item = items[index];
  const hasMultiple = items.length > 1;

  return createPortal(
    <div
      className="fixed inset-0 z-[20060] flex items-center justify-center bg-black/88 backdrop-blur-sm p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt || "Image preview"}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 transition-colors hover:border-white/30 hover:text-white"
        aria-label="Close"
      >
        <X size={18} />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(-1);
            }}
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 transition-colors hover:border-white/30 hover:text-white sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(1);
            }}
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 transition-colors hover:border-white/30 hover:text-white sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <div
        className="relative flex max-h-[90vh] max-w-[min(96vw,1400px)] flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.src}
          alt={item.alt || "Preview"}
          className="max-h-[calc(90vh-3rem)] w-auto max-w-full object-contain"
        />
        {(item.label || hasMultiple) && (
          <div className="flex items-center gap-3 text-center">
            {item.label && (
              <p className="font-general text-[12px] leading-snug text-white/65">{item.label}</p>
            )}
            {hasMultiple && (
              <p className="font-general text-[11px] uppercase tracking-[0.14em] text-white/35">
                {index + 1} / {items.length}
              </p>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/** Wraps an image area — click opens lightbox without nesting interactive conflicts */
export function LightboxTrigger({
  items,
  index = 0,
  onOpen,
  children,
  className = "",
  title = "View full size",
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen(items, index);
      }}
      className={`group/lightbox relative block w-full cursor-zoom-in text-left ${className}`}
      title={title}
      aria-label={title}
    >
      {children}
      <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover/lightbox:bg-black/20" />
      <span className="pointer-events-none absolute bottom-2 right-2 rounded-full border border-white/20 bg-black/55 p-1.5 text-white/75 opacity-0 transition-opacity group-hover/lightbox:opacity-100">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </span>
    </button>
  );
}
