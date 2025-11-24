// src/sections/ExperimentsSection.jsx
"use client";
import { useRouter } from "next/navigation";
import { useLetterReveal } from "../hooks/useLetterReveal";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ExperimentsSection() {
  const router = useRouter();
  
  // Refs for letter reveal animation
  const ideasRef = useLetterReveal();
  const experimentsRef = useLetterReveal({ delay: 0.2 });
  const skillsRef = useLetterReveal({ delay: 0.4 });
  
  // Refs for section animations
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const gridLinesRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate video background with scale effect
      if (videoRef.current) {
        gsap.set(videoRef.current, { opacity: 0, scale: 1.1 });
        gsap.to(videoRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }

      // Animate dark overlay
      if (overlayRef.current) {
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }

      // Animate grid lines
      if (gridLinesRef.current) {
        const lines = gridLinesRef.current.querySelectorAll('div');
        gsap.set(lines, { scaleY: 0, transformOrigin: 'top' });
        gsap.to(lines, {
          scaleY: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }

      // Animate CTA indicator
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { y: 20, opacity: 0 });
        gsap.to(ctaRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    console.log('ExperimentsSection clicked: navigating to /experiments');
    router.push('/experiments');
  };
  return (
    <section ref={sectionRef} className="relative w-full h-[70vh] bg-black overflow-hidden rounded-lg p-[5%]">
      <style>{`
        .exp-title { font-size: clamp(16px, 4vw, 52px); }
        @media (min-width: 768px) { .exp-title { font-size: clamp(22px, 4.5vw, 72px); } }
      `}</style>
      {/* Background video (full viewport). Replace src with your asset under /public/videos. */}
      {/* Future interactive hover effects on the video can be added here (e.g., shaders). */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src="/videos/experiments-bg.mp4" type="video/mp4" />
      </video>

      {/* Subtle dark layer for contrast */}
      <div ref={overlayRef} className="absolute inset-0 bg-black/35 z-10" />

      {/* Clickable overlay linking to /experiments */}
      <button onClick={handleClick} aria-label="Enter experiments" className="group absolute inset-0 z-20">
        {/* Structural grid for proportion reference */}
        <div className="grid grid-cols-3 grid-rows-2 w-full h-full" />

        {/* Big titles (uniform size across all three, matching previous typography) */}
        <div className="absolute inset-0 grid grid-cols-3 place-items-center">
          <div className="w-full flex items-center justify-center">
            <span 
              ref={ideasRef}
              className="exp-title font-ppneue text-white/95 uppercase leading-[0.9] tracking-[0.04em] select-none font-normal"
              style={{ perspective: "1000px" }}
            >
              IDEAS
            </span>
          </div>
          <div className="w-full flex items-center justify-center">
            <span 
              ref={experimentsRef}
              className="exp-title font-ppneue text-white/95 uppercase leading-[0.9] tracking-[0.04em] select-none font-normal text-center"
              style={{ perspective: "1000px" }}
            >
              EXPERIMENTS
            </span>
          </div>
          <div className="w-full flex items-center justify-center">
            <span 
              ref={skillsRef}
              className="exp-title font-ppneue text-white/95 uppercase leading-[0.9] tracking-[0.04em] select-none font-normal"
              style={{ perspective: "1000px" }}
            >
              SKILLS
            </span>
          </div>
        </div>

        {/* Corner labels (Montreal light) */}
        <div className="absolute inset-0 p-4">
          <div className="absolute top-4 left-4 font-ppneue font-normal text-[11px] tracking-[0.22em] text-white/85 uppercase select-none">Creative Tech</div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 font-ppneue font-normal text-[11px] tracking-[0.22em] text-white/85 uppercase select-none">Motion & 3D</div>
          <div className="absolute top-4 right-4 font-ppneue font-normal text-[11px] tracking-[0.22em] text-white/85 uppercase select-none">New Media</div>

          <div className="absolute bottom-4 left-4 font-ppneue font-normal text-[11px] tracking-[0.22em] text-white/85 uppercase select-none">Sound/Visual</div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-ppneue font-normal text-[11px] tracking-[0.22em] text-white/85 uppercase select-none">Side Projects</div>
          <div className="absolute bottom-4 right-4 font-ppneue font-normal text-[11px] tracking-[0.22em] text-white/85 uppercase select-none">Tools & VJing</div>
        </div>

        {/* Grid overlay lines */}
        <div ref={gridLinesRef} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/20" />
          <div className="absolute top-0 bottom-0 left-2/3 w-px bg-white/20" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/20" />
        </div>

        {/* CTA indicator */}
        <div ref={ctaRef} className="absolute left-1/2 -translate-x-1/2 bottom-[8%] text-center select-none">
          <span className="font-ppneue font-normal text-white/95 text-[12px] tracking-[0.3em] uppercase inline-flex items-center gap-2">
            <span className="relative inline-block w-2 h-2 rounded-full bg-white/90 animate-ping" />
            Click here to enter experiments
            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-white/70 animate-pulse" />
          </span>
        </div>
      </button>

      {/* Note: For very narrow mobile screens, consider reducing fontSize clamp upper bound. */}
    </section>
  );
}
