"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function GlassPortalPill({ anchorRef, blur = 18, backgroundOpacity = 0.12, borderRadius = 999, className = "" }) {
  const [rect, setRect] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let rafId = null;
    let intervalId = null;
    let timeoutId = null;
    let frames = 0;
    let lastRectKey = "";

    const setRectIfChanged = (nextRect) => {
      const key = `${nextRect.x}|${nextRect.y}|${nextRect.w}|${nextRect.h}`;
      if (key === lastRectKey) return;
      lastRectKey = key;
      setRect(nextRect);
    };

    const update = () => {
      const el = anchorRef?.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRectIfChanged({
        x: Math.round(r.left),
        y: Math.round(r.top),
        w: Math.round(r.width),
        h: Math.round(r.height),
      });
    };

    update();
    // Recalculate once fonts swap in (first load can shift nav width/position).
    if (document.fonts?.ready) {
      document.fonts.ready.then(update).catch(() => {});
    }

    // Track early GSAP/layout settling frames so pill is centered before first scroll.
    const tick = () => {
      update();
      frames += 1;
      if (frames < 120) {
        rafId = window.requestAnimationFrame(tick);
      }
    };
    rafId = window.requestAnimationFrame(tick);

    // Extra guard for async shifts (video/hero/nav intro).
    intervalId = window.setInterval(update, 250);
    timeoutId = window.setTimeout(() => {
      if (intervalId) window.clearInterval(intervalId);
      intervalId = null;
    }, 2500);

    const onResize = () => update();
    const onScroll = () => update();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(update);
    if (anchorRef?.current) ro.observe(anchorRef.current);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
      if (intervalId) window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [anchorRef]);

  if (!mounted || !rect) return null;

  const style = {
    position: 'fixed',
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${rect.w}px`,
    height: `${rect.h}px`,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    backgroundColor: `rgba(255,255,255,${backgroundOpacity})`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(150%)`,
    backdropFilter: `blur(${blur}px) saturate(150%)`,
    border: "1px solid rgba(255,255,255,0.10)",
    pointerEvents: 'none',
    zIndex: 9999, // just below nav which is 10000
  };

  return createPortal(
    <div data-glass-portal-pill className={className} style={style} />,
    document.body
  );
}


