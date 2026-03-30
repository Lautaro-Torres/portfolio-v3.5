"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

function refreshScrollLayout() {
  ScrollTrigger.refresh();
  const smoother = ScrollSmoother.get();
  if (smoother && typeof smoother.refresh === "function") {
    smoother.refresh();
  }
}

export default function ScrollOptimizer() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const wrapper = document.querySelector("#smooth-wrapper");
    const content = document.querySelector("#smooth-content");
    if (!wrapper || !content) return;

    ScrollSmoother.get()?.kill();

    // Keep scrolling physically smooth without extra visual side-effects.
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 0.9,
      smoothTouch: 0.08,
      normalizeScroll: true,
      effects: false,
      ignoreMobileResize: true,
    });

    const refreshTimer = window.setTimeout(() => {
      refreshScrollLayout();
    }, 120);

    return () => {
      window.clearTimeout(refreshTimer);
      smoother?.kill();
    };
  }, []);

  // Client navigations swap content inside #smooth-content but ScrollSmoother keeps old height.
  // Refresh after route change (staggered) so mobile layout / hero / video can settle.
  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) refreshScrollLayout();
    };
    run();
    const rafId = requestAnimationFrame(run);
    const t200 = window.setTimeout(run, 200);
    const t500 = window.setTimeout(run, 500);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.clearTimeout(t200);
      window.clearTimeout(t500);
    };
  }, [pathname]);

  return null;
}

