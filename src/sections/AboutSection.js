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
        gsap.fromTo(
          cardRef.current,
          { y: HOME_MOTION.revealY, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: HOME_MOTION.sectionCardDuration,
            ease: HOME_MOTION.fadeEase,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 92%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
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
      className="relative w-full mt-0 pt-0 mb-0 pb-32 md:pb-0 h-auto min-h-0 md:min-h-[100dvh] md:h-[100dvh]"
    >
      {/* Section number — always at bottom of section; fades when scrolling to Projects */}
      <div
        ref={sectionNumberRef}
        className="absolute bottom-[clamp(1.5rem,4vh,2.5rem)] left-0 z-10 pointer-events-none"
      >
        <span className="text-white/25 text-[10px] uppercase tracking-[0.24em]">02</span>
      </div>
      <div className="md:h-full md:flex md:items-center md:justify-center md:pt-[8vh]">
        <div className="grid grid-cols-1 md:grid-cols-[0.82fr_1.18fr] gap-y-12 md:gap-y-0 md:gap-x-16 lg:gap-x-20 items-center justify-items-center w-full">
          <div className="w-full">
            <div
              ref={cardParallaxRef}
              className="w-full"
            >
              <div
                ref={cardRef}
                className="mt-2 w-full h-[430px] sm:h-[470px] md:h-[620px] flex items-center justify-center"
              >
                <AboutPortalCard
                  videoSrc={aboutRenderVideo}
                  name="Lautaro Torres"
                  className="max-w-[290px] h-[370px] sm:max-w-[320px] sm:h-[410px] md:max-w-[430px] md:h-[540px]"
                />
              </div>
            </div>
          </div>

          <div ref={textParallaxRef} className="md:self-center">
            <div className="grid grid-cols-12 gap-x-4">
              <h2
                ref={titleWrapRef}
                className="col-span-12 font-anton uppercase text-white leading-[0.96] tracking-[0.01em] font-normal text-[clamp(2.65rem,9.4vw,6.8rem)]"
              >
                <span className="block">
                  <span ref={titleLine1Ref} className="block md:-ml-[0.06em] lg:-ml-[0.08em]">
                    BRIDGING REALITY
                  </span>
                </span>
                <span className="block inline-flex items-center gap-[0.12em] md:whitespace-nowrap">
                  <span ref={lottieWrapRef} className="inline-flex items-center">
                    <InlineLottieGlobe className="w-[0.78em] h-[0.78em] translate-y-[0.03em] rounded-full overflow-hidden bg-[#0a0a0a]" />
                  </span>
                  <span ref={titleLine2TextRef} className="font-anton">
                  &nbsp;INTO THE DIGITAL
                  </span>
                </span>
              </h2>
              <p
                ref={bodyCopyRef}
                className="col-start-4 col-span-9 md:col-start-1 md:col-span-7 mt-5 md:mt-7 text-white/82 text-base md:text-[2rem] leading-[1.25] max-w-[760px]"
              >
                From strategy to execution, I build websites and digital experiences that translate
                real-world brands into systems people can feel, navigate and remember.
              </p>
              <div ref={ctaWrapRef} className="col-start-4 col-span-9 md:col-start-1 md:col-span-7 mt-7">
                <TextCtaLink text="See Experience" href="/experience" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
