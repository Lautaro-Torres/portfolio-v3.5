"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WordRotator from "../components/WordRotator";
import MateHero from "../components/MateHero";
import { useLoading } from "../contexts/LoadingContext";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const heroRef = useRef(null);
  const heroOrbWrapRef = useRef(null);
  const heroContentRef = useRef(null);
  const heroMainTitlesRef = useRef(null);
  const heroSubtitleWrapRef = useRef(null);
  const heroDesktopTaglineRef = useRef(null);
  const heroTopTagRef = useRef(null);
  const heroFooterRef = useRef(null);
  const taglineRef = useRef(null);
  const subtitleRef = useRef(null);
  const orbRef = useRef(null);
  const introTlRef = useRef(null);
  const [argentinaTime, setArgentinaTime] = useState("");
  /** Latched after intro timeline completes — unlocks CSS that hides layers pre-intro. */
  const [introComplete, setIntroComplete] = useState(false);
  const { isInitialLoading, isRevealComplete } = useLoading();
  const isHeroReady = !isInitialLoading && isRevealComplete;

  const handleWordTransitionTimeline = useCallback((tl, nextMode, duration) => {
    orbRef.current?.syncMaterialWithTimeline?.(tl, nextMode, duration);
  }, []);

  useLayoutEffect(() => {
    document.body.classList.add("home-hero-intro-pending");
    return () => {
      document.body.classList.remove("home-hero-intro-pending");
    };
  }, []);

  useLayoutEffect(() => {
    const navEl = document.querySelector("[data-main-nav]");
    const badgeEl = document.querySelector("[data-dagoberto-badge]");
    const glassPillEl = document.querySelector("[data-glass-portal-pill]");
    const persistentUiEls = [navEl, badgeEl, glassPillEl].filter(Boolean);

    const supportEls = [
      heroDesktopTaglineRef.current,
      taglineRef.current,
      heroSubtitleWrapRef.current,
      heroFooterRef.current,
    ].filter(Boolean);

    const allIntroEls = [
      heroOrbWrapRef.current,
      heroMainTitlesRef.current,
      ...supportEls,
      navEl,
      badgeEl,
      glassPillEl,
    ].filter(Boolean);

    if (!isHeroReady) {
      introTlRef.current?.kill();
      introTlRef.current = null;
      setIntroComplete(false);
      gsap.set(heroRef.current, { backgroundColor: "#000000" });
      gsap.set(allIntroEls, { autoAlpha: 0 });
      if (heroMainTitlesRef.current) {
        gsap.set(heroMainTitlesRef.current, { y: 52, force3D: true });
      }
      return () => {
        introTlRef.current?.kill();
        introTlRef.current = null;
        // Prevent nav/badge/pill from staying hidden after SPA navigation.
        gsap.set(persistentUiEls, { clearProps: "opacity,visibility" });
      };
    }

    const ctx = gsap.context(() => {
      /* Deterministic prep: same frame as first paint with isHeroReady (set + to, no from() surprises). */
      gsap.set(heroRef.current, { backgroundColor: "#000000" });
      if (heroOrbWrapRef.current) gsap.set(heroOrbWrapRef.current, { autoAlpha: 0 });
      if (heroMainTitlesRef.current) {
        gsap.set(heroMainTitlesRef.current, { y: 52, autoAlpha: 0, force3D: true });
      }
      gsap.set(supportEls, { autoAlpha: 0 });
      gsap.set([navEl, badgeEl, glassPillEl].filter(Boolean), { autoAlpha: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.classList.remove("home-hero-intro-pending");
          /* Commit .hero-home-intro-complete before clearProps so CSS prep rules never flash back. */
          flushSync(() => setIntroComplete(true));
          gsap.set(allIntroEls, { clearProps: "opacity,visibility" });
          gsap.set(heroRef.current, { clearProps: "backgroundColor" });
          ScrollTrigger.refresh();
        },
      });

      if (heroOrbWrapRef.current) {
        tl.to(
          heroOrbWrapRef.current,
          { autoAlpha: 1, duration: 0.64, ease: "power2.out" },
          0.05
        );
      }

      if (heroMainTitlesRef.current) {
        tl.to(
          heroMainTitlesRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.76,
            ease: "power3.out",
          },
          ">+=0.18"
        );
      }

      if (supportEls.length) {
        tl.to(
          supportEls,
          {
            autoAlpha: 1,
            duration: 0.46,
            stagger: 0.065,
            ease: "power2.out",
          },
          ">+=0.14"
        );
      }

      /* Nav + portaled glass pill same beat (pill is not inside [data-main-nav]). */
      const navAndGlass = [navEl, glassPillEl].filter(Boolean);
      if (navAndGlass.length) {
        tl.to(
          navAndGlass,
          { autoAlpha: 1, duration: 0.46, ease: "power2.out" },
          ">+=0.08"
        );
      }

      if (badgeEl) {
        tl.to(
          badgeEl,
          { autoAlpha: 1, duration: 0.46, ease: "power2.out" },
          "<0.05"
        );
      }

      tl.to(
        heroRef.current,
        {
          backgroundColor: "#0a0a0a",
          duration: 0.52,
          ease: "power2.inOut",
        },
        "<0.06"
      );

      introTlRef.current = tl;
    }, heroRef);

    return () => {
      introTlRef.current?.kill();
      introTlRef.current = null;
      ctx.revert();
      // Ensure persistent UI is restored even if intro unmounts mid-timeline.
      gsap.set(persistentUiEls, { clearProps: "opacity,visibility" });
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

      const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
      const heightFactor =
        isMobile && typeof window !== "undefined"
          ? (() => {
              const w = window.innerWidth || 375;
              const h = window.innerHeight || 812;
              const aspect = h / w || 2; // ~2 en muchos iPhone modernos
              const raw = aspect / 2; // normalizar alrededor de 1
              return Math.min(Math.max(raw, 0.85), 1.35);
            })()
          : 1;

      const parallaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          // scrub: N (segundos) retrasa el parallax respecto al scroll → sensación “trabada”.
          // true = 1:1 con el progreso del scroll; más fluido con ScrollSmoother en desktop.
          scrub: true,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      const orbYEnd = isMobile ? 26 * heightFactor : 16;

      // Un solo tween en yPercent: velocidad constante respecto al scroll (antes 0.72+0.28 rompía la derivada ~72%).
      parallaxTl.to(
        heroOrbWrapRef.current,
        {
          yPercent: orbYEnd,
          duration: 1,
          ease: "none",
          force3D: true,
        },
        0
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
            yPercent: isMobile ? -52 * heightFactor : -36,
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
            yPercent: isMobile ? -56 * heightFactor : -40,
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
            yPercent: isMobile ? -40 * heightFactor : -28,
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
      className={`hero-home relative w-full min-h-[100dvh] h-[100dvh] flex items-center justify-center mb-0 overflow-hidden ${
        introComplete ? "hero-home-intro-complete bg-[#0a0a0a]" : "bg-black"
      }`}
    >
      {/* 3D hero band — canvas ocupa todo el hero; posición final se controla desde HeroOrb3D (offsets / amplitudes). */}
      <div
        ref={heroOrbWrapRef}
        className="hero-home-layer-orb absolute inset-0 z-[50] pointer-events-none will-change-transform"
      >
        <MateHero ref={orbRef} />
      </div>

      <div
        ref={(node) => {
          heroTopTagRef.current = node;
          taglineRef.current = node;
        }}
        className="hero-home-layer-support absolute top-20 left-[5%] z-40 md:hidden pointer-events-none"
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
        className="hero-home-layer-support absolute bottom-[clamp(1.5rem,4vh,2.5rem)] left-[5%] right-[5%] z-40 flex items-center justify-between pointer-events-none"
      >
        <span className="text-white/25 text-[10px] uppercase tracking-[0.24em]">01</span>
        <span className="hidden md:inline text-white/35 text-[9px] uppercase tracking-[0.2em]">
          Scroll to explore
        </span>
      </div>

      <div
        ref={heroContentRef}
        className="relative z-[30] w-full h-full pointer-events-none pt-16 md:pt-0"
      >
        <div className="w-full px-[5%] h-full flex flex-col justify-end md:justify-center pb-[16%] md:pb-0">
          {/* Tagline row — same height */}
          <div
            ref={heroDesktopTaglineRef}
            className="hero-home-layer-support hidden md:flex md:items-center md:justify-between mb-8 lg:mb-12"
          >
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
            className="hero-home-layer-titles w-full flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between gap-0 md:gap-4 lg:gap-6 mb-8 lg:mb-12 mt-[-9vh] md:mt-0"
          >
            <div className="w-full md:w-auto md:shrink-0 text-left overflow-hidden py-[8px] md:py-[48px] flex items-center justify-start">
              <span 
                className="font-anton text-white uppercase whitespace-nowrap leading-[0.95] tracking-[0.04em] font-normal text-[clamp(4rem,11.4vw,5.9rem)] md:text-[clamp(3.6rem,7.2vw,5.8rem)] lg:text-[clamp(5rem,8.6vw,7.8rem)] xl:text-[clamp(6.8rem,11.8vw,10.9rem)] cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                CREATIVE
              </span>
            </div>
            <div className="w-full md:w-auto md:shrink-0 text-left md:text-right flex items-center justify-start md:justify-end -mt-1 md:mt-0">
              <WordRotator
                isReady={isHeroReady}
                onTransitionTimeline={handleWordTransitionTimeline}
                className="justify-start md:justify-end font-anton text-white uppercase whitespace-nowrap leading-[0.85] tracking-[0.04em] font-normal text-[clamp(4rem,11.4vw,5.9rem)] md:text-[clamp(3.6rem,7.2vw,5.8rem)] lg:text-[clamp(5rem,8.6vw,7.8rem)] xl:text-[clamp(6.8rem,11.8vw,10.9rem)] cursor-pointer"
              />
            </div>
          </div>

          {/* Subtitle - clean fade-in */}
          <div
            ref={heroSubtitleWrapRef}
            className="hero-home-layer-support flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0"
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
