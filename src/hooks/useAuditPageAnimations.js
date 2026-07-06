"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { useLoading } from "../contexts/LoadingContext";

async function waitForLayoutReady() {
  try {
    if (document.fonts?.ready) await document.fonts.ready;
  } catch {
    /* ignore */
  }
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
}

function clearRevealProps(root) {
  root?.querySelectorAll(".bento-above, .bento-scroll").forEach((el) => {
    gsap.killTweensOf(el);
    gsap.set(el, { clearProps: "opacity,transform,y,visibility" });
  });
}

/**
 * Audit page intro animations. Never animates opacity — only y-offset — so content
 * stays visible even if GSAP is interrupted (ScrollTrigger + opacity:0 caused blank pages).
 */
export function useAuditPageAnimations(pageRef, heroRef, gridRef) {
  const { isInitialLoading } = useLoading();

  useEffect(() => {
    if (isInitialLoading) return undefined;

    let ctx;
    let cancelled = false;

    const init = async () => {
      await waitForLayoutReady();
      if (cancelled || !pageRef.current) return;

      clearRevealProps(pageRef.current);

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        if (heroRef.current) {
          const els = Array.from(heroRef.current.children);
          tl.from(els, {
            y: 22,
            duration: 0.7,
            stagger: 0.08,
          }, 0.1);
        }

        const aboveFold = gridRef.current?.querySelectorAll(".bento-above");
        if (aboveFold?.length) {
          tl.from(aboveFold, {
            y: 22,
            duration: 0.7,
            stagger: 0.1,
          }, 0.25);
        }

        const scrollSections = gridRef.current?.querySelectorAll(".bento-scroll");
        if (scrollSections?.length) {
          tl.from(scrollSections, {
            y: 20,
            duration: 0.65,
            stagger: 0.1,
          }, 0.45);
        }

        pageRef.current?.querySelectorAll(".count-up").forEach((el) => {
          const target = parseInt(el.dataset.target, 10);
          if (isNaN(target)) return;
          const obj = { value: 0 };
          el.textContent = "0";
          gsap.to(obj, {
            value: target,
            duration: 1,
            ease: "power2.out",
            delay: 0.5,
            onUpdate: () => {
              el.textContent = Math.round(obj.value);
            },
          });
        });

        pageRef.current?.querySelectorAll(".anim-bar").forEach((el) => {
          const targetWidth = el.dataset.width ?? "0%";
          gsap.fromTo(
            el,
            { width: 0 },
            {
              width: targetWidth,
              duration: 0.9,
              ease: "power2.out",
              delay: 0.7,
            }
          );
        });

        pageRef.current?.querySelectorAll(".anim-timeline").forEach((el, index) => {
          const targetWidth = el.dataset.width ?? "100%";
          gsap.fromTo(
            el,
            { width: 0 },
            {
              width: targetWidth,
              duration: 0.85,
              delay: 0.7 + index * 0.12,
              ease: "power2.out",
            }
          );
        });
      }, pageRef);
    };

    init();

    return () => {
      cancelled = true;
      clearRevealProps(pageRef.current);
      ctx?.revert();
    };
  }, [isInitialLoading, pageRef, heroRef, gridRef]);
}
