"use client";
import dynamic from "next/dynamic";
import { projectsData } from "../data/projects";
import ProjectCard from "../components/ui/ProjectCard";
import { useTransitionRouter } from "../hooks/useTransitionRouter";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextCtaLink from "../components/ui/TextCtaLink";
import { HOME_MOTION } from "../utils/homeMotion";
import { useClippedTitleReveal } from "../hooks/useClippedTitleReveal";

const Monitor = dynamic(() => import("../components/Three/Monitor"), { ssr: false, loading: () => null });

export default function Projects() {
  const { push } = useTransitionRouter();

  // Refs for button and slider animations
  const sectionRef = useRef(null);
  const workTitleRef = useClippedTitleReveal({
    start: "top 88%",
    duration: HOME_MOTION.titleCharDuration,
    stagger: HOME_MOTION.titleCharStagger,
    ease: HOME_MOTION.titleCharEase,
  });
  const buttonRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Animate buttons with scale-up + fade-in
      if (buttonRef.current) {
        gsap.set(buttonRef.current, { scale: 0.94, opacity: 0 });
        gsap.to(buttonRef.current, {
          scale: 1,
          opacity: 1,
          duration: HOME_MOTION.sectionItemDuration,
          ease: HOME_MOTION.fadeEase,
          scrollTrigger: {
            trigger: buttonRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }

      // Animate project cards with left-to-right stagger
      if (sliderRef.current) {
        const slides = sliderRef.current.querySelectorAll(".swiper-slide");

        if (slides.length > 0) {
          gsap.set(slides, { y: HOME_MOTION.revealY, opacity: 0 });

          gsap.to(slides, {
            y: 0,
            opacity: 1,
            duration: HOME_MOTION.sectionCardDuration,
            stagger: 0.12,
            ease: HOME_MOTION.fadeEase,
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: sliderRef.current,
              start: "top 86%",
              toggleActions: "play none none none",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        }
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full pt-6 md:pt-8 pb-5 md:pb-8 min-h-[100vh] flex flex-col justify-center mb-0">
      {/* Section number — left margin, coherent with Hero/About */}
      <div className="absolute bottom-[clamp(1.5rem,4vh,2.5rem)] left-0 z-10 pointer-events-none">
        <span className="text-white/25 text-[10px] uppercase tracking-[0.24em]">03</span>
      </div>
      {/* HEADER */}
      <div className="mb-7 md:mb-10 flex items-end justify-between gap-6">
        <div className="flex items-end gap-3 md:gap-4">
          <div className="relative w-[clamp(3.024rem,9.66vw,6.216rem)] h-[clamp(3.024rem,9.66vw,6.216rem)] overflow-visible scale-[1.14] origin-bottom">
            <Monitor />
          </div>
          <h1
            ref={workTitleRef}
            className="font-anton text-[clamp(3.6rem,11.5vw,7.4rem)] text-white uppercase leading-[0.84] tracking-[0.02em] font-normal"
          >
            WORK
          </h1>
        </div>
        <div
          ref={buttonRef}
          className="w-fit mb-2"
        >
          <TextCtaLink text="View all" onClick={() => push("/projects")} />
        </div>
      </div>

      {/* CAROUSEL - Project cards */}
      <div ref={sliderRef} className="relative group/slider">
        <Swiper
          modules={[Keyboard, Mousewheel]}
          spaceBetween={20}
          loop={false}
          slidesPerView={1.1}
          centeredSlides={false}
          mousewheel={{
            enabled: true,
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          }}
          keyboard={{ enabled: true }}
          speed={600}
          resistanceRatio={0.25}
          threshold={10}
          followFinger={true}
          allowTouchMove={true}
          simulateTouch={true}
          preventClicks={false}
          preventClicksPropagation={false}
          breakpoints={{
            0: {
              slidesPerView: 1.08,
              centeredSlides: false,
              spaceBetween: 14,
              slidesOffsetBefore: 0,
              slidesOffsetAfter: 0,
            },
            640: {
              slidesPerView: 1.45,
              centeredSlides: false,
              spaceBetween: 16,
              slidesOffsetBefore: 0,
              slidesOffsetAfter: 0,
            },
            1024: {
              slidesPerView: 2.18,
              centeredSlides: false,
              spaceBetween: 18,
              slidesOffsetBefore: 0,
              slidesOffsetAfter: 8,
            },
            1360: {
              slidesPerView: 2.28,
              centeredSlides: false,
              spaceBetween: 20,
              slidesOffsetBefore: 0,
              slidesOffsetAfter: 10,
            },
          }}
          className="relative projects-swiper"
        >
          {projectsData.map((project) => (
            <SwiperSlide key={project.slug} className="flex !h-auto">
              <ProjectCard {...project} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        :global(.projects-swiper) {
          overflow: visible;
          cursor: grab;
        }
        :global(.projects-swiper.swiper-dragging) {
          cursor: grabbing;
        }
        :global(.projects-swiper .swiper-wrapper) {
          align-items: stretch;
        }
        :global(.projects-swiper .swiper-slide) {
          height: auto;
        }
        :global(.projects-swiper .swiper-slide > *) {
          height: 100%;
        }
      `}</style>
    </section>
  );
}
