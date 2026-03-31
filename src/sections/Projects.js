"use client";
import dynamic from "next/dynamic";
import { projectsData } from "../data/projects";
import ProjectCard from "../components/ui/ProjectCard";
import { useTransitionRouter } from "../hooks/useTransitionRouter";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextCtaLink from "../components/ui/TextCtaLink";
import { HOME_MOTION } from "../utils/homeMotion";
import { useClippedTitleReveal } from "../hooks/useClippedTitleReveal";
import { getProjectUrl } from "../utils/projectUtils";

const Monitor = dynamic(() => import("../components/Three/Monitor"), { ssr: false, loading: () => null });

export default function Projects() {
  const { push } = useTransitionRouter();
  const pushRef = useRef(push);
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef(null);
  const workTitleRef = useClippedTitleReveal({
    start: "top 88%",
    duration: HOME_MOTION.titleCharDuration,
    stagger: HOME_MOTION.titleCharStagger,
    ease: HOME_MOTION.titleCharEase,
  });
  const buttonRef = useRef(null);
  const sliderRef = useRef(null);
  const handleProjectNavigateRef = useRef((slug) => {
    pushRef.current(getProjectUrl(slug));
  });

  useEffect(() => {
    pushRef.current = push;
  }, [push]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
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

      if (sliderRef.current) {
        // Animar la tarjeta, no el .swiper-slide: opacity 0 en el slide entero retrasa pintura/decodificación
        // del logo en mobile hasta que Swiper repinta (p. ej. al deslizar).
        const cards = sliderRef.current.querySelectorAll(".home-project-card");

        if (cards.length > 0) {
          gsap.set(cards, { y: HOME_MOTION.revealY, opacity: 0 });

          gsap.to(cards, {
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
    <section
      ref={sectionRef}
      className="relative w-full pt-6 md:pt-8 pb-10 md:pb-8 max-md:pb-[clamp(3.25rem,11vh,5.5rem)] min-h-0 md:min-h-[100vh] flex flex-col justify-start md:justify-center mb-0"
    >
      <div className="absolute bottom-[clamp(1.5rem,4vh,2.5rem)] left-0 z-10 pointer-events-none">
        <span className="text-white/25 text-[10px] uppercase tracking-[0.24em]">03</span>
      </div>
      <div className="relative mb-7 md:mb-10 flex items-end justify-between gap-4 md:gap-6 md:items-baseline">
        <div className="flex items-end gap-3 md:gap-4 font-anton text-[clamp(3.6rem,11.5vw,7.4rem)] leading-[0.84] tracking-[0.02em] text-white uppercase">
          <div className="relative h-[1em] w-[1em] shrink-0 overflow-visible">
            <Monitor />
          </div>
          <h1 ref={workTitleRef} className="font-normal m-0 p-0">
            WORK
          </h1>
        </div>
        <div ref={buttonRef} className="w-fit shrink-0">
          <TextCtaLink text="View all" onClick={() => push("/projects")} />
        </div>
      </div>

      <div ref={sliderRef} className="relative group/slider">
        <Swiper
          modules={[Keyboard, Mousewheel]}
          spaceBetween={14}
          loop={false}
          slidesPerView="auto"
          centeredSlides={false}
          watchSlidesProgress={false}
          mousewheel={{
            enabled: true,
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          }}
          keyboard={{ enabled: true }}
          speed={520}
          resistanceRatio={0.32}
          threshold={12}
          followFinger={true}
          allowTouchMove={true}
          simulateTouch={true}
          preventClicks={false}
          preventClicksPropagation={false}
          breakpoints={{
            640: { spaceBetween: 16 },
            1024: { spaceBetween: 18 },
            1360: { spaceBetween: 20 },
          }}
          onInit={(swiper) => {
            setActiveIndex(swiper.realIndex ?? 0);
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex ?? 0);
          }}
          onTransitionEnd={(swiper) => {
            setActiveIndex(swiper.realIndex ?? 0);
          }}
          className="relative projects-swiper"
        >
          {projectsData.map((project, idx) => (
            <SwiperSlide
              key={project.slug}
              className="
                !h-auto
                !w-[92%]
                sm:!w-[80%]
                md:!w-[68%]
                lg:!w-[54%]
                xl:!w-[50%]
                2xl:!w-[47%]
              "
            >
              <ProjectCard
                {...project}
                index={idx}
                activeIndex={activeIndex}
                onNavigate={handleProjectNavigateRef.current}
                className="w-full home-project-card"
              />
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
          width: 100%;
          height: auto;
          align-self: stretch;
        }
        /* Móvil: sin halo/borde del focus ring ni sombra; evita línea clara en el recorte redondeado */
        @media (max-width: 639px) {
          :global(.projects-swiper a.home-project-card) {
            -webkit-tap-highlight-color: transparent;
            box-shadow: none !important;
            --tw-ring-offset-width: 0px;
            --tw-ring-shadow: 0 0 #0000;
          }
          :global(.projects-swiper a.home-project-card:focus),
          :global(.projects-swiper a.home-project-card:focus-visible) {
            outline: none;
            box-shadow: none !important;
            --tw-ring-shadow: 0 0 #0000;
          }
        }
      `}</style>
    </section>
  );
}
