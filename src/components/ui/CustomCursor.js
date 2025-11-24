"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Cursor global con el look&feel del cursor del Swiper:
 * - Default: dot 10px (sin texto)
 * - Clickables (a, button, role=button): dot 12px (sin texto)
 * - Draggables/slider (.swiper / role=slider / draggable): 36px con "Drag"
 * Animación por width/height (no scale) -> sin pixelación.
 */
export default function CustomCursor() {
  const LABEL_DRAG = "Drag";   // Used only on the projects swiper/slider
  const LABEL_CLICK = "Click"; // Used for all other interactive elements
  const cursorRef = useRef(null);
  const labelRef = useRef(null);
  const rafRef = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const lerpX = useRef(0);
  const lerpY = useRef(0);

  const [enabled, setEnabled] = useState(false);

  // tamaños
  const SIZE_DOT = 10;
  const SIZE_CLICK = 12;
  const SIZE_DRAG = 36;

  useEffect(() => {
    const isBrowser = typeof window !== "undefined";
    const fine =
      isBrowser &&
      window.matchMedia &&
      window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    const touch =
      typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

    if (!fine || touch) return;

    if (isBrowser) {
      if (window.__GLOBAL_CUSTOM_CURSOR_MOUNTED__) return;
      window.__GLOBAL_CUSTOM_CURSOR_MOUNTED__ = true;
    }
    setEnabled(true);

    return () => {
      if (isBrowser) {
        try {
          delete window.__GLOBAL_CUSTOM_CURSOR_MOUNTED__;
        } catch {
          window.__GLOBAL_CUSTOM_CURSOR_MOUNTED__ = undefined;
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const el = cursorRef.current;
    const labelEl = labelRef.current;
    if (!el || !labelEl) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set(el, {
      xPercent: -50,
      yPercent: -50,
      width: SIZE_DOT,
      height: SIZE_DOT,
      backgroundColor: "rgba(228,228,231,0.9)",
      boxShadow: "none",
    });

    const setX = gsap.quickSetter(el, "x", "px");
    const setY = gsap.quickSetter(el, "y", "px");

    // pos inicial
    lerpX.current = window.innerWidth / 2;
    lerpY.current = window.innerHeight / 2;
    mouseX.current = lerpX.current;
    mouseY.current = lerpY.current;

    const onMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    const onEnter = () => gsap.to(el, { autoAlpha: 1, duration: 0.15, overwrite: "auto" });
    const onLeave = () => gsap.to(el, { autoAlpha: 0, duration: 0.15, overwrite: "auto" });

    // detección de elemento interactivo
    const findInteractive = (t) =>
      t?.closest?.(
        [
          "[data-draggable]",
          '[draggable="true"]',
          '[role="slider"]',
          "a",
          "button",
          '[role="button"]',
          ".projects-swiper",
          ".swiper",
          ".swiper-wrapper",
          ".swiper-slide",
        ].join(", ")
      );

    const isSliderish = (t) =>
      !!t?.closest?.(
        [
          ".projects-swiper",
          ".swiper",
          ".swiper-wrapper",
          ".swiper-slide",
          '[role="slider"]',
          '[data-draggable]',
          '[draggable="true"]',
        ].join(", ")
      );

    const applyMode = (labelText = LABEL_CLICK) => {
      const isDrag = true; // unified: always bubble with label for any interactive element
      // tamaño por width/height => sin pixelar
      const targetSize = isDrag ? SIZE_DRAG : SIZE_CLICK;
      gsap.to(el, {
        width: targetSize,
        height: targetSize,
        borderRadius: targetSize / 2,
        backgroundColor: "rgba(255,255,255,0.95)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
        duration: 0.18,
        ease: "expo.out",
        overwrite: "auto",
      });

      // label
      el.classList.add("has-label", "mode-drag");
      labelEl.textContent = labelText;
    };

    const resetToDot = () => {
      gsap.to(el, {
        width: SIZE_DOT,
        height: SIZE_DOT,
        borderRadius: SIZE_DOT / 2,
        backgroundColor: "rgba(228,228,231,0.9)",
        boxShadow: "none",
        duration: 0.2,
        ease: "expo.out",
        overwrite: "auto",
      });
      el.classList.remove("mode-drag", "has-label");
      labelEl.textContent = "";
    };

    let insideEl = null;

    const onOver = (e) => {
      const inter = findInteractive(e.target);
      if (!inter) return;
      insideEl = inter;
      // Show Drag only over slider/swiper; otherwise show Click
      const label = isSliderish(inter) ? LABEL_DRAG : LABEL_CLICK;
      applyMode(label);
    };

    const onOut = (e) => {
      const inter = findInteractive(e.target);
      if (!inter) return;
      const rel = e.relatedTarget;
      if (rel && inter.contains(rel)) return; // mov dentro del mismo
      insideEl = null;
      resetToDot();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerenter", onEnter);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);

    // follow loop
    const smooth = 0.16;
    const tick = () => {
      lerpX.current += (mouseX.current - lerpX.current) * smooth;
      lerpY.current += (mouseY.current - lerpY.current) * smooth;
      setX(lerpX.current);
      setY(lerpY.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerenter", onEnter);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <span ref={labelRef} className="custom-cursor__label" />
    </div>
  );
}
