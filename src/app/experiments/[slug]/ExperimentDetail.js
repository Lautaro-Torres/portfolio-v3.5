"use client";
import { useParams, notFound } from "next/navigation";
import { experimentsData } from "../../../data/experiments";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLetterReveal } from "../../../hooks/useLetterReveal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard } from "swiper/modules";
import "swiper/css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function ExperimentPage() {
  const pageRef = useRef(null);
  const titleRef = useLetterReveal({ scrollTrigger: false, delay: 0.2 });
  const tagsRef = useRef(null);
  const summaryRef = useRef(null);
  const heroRef = useRef(null);
  const modalRef = useRef(null);

  const [videoOpen, setVideoOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const params = useParams();
  const experiment = experimentsData.find((e) => e.slug === params.slug);
  if (!experiment) notFound();

  const galleryImages = experiment.galleryImages || [];

  // Initial GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (tagsRef.current) {
        const tags = tagsRef.current.querySelectorAll("span");
        gsap.fromTo(
          tags,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.4)",
            delay: 0.4,
          }
        );
      }

      if (summaryRef.current) {
        gsap.fromTo(
          summaryRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.6 }
        );
      }

      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { scale: 1.06, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Escape key closes modal
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") closeVideoPlayer();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Opens popup without scroll movement
  const openVideoPlayer = () => {
    const y = window.scrollY;
    setScrollPosition(y);

    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    document.body.style.width = "100%";

    setVideoOpen(true);
  };

  // Close modal and restore exact scroll position
  const closeVideoPlayer = () => {
    setVideoOpen(false);

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.overflow = "";
    document.body.style.width = "";

    window.scrollTo(0, scrollPosition);
  };

  // Modal fade animation
  useEffect(() => {
    if (videoOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [videoOpen]);

  return (
    <div ref={pageRef} className="min-h-screen text-white bg-[#0a0a0a]">
      <main className="relative w-full pt-20">
        <div className="w-full max-w-[1900px] mx-auto px-[5%] py-12">

          {/* HEADER */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
            <div className="col-span-12 lg:col-span-7 mb-8 lg:mb-0">
              <h1
                ref={titleRef}
                className="font-ppneue leading-tight text-[clamp(2.5rem,7.5vw,6rem)]"
                style={{
                  wordBreak: "keep-all",
                  overflowWrap: "normal",
                  whiteSpace: "normal",
                  hyphens: "none",
                }}
              >
                {experiment.title}
              </h1>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <div ref={tagsRef} className="flex flex-wrap gap-3 mb-8">
                {experiment.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 text-sm font-ppneue border border-white rounded-full bg-transparent"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* SUMMARY BIGGER */}
              <p
                ref={summaryRef}
                className="text-white/90 text-xl md:text-2xl leading-relaxed tracking-wide max-w-2xl"
              >
                {experiment.summary}
              </p>
            </div>
          </div>

          {/* HERO — video background */}
          <div ref={heroRef} className="relative mb-16">
            <div
              className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden cursor-pointer group"
              onClick={openVideoPlayer}
            >
              {experiment.videoUrl ? (
                <video
                  src={experiment.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img
                  src={experiment.imageUrl}
                  alt={`${experiment.title} hero`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

              {experiment.logoUrl && (
                <div className="absolute bottom-6 left-6 z-10">
                  <img
                    src={experiment.logoUrl}
                    alt={`${experiment.title} logo`}
                    className="h-12 w-auto bg-white/10 backdrop-blur-sm rounded p-3 shadow-lg"
                  />
                </div>
              )}

              {experiment.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/40 rounded-full p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 24 24"
                      className="w-12 h-12"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DESCRIPTION + KEY FEATURES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <div className="space-y-8">
              <p className="text-white/90 text-lg leading-relaxed tracking-wide">
                {experiment.description ||
                  experiment.hoverDescription ||
                  "This experiment explores creative technology, interaction, and visual design blending art and code."}
              </p>

              {experiment.ctaLink && experiment.ctaText && (
                <a
                  href={experiment.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-ppneue font-medium text-white bg-gray-800/50 hover:bg-gray-700/50 transition-all border border-white/20 hover:border-white/40"
                >
                  {experiment.ctaText}
                </a>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-ppneue font-semibold text-white">
                Key Features
              </h3>

              <div className="space-y-0">
                {experiment.tags?.map((tag, index) => (
                  <div key={index} className="border-b border-white/20 py-5">
                    <p className="text-white/70 text-base leading-loose">
                      {tag}
                    </p>
                  </div>
                ))}

                <div className="border-b border-white/20 py-5">
                  <p className="text-white/70 text-base leading-loose">
                    Interactive Experience
                  </p>
                </div>
                <div className="border-b border-white/20 py-5">
                  <p className="text-white/70 text-base leading-loose">
                    Creative Technology
                  </p>
                </div>
                <div className="border-b border-white/20 py-5">
                  <p className="text-white/70 text-base leading-loose">
                    Modern Web Standards
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* GALLERY — with right-edge sneak peek */}
          {galleryImages.length > 0 && (
            <div className="mt-16 -mx-[5vw] pl-[5vw]">
              <Swiper
                modules={[Keyboard]}
                spaceBetween={32}
                slidesPerView={1.15}
                keyboard={{ enabled: true }}
                grabCursor={true}
                loop={galleryImages.length > 4}
                breakpoints={{
                  640: { slidesPerView: 2.1, spaceBetween: 32 },
                  1024: { slidesPerView: 4.15, spaceBetween: 36 },
                }}
              >
                {galleryImages.map((media, i) => {
                  const isVideo =
                    media.endsWith(".mp4") || media.includes("video");

                  return (
                    <SwiperSlide key={i}>
                      <div className="relative cursor-pointer aspect-[4/5] rounded-lg overflow-hidden group">
                        {isVideo ? (
                          <video
                            src={media}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={media}
                            alt={`${experiment.title} ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}

                        {isVideo && (
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="white"
                              viewBox="0 0 24 24"
                              className="w-12 h-12 drop-shadow-lg"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          )}
        </div>
      </main>

      {/* POPUP MODAL — opens in current viewport, blocks scroll */}
      {videoOpen && (
        <div
          ref={modalRef}
          onClick={closeVideoPlayer}
          className="fixed top-0 left-0 w-screen h-screen z-[200] bg-black/70 backdrop-blur-[6px] flex items-center justify-center"
        >
          <div
            className="relative w-[85%] md:w-[70%] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={experiment.videoUrl}
              autoPlay
              controls
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <button
              onClick={closeVideoPlayer}
              className="absolute -top-10 right-0 text-white text-4xl hover:text-gray-300"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
