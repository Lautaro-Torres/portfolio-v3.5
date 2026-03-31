// TransitionContext.js
"use client";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { armRouteReadyWait, normalizeRoutePath } from "../utils/routeReadyGate";

const TransitionContext = createContext();

/** Stable DOM target for route opacity transitions — see `layout.js` (#page-transition-root). */
const PAGE_TRANSITION_ROOT_ID = "page-transition-root";

export function TransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const transitionTlRef = useRef(null);
  const overlayRef = useRef(null);
  const loadingBarRef = useRef(null);
  const loadingBarFillRef = useRef(null);
  const loadingPercentRef = useRef(null);
  const progressTweenRef = useRef(null);
  const pendingRouteRef = useRef(null);
  const routeChangeResolverRef = useRef(null);
  const routeChangeTimeoutRef = useRef(null);

  const setLoaderProgress = (value, options = {}) => {
    const nextValue = Math.max(0, Math.min(100, value));
    const duration = options.immediate ? 0 : options.duration ?? 0.38;
    const ease = options.ease ?? "power2.out";
    const state = { value: Number(loadingPercentRef.current?.dataset.progress || 0) };

    if (progressTweenRef.current) {
      progressTweenRef.current.kill();
      progressTweenRef.current = null;
    }

    const render = (progressValue) => {
      const rounded = Math.round(progressValue);
      if (loadingPercentRef.current) {
        loadingPercentRef.current.textContent = `${rounded}%`;
        loadingPercentRef.current.dataset.progress = String(rounded);
      }
      if (loadingBarFillRef.current) {
        loadingBarFillRef.current.style.transform = `scaleX(${progressValue / 100})`;
      }
    };

    if (duration === 0) {
      render(nextValue);
      return;
    }

    progressTweenRef.current = gsap.to(state, {
      value: nextValue,
      duration,
      ease,
      onUpdate: () => render(state.value),
      onComplete: () => {
        render(nextValue);
        progressTweenRef.current = null;
      },
    });
  };

  const clearPendingRoute = () => {
    pendingRouteRef.current = null;
    routeChangeResolverRef.current = null;
    if (routeChangeTimeoutRef.current) {
      clearTimeout(routeChangeTimeoutRef.current);
      routeChangeTimeoutRef.current = null;
    }
  };

  const getPathnameFromHref = (href) => {
    if (typeof window === "undefined") return href;
    try {
      return new URL(href, window.location.origin).pathname;
    } catch {
      return href;
    }
  };

  const handleChunkLoadFallback = () => {
    if (typeof window === "undefined" || !pendingRouteRef.current) return;
    const targetRoute = pendingRouteRef.current;
    clearPendingRoute();
    window.location.assign(targetRoute);
  };

  // Track route changes
  useEffect(() => {
    setCurrentRoute(pathname);

    if (!pendingRouteRef.current || !routeChangeResolverRef.current) return;

    const targetPathname = getPathnameFromHref(pendingRouteRef.current);
    if (pathname === targetPathname) {
      const resolve = routeChangeResolverRef.current;
      clearPendingRoute();
      resolve(true);
    }
  }, [pathname]);

  useEffect(() => {
    const isChunkLoadError = (error) => {
      const message =
        error?.message ||
        error?.reason?.message ||
        error?.reason?.toString?.() ||
        "";

      return (
        message.includes("ChunkLoadError") ||
        message.includes("Loading chunk") ||
        message.includes("failed to fetch") ||
        message.includes("Failed to fetch dynamically imported module")
      );
    };

    const handleError = (event) => {
      if (!isChunkLoadError(event?.error)) return;
      event.preventDefault?.();
      handleChunkLoadFallback();
    };

    const handleRejection = (event) => {
      if (!isChunkLoadError(event?.reason)) return;
      event.preventDefault?.();
      handleChunkLoadFallback();
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  // Create transition overlay element
  const createTransitionOverlay = () => {
    if (overlayRef.current) return overlayRef.current;

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[25000] bg-[#0a0a0a] pointer-events-none';
    overlay.style.opacity = '0';
    overlay.style.transform = 'translateY(-100%)';
    overlay.style.isolation = 'isolate';

    const content = document.createElement("div");
    content.className =
      "absolute inset-0 flex flex-col items-center justify-center px-[5vw]";

    const percent = document.createElement("div");
    percent.className =
      "route-loader-percent font-anton font-normal uppercase text-white leading-[0.8] tracking-[0.02em] text-center select-none";
    percent.textContent = "0%";
    percent.dataset.progress = "0";

    const loadingTrack = document.createElement("div");
    loadingTrack.className =
      "route-loader-track absolute left-0 right-0 bottom-0 h-[4px] bg-white/10 overflow-hidden";

    const progressFill = document.createElement("div");
    progressFill.className = "route-loader-progress h-full w-full bg-white origin-left";
    progressFill.style.transform = "scaleX(0)";

    loadingTrack.appendChild(progressFill);
    content.appendChild(percent);
    const subtitle = document.createElement("p");
    subtitle.className =
      "mt-4 text-white/60 text-sm font-general font-light tracking-[0.14em] uppercase";
    subtitle.textContent = "Cargando vista…";
    content.appendChild(subtitle);
    overlay.appendChild(content);
    overlay.appendChild(loadingTrack);
    document.body.appendChild(overlay);

    overlayRef.current = overlay;
    loadingBarRef.current = loadingTrack;
    loadingBarFillRef.current = progressFill;
    loadingPercentRef.current = percent;
    setLoaderProgress(0, { immediate: true });

    return overlay;
  };

  /**
   * Always the same element: wraps `{children}` only (footer stays outside).
   * Never use `document.body` or `#smooth-content` here — body breaks `position: fixed` (nav, badge);
   * smooth-content is transformed by ScrollSmoother and must not get stray opacity tweens.
   */
  const getTransitionTarget = () => document.getElementById(PAGE_TRANSITION_ROOT_ID);

  // Step 1: Exit animation for current content (opacity only — no transform on ancestors of fixed UI)
  const exitCurrentView = () => {
    return new Promise((resolve) => {
      const content = getTransitionTarget();
      if (!content) {
        resolve();
        return;
      }
      gsap.to(content, {
        opacity: 0.3,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          resolve();
        },
      });
    });
  };

  // Slide transition overlay in (indeterminate bar — no fake %)
  const playLoaderIntro = (overlay) => {
    return new Promise((resolve) => {
      gsap.set(overlay, { autoAlpha: 1, yPercent: -100 });
      transitionTlRef.current = gsap.to(overlay, {
        yPercent: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => resolve(),
      });
    });
  };

  // Step 3: Navigate to new route
  const navigateToRoute = async (targetRoute) => {
    const targetPathname = getPathnameFromHref(targetRoute);

    try {
      router.prefetch?.(targetRoute);
    } catch {
      // Prefetch is opportunistic only.
    }

    const routeChanged = await new Promise((resolve) => {
      pendingRouteRef.current = targetRoute;
      routeChangeResolverRef.current = resolve;
      routeChangeTimeoutRef.current = setTimeout(() => {
        clearPendingRoute();
        resolve(false);
      }, 3500);

      // Let ScrollOptimizer own scroll (ScrollSmoother + window). Next's default scroll fights the proxy.
      router.push(targetRoute, { scroll: false });
    });

    if (!routeChanged && typeof window !== "undefined" && window.location.pathname !== targetPathname) {
      window.location.assign(targetRoute);
      return false;
    }

    return routeChanged;
  };

  // Step 4: Hide loader and show new content
  const hideLoaderAndEnter = (overlay, loadingTrack) => {
    return new Promise((resolve) => {
      const enterTarget = getTransitionTarget();

      const tl = gsap.timeline({
        onComplete: () => {
          resolve();
        },
      });

      tl.to(loadingTrack, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.inOut",
      })
        // Slide overlay up
        .to(
          overlay,
          {
            yPercent: -100,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "-=0.1"
        )
        // Fade overlay out
        .to(
          overlay,
          {
            autoAlpha: 0,
            duration: 0.2,
          },
          "-=0.1"
        );

      if (enterTarget) {
        tl.fromTo(
          enterTarget,
          { opacity: 0.3 },
          {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }
    });
  };

  const startTransition = async (targetRoute) => {
    if (isTransitioning) {
      return;
    }
    
    // Don't transition if we're already on the target route
    if (currentRoute === targetRoute) {
      return;
    }

    setIsTransitioning(true);

    const transitionRoot = document.getElementById(PAGE_TRANSITION_ROOT_ID);
    if (transitionRoot) gsap.killTweensOf(transitionRoot);

    const overlay = createTransitionOverlay();
    const loadingTrack = loadingBarRef.current;
    const transitionStartedAt = Date.now();
    const MIN_LOADER_MS = 720;
    const READY_TIMEOUT_MS = 28000;

    // Kill any existing timeline
    if (transitionTlRef.current) {
      transitionTlRef.current.kill();
    }

    try {
      await exitCurrentView();
      setLoaderProgress(12);

      await playLoaderIntro(overlay);
      setLoaderProgress(24);

      const routeChanged = await navigateToRoute(targetRoute);

      if (!routeChanged) {
        return;
      }
      setLoaderProgress(58, { duration: 0.45 });

      const targetPath = normalizeRoutePath(getPathnameFromHref(targetRoute));
      await armRouteReadyWait(targetPath, READY_TIMEOUT_MS);
      setLoaderProgress(86, { duration: 0.5 });

      const elapsed = Date.now() - transitionStartedAt;
      const remainder = Math.max(0, MIN_LOADER_MS - elapsed);
      if (remainder) {
        setLoaderProgress(94, { duration: Math.min(remainder / 1000, 0.45) });
        await new Promise((r) => setTimeout(r, remainder));
      }

      setLoaderProgress(100, { duration: 0.28 });
      await hideLoaderAndEnter(overlay, loadingTrack);
    } catch (error) {
      console.error('❌ Transition error:', error);
    } finally {
      // Cleanup
      setIsTransitioning(false);
      if (progressTweenRef.current) {
        progressTweenRef.current.kill();
        progressTweenRef.current = null;
      }

      requestAnimationFrame(() => {
        const root = document.getElementById(PAGE_TRANSITION_ROOT_ID);
        if (root) gsap.set(root, { opacity: 1, clearProps: "transform" });
      });

      setTimeout(() => {
        if (overlayRef.current && document.body.contains(overlayRef.current)) {
          document.body.removeChild(overlayRef.current);
          overlayRef.current = null;
          loadingBarRef.current = null;
          loadingBarFillRef.current = null;
          loadingPercentRef.current = null;
        }
      }, 100);
    }
  };

  const value = {
    isTransitioning,
    /** @deprecated No fake % — loader is indeterminate until the route reports ready. */
    transitionProgress: null,
    startTransition,
  };

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}
