// PageReveal.js
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLoading } from "../../contexts/LoadingContext";

export default function PageReveal({ children }) {
  const contentRef = useRef(null);
  const { isInitialLoading, hasLoadedBefore } = useLoading();

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    if (hasLoadedBefore && !isInitialLoading) {
      // If loading just completed, animate content in
      gsap.fromTo(content, 
        { 
          autoAlpha: 0,
          y: 20
        },
        { 
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.2,
          onComplete: () => {
            // Ensure no lingering transforms interfere with backdrop-filter sampling
            gsap.set(content, { clearProps: "transform" });
          }
        }
      );
    } else if (!isInitialLoading) {
      // If no loading screen (returning visitor), show immediately
      gsap.set(content, { autoAlpha: 1, y: 0 });
      gsap.set(content, { clearProps: "transform" });
    }
  }, [isInitialLoading, hasLoadedBefore]);

  return (
    <div 
      ref={contentRef}
      style={{ opacity: 0 }} // Initial hidden state
    >
      {children}
    </div>
  );
}
