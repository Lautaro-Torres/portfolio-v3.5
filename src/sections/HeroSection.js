"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import AvatarLumaSplat from "../components/AvatarLumaSplat";
import { useLetterReveal } from "../hooks/useLetterReveal";

export default function HeroSection() {
  const heroRef = useRef(null);
  const taglineRef = useRef(null);
  const subtitleRef = useRef(null);
  
  // Hero section animates immediately on page load (not on scroll)
  const titleLeftRef = useLetterReveal({ scrollTrigger: false });
  const titleRightRef = useLetterReveal({ delay: 0.4, scrollTrigger: false });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - hide tagline and subtitle
      gsap.set([taglineRef.current, subtitleRef.current], {
        opacity: 0,
        y: 30,
      });

      // Create master timeline for tagline and subtitle
      const tl = gsap.timeline({ delay: 0.8 }); // Wait for titles to start

      // 3. Subtitle animation - clean fade-in (SECOND)
      tl.to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.2"
      );

      // 4. Tagline animation - smooth fade-in (LAST)
      tl.to(
        taglineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
        },
        "-=0.4"
      );

    }, heroRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100svh] h-auto md:h-[100svh] flex items-end md:items-center justify-center mb-0 overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Background avatar - Luma Gaussian Splat viewer */}
      <div className="absolute inset-0 w-full h-full z-10">
        <AvatarLumaSplat />
      </div>

      {/* Gradient overlay for better text contrast */}
      <div className="pointer-events-none absolute inset-0 z-[15]">
        {/* Mobile: linear from bottom to transparent */}
        <div className="block md:hidden w-full h-full bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.45)_40%,rgba(0,0,0,0)_100%)]" />
        {/* Desktop: radial around center */}
        <div className="hidden md:block w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.0)_0%,rgba(0,0,0,0.4)_52%,rgba(0,0,0,0.9)_100%)]" />
      </div>

      <div className="relative z-20 w-full h-full pointer-events-none pt-16 md:pt-0">
        <div className="w-full max-w-[1900px] mx-auto px-[5%] h-full flex flex-col justify-end md:justify-center pb-[22%] md:pb-0">
          {/* Tagline - smooth fade-in */}
          <div ref={taglineRef} className="mb-8 lg:mb-12">
            <p className="text-white text-sm md:text-base lg:text-lg">
              Building distinctive digital projects
              <br />
              with code & design.
            </p>
          </div>

          {/* Main Titles - letter-by-letter staggered reveal */}
          <div className="w-full flex flex-row flex-wrap items-center justify-start md:justify-between gap-2 md:gap-8 lg:gap-10 mb-8 lg:mb-12">
            <div className="w-auto text-left overflow-hidden">
              <span 
                ref={titleLeftRef}
                className="font-ppneue text-white uppercase leading-[1] tracking-[0.04em] font-normal text-[clamp(2.5rem,7.5vw,3.5rem)] md:text-[clamp(4rem,7.5vw,6.75rem)] cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                LAUTARO
              </span>
            </div>
            <div className="w-auto text-left md:text-right overflow-hidden">
              <span 
                ref={titleRightRef}
                className="font-ppneue text-white uppercase leading-[0.9] tracking-[0.04em] font-normal text-[clamp(2.5rem,7.5vw,3.5rem)] md:text-[clamp(4rem,7.5vw,6.75rem)] cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                TORRES
              </span>
            </div>
          </div>

          {/* Subtitle - clean fade-in */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
            <span ref={subtitleRef} className="text-white text-sm md:text-xl">
              CREATIVE DEVELOPER & DESIGNER
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
