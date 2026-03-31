"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { splitTextToClippedChars } from "../utils/gsapSplitTitle";

/**
 * Reusable page intro animation for single project view.
 * Sequence: hero takeover → settles to layout position → overlay hides → title animates (letters) → then facts, summary, pills appear.
 */
export function useProjectIntroAnimation(refs) {
  const {
    overlayRef,
    heroTargetRef,
    titleRef,
    headerContentRefs = [],
    bodyContentRef,
    resetKey,
    onOverlaySettled,
    onComplete,
  } = refs;

  const timelineRef = useRef(null);
  const isCompleteRef = useRef(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Re-run intro when route/item changes.
    hasStartedRef.current = false;
    isCompleteRef.current = false;
  }, [resetKey]);

  const cleanup = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    const overlay = overlayRef?.current;
    if (overlay) {
      gsap.set(overlay, {
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
      });
    }
    if (!isCompleteRef.current) {
      hasStartedRef.current = false;
    }
  }, [overlayRef]);

  useEffect(() => {
    const overlay = overlayRef?.current;
    const heroTarget = heroTargetRef?.current;
    const title = titleRef?.current;
    const headerElements = (Array.isArray(headerContentRefs) ? headerContentRefs : [headerContentRefs])
      .map((r) => r?.current)
      .filter(Boolean);
    const bodyContent = bodyContentRef?.current;

    if (!overlay || !heroTarget) return;
    if (hasStartedRef.current || isCompleteRef.current) return;
    hasStartedRef.current = true;

    // Content hidden initially; title container stays visible so letters can appear
    gsap.set([...headerElements, bodyContent].filter(Boolean), { opacity: 0 });
    let restoreTitle = () => {};
    let titleChars = [];
    if (title) {
      gsap.set(title, {
        fontFamily: "Anton, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        fontWeight: 400,
      });
      const split = splitTextToClippedChars(title, { fontFamily: "inherit" });
      restoreTitle = split.restore;
      titleChars = split.chars;
      if (titleChars.length) gsap.set(titleChars, { yPercent: 100 });
    }

    // Overlay starts full viewport
    gsap.set(overlay, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      zIndex: 100,
      overflow: "hidden",
      opacity: 1,
      visibility: "visible",
      pointerEvents: "none",
    });

    const runIntro = () => {
      const rect = heroTarget.getBoundingClientRect();
      const heroInner = heroTarget.querySelector("div");
      const computed = heroInner ? window.getComputedStyle(heroInner) : null;
      const borderRadius = computed ? parseInt(computed.borderRadius, 10) || 8 : 8;

      const tl = gsap.timeline({
        onComplete: () => {
          isCompleteRef.current = true;
          gsap.set(overlay, {
            opacity: 0,
            visibility: "hidden",
            pointerEvents: "none",
          });
          if (typeof onComplete === "function") onComplete();
        },
        onKill: () => {
          gsap.set(overlay, {
            opacity: 0,
            visibility: "hidden",
            pointerEvents: "none",
          });
          if (typeof onComplete === "function") onComplete();
        },
      });

      // 1. Hero overlay: brief hold at fullscreen so the video reads, then animates to layout
      tl.to(overlay, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius,
        duration: 1.88,
        delay: 0.75,
        ease: "power3.inOut",
        overwrite: "auto",
      });

      // 2) Start top content slightly before settle to avoid perceived dead-time.
      tl.addLabel("heroSettled", "-=0.24");

      if (title) {
        tl.to(
          titleChars,
          {
            yPercent: 0,
            duration: 0.32,
            stagger: 0.02,
            ease: "power2.inOut",
          },
          "heroSettled"
        );
      }

      if (headerElements.length > 0) {
        tl.to(
          headerElements,
          {
            opacity: 1,
            duration: 0.32,
            ease: "power2.out",
            stagger: 0.04,
          },
          "heroSettled+=0.01"
        );
      }

      if (bodyContent) {
        tl.to(
          bodyContent,
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "heroSettled+=0.06"
        );
      }

      // 3) Trigger settle slightly BEFORE the overlay disappears so the underlying hero
      // video can already be playing when we handoff, avoiding a perceived "jump".
      if (typeof onOverlaySettled === "function") {
        tl.call(() => onOverlaySettled(), null, "heroSettled+=0.12");
      }

      // 4) Overlay hides at the end (short fade keeps the hero takeover feel intact).
      tl.to(overlay, { opacity: 0, duration: 0.08, ease: "none" }, ">-=0.02");
      tl.set(overlay, { visibility: "hidden", pointerEvents: "none" });

      timelineRef.current = tl;
    };

    // Wait for layout to be ready
    let timeoutId;
    const rafId = requestAnimationFrame(() => {
      timeoutId = setTimeout(runIntro, 40);
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      restoreTitle();
      cleanup();
    };
  }, [
    overlayRef,
    heroTargetRef,
    titleRef,
    headerContentRefs,
    bodyContentRef,
    cleanup,
    onOverlaySettled,
    onComplete,
    resetKey,
  ]);

  return { cleanup };
}
