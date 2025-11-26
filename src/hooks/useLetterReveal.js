"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Custom hook for letter-by-letter reveal animation
 * @param {Object} options - Animation options
 * @param {number} options.stagger - Stagger delay between letters (default: 0.05)
 * @param {number} options.duration - Animation duration (default: 0.8)
 * @param {string} options.ease - GSAP easing (default: "power3.out")
 * @param {number} options.yStart - Starting Y position (default: 100)
 * @param {number} options.rotationX - Starting rotationX (default: -90)
 * @param {boolean} options.scrollTrigger - Enable scroll trigger (default: true)
 * @param {number} options.delay - Initial delay (default: 0)
 */
export function useLetterReveal(options = {}) {
  const {
    stagger = 0.035,
    duration = 0.6,
    ease = "power2.out",
    yStart = 60,
    rotationX = -65,
    scrollTrigger = true,
    delay = 0,
    playWhen = true,
  } = options;

  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !playWhen) return;

    // Split text into individual letters
    const text = element.textContent;
    element.innerHTML = ""; // Clear original text
    
    const letters = [];
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement("span");
      span.textContent = char;
      span.style.display = "inline-block";
      
      // Preserve spaces
      if (char === " ") {
        span.style.width = "0.3em";
      }
      
      element.appendChild(span);
      letters.push(span);
    }

    // Set initial state: hidden and shifted, so text isn't visible before its animation
    gsap.set(letters, {
      y: yStart,
      rotationX: rotationX,
      opacity: 0,
    });

    // Create animation
    if (scrollTrigger) {
      // Animate on scroll - triggers when element enters the viewport
      gsap.to(letters, {
        y: 0,
        rotationX: 0,
        opacity: 1,
        duration: duration,
        stagger: stagger,
        ease: ease,
        delay: delay,
        scrollTrigger: {
          trigger: element,
          start: "top 85%", // Triggers when top of element reaches 85% down the viewport (slightly earlier)
          end: "bottom 15%", // Animation completes before element leaves bottom 15%
          toggleActions: "play none none none", // Only play on enter, no reverse
          once: true, // Only trigger once
          invalidateOnRefresh: true, // Recalculate on refresh to handle dynamic content
          markers: false, // Set to true for debugging if needed
        },
      });
    } else {
      // Animate immediately (for Hero section)
      gsap.to(letters, {
        y: 0,
        rotationX: 0,
        opacity: 1,
        duration: duration,
        stagger: stagger,
        ease: ease,
        delay: delay,
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [stagger, duration, ease, yStart, rotationX, scrollTrigger, delay, playWhen]);

  return elementRef;
}

