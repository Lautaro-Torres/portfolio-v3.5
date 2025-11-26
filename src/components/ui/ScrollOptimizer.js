"use client";
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

export default function ScrollOptimizer() {
  useEffect(() => {
    // Create ScrollSmoother with the correct wrapper/content structure
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 0.7,
      effects: true,
      smoothTouch: 0.05,
    });

    // Refresh ScrollTriggers multiple times to handle dynamic content loading
    // This ensures ScrollTriggers work even when sections load asynchronously
    const refreshIntervals = [100, 300, 600, 1000, 1500];
    const timers = refreshIntervals.map(delay => 
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, delay)
    );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      smoother?.kill();
    };
  }, []);

  return null;
}

