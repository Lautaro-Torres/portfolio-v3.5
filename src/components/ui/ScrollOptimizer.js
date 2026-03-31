"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

/** Same breakpoint as Tailwind `md:` — native scroll below, ScrollSmoother at md+. */
const DESKTOP_SCROLL_MEDIA = "(min-width: 768px)";

const SMOOTH_SCROLL_CLASS = "smooth-scroll-active";

function refreshScrollLayout() {
  ScrollTrigger.refresh();
  const smoother = ScrollSmoother.get();
  if (smoother && typeof smoother.refresh === "function") {
    smoother.refresh();
  }
}

/** `/projects/[slug]` — not the index `/projects` */
function isProjectDetailPath(pathname) {
  const parts = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  return parts[0] === "projects" && parts.length >= 2;
}

function resetScrollToTopAndRefresh() {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTop(0);
  } else {
    window.scrollTo(0, 0);
  }
  refreshScrollLayout();
}

function killScrollSmoother() {
  ScrollSmoother.get()?.kill();
  document.documentElement.classList.remove(SMOOTH_SCROLL_CLASS);
}

function createScrollSmoother() {
  const wrapper = document.querySelector("#smooth-wrapper");
  const content = document.querySelector("#smooth-content");
  if (!wrapper || !content) return null;

  killScrollSmoother();

  // Desktop only: inertia without excessive lag; no normalizeScroll to avoid “double” wheel feel.
  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 0.62,
    smoothTouch: false,
    normalizeScroll: false,
    effects: false,
    ignoreMobileResize: true,
  });

  document.documentElement.classList.add(SMOOTH_SCROLL_CLASS);

  return smoother;
}

export default function ScrollOptimizer() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const mq = window.matchMedia(DESKTOP_SCROLL_MEDIA);
    let refreshTimer;

    const applyForViewport = () => {
      window.clearTimeout(refreshTimer);
      if (mq.matches) {
        createScrollSmoother();
        refreshTimer = window.setTimeout(() => {
          refreshScrollLayout();
        }, 120);
      } else {
        killScrollSmoother();
        ScrollTrigger.refresh();
      }
    };

    applyForViewport();
    mq.addEventListener("change", applyForViewport);

    return () => {
      window.clearTimeout(refreshTimer);
      mq.removeEventListener("change", applyForViewport);
      killScrollSmoother();
    };
  }, []);

  // Route changes: reset scroll first (stale position + old body height from ScrollSmoother = black gap at bottom),
  // then refresh ScrollTrigger / smoother so measurements match the new page.
  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      resetScrollToTopAndRefresh();
    };
    run();
    const rafId = requestAnimationFrame(run);
    const t200 = window.setTimeout(run, 200);
    const t500 = window.setTimeout(run, 500);
    // Project detail streams content + intro layout; a late pass avoids staying at the old /projects scroll.
    const extraIds = [];
    if (isProjectDetailPath(pathname)) {
      extraIds.push(
        window.setTimeout(run, 80),
        window.setTimeout(run, 750),
        window.setTimeout(run, 1400)
      );
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.clearTimeout(t200);
      window.clearTimeout(t500);
      extraIds.forEach((id) => window.clearTimeout(id));
    };
  }, [pathname]);

  return null;
}

