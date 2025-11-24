"use client";
import dynamic from "next/dynamic";
import { projectsData } from "../data/projects";
import { useRouter } from "next/navigation";
import ProjectCard from "../components/ui/ProjectCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useLetterReveal } from "../hooks/useLetterReveal";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Monitor = dynamic(() => import("../components/Three/Monitor"), { ssr: false, loading: () => null });

export default function Projects() {
  const router = useRouter();
  
  // Refs for letter reveal animation
  const selectedMobileRef = useLetterReveal();
  const projectsMobileRef = useLetterReveal({ delay: 0.3 });
  const selectedDesktopRef = useLetterReveal();
  const projectsDesktopRef = useLetterReveal({ delay: 0.3 });
  
  // Refs for paragraph, button, and slider animations
  const sectionRef = useRef(null);
  const paragraphDesktopRef = useRef(null);
  const paragraphMobileRef = useRef(null);
  const buttonDesktopRef = useRef(null);
  const buttonMobileRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate paragraph as a whole (avoids clipping for single-line text)
      const animateParagraph = (element) => {
        if (!element) return;
        gsap.set(element, { y: 40, opacity: 0, willChange: 'transform' });
        gsap.to(element, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
            invalidateOnRefresh: true,
          },
        });
      };

      animateParagraph(paragraphDesktopRef.current);
      animateParagraph(paragraphMobileRef.current);

      // Animate buttons with scale-up + fade-in
      [buttonDesktopRef.current, buttonMobileRef.current].forEach(button => {
        if (button) {
          gsap.set(button, { scale: 0.9, opacity: 0 });
          
          gsap.to(button, {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: button,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });

      // Animate project cards with left-to-right stagger
      if (sliderRef.current) {
        const slides = sliderRef.current.querySelectorAll('.swiper-slide');
        
        if (slides.length > 0) {
          gsap.set(slides, { x: -60, opacity: 0 });
          
          gsap.to(slides, {
            x: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sliderRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        }
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full pt-24 min-h-[95vh] md:min-h-[60vh] mb-12 md:mb-24">
      {/* MOBILE TITLE */}
      <div className="flex md:hidden flex-col mb-10">
        <div className="flex items-center mb-2">
          <div className="relative w-[80px] h-[80px] mr-2">
            <Monitor />
          </div>
          <h1 
            ref={selectedMobileRef}
            className="font-anton text-[clamp(3rem,10vw,2.8rem)] text-white uppercase leading-[0.9] tracking-[0.04em] font-normal mb-0"
            style={{ perspective: "1000px" }}
          >
            SELECTED
          </h1>
        </div>
        <h1 
          ref={projectsMobileRef}
          className="font-anton text-[clamp(3rem,10vw,2.8rem)] text-white uppercase leading-[0.9] tracking-[0.04em] font-normal mt-0"
          style={{ perspective: "1000px" }}
        >
          PROJECTS
        </h1>
        <p ref={paragraphMobileRef} className="text-white text-base mt-3 mb-6">
          A glimpse into the projects I&apos;ve designed and developed blending code, aesthetics, and purpose
        </p>
        <button
          ref={buttonMobileRef}
          onClick={() => router.push('/projects')}
          className="relative overflow-hidden px-4 py-2 rounded-full font-ppneue font-medium text-white border border-white/20 transition-all duration-300 ease-in-out group w-fit text-sm"
        >
          {/* Gradient background (matches navbar) - shows on hover */}
          <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-transparent animate-gradient-move"></span>
            <span className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-emerald-500/5 animate-gradient-move" style={{ animationDelay: '1.5s' }}></span>
          </span>
          <span className="relative z-10 inline-flex items-center gap-2">
            View all projects
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300">
              <path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </span>
        </button>
      </div>

      {/* DESKTOP TITLE */}
      <div className="hidden md:flex flex-col lg:flex-row gap-8 items-start justify-between mb-16">
        <div className="flex-1 flex flex-col">
          <div className="flex items-start">
            <div className="relative w-[150px] h-[150px] overflow-visible">
              <Monitor />
            </div>
            <h1 
              ref={selectedDesktopRef}
              className="font-anton text-display text-white uppercase leading-[0.9] tracking-[0.04em] font-normal ml-4 mb-0"
              style={{ perspective: "1000px" }}
            >
              SELECTED
            </h1>
          </div>
          <h1 
            ref={projectsDesktopRef}
            className="font-anton text-display text-white uppercase leading-[0.9] tracking-[0.04em] font-normal mt-0"
            style={{ perspective: "1000px" }}
          >
            PROJECTS
          </h1>
        </div>
        <div className="flex-1 flex flex-col items-start justify-end">
          <p ref={paragraphDesktopRef} className="text-white text-2xl md:text-[1.45rem] leading-relaxed max-w-xl mb-6">
            A glimpse into the projects I&apos;ve designed and developed blending code, aesthetics, and purpose
          </p>
          <button
            ref={buttonDesktopRef}
            onClick={() => router.push('/projects')}
            className="relative overflow-hidden px-6 py-3 rounded-full font-ppneue font-medium text-white border border-white/20 transition-all duration-300 ease-in-out group w-fit"
          >
            {/* Gradient background (matches navbar) - shows on hover */}
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-transparent animate-gradient-move"></span>
              <span className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-emerald-500/5 animate-gradient-move" style={{ animationDelay: '1.5s' }}></span>
            </span>
            <span className="relative z-10 inline-flex items-center gap-2">
              View all projects
              <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300">
                <path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>


      {/* SLIDER */}
      <div ref={sliderRef} className="relative">
        <Swiper
          modules={[Pagination, Keyboard, Mousewheel]}
          spaceBetween={32}
          loop={true}
          slidesPerView="auto"
          centeredSlides={true}
          mousewheel={{
            enabled: true,
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          }}
          keyboard={{ enabled: true }}
          pagination={{ clickable: true }}
          speed={600}
          resistanceRatio={0.25}
          threshold={10}
          followFinger={true}
          allowTouchMove={true}
          simulateTouch={true}
          preventClicks={false}
          preventClicksPropagation={false}
          onTouchStart={(swiper) => {
            // Add class to disable clicks during drag
            swiper.el.classList.add('swiper-dragging');
          }}
          onTouchEnd={(swiper) => {
            // Remove class after drag ends
            setTimeout(() => {
              swiper.el.classList.remove('swiper-dragging');
            }, 100);
          }}
          breakpoints={{
            0:   { 
              slidesPerView: 1,
              centeredSlides: true,
              spaceBetween: 32
            },
            640: { 
              slidesPerView: 2,
              centeredSlides: false,
              spaceBetween: 32
            },
            1024: { 
              slidesPerView: 3,
              centeredSlides: false,
              spaceBetween: 32
            },
          }}
          className="relative projects-swiper"
        >
          {projectsData.map((project, index) => (
            <SwiperSlide key={index} className="flex !h-auto">
              <ProjectCard 
                {...project} 
                projectNumber={index + 1}
                totalProjects={projectsData.length}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        :global(.projects-swiper .swiper-pagination) { bottom: -28px !important; }
        :global(.projects-swiper .swiper-pagination-bullet) {
          width: 8px; height: 8px; background: rgba(255,255,255,0.35); opacity: 1; margin: 0 6px !important; transition: transform .25s ease, background .25s ease;
        }
        :global(.projects-swiper .swiper-pagination-bullet-active) { background: rgba(255,255,255,0.95); transform: scale(1.6); }
        
        /* Improve drag experience */
        :global(.projects-swiper) {
          cursor: grab;
        }
        :global(.projects-swiper.swiper-dragging) {
          cursor: grabbing;
        }
        :global(.projects-swiper.swiper-dragging *) {
          pointer-events: none;
        }
        :global(.projects-swiper.swiper-dragging button) {
          pointer-events: none;
        }
        
        /* Remove unwanted borders and outlines */
        :global(.projects-swiper button:focus),
        :global(.projects-swiper button:active),
        :global(.projects-swiper button:focus-visible) {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        /* Remove any focus rings */
        :global(.projects-swiper *:focus) {
          outline: none !important;
        }
        
        /* Ensure no borders on project cards during interaction */
        :global(.projects-swiper .swiper-slide button) {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        /* Remove any default browser styling */
        :global(.projects-swiper button) {
          -webkit-tap-highlight-color: transparent !important;
          -webkit-focus-ring-color: transparent !important;
          -moz-outline: none !important;
        }
      `}</style>
    </section>
  );
}
