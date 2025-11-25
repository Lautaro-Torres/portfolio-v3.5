// TransitionContext.js
"use client";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [currentRoute, setCurrentRoute] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const transitionTlRef = useRef(null);
  const overlayRef = useRef(null);
  const loadingBarRef = useRef(null);
  const contentRef = useRef(null);

  // Track route changes
  useEffect(() => {
    setCurrentRoute(pathname);
  }, [pathname]);

  // Create transition overlay element
  const createTransitionOverlay = () => {
    if (overlayRef.current) return overlayRef.current;

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[25000] bg-[#0a0a0a] flex items-center justify-center pointer-events-none';
    overlay.style.opacity = '0';
    overlay.style.transform = 'translateY(-100%)';
    overlay.style.isolation = 'isolate';

    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'relative w-64 h-1 bg-white/10 rounded-full overflow-hidden';

    const loadingBar = document.createElement('div');
    loadingBar.className = 'absolute inset-0 bg-white rounded-full';
    loadingBar.style.transform = 'scaleX(0)';
    loadingBar.style.transformOrigin = 'left center';

    const loadingText = document.createElement('div');
    loadingText.className = 'absolute bottom-20 left-1/2 transform -translate-x-1/2';
    loadingText.innerHTML = '<p class="text-white/60 text-sm font-montreal tracking-wider uppercase">Loading</p>';

    loadingContainer.appendChild(loadingBar);
    overlay.appendChild(loadingContainer);
    overlay.appendChild(loadingText);
    document.body.appendChild(overlay);

    overlayRef.current = overlay;
    loadingBarRef.current = loadingBar;

    return overlay;
  };

  // Step 1: Exit animation for current content
  const exitCurrentView = () => {
    return new Promise((resolve) => {
      const content = document.querySelector('main') || document.body;
      gsap.to(content, {
        opacity: 0.3,
        y: -30,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          resolve();
        }
      });
    });
  };

  // Step 2: Show loader with minimum duration
  const showLoader = (overlay, loadingBar) => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const minDuration = 700; // Minimum 700ms for loader visibility
      
      // Set initial states
      gsap.set(overlay, { autoAlpha: 1, yPercent: -100 });
      gsap.set(loadingBar, { scaleX: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, minDuration - elapsed);

          // Ensure minimum duration
          setTimeout(() => {
            resolve();
          }, remaining);
        }
      });

      // Slide overlay down
      tl.to(overlay, {
        yPercent: 0,
        duration: 0.4,
        ease: "power2.inOut"
      })
      // Animate loading bar to 100%
      .to(loadingBar, {
        scaleX: 1,
        duration: 0.6,
        ease: "power2.inOut",
        onUpdate: function() {
          const progress = Math.round(this.progress() * 100);
          setTransitionProgress(progress);
        }
      }, "-=0.1");

      transitionTlRef.current = tl;
    });
  };

  // Step 3: Navigate to new route
  const navigateToRoute = async (targetRoute) => {
    router.push(targetRoute);
    
    // Wait for route change to complete
    await new Promise(resolve => setTimeout(resolve, 150));
  };

  // Step 4: Hide loader and show new content
  const hideLoaderAndEnter = (overlay, loadingBar) => {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          resolve();
        }
      });

      // Exit loader animation
      tl.to(loadingBar, {
        scaleY: 12,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        transformOrigin: "center center"
      })
      // Slide overlay up
      .to(overlay, {
        yPercent: -100,
        duration: 0.5,
        ease: "power2.inOut"
      }, "-=0.1")
      // Fade overlay out
      .to(overlay, {
        autoAlpha: 0,
        duration: 0.2
      }, "-=0.1")
      // Enter new content
      .fromTo(document.querySelector('main') || document.body, 
        { opacity: 0.3, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.3");
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
    setTransitionProgress(0);

    const overlay = createTransitionOverlay();
    const loadingBar = loadingBarRef.current;

    // Kill any existing timeline
    if (transitionTlRef.current) {
      transitionTlRef.current.kill();
    }

    try {
      // STEP 1: Exit current view (wait for completion)
      await exitCurrentView();
      
      // STEP 2: Show loader with minimum duration (wait for completion)
      await showLoader(overlay, loadingBar);
      
      // STEP 3: Navigate to new route (wait for completion)
      await navigateToRoute(targetRoute);
      
      // STEP 4: Hide loader and enter new view (wait for completion)
      await hideLoaderAndEnter(overlay, loadingBar);

    } catch (error) {
      console.error('❌ Transition error:', error);
    } finally {
      // Cleanup
      setIsTransitioning(false);
      setTransitionProgress(100);
      
      setTimeout(() => {
        if (overlayRef.current && document.body.contains(overlayRef.current)) {
          document.body.removeChild(overlayRef.current);
          overlayRef.current = null;
          loadingBarRef.current = null;
        }
      }, 100);
    }
  };

  const value = {
    isTransitioning,
    transitionProgress,
    startTransition
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
