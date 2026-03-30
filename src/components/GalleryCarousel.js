"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { VideoPoster } from "./VideoPoster";

/**
 * Carousel with nav buttons, 75vh center content, sneak peek.
 * Desktop: horizontal. Mobile: vertical, sneak peek 1/4.
 * Videos: play opens modal (onPlay) — no inline playback.
 */
export function GalleryCarousel({ items = [], onPlay, projectTitle = "" }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const [x, setX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const maxScrollRef = useRef(0);
  const realMaxScrollRef = useRef(0);
  const itemWidthRef = useRef(0);
  const itemHeightRef = useRef(0);
  const startXRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const tweenRef = useRef(null);
  const isDraggingRef = useRef(false);

  const gap = 16;
  const n = items.length;

  const updateCenterEffect = useCallback(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    const rect = wrap.getBoundingClientRect();
    const mobile = rect.width < 768;
    const figures = track.querySelectorAll("figure");

    if (mobile) {
      const hy = rect.height;
      const currentY = parseFloat(gsap.getProperty(track, "y"));
      const itemHeight = itemHeightRef.current;
      if (!itemHeight) return;
      const step = itemHeight + gap;
      const padTop = (hy - itemHeight) / 2 - step;
      const centerView = hy / 2;
      figures.forEach((fig, i) => {
        const itemCenter = padTop - currentY + i * step + itemHeight / 2;
        const distFromCenter = Math.abs(itemCenter - centerView);
        const maxDist = itemHeight * 0.9;
        const t = 1 - Math.min(distFromCenter / maxDist, 1);
        const scale = 0.6 + t * 0.55;
        const opacity = 0.45 + t * 0.55;
        gsap.set(fig, { scale, opacity });
      });
    } else {
      const wx = rect.width;
      const currentX = parseFloat(gsap.getProperty(track, "x"));
      const itemWidth = itemWidthRef.current;
      if (!itemWidth) return;
      const step = itemWidth + gap;
      const padLeft = (wx - itemWidth) / 2 - step;
      const centerView = wx / 2;
      figures.forEach((fig, i) => {
        const itemCenter = padLeft - currentX + i * step + itemWidth / 2;
        const distFromCenter = Math.abs(itemCenter - centerView);
        const maxDist = itemWidth * 0.9;
        const t = 1 - Math.min(distFromCenter / maxDist, 1);
        const scale = 0.6 + t * 0.55;
        const opacity = 0.45 + t * 0.55;
        gsap.set(fig, { scale, opacity });
      });
    }
  }, []);

  const updateDimensions = useCallback(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || items.length === 0) return;

    const wrapRect = wrap.getBoundingClientRect();
    const mobile = wrapRect.width < 768;
    setIsMobile(mobile);

    if (mobile) {
      // Vertical: 75vh, infinite loop (sin comienzo ni final)
      const h = wrapRect.height;
      const itemHeight = (h - 2 * gap) / 1.5;
      itemHeightRef.current = itemHeight;
      itemWidthRef.current = wrapRect.width;
      const step = itemHeight + gap;
      const extendedLen = n > 1 ? n + 2 : n;
      realMaxScrollRef.current = (n - 1) * step;
      maxScrollRef.current = n > 1 ? n * step : 0;
      const padTop = (h - itemHeight) / 2 - step;
      const totalHeight = padTop + extendedLen * itemHeight + (extendedLen - 1) * gap;
      gsap.set(track, { width: "100%", height: totalHeight, x: 0 });
      track.style.setProperty("--item-w", "100%");
      track.style.setProperty("--item-h", `${itemHeight}px`);
      track.style.setProperty("--pad-top", `${padTop}px`);
      track.style.paddingTop = "0";
      track.style.marginTop = `${padTop}px`;
      track.style.paddingLeft = "0";
      track.style.marginLeft = "0";
      const minY = n > 1 ? -maxScrollRef.current : 0;
      const maxY = n > 1 ? step : 0;
      const currentY = gsap.getProperty(track, "y");
      const clamped = Math.max(minY, Math.min(maxY, typeof currentY === "number" ? currentY : 0));
      gsap.set(track, { y: clamped, x: 0 });
      setX(clamped);
    } else {
      // Desktop: horizontal, 75vh — infinite loop (sin comienzo ni final)
      const itemWidth = (wrapRect.width - 2 * gap) / 1.5;
      itemWidthRef.current = itemWidth;
      itemHeightRef.current = wrapRect.height;
      const step = itemWidth + gap;
      const extendedLen = n > 1 ? n + 2 : n;
      realMaxScrollRef.current = (n - 1) * step;
      maxScrollRef.current = n > 1 ? n * step : 0;
      const padLeft = (wrapRect.width - itemWidth) / 2 - step;
      const totalWidth = padLeft + extendedLen * itemWidth + (extendedLen - 1) * gap;
      gsap.set(track, { width: totalWidth, height: "100%", y: 0 });
      track.style.setProperty("--item-w", `${itemWidth}px`);
      track.style.setProperty("--item-h", "100%");
      track.style.setProperty("--pad-left", `${padLeft}px`);
      track.style.paddingLeft = "0";
      track.style.marginLeft = `${padLeft}px`;
      track.style.marginTop = "0";
      track.style.paddingTop = "0";
      const currentX = gsap.getProperty(track, "x");
      const minX = n > 1 ? -maxScrollRef.current : 0;
      const maxX = n > 1 ? step : 0;
      const clamped = Math.max(minX, Math.min(maxX, typeof currentX === "number" ? currentX : 0));
      gsap.set(track, { x: clamped });
      setX(clamped);
    }
    requestAnimationFrame(updateCenterEffect);
  }, [items.length, n, updateCenterEffect]);

  useEffect(() => {
    const run = () => {
      updateDimensions();
      requestAnimationFrame(updateCenterEffect);
    };
    run();
    const ro = new ResizeObserver(run);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [updateDimensions, updateCenterEffect]);

  const snapToNearest = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const mobile = wrapRef.current?.getBoundingClientRect().width < 768;
    const step = mobile ? itemHeightRef.current + gap : itemWidthRef.current + gap;
    if (step <= 0) return;

    const snapToReal = (current, minVal, maxVal, prop) => {
      const index = Math.round(-current / step);
      const clampedIndex = Math.max(0, Math.min(n - 1, index));
      const target = Math.max(minVal, Math.min(maxVal, -clampedIndex * step));
      tweenRef.current = gsap.to(track, {
        [prop]: target,
        duration: 0.4,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => {
          setX(parseFloat(gsap.getProperty(track, prop)));
          updateCenterEffect();
        },
      });
    };

    if (mobile) {
      const currentY = parseFloat(gsap.getProperty(track, "y"));
      const minY = n > 1 ? -maxScrollRef.current : 0;
      const maxY = n > 1 ? step : 0;
      snapToReal(currentY, minY, maxY, "y");
    } else {
      const currentX = parseFloat(gsap.getProperty(track, "x"));
      const minX = n > 1 ? -maxScrollRef.current : 0;
      const maxX = n > 1 ? step : 0;
      snapToReal(currentX, minX, maxX, "x");
    }
  }, [items.length, n, updateCenterEffect]);

  const handlePointerDown = useCallback(
    (e) => {
      if (items.length <= 1) return;
      if (e.target.closest?.("button")) return;
      const track = trackRef.current;
      if (!track) return;
      isDraggingRef.current = true;
      const mobile = wrapRef.current?.getBoundingClientRect().width < 768;
      startXRef.current = mobile ? e.clientY : e.clientX;
      dragOffsetRef.current = parseFloat(gsap.getProperty(track, mobile ? "y" : "x"));
      if (tweenRef.current) tweenRef.current.kill();
      wrapRef.current?.setPointerCapture?.(e.pointerId);
    },
    [items.length]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDraggingRef.current || items.length <= 1) return;
      const track = trackRef.current;
      if (!track) return;
      const mobile = wrapRef.current?.getBoundingClientRect().width < 768;
      const step = mobile ? itemHeightRef.current + gap : itemWidthRef.current + gap;
      const delta = mobile ? e.clientY - startXRef.current : e.clientX - startXRef.current;
      let newVal = dragOffsetRef.current + delta;
      const minVal = n > 1 ? -maxScrollRef.current : 0;
      const maxVal = n > 1 ? step : 0;
      newVal = Math.max(minVal, Math.min(maxVal, newVal));
      gsap.set(track, mobile ? { y: newVal } : { x: newVal });
      setX(newVal);
      updateCenterEffect();
    },
    [items.length, n, updateCenterEffect]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    wrapRef.current?.releasePointerCapture?.();
    snapToNearest();
  }, [snapToNearest]);

  const canDrag = items.length > 1;
  const extendedItems =
    n > 1
      ? [items[n - 1], ...items, items[0]]
      : items;

  const goPrev = useCallback(() => {
    const track = trackRef.current;
    if (!track || items.length <= 1) return;
    const mobile = wrapRef.current?.getBoundingClientRect().width < 768;
    const step = mobile ? itemHeightRef.current + gap : itemWidthRef.current + gap;
    const prop = mobile ? "y" : "x";
    const current = parseFloat(gsap.getProperty(track, prop));
    const next =
      current >= -step * 0.5
        ? step
        : Math.min(step, current + step);
    if (tweenRef.current) tweenRef.current.kill();
    tweenRef.current = gsap.to(track, {
      [prop]: next,
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => {
        setX(parseFloat(gsap.getProperty(track, prop)));
        updateCenterEffect();
      },
      onComplete: () => {
        if (next >= step * 0.9) {
          gsap.set(track, { [prop]: -realMaxScrollRef.current });
          setX(-realMaxScrollRef.current);
          requestAnimationFrame(updateCenterEffect);
        }
      },
    });
  }, [items.length, updateCenterEffect]);

  const goNext = useCallback(() => {
    const track = trackRef.current;
    if (!track || items.length <= 1) return;
    const mobile = wrapRef.current?.getBoundingClientRect().width < 768;
    const step = mobile ? itemHeightRef.current + gap : itemWidthRef.current + gap;
    const prop = mobile ? "y" : "x";
    const current = parseFloat(gsap.getProperty(track, prop));
    const next =
      current <= -realMaxScrollRef.current + step * 0.5
        ? -maxScrollRef.current
        : Math.max(-maxScrollRef.current, current - step);
    if (tweenRef.current) tweenRef.current.kill();
    tweenRef.current = gsap.to(track, {
      [prop]: next,
      duration: 0.5,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => {
        setX(parseFloat(gsap.getProperty(track, prop)));
        updateCenterEffect();
      },
      onComplete: () => {
        if (next <= -realMaxScrollRef.current - step * 0.1) {
          gsap.set(track, { [prop]: 0 });
          setX(0);
          requestAnimationFrame(updateCenterEffect);
        }
      },
    });
  }, [items.length, updateCenterEffect]);

  if (items.length === 0) return null;

  return (
    <div className="relative flex flex-col">
      <div
        ref={wrapRef}
        className={`overflow-hidden select-none h-[75vh] ${canDrag ? "cursor-grab active:cursor-grabbing" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: "none" }}
      >
      <div
        ref={trackRef}
        className="flex flex-col md:flex-row will-change-transform"
        style={{ gap: `${gap}px` }}
      >
        {extendedItems.map((item, i) => {
          const realIndex = n > 1
            ? i === 0
              ? n - 1
              : i === n + 1
                ? 0
                : i - 1
            : i;
          return (
          <figure
            key={i}
            className="flex-shrink-0 origin-center flex flex-col gap-2"
            style={{
              width: isMobile ? "100%" : "var(--item-w, 33.33%)",
              height: isMobile ? "var(--item-h, auto)" : undefined,
              minHeight: isMobile ? "var(--item-h)" : undefined,
              transformOrigin: "center center",
            }}
          >
            <div className="rounded-lg overflow-hidden border border-white/10 bg-black/30 shadow-lg flex-1 min-h-0 group relative transition-all duration-300 group-hover:brightness-110 group-hover:shadow-[0_0_24px_rgba(255,255,255,0.12)]">
              {item.type === "video" ? (
                <div className="relative w-full h-full bg-black/40">
                  <VideoPoster
                    src={item.src}
                    poster={item.poster}
                    posterTime={item.posterTime ?? 1}
                    className="block w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => onPlay?.(realIndex)}
                    className="absolute inset-0 flex items-center justify-center z-10"
                    aria-label="Ver video"
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-black/40 rounded-full p-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="w-12 h-12 text-white ml-0.5"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={item.alt || item.caption || `${projectTitle} gallery`}
                  className="block w-full h-full object-cover"
                />
              )}
            </div>
            {item.caption && (
              <figcaption className="font-general font-normal text-white/60 text-sm hidden md:block">
                {item.caption}
              </figcaption>
            )}
          </figure>
        );})}
      </div>
    </div>
      {canDrag && (
        <div className="flex justify-center items-center gap-4 mt-4 flex-shrink-0">
          <button
            type="button"
            onClick={goPrev}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-opacity"
            aria-label="Anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-opacity"
            aria-label="Siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
