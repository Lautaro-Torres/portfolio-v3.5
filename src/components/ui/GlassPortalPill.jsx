"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function GlassPortalPill({ anchorRef, blur = 18, backgroundOpacity = 0.12, borderRadius = 999, className = "" }) {
  const [rect, setRect] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const el = anchorRef?.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) });
    };
    update();
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
    <div className={className} style={style} />,
    document.body
  );
}


