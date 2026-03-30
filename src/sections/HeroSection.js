"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WordRotator from "../components/WordRotator";
import HeroOrb3D from "../components/HeroOrb3D";
import { useLoading } from "../contexts/LoadingContext";
import { HOME_MOTION } from "../utils/homeMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const heroRef = useRef(null);
  const heroOrbWrapRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroMainTitlesRef = useRef(null);
  const heroSubtitleWrapRef = useRef(null);
  const heroTopTagRef = useRef(null);
  const heroFooterRef = useRef(null);
  const taglineRef = useRef(null);
  const subtitleRef = useRef(null);
  const orbRef = useRef(null);
  const introTlRef = useRef(null);
  const [argentinaTime, setArgentinaTime] = useState("");
  const { isInitialLoading, isRevealComplete } = useLoading();
  const isHeroReady = !isInitialLoading && isRevealComplete;

  const handleWordTransitionTimeline = useCallback((tl, nextMode, duration) => {
    orbRef.current?.syncMaterialWithTimeline?.(tl, nextMode, duration);
  }, []);

  useLayoutEffect(() => {
    if (!isHeroReady) {
      const navEl = document.querySelector("[data-main-nav]");
      const badgeEl = document.querySelector("[data-dagoberto-badge]");
      gsap.set(
        [
          heroOrbWrapRef.current,
          heroMainTitlesRef.current,
          subtitleRef.current,
          taglineRef.current,
          heroFooterRef.current,
          navEl,
          badgeEl,
        ].filter(Boolean),
        { opacity: 1, y: 0, scale: 1, clearProps: "opacity,transform" }
      );
      return undefined;
    }

    const ctx = gsap.context(() => {
      const navEl = document.querySelector("[data-main-nav]");
      const badgeEl = document.querySelector("[data-dagoberto-badge]");

      const introTargets = [
        heroMainTitlesRef.current,
        subtitleRef.current,
        taglineRef.current,
        heroFooterRef.current,
        navEl,
        badgeEl,
      ].filter(Boolean);

      // Keep visible by default; intro uses fromTo so it never gets stuck hidden.
      gsap.set([heroOrbWrapRef.current, ...introTargets].filter(Boolean), {
        clearProps: "opacity,transform",
      });

      const tl = gsap.timeline({
        defaults: { ease: HOME_MOTION.fadeEase },
        onComplete: () => {
          ScrollTrigger.refresh();
        },
      });

      if (navEl || badgeEl) {
        tl.fromTo(
          [navEl, badgeEl].filter(Boolean),
          { opacity: 0.12 },
          {
            opacity: 1,
            duration: HOME_MOTION.fadeDuration,
            clearProps: "opacity",
            immediateRender: false,
          },
          0.1
        );
      }

      if (heroOrbWrapRef.current) {
        tl.fromTo(
          heroOrbWrapRef.current,
          { opacity: 0.18 },
          {
            opacity: 1,
            duration: HOME_MOTION.fadeDuration,
            clearProps: "opacity",
            immediateRender: false,
          },
          0
        );
      }

      if (heroMainTitlesRef.current) {
        tl.fromTo(
          heroMainTitlesRef.current,
          { opacity: 0.08 },
          {
            opacity: 1,
            duration: HOME_MOTION.fadeDuration,
            clearProps: "opacity",
            immediateRender: false,
          },
          0.34
        );
      }

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0.08 },
          {
            opacity: 1,
            duration: HOME_MOTION.fadeDuration,
            clearProps: "opacity",
            immediateRender: false,
          },
          0.58
        );
      }

      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { opacity: 0.08 },
          {
            opacity: 1,
            duration: HOME_MOTION.fadeDuration,
            clearProps: "opacity",
            immediateRender: false,
          },
          0.46
        );
      }

      if (heroFooterRef.current) {
        tl.fromTo(
          heroFooterRef.current,
          { opacity: 0.08 },
          {
            opacity: 1,
            duration: HOME_MOTION.fadeDuration,
            clearProps: "opacity",
            immediateRender: false,
          },
          0.72
        );
      }

      introTlRef.current = tl;
    }, heroRef);

    return () => {
      introTlRef.current?.kill();
      introTlRef.current = null;
      ctx.revert();
    };
  }, [isHeroReady]);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/Argentina/Buenos_Aires",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const updateArgentinaTime = () => {
      setArgentinaTime(`${formatter.format(new Date())} ART (GMT-3)`);
    };

    updateArgentinaTime();
    const timer = window.setInterval(updateArgentinaTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!heroRef.current || !heroContentRef.current || !heroOrbWrapRef.current) return;

      const parallaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      // Keep centered at start; during scroll move down to reach lower hero margin.
      parallaxTl.to(
        heroOrbWrapRef.current,
        {
          yPercent: 6,
          scale: 0.995,
          duration: 0.72,
          ease: "none",
        },
        0
      );
      parallaxTl.to(
        heroOrbWrapRef.current,
        {
          yPercent: 16,
          scale: 0.98,
          duration: 0.28,
          ease: "none",
        }
      );

      parallaxTl.to(
        heroContentRef.current,
        {
          yPercent: -28,
          ease: "none",
        },
        0
      );

      if (heroMainTitlesRef.current) {
        parallaxTl.to(
          heroMainTitlesRef.current,
          {
            yPercent: -36,
            opacity: 0.72,
            ease: "none",
          },
          0
        );
      }

      if (heroSubtitleWrapRef.current) {
        parallaxTl.to(
          heroSubtitleWrapRef.current,
          {
            yPercent: -40,
            opacity: 0.54,
            ease: "none",
          },
          0
        );
      }

      if (heroTopTagRef.current) {
        parallaxTl.to(
          heroTopTagRef.current,
          {
            yPercent: -28,
            opacity: 0.44,
            ease: "none",
          },
          0
        );
      }

      if (heroFooterRef.current) {
        parallaxTl.to(
          heroFooterRef.current,
          { yPercent: 12, ease: "none" },
          0
        );
      }

      // Fade out 01 when scrolling to About (previous section's number disappears)
      const aboutEl = document.getElementById("about");
      if (heroFooterRef.current && aboutEl) {
        gsap.fromTo(
          heroFooterRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: aboutEl,
              start: "top 90%",
              end: "top 55%",
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100dvh] h-[100dvh] flex items-center justify-center mb-0 overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div ref={heroOrbWrapRef} className="absolute inset-0 z-[50] pointer-events-none">
        <HeroOrb3D ref={orbRef} />
      </div>

      <div
        ref={(node) => {
          heroTopTagRef.current = node;
          taglineRef.current = node;
        }}
        className="absolute top-20 left-[5%] z-40 md:hidden pointer-events-none"
      >
        <p className="text-white text-sm font-general font-light uppercase tracking-[0.18em]">
          LAUTARO TORRES
        </p>
        <p className="mt-2 text-white/55 text-[10px] font-general font-light uppercase tracking-[0.16em]">
          Based in Argentina - Working Globally
        </p>
        <p className="mt-2 text-white/45 text-[10px] font-general font-light uppercase tracking-[0.14em]">
          {argentinaTime}
        </p>
      </div>

      {/* Section number — matches 90% container margins */}
      <div
        ref={heroFooterRef}
        className="absolute bottom-[clamp(1.5rem,4vh,2.5rem)] left-[5%] right-[5%] z-40 flex items-center justify-between pointer-events-none"
      >
        <span className="text-white/25 text-[10px] uppercase tracking-[0.24em]">01</span>
        <span className="hidden md:inline text-white/35 text-[9px] uppercase tracking-[0.2em]">
          Scroll to explore
        </span>
      </div>

      <div ref={heroContentRef} className="relative z-[30] w-full h-full pointer-events-none pt-16 md:pt-0">
        <div className="w-full px-[5%] h-full flex flex-col justify-end md:justify-center pb-[22%] md:pb-0">
          {/* Tagline row — same height */}
          <div className="hidden md:flex md:items-center md:justify-between mb-8 lg:mb-12">
            <p className="text-white text-sm md:text-base lg:text-lg font-general font-light uppercase tracking-[0.14em]">
              LAUTARO TORRES
            </p>
            <div className="text-right">
              <p className="text-white/55 text-[10px] md:text-[11px] font-general font-light uppercase tracking-[0.16em]">
                Based in Argentina - Working Globally
              </p>
              <p className="mt-1 text-white/45 text-[9px] md:text-[10px] font-general font-light uppercase tracking-[0.14em]">
                {argentinaTime}
              </p>
            </div>
          </div>

          {/* Main Titles - letter-by-letter staggered reveal */}
          <div
            ref={heroMainTitlesRef}
            className="w-full flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between gap-0 md:gap-4 lg:gap-6 mb-8 lg:mb-12"
          >
            <div className="w-full md:w-auto md:shrink-0 text-left overflow-hidden py-[8px] md:py-[48px] flex items-center justify-start">
              <span 
                className="font-anton text-white uppercase whitespace-nowrap leading-[0.95] tracking-[0.04em] font-normal text-[clamp(4.6rem,12.2vw,6.7rem)] md:text-[clamp(3.6rem,7.2vw,5.8rem)] lg:text-[clamp(5rem,8.6vw,7.8rem)] xl:text-[clamp(6.8rem,11.8vw,10.9rem)] cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                CREATIVE
              </span>
            </div>
            <div className="w-full md:w-auto md:shrink-0 text-left md:text-right flex items-center justify-start md:justify-end -mt-1 md:mt-0">
              <WordRotator
                isReady={isHeroReady}
                onTransitionTimeline={handleWordTransitionTimeline}
                className="justify-start md:justify-end font-anton text-white uppercase whitespace-nowrap leading-[0.85] tracking-[0.04em] font-normal text-[clamp(4.6rem,12.2vw,6.7rem)] md:text-[clamp(3.6rem,7.2vw,5.8rem)] lg:text-[clamp(5rem,8.6vw,7.8rem)] xl:text-[clamp(6.8rem,11.8vw,10.9rem)] cursor-pointer"
              />
            </div>
          </div>

          {/* Subtitle - clean fade-in */}
          <div
            ref={heroSubtitleWrapRef}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0"
          >
            <span ref={subtitleRef} className="text-white text-sm md:text-xl font-general font-medium tracking-[0.01em]">
              Building distinctive digital projects
              <br />
              with code & design.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
