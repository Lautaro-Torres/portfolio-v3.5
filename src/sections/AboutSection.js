"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutPortalCard from "../components/AboutPortalCard";
import InlineLottieGlobe from "../components/InlineLottieGlobe";
import TextCtaLink from "../components/ui/TextCtaLink";
import { HOME_MOTION } from "../utils/homeMotion";
import { useClippedTitleReveal } from "../hooks/useClippedTitleReveal";

const ABOUT_TITLE_LINE1 = "BRIDGING REALITY";
const ABOUT_TITLE_LINE2 = "INTO THE DIGITAL";

export default function AboutSection() {
  const aboutRenderVideo = "/assets/videos/opt-lautor-loop-card-2.mp4";
  const [isMobileTitle, setIsMobileTitle] = useState(false);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const cardParallaxRef = useRef(null);
  const textParallaxRef = useRef(null);
  const titleWrapRef = useRef(null);
  const titleRevealStart = isMobileTitle ? "top 86%" : "top 72%";
  const lowerTextRevealStartedRef = useRef(false);
  const lowerTextBlockRef = useRef(null);

  const onTitleLine2CharsComplete = useCallback(() => {
    if (lowerTextRevealStartedRef.current) return;
    const el = lowerTextBlockRef.current;
    if (!el) return;
    lowerTextRevealStartedRef.current = true;
    gsap.fromTo(
      el,
      { y: HOME_MOTION.revealY, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: HOME_MOTION.sectionItemDuration,
        ease: HOME_MOTION.fadeEase,
        delay: 0.08,
        immediateRender: false,
      }
    );
  }, []);

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
    onComplete: onTitleLine2CharsComplete,
  });
  const lottieWrapRef = useRef(null);
  const sectionNumberRef = useRef(null);

  useEffect(() => {
    lowerTextRevealStartedRef.current = false;
  }, [isMobileTitle, titleRevealStart]);

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
      // Hide title + lower block until scroll (card shows first); body+CTA fade after title chars finish
      gsap.set([titleWrapRef.current, lowerTextBlockRef.current], { opacity: 0 });

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

      // 3) Paragraph + CTA: fade runs from useClippedTitleReveal line-2 onComplete (not ScrollTrigger+delay)
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [isMobileTitle, titleRevealStart]);

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
        {/* Mobile: tarjeta alta (3:5, no cuadrada) + texto con el resto; desktop: grid 2 cols. */}
        <div className="w-full h-[calc(100%-var(--about-pad-top)-var(--about-pad-bottom))] md:h-auto md:grid md:grid-cols-[0.82fr_1.18fr] md:gap-x-16 lg:gap-x-20 md:items-center md:justify-items-center min-h-0 flex flex-col md:block">
          <div className="w-full shrink-0 flex justify-center items-start pt-1 pb-2 md:pb-0 md:h-auto md:items-center md:pt-0 md:shrink md:flex-initial min-h-0">
            <div ref={cardParallaxRef} className="w-full flex justify-center items-center min-h-0 md:h-full md:min-h-[540px]">
              <div
                ref={cardRef}
                className="
                  relative mx-auto w-[min(78vw,280px)]
                  aspect-[3/5] max-h-[min(54dvh,520px)]
                  md:w-full md:max-w-none md:aspect-auto md:max-h-none
                  md:flex md:items-center md:justify-center md:min-h-0 md:h-[min(540px,72vh)]
                "
              >
                <AboutPortalCard
                  videoSrc={aboutRenderVideo}
                  name="Lautaro Torres"
                  className="absolute inset-0 h-full w-full md:static md:h-[540px] md:w-full md:max-w-[430px]"
                />
              </div>
            </div>
          </div>

          <div
            ref={textParallaxRef}
            className="w-full flex-1 min-h-0 md:flex-none md:h-auto md:self-center overflow-hidden flex flex-col justify-between gap-3 mt-4 md:mt-0"
          >
            <div className="grid grid-cols-12 gap-x-4 w-full min-h-0 pl-6 pr-4 md:pl-0 md:pr-0">
              <h2
                ref={titleWrapRef}
                className="col-span-12 grid grid-cols-12 gap-x-4 gap-y-1 m-0 p-0 shrink-0 font-normal"
              >
                <span
                  ref={titleLine1Ref}
                  className="col-span-12 block font-anton uppercase text-white leading-[0.96] tracking-[0.01em] text-[clamp(2.1rem,7.2vw,5.6rem)] md:text-[clamp(2.6rem,5.4vw,5.4rem)] md:-ml-[0.06em] lg:-ml-[0.08em]"
                >
                  {ABOUT_TITLE_LINE1}
                </span>
                <span className="col-span-12 md:col-start-3 md:col-span-10 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 md:inline-flex md:gap-x-[0.12em] md:whitespace-nowrap font-anton uppercase text-white leading-[0.96] tracking-[0.01em] text-[clamp(2.1rem,7.2vw,5.6rem)] md:text-[clamp(2.6rem,5.4vw,5.4rem)]">
                  <span ref={lottieWrapRef} className="inline-flex shrink-0 items-center self-start pt-[0.06em]">
                    <InlineLottieGlobe className="w-[0.78em] h-[0.78em] translate-y-[0.03em] rounded-full overflow-hidden bg-[#0a0a0a]" />
                  </span>
                  <span ref={titleLine2TextRef} className="min-w-0">
                    {ABOUT_TITLE_LINE2}
                  </span>
                </span>
              </h2>
              <div
                ref={lowerTextBlockRef}
                className="col-span-9 col-start-4 md:col-start-3 md:col-span-5 mt-3 md:mt-7 flex flex-col gap-3 md:gap-7"
              >
                <p className="text-white/82 text-[clamp(0.92rem,1.7vw,1.05rem)] md:text-[clamp(1.1rem,1.2vw,1.4rem)] leading-[1.22] md:max-w-none">
                  From strategy to execution, I build websites and digital experiences that translate
                  real-world brands into systems people can feel, navigate and remember.
                </p>
                <div className="shrink-0">
                  <TextCtaLink text="See Experience" href="/experience" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
