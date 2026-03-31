"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutPortalCard from "../components/AboutPortalCard";
import InlineLottieGlobe from "../components/InlineLottieGlobe";
import TextCtaLink from "../components/ui/TextCtaLink";
import { HOME_MOTION } from "../utils/homeMotion";
import { useClippedTitleReveal } from "../hooks/useClippedTitleReveal";

export default function AboutSection() {
  const aboutRenderVideo = "/assets/videos/opt-lautor-loop-card-2.mp4";
  const [isMobileTitle, setIsMobileTitle] = useState(false);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const cardParallaxRef = useRef(null);
  const textParallaxRef = useRef(null);
  const titleWrapRef = useRef(null);
  const titleRevealStart = isMobileTitle ? "top 86%" : "top 72%";
  const titleLine1Ref = useClippedTitleReveal({
    start: titleRevealStart,
    delay: 0.08,
    duration: HOME_MOTION.titleCharDuration,
    stagger: HOME_MOTION.titleCharStagger,
    ease: HOME_MOTION.titleCharEase,
  });
  const titleLine2TextRef = useClippedTitleReveal({
    start: titleRevealStart,
    // Sequence: line 1 fully animates first, then line 2 starts.
    delay: isMobileTitle ? 0.98 : 1.15,
    duration: HOME_MOTION.titleCharDuration,
    stagger: HOME_MOTION.titleCharStagger,
    ease: HOME_MOTION.titleCharEase,
  });
  const lottieWrapRef = useRef(null);
  const bodyCopyRef = useRef(null);
  const ctaWrapRef = useRef(null);
  const sectionNumberRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobileTitle(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hide title, body and CTA until their scroll trigger fires (card shows first)
      gsap.set([titleWrapRef.current, bodyCopyRef.current, ctaWrapRef.current], { opacity: 0 });

      // 1) Card enters first — when section top hits 92% of viewport
      if (cardRef.current) {
        // With 100dvh-locked sections, relying on a scrub-less tween's initial render can keep the
        // element stuck at opacity:0 if the trigger never "enters" in the expected way. Keep visible
        // by default and only animate onEnter.
        gsap.set(cardRef.current, { opacity: 1, y: 0, clearProps: "opacity,transform" });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 92%",
          once: true,
          invalidateOnRefresh: true,
          onEnter: () => {
            gsap.fromTo(
              cardRef.current,
              { y: HOME_MOTION.revealY, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: HOME_MOTION.sectionCardDuration,
                ease: HOME_MOTION.fadeEase,
                immediateRender: false,
              }
            );
          },
        });
      }

      // 2) Title (chars + lottie) after card — when section top hits 78%
      if (titleWrapRef.current) {
        const titleTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: titleRevealStart,
            once: true,
            invalidateOnRefresh: true,
          },
        });
        titleTl.to(titleWrapRef.current, { opacity: 1, duration: 0.01 });
        if (lottieWrapRef.current) {
          titleTl.fromTo(
            lottieWrapRef.current,
            { opacity: 0, y: 16, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: HOME_MOTION.sectionItemDuration, ease: HOME_MOTION.fadeEase },
            0.2
          );
        }
      }

      // 3) Body copy — when section top hits 70%
      if (bodyCopyRef.current) {
        gsap.fromTo(
          bodyCopyRef.current,
          { y: HOME_MOTION.revealY, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: HOME_MOTION.sectionItemDuration,
            ease: HOME_MOTION.fadeEase,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 68%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // 4) CTA last — when section top hits 65%
      if (ctaWrapRef.current) {
        gsap.fromTo(
          ctaWrapRef.current,
          { y: HOME_MOTION.revealY - 8, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: HOME_MOTION.sectionItemDuration,
            ease: HOME_MOTION.fadeEase,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 64%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const cardTravelFrom = isMobile ? 7 : 8;
      const cardTravelTo = isMobile ? -16 : -18;
      const textTravelFrom = isMobile ? 12 : 14;
      const textTravelTo = isMobile ? -26 : -34;
      const sharedStart = isMobile ? "top 96%" : "top 88%";
      const sharedEnd = isMobile ? "bottom 4%" : "bottom 14%";

      if (cardParallaxRef.current) {
        gsap.fromTo(
          cardParallaxRef.current,
          { yPercent: cardTravelFrom },
          {
            yPercent: cardTravelTo,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: sharedStart,
              end: sharedEnd,
              scrub: isMobile ? 1.05 : 1.15,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      if (textParallaxRef.current) {
        gsap.fromTo(
          textParallaxRef.current,
          { yPercent: textTravelFrom },
          {
            yPercent: textTravelTo,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: sharedStart,
              end: sharedEnd,
              scrub: isMobile ? 0.95 : 0.98,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Fade out 02 when scrolling to Projects (previous section's number disappears)
      const projectsEl = document.getElementById("projects");
      if (sectionNumberRef.current && projectsEl) {
        gsap.fromTo(
          sectionNumberRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: projectsEl,
              start: "top 90%",
              end: "top 55%",
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full mt-0 pt-0 mb-0 h-[100dvh] min-h-[100dvh] md:h-[100dvh] md:min-h-[100dvh]"
    >
      {/* Section number — always at bottom of section; fades when scrolling to Projects */}
      <div
        ref={sectionNumberRef}
        className="absolute bottom-[clamp(1.5rem,4vh,2.5rem)] left-0 z-10 pointer-events-none"
      >
        <span className="text-white/25 text-[10px] uppercase tracking-[0.24em]">02</span>
      </div>
      <div
        className="h-full flex items-center justify-center pt-[var(--about-pad-top)] pb-[var(--about-pad-bottom)] md:pt-[8vh] md:pb-0"
        style={{
          "--about-pad-top": "clamp(3.25rem,7vh,5.5rem)",
          // Aún menos padding inferior en mobile para que el contenido llene mejor el viewport.
          "--about-pad-bottom": "clamp(1.6rem,3.5vh,3.2rem)",
        }}
      >
        {/* Mobile: 60% card / 40% texto sobre alto neto (100dvh − paddings). Desktop: grid 2 cols. */}
        <div className="w-full h-[calc(100%-var(--about-pad-top)-var(--about-pad-bottom))] md:h-auto md:grid md:grid-cols-[0.82fr_1.18fr] md:gap-x-16 lg:gap-x-20 md:items-center md:justify-items-center min-h-0">
          <div className="w-full h-[55%] min-h-0 md:h-auto flex items-stretch justify-center">
            <div ref={cardParallaxRef} className="w-full h-full min-h-0">
              <div ref={cardRef} className="w-full h-full min-h-0 flex items-stretch justify-center">
                <AboutPortalCard
                  videoSrc={aboutRenderVideo}
                  name="Lautaro Torres"
                  className="max-w-[min(92vw,320px)] w-full h-full max-h-full sm:max-w-[320px] md:max-w-[430px] md:h-[540px]"
                />
              </div>
            </div>
          </div>

          <div
            ref={textParallaxRef}
            className="w-full h-[45%] min-h-0 md:h-auto md:self-center overflow-hidden flex flex-col justify-between gap-3 mt-10 md:mt-0"
          >
            <div className="grid grid-cols-12 gap-x-4 w-full min-h-0 pl-6 pr-4 md:pl-0 md:pr-0">
              <h2
                ref={titleWrapRef}
                className="col-span-12 font-anton uppercase text-white leading-[0.96] tracking-[0.01em] font-normal text-[clamp(2.1rem,7.2vw,5.6rem)] md:text-[clamp(2.6rem,5.4vw,5.4rem)] shrink-0"
              >
                <span className="block">
                  <span ref={titleLine1Ref} className="block md:-ml-[0.06em] lg:-ml-[0.08em]">
                    BRIDGING REALITY
                  </span>
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 md:inline-flex md:gap-x-[0.12em] md:whitespace-nowrap">
                  <span ref={lottieWrapRef} className="inline-flex shrink-0 items-center self-start pt-[0.06em]">
                    <InlineLottieGlobe className="w-[0.78em] h-[0.78em] translate-y-[0.03em] rounded-full overflow-hidden bg-[#0a0a0a]" />
                  </span>
                  <span ref={titleLine2TextRef} className="font-anton min-w-0">
                    INTO THE DIGITAL
                  </span>
                </span>
              </h2>
              <p
                ref={bodyCopyRef}
                className="col-span-9 col-start-4 md:col-start-1 md:col-span-7 mt-3 md:mt-7 text-white/82 text-[clamp(0.92rem,1.7vw,1.05rem)] md:text-[clamp(1.1rem,1.2vw,1.4rem)] leading-[1.22] max-w-[760px]"
              >
                From strategy to execution, I build websites and digital experiences that translate
                real-world brands into systems people can feel, navigate and remember.
              </p>
              <div
                ref={ctaWrapRef}
                className="col-span-9 col-start-4 md:col-start-1 md:col-span-7 mt-3 md:mt-7 shrink-0"
              >
                <TextCtaLink text="See Experience" href="/experience" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
