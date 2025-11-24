// LoadingScreen.js
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLoading } from "../../contexts/LoadingContext";

export default function LoadingScreen() {
  const containerRef = useRef(null);
  const loadingBarRef = useRef(null);
  const { isInitialLoading, completeLoading } = useLoading();

  useEffect(() => {
    if (!isInitialLoading) return;

    const container = containerRef.current;
    const loadingBar = loadingBarRef.current;
    
    if (!container || !loadingBar) return;

    // Set initial states
    gsap.set(container, { autoAlpha: 1 });
    gsap.set(loadingBar, { scaleX: 0, transformOrigin: "left center" });

    // Create master timeline
    const masterTl = gsap.timeline({
      onComplete: () => {
        completeLoading();
      }
    });

    // Loading animation (0% to 100%)
    masterTl.to(loadingBar, {
      scaleX: 1,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: function() {
        // Optional: Add percentage counter if needed
        // console.log(`Loading: ${Math.round(this.progress() * 100)}%`);
      }
    })
    // Brief pause at 100%
    .to({}, { duration: 0.3 })
    // Exit animation - expand and fade
    .to(loadingBar, {
      scaleY: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      transformOrigin: "center center"
    }, "-=0.1")
    // Slide entire screen up
    .to(container, {
      yPercent: -100,
      duration: 1,
      ease: "power2.inOut"
    }, "-=0.6")
    // Final fade out
    .to(container, {
      autoAlpha: 0,
      duration: 0.3
    }, "-=0.3");

    // Cleanup function
    return () => {
      masterTl.kill();
    };
  }, [isInitialLoading, completeLoading]);

  if (!isInitialLoading) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[20000] bg-[#0a0a0a] flex items-center justify-center"
      style={{ isolation: 'isolate' }}
    >
      {/* Loading Bar Container */}
      <div className="relative w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        {/* Animated Loading Bar */}
        <div
          ref={loadingBarRef}
          className="absolute inset-0 bg-white rounded-full"
        />
      </div>
      
      {/* Optional: Loading text */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <p className="text-white/60 text-sm font-montreal tracking-wider uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}
