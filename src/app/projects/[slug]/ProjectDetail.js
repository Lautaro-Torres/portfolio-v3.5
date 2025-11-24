"use client";
import { useParams, notFound } from "next/navigation";
import { projectsData } from "../../../data/projects";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLetterReveal } from "../../../hooks/useLetterReveal";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function ProjectPage() {
  const pageRef = useRef(null);
  const titleRef = useLetterReveal({ scrollTrigger: false, delay: 0.2 });
  const tagsRef = useRef(null);
  const summaryRef = useRef(null);
  const heroRef = useRef(null);
  const modalRef = useRef(null);

  const [videoOpen, setVideoOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const { slug } = useParams();
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) notFound();

  // --- GSAP Animations ---
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

  // --- Modal Logic ---
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

  // ESC key closes modal
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") closeVideoPlayer();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // GSAP modal fade-in
  useEffect(() => {
    if (videoOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [videoOpen]);

  const openSiteLink = () => {
    if (project.siteLink && project.siteLink !== "#") {
      window.open(project.siteLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="relative w-full pt-20">
        <div className="w-full max-w-[1900px] mx-auto px-[5%] py-12">

          {/* HEADER */}
          <div className="grid grid-cols-12 gap-8 mb-16">
            <div className="col-span-12 lg:col-span-7">
              <h1
                ref={titleRef}
                className="font-anton leading-[0.9] tracking-[0.04em]
                text-[clamp(2rem,8vw,6rem)] md:text-[clamp(3rem,7vw,8rem)] normal-case mb-8"
              >
                {project.title}
              </h1>
            </div>

            <div className="col-span-12 lg:col-span-5">
              {!!project.tags?.length && (
                <div ref={tagsRef} className="flex flex-wrap gap-3 mb-8">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 text-xs sm:text-sm border border-white rounded-full tracking-[0.05em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* BIGGER SUMMARY (Requested) */}
              {project.summary && (
                <p
                  ref={summaryRef}
                  className="text-white/90 text-xl md:text-2xl leading-relaxed tracking-wide font-ppneue"
                  style={{ lineHeight: "1.55" }}
                >
                  {project.summary}
                </p>
              )}
            </div>
          </div>

          {/* HERO (Click → Video Modal) */}
          <div ref={heroRef} className="relative mb-16">
            <div
              onClick={openVideoPlayer}
              className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden cursor-pointer group"
            >
              {project.videoUrl ? (
                <video
                  src={project.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img
                  src={project.imageUrl}
                  alt={`${project.title} hero`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

              {project.logoUrl && (
                <div className="absolute bottom-6 left-6 z-10">
                  <img
                    src={project.logoUrl}
                    alt={`${project.title} logo`}
                    className="h-10 sm:h-12 w-auto bg-white/10 backdrop-blur-sm rounded p-3 shadow-lg"
                  />
                </div>
              )}

              {project.videoUrl && (
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

          {/* DESCRIPTION + FEATURES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* LEFT */}
            <div className="space-y-8">
              {project.hoverDescription && (
                <p
                  className="font-figtree text-white text-[0.9rem] sm:text-base md:text-lg leading-relaxed"
                  style={{ lineHeight: "1.7", letterSpacing: "0.02em", fontWeight: 300 }}
                >
                  {project.hoverDescription}
                </p>
              )}

              {project.siteLink && (
                <button
                  onClick={openSiteLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-figtree font-medium text-white bg-gray-800/50 border border-white/20 hover:border-white/40 transition"
                >
                  Visit Site
                </button>
              )}
            </div>

            {/* RIGHT — Key Features */}
            {!!project.features?.length && (
              <div className="space-y-6">
                <h3 className="font-anton text-white text-xl tracking-[0.04em]">
                  Key Features
                </h3>

                <div className="space-y-0">
                  {project.features.map((feature, i) => (
                    <div key={i} className="border-b border-white/20 py-5">
                      <p className="font-figtree text-white/70 text-[0.85rem] sm:text-base leading-relaxed">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL: video player, freezes scroll */}
      {videoOpen && (
        <div
          ref={modalRef}
          className="fixed top-0 left-0 w-screen h-screen z-[200] bg-black/70 backdrop-blur-[6px] flex items-center justify-center"
          onClick={closeVideoPlayer}
        >
          <div
            className="relative w-[85%] md:w-[70%] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={project.videoUrl}
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
