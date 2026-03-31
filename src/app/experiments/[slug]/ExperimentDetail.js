"use client";
import { useParams, notFound } from "next/navigation";
import { experimentsData } from "../../../data/experiments";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useClippedTitleReveal } from "../../../hooks/useClippedTitleReveal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard } from "swiper/modules";
import TextCtaLink from "../../../components/ui/TextCtaLink";
import { markRouteReady, normalizeRoutePath } from "../../../utils/routeReadyGate";
import "swiper/css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

function minCircularSlideDistance(i, active, len) {
  if (len < 2) return Math.abs(i - active);
  const d = Math.abs(i - active);
  return Math.min(d, len - d);
}

function ExperimentGalleryMedia({ media, index, activeIndex, titleSuffix, useLoop, slideCount }) {
  const isVideo = typeof media === "string" && (media.endsWith(".mp4") || media.includes("video"));
  const videoRef = useRef(null);

  const { shouldLoad, shouldPlay } = useMemo(() => {
    const dist = useLoop
      ? minCircularSlideDistance(index, activeIndex, slideCount)
      : Math.abs(index - activeIndex);
    return {
      shouldLoad: dist <= 1,
      shouldPlay: index === activeIndex,
    };
  }, [activeIndex, index, slideCount, useLoop]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !isVideo) return;
    if (!shouldLoad) {
      v.pause();
      return;
    }
    if (shouldPlay) {
      const p = v.play();
      if (p?.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [isVideo, shouldLoad, shouldPlay]);

  if (!isVideo) {
    return (
      <img
        src={media}
        alt={`${titleSuffix} ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? media : undefined}
      muted
      loop
      playsInline
      preload={!shouldLoad ? "none" : shouldPlay ? "auto" : "metadata"}
      disablePictureInPicture
      disableRemotePlayback
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export default function ExperimentPage() {
  const pageRef = useRef(null);
  const titleRef = useClippedTitleReveal({ scrollTrigger: false, delay: 0.2 });
  const tagsRef = useRef(null);
  const summaryRef = useRef(null);
  const heroRef = useRef(null);
  const modalRef = useRef(null);

  const [videoOpen, setVideoOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [galleryActiveIndex, setGalleryActiveIndex] = useState(0);

  const params = useParams();
  const experiment = experimentsData.find((e) => e.slug === params.slug);
  if (!experiment) notFound();

  const galleryImages = experiment.galleryImages || [];

  useEffect(() => {
    const path = normalizeRoutePath(`/experiments/${experiment.slug}`);
    const root = pageRef.current;
    if (!root) return;
    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      markRouteReady(path);
    };
    const imgs = Array.from(root.querySelectorAll("img"));
    const pending = [];
    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) return;
      pending.push(
        new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        })
      );
    });
    const run = async () => {
      try {
        if (document.fonts?.ready) await document.fonts.ready;
      } catch {
        /* ignore */
      }
      if (pending.length === 0) {
        requestAnimationFrame(() => requestAnimationFrame(fire));
      } else {
        await Promise.all(pending);
        requestAnimationFrame(fire);
      }
    };
    run();
    const t = setTimeout(fire, 14000);
    return () => clearTimeout(t);
  }, [experiment.slug]);

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
          { scale: 1.04, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top 80%",
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

          {/* HEADER — Same layout as ProjectDetail: left = title, right = summary + pills (experiments have no facts) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-12 lg:gap-x-16 md:gap-y-8 mb-10 md:mb-16 items-start">
            <div className="col-span-12 lg:col-span-6">
              <h1
                ref={titleRef}
                className="font-anton leading-[0.92] tracking-[0.02em] uppercase text-[clamp(2.2rem,12vw,2.75rem)] md:text-[clamp(2.9rem,11vw,7rem)] text-white w-full whitespace-nowrap md:whitespace-normal"
              >
                {experiment.title}
              </h1>
            </div>

            <div className="col-span-12 lg:col-span-6 lg:flex lg:flex-col lg:items-end lg:text-right">
              {experiment.summary && (
                <p
                  ref={summaryRef}
                  className="text-white text-lg md:text-xl leading-relaxed tracking-[0.01em] font-general font-medium max-w-2xl mb-6 md:mb-8"
                  style={{ lineHeight: "1.6" }}
                >
                  {experiment.summary}
                </p>
              )}

              {!!experiment.tags?.length && (
                <div ref={tagsRef} className="flex flex-wrap gap-3 lg:justify-end">
                  {experiment.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-xs sm:text-[11px] border border-white/20 rounded-full tracking-[0.12em] uppercase text-white/70 sm:text-white/60 font-light font-general"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
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

            </div>
          </div>

          {/* DESCRIPTION + KEY FEATURES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <div className="space-y-8">
              <p className="text-white/90 text-lg leading-relaxed tracking-wide font-general font-medium">
                {experiment.description ||
                  experiment.hoverDescription ||
                  "This experiment explores creative technology, interaction, and visual design blending art and code."}
              </p>

              {experiment.ctaLink && experiment.ctaText && (
                <TextCtaLink text={experiment.ctaText} href={experiment.ctaLink} external />
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-general font-light uppercase tracking-[0.12em] text-white">
                Key Features
              </h3>

              <div className="space-y-0">
                {experiment.tags?.map((tag, index) => (
                  <div key={index} className="border-b border-white/20 py-5">
                    <p className="text-white/70 text-base leading-loose font-general font-normal">
                      {tag}
                    </p>
                  </div>
                ))}

                <div className="border-b border-white/20 py-5">
                  <p className="text-white/70 text-base leading-loose font-general font-normal">
                    Interactive Experience
                  </p>
                </div>
                <div className="border-b border-white/20 py-5">
                  <p className="text-white/70 text-base leading-loose font-general font-normal">
                    Creative Technology
                  </p>
                </div>
                <div className="border-b border-white/20 py-5">
                  <p className="text-white/70 text-base leading-loose font-general font-normal">
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
                watchSlidesProgress={false}
                loop={galleryImages.length > 4}
                breakpoints={{
                  640: { slidesPerView: 2.1, spaceBetween: 32 },
                  1024: { slidesPerView: 4.15, spaceBetween: 36 },
                }}
                onInit={(swiper) => setGalleryActiveIndex(swiper.realIndex ?? 0)}
                onSlideChange={(swiper) => setGalleryActiveIndex(swiper.realIndex ?? 0)}
                onTransitionEnd={(swiper) => setGalleryActiveIndex(swiper.realIndex ?? 0)}
              >
                {galleryImages.map((media, i) => {
                  const isVideo =
                    typeof media === "string" &&
                    (media.endsWith(".mp4") || media.includes("video"));

                  return (
                    <SwiperSlide key={i}>
                      <div className="relative cursor-pointer aspect-[4/5] rounded-lg overflow-hidden group">
                        <ExperimentGalleryMedia
                          media={media}
                          index={i}
                          activeIndex={galleryActiveIndex}
                          titleSuffix={experiment.title}
                          useLoop={galleryImages.length > 4}
                          slideCount={galleryImages.length}
                        />

                        {isVideo && (
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
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
