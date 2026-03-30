"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProjectIntroAnimation } from "../../../hooks/useProjectIntroAnimation";
import { VideoPoster } from "../../../components/VideoPoster";
import { ProjectFacts } from "../../../components/ProjectFacts";
import TextCtaLink from "../../../components/ui/TextCtaLink";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function ProjectPage({ project }) {
  const pageRef = useRef(null);
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const rightColumnRef = useRef(null);
  const bodyContentRef = useRef(null);
  const factsRef = useRef(null);
  const tagsRef = useRef(null);
  const summaryRef = useRef(null);
  const heroRef = useRef(null);
  const overlayVideoRef = useRef(null);
  const heroVideoRef = useRef(null);
  const heroLogoRef = useRef(null);
  const modalRef = useRef(null);
  const galleryModalRef = useRef(null);
  const galleryStageRef = useRef(null);
  const galleryRef = useRef(null);

  const [videoOpen, setVideoOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasHeroSettled, setHasHeroSettled] = useState(false);
  const [galleryModalIndex, setGalleryModalIndex] = useState(null);
  const [isGalleryModalClosing, setIsGalleryModalClosing] = useState(false);
  const [previousGalleryModalIndex, setPreviousGalleryModalIndex] = useState(null);
  const [isGalleryCrossfading, setIsGalleryCrossfading] = useState(false);
  const [isGalleryNavigating, setIsGalleryNavigating] = useState(false);
  const gallerySwitchTimeoutRef = useRef(null);
  const mediaPreloadCacheRef = useRef(new Set());
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  const descriptionContent = Array.isArray(project.description)
    ? project.description
    : project.description
    ? project.description.split(/\n\n+/).filter(Boolean)
    : project.hoverDescription
    ? [project.hoverDescription]
    : [];
  // Gallery: min 3, max 6 items (Cardamomo layout)
  const rawGallery = Array.isArray(project.gallery) ? project.gallery.slice(0, 6) : [];
  const heroStillImage =
    rawGallery.find((g) => g.type === "image")?.src ??
    rawGallery.find(
      (g) =>
        g?.src &&
        typeof g.src === "string" &&
        !/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(g.src)
    )?.src ??
    project.logoUrl ??
    null;
  const hasGallery = rawGallery.length >= 3 && rawGallery.length <= 6;
  const fullWidthMedia = rawGallery[0];
  const sideMedia = rawGallery[1];
  const trailingMedia = rawGallery.slice(2) || [];
  const headerContentRefs = useMemo(() => [factsRef, rightColumnRef], []);

  // --- Page intro animation (hero takeover → settle → title → content) ---
  useProjectIntroAnimation({
    overlayRef,
    heroTargetRef: heroRef,
    titleRef,
    headerContentRefs,
    bodyContentRef,
    onOverlaySettled: () => setHasHeroSettled(true),
  });

  useEffect(() => {
    setHasHeroSettled(false);
  }, [project?.slug]);

  useEffect(() => {
    if (!project?.videoUrl) return;
    const heroVideo = heroVideoRef.current;
    if (!heroVideo) return;

    // Keep decoder warm under the overlay for a seamless handoff.
    if (!hasHeroSettled) {
      const warmupPlay = heroVideo.play();
      if (warmupPlay?.catch) warmupPlay.catch(() => {});
      return;
    }

    const syncAndPlay = () => {
      const overlayVideo = overlayVideoRef.current;
      if (!heroVideoRef.current) return;
      const targetVideo = heroVideoRef.current;

      const sourceTime = overlayVideo?.currentTime;
      const duration = targetVideo.duration;
      if (
        Number.isFinite(sourceTime) &&
        Number.isFinite(duration) &&
        duration > 0
      ) {
        targetVideo.currentTime = sourceTime % duration;
      }
      const playPromise = targetVideo.play();
      if (playPromise?.catch) playPromise.catch(() => {});
    };

    let refineTimeoutId;
    const runSyncSequence = () => {
      syncAndPlay();
      // Small refine pass to absorb decoder drift at the handoff moment.
      refineTimeoutId = window.setTimeout(syncAndPlay, 90);
    };

    if (heroVideo.readyState >= 1) {
      runSyncSequence();
    } else {
      heroVideo.addEventListener("loadedmetadata", runSyncSequence, { once: true });
    }

    return () => {
      if (refineTimeoutId) window.clearTimeout(refineTimeoutId);
      heroVideo.removeEventListener("loadedmetadata", runSyncSequence);
    };
  }, [hasHeroSettled, project?.slug, project?.videoUrl]);

  useEffect(() => {
    const logoEl = heroLogoRef.current;
    if (!logoEl || !project?.logoUrl) return;
    if (!hasHeroSettled) {
      gsap.set(logoEl, { autoAlpha: 0, y: 16, scale: 0.94 });
      return;
    }

    const tween = gsap.to(logoEl, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.32,
      ease: "power3.out",
      delay: 0,
    });
    return () => tween.kill();
  }, [hasHeroSettled, project?.logoUrl, project?.slug]);

  // --- Gallery: scroll-triggered animation (separate from intro) ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (galleryRef.current) {
        const cards = galleryRef.current.querySelectorAll("figure");
        gsap.fromTo(
          cards,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: galleryRef.current,
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

  const openGalleryModal = useCallback((index) => {
    if (gallerySwitchTimeoutRef.current) clearTimeout(gallerySwitchTimeoutRef.current);
    setPreviousGalleryModalIndex(null);
    setIsGalleryCrossfading(false);
    setIsGalleryNavigating(false);
    setIsGalleryModalClosing(false);
    setGalleryModalIndex(index);
  }, []);

  const closeGalleryModal = useCallback(() => {
    if (isGalleryModalClosing || galleryModalIndex === null) return;
    setIsGalleryModalClosing(true);
    if (gallerySwitchTimeoutRef.current) clearTimeout(gallerySwitchTimeoutRef.current);
    const modalEl = galleryModalRef.current;
    const stageEl = galleryStageRef.current;

    if (modalEl && stageEl) {
      gsap.to(stageEl, {
        opacity: 0,
        scale: 0.985,
        y: 10,
        duration: 0.24,
        ease: "power2.inOut",
      });
      gsap.to(modalEl, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.inOut",
        onComplete: () => {
          setGalleryModalIndex(null);
          setPreviousGalleryModalIndex(null);
          setIsGalleryCrossfading(false);
          setIsGalleryNavigating(false);
          setIsGalleryModalClosing(false);
        },
      });
      return;
    }

    setGalleryModalIndex(null);
    setPreviousGalleryModalIndex(null);
    setIsGalleryCrossfading(false);
    setIsGalleryNavigating(false);
    setIsGalleryModalClosing(false);
  }, [galleryModalIndex, isGalleryModalClosing]);

  const handleIncomingMediaReady = useCallback(() => {
    if (previousGalleryModalIndex === null || isGalleryCrossfading) return;
    if (gallerySwitchTimeoutRef.current) clearTimeout(gallerySwitchTimeoutRef.current);
    setIsGalleryCrossfading(true);
    gallerySwitchTimeoutRef.current = window.setTimeout(() => {
      setPreviousGalleryModalIndex(null);
      setIsGalleryCrossfading(false);
      setIsGalleryNavigating(false);
    }, 260);
  }, [isGalleryCrossfading, previousGalleryModalIndex]);

  const preloadGalleryItem = useCallback((item) => {
    if (!item?.src) return Promise.resolve();
    const cacheKey = item.src;
    if (mediaPreloadCacheRef.current.has(cacheKey)) return Promise.resolve();

    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        mediaPreloadCacheRef.current.add(cacheKey);
        resolve();
      };

      if (item.type === "video") {
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.src = item.src;
        video.onloadeddata = finish;
        video.oncanplay = finish;
        video.onerror = finish;
        video.load();
        window.setTimeout(finish, 1200);
        return;
      }

      const img = new Image();
      img.onload = finish;
      img.onerror = finish;
      img.src = item.src;
      window.setTimeout(finish, 1200);
    });
  }, []);

  const navigateGallery = useCallback(
    async (direction) => {
      if (galleryModalIndex === null || !rawGallery.length || isGalleryNavigating) return;
      const delta = direction === "prev" ? -1 : 1;
      const nextIndex = (galleryModalIndex + delta + rawGallery.length) % rawGallery.length;
      if (nextIndex === galleryModalIndex) return;

      setIsGalleryNavigating(true);
      await preloadGalleryItem(rawGallery[nextIndex]);

      if (gallerySwitchTimeoutRef.current) clearTimeout(gallerySwitchTimeoutRef.current);
      setPreviousGalleryModalIndex(galleryModalIndex);
      setGalleryModalIndex(nextIndex);
      setIsGalleryCrossfading(false);
      // Fallback in case media readiness events do not fire.
      gallerySwitchTimeoutRef.current = window.setTimeout(() => {
        handleIncomingMediaReady();
      }, 900);
    },
    [galleryModalIndex, handleIncomingMediaReady, isGalleryNavigating, preloadGalleryItem, rawGallery]
  );

  const handleGalleryTouchStart = useCallback((e) => {
    const touch = e.touches?.[0];
    if (!touch) return;
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  }, []);

  const handleGalleryTouchEnd = useCallback(
    (e) => {
      const touch = e.changedTouches?.[0];
      if (!touch || galleryModalIndex === null || rawGallery.length <= 1) return;

      const startX = touchStartXRef.current;
      const startY = touchStartYRef.current;
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      if (startX === null || startY === null) return;

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      // Horizontal swipe navigation for mobile modal
      if (Math.abs(deltaX) > 44 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) navigateGallery("next");
        if (deltaX > 0) navigateGallery("prev");
      }
    },
    [galleryModalIndex, navigateGallery, rawGallery.length]
  );

  // ESC key closes modals
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        if (galleryModalIndex !== null) closeGalleryModal();
        else closeVideoPlayer();
        return;
      }
      if (galleryModalIndex !== null && hasGallery && !isGalleryModalClosing) {
        if (e.key === "ArrowLeft") navigateGallery("prev");
        if (e.key === "ArrowRight") navigateGallery("next");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeGalleryModal, galleryModalIndex, hasGallery, isGalleryModalClosing, navigateGallery, rawGallery.length]);

  // Gallery modal: lock scroll (como el hero)
  useEffect(() => {
    if (galleryModalIndex === null) return;
    const y = window.scrollY;
    document.body.classList.add("gallery-modal-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    document.body.style.width = "100%";
    return () => {
      document.body.classList.remove("gallery-modal-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    };
  }, [galleryModalIndex]);

  useEffect(() => {
    return () => {
      if (gallerySwitchTimeoutRef.current) clearTimeout(gallerySwitchTimeoutRef.current);
      document.body.classList.remove("gallery-modal-open");
    };
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

  useEffect(() => {
    if (galleryModalIndex !== null && galleryModalRef.current) {
      gsap.fromTo(
        galleryModalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      if (galleryStageRef.current) {
        gsap.fromTo(
          galleryStageRef.current,
          { opacity: 0, scale: 0.985, y: 12 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power2.out", delay: 0.04 }
        );
      }
    }
  }, [galleryModalIndex]);

  const openSiteLink = () => {
    if (project.siteLink && project.siteLink !== "#") {
      window.open(project.siteLink, "_blank", "noopener,noreferrer");
    }
  };

  const renderGalleryMedia = (item, index, className = "") => {
    if (!item) return null;
    const isVideo =
      item.type === "video" ||
      (typeof item.src === "string" && /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(item.src));

    return (
      <figure
        key={`${item.src}-${index}`}
        className={`group h-[32vh] sm:h-[38vh] md:h-[52vh] lg:h-[80vh] max-h-[80vh] lg:cursor-grab active:cursor-grabbing ${className}`}
      >
        <div className="relative w-full h-full max-h-[80vh] rounded-lg overflow-hidden bg-black/40 shadow-lg">
          {isVideo ? (
            <>
              <VideoPoster
                src={item.src}
                poster={item.poster}
                posterTime={item.posterTime ?? 1}
                previewLoop={item.loopPreview}
                previewLoopStart={item.loopPreviewStart ?? 0}
                previewLoopSeconds={item.loopPreviewSeconds ?? 2.2}
                fullVideoLoop={item.fullVideoLoop}
                loopTrimEnd={item.loopTrimEnd ?? 0}
                className="block w-full h-full max-h-[80vh] object-cover"
              />
              <button
                type="button"
                onClick={() => openGalleryModal(index)}
                className="absolute inset-0 z-10"
                aria-label={`Play ${item.caption || "gallery video"}`}
              />
            </>
          ) : (
            <>
              <img
                src={item.src}
                alt={item.alt || item.caption || `${project.title} gallery image ${index + 1}`}
                className="block w-full h-full max-h-[80vh] object-cover"
              />
              <button
                type="button"
                onClick={() => openGalleryModal(index)}
                className="absolute inset-0 z-10"
                aria-label={`Open ${item.alt || item.caption || `gallery image ${index + 1}`}`}
              />
            </>
          )}

          <div className="absolute right-3 bottom-3 lg:right-4 lg:bottom-4 z-20">
            <span className="inline-flex items-center px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full border border-white/25 bg-black/55 text-[10px] lg:text-[11px] tracking-[0.12em] uppercase text-white/92 opacity-75 group-hover:opacity-100 transition-opacity duration-200">
              {isVideo ? "PLAY" : "OPEN"}
            </span>
          </div>
        </div>
      </figure>
    );
  };

  return (
    <div ref={pageRef} className="min-h-screen min-h-[100dvh] bg-[#0a0a0a] text-white">
      {/* INTRO OVERLAY: hero takeover, animates to layout position */}
      <div
        ref={overlayRef}
        className="fixed z-[100] overflow-hidden"
        style={{ top: 0, left: 0, width: "100vw", height: "100dvh", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 w-full h-full">
          {project.videoUrl ? (
            <video
              ref={overlayVideoRef}
              src={project.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : heroStillImage ? (
            <img
              src={heroStillImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>
      </div>

      <main className="relative w-full">
        {/* Section header + hero = 100vh — siguiente sección no visible hasta scroll */}
        <section className="min-h-[100dvh] flex flex-col pt-[clamp(4rem,12vw,6rem)]">
          <div className="w-full max-w-[1900px] mx-auto px-[5%] py-12 flex-1 flex flex-col min-h-0">
            {/* HEADER — Layout: left = title + project info tags, right = summary + pills */}
            <div
              className="grid grid-cols-1 md:grid-cols-12 gap-x-[clamp(1rem,3vw,2rem)] gap-y-[clamp(1.5rem,4vw,2.5rem)] mb-[clamp(2rem,5vw,4rem)] items-start shrink-0"
            >
            {/* LEFT: Title + Project info tags */}
            <div className="col-span-12 lg:col-span-6">
              <h1
                ref={titleRef}
                className="font-anton leading-[0.92] tracking-[0.02em] uppercase text-white w-full whitespace-normal break-words"
                style={{
                  fontSize: "clamp(1.75rem, 5vw + 1.5rem, 6.5rem)",
                  fontFamily: "Anton, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 400,
                }}
              >
                {project.title}
              </h1>

              {(project.year || project.country || project.industry || project.timeOfProject) && (
                <div ref={factsRef}>
                  <ProjectFacts
                    year={project.year}
                    country={project.country}
                    industry={project.industry}
                    timeOfProject={project.timeOfProject}
                  />
                </div>
              )}
            </div>

            {/* RIGHT: Summary + Pills */}
            <div ref={rightColumnRef} className="col-span-12 lg:col-span-6 lg:flex lg:flex-col lg:items-end lg:text-right">
              {project.summary && (
                <p
                  ref={summaryRef}
                  className="text-white text-[clamp(0.95rem,2vw,1.25rem)] leading-relaxed tracking-[0.01em] font-general font-medium max-w-2xl mb-[clamp(1rem,2.5vw,2rem)]"
                  style={{ lineHeight: "1.6" }}
                >
                  {project.summary}
                </p>
              )}

              {!!project.tags?.length && (
                <div ref={tagsRef} className="flex flex-wrap gap-[clamp(0.5rem,1.5vw,0.75rem)] lg:justify-end">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-[clamp(0.5rem,1.5vw,0.75rem)] py-[clamp(0.25rem,1vw,0.375rem)] text-[clamp(0.65rem,1.5vw,0.75rem)] border border-white/20 rounded-full tracking-[0.12em] uppercase text-white/70 sm:text-white/60 font-light font-general"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

            {/* HERO (Click → Video Modal) — target for intro overlay animation */}
            <div ref={heroRef} className="relative flex-1 min-h-[280px] flex flex-col">
              <div
                onClick={openVideoPlayer}
                className="relative w-full h-full flex-1 min-h-[240px] overflow-hidden rounded-[clamp(0.5rem,1.5vw,1rem)] cursor-pointer group"
              >
              {project.videoUrl ? (
                <video
                  ref={heroVideoRef}
                  src={project.videoUrl}
                  autoPlay={false}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : heroStillImage ? (
                <img
                  src={heroStillImage}
                  alt={`${project.title} hero`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : null}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

              <div className="hidden lg:flex absolute right-4 bottom-4 z-20">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/25 bg-black/55 text-[11px] tracking-[0.12em] text-white/92">
                  PLAY
                </span>
              </div>

              {project.logoUrl && (
                <div
                  ref={heroLogoRef}
                  className="absolute bottom-[clamp(0.75rem,2vw,1.5rem)] left-[clamp(0.75rem,2vw,1.5rem)] z-10"
                >
                  <img
                    src={project.logoUrl}
                    alt={`${project.title} logo`}
                    className="h-[clamp(2rem,5vw,3rem)] w-auto bg-white/10 backdrop-blur-sm rounded p-[clamp(0.5rem,1.5vw,0.75rem)] shadow-lg"
                  />
                </div>
              )}

              {project.videoUrl && (
                <div className="absolute inset-0 hidden md:flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
        </div>
        </section>

        {/* DESCRIPTION + FEATURES + GALLERY — visible al hacer scroll */}
        <div className={`w-full max-w-[1900px] mx-auto px-[5%] ${hasGallery ? "py-0" : "py-12"}`}>
          <div ref={bodyContentRef}>
            {!hasGallery && (
              <>
                {/* 1. Texto en dos columnas + botón */}
                <div className="mb-[clamp(3rem,6vw,5rem)]">
                  {descriptionContent.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[clamp(2rem,5vw,4rem)] gap-y-4 mb-6">
                      {descriptionContent.map((paragraph, index) => (
                        <p
                          key={index}
                          className="font-general font-normal text-white text-[clamp(0.9rem,1.8vw,1.125rem)] leading-relaxed whitespace-pre-line"
                          style={{ lineHeight: "1.7", letterSpacing: "0.02em", fontWeight: 300 }}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                  {project.siteLink && project.siteLink !== "#" && (
                    <TextCtaLink text="Visit Project" onClick={openSiteLink} />
                  )}
                </div>

                {/* 2. Key Features */}
                {!!project.features?.length && (
                  <div className="mb-[clamp(3rem,6vw,5rem)]">
                    <h3 className="font-anton text-white text-[clamp(1rem,2.2vw,1.25rem)] tracking-[0.04em] mb-[clamp(1rem,2.5vw,1.5rem)]">
                      Key Features
                    </h3>
                    <div className="space-y-0">
                      {project.features.map((feature, i) => (
                        <div key={i} className="border-b border-white/20 py-[clamp(0.75rem,2vw,1.25rem)]">
                          <p className="font-general font-normal text-white/70 text-[clamp(0.85rem,1.6vw,1rem)] leading-relaxed">
                            {feature}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 3. Gallery — editorial grid */}
        {hasGallery && (
          <section ref={galleryRef} className="w-full py-2 md:py-[clamp(2rem,5vw,4rem)]">
            <div className="w-full max-w-[1900px] mx-auto px-[5%]">
              <div className="space-y-6 md:space-y-[clamp(2rem,4vw,3.5rem)]">
                {/* 1) Espacio vacio izquierda + texto/boton derecha */}
                {(descriptionContent[0] || project.siteLink) && (
                  <div className="w-full">
                    <article className="py-2 md:py-[clamp(1.5rem,2.8vw,2.5rem)]">
                      <span className="block font-general font-light uppercase text-white/70 text-[clamp(0.72rem,0.9vw,0.82rem)] tracking-[0.12em] mb-[clamp(0.75rem,1.2vw,1rem)]">
                        Introduction
                      </span>
                      {descriptionContent[0] && (
                        <p className="font-general font-medium text-white text-[clamp(1.55rem,3.1vw,3.5rem)] leading-[1.16] tracking-[-0.012em] max-w-[32ch] mb-6">
                          {descriptionContent[0]}
                        </p>
                      )}
                      {project.siteLink && project.siteLink !== "#" && (
                        <TextCtaLink text="View Project" onClick={openSiteLink} className="w-fit" />
                      )}
                    </article>
                  </div>
                )}

                {/* 2) Bloque full width (80vh) */}
                {fullWidthMedia && renderGalleryMedia(fullWidthMedia, 0)}

                {/* 3) Texto izquierda + bloque derecha (80vh) */}
                {(sideMedia || descriptionContent[1] || project.features?.length > 0) && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 md:gap-y-6 items-start">
                    <article className="py-6 lg:py-0 lg:pt-4 lg:col-span-4">
                      {descriptionContent[1] && (
                        <p className="font-general font-normal text-white/86 text-[clamp(1rem,1.55vw,1.2rem)] leading-relaxed mb-5">
                          {descriptionContent[1]}
                        </p>
                      )}
                      {!!project.features?.length && (
                        <ul className="space-y-0 mt-5">
                          {project.features.slice(0, 4).map((feature, index) => (
                            <li
                              key={`focus-${index}`}
                              className="font-general font-normal text-white/78 text-[clamp(0.95rem,1.35vw,1.08rem)] leading-relaxed border-b border-white/20 py-2.5"
                            >
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                    <div className="hidden lg:block lg:col-span-2" />
                    {sideMedia && <div className="lg:col-span-6">{renderGalleryMedia(sideMedia, 1)}</div>}
                  </div>
                )}

                {/* 4) Distribucion variable de restantes (3..6 total) */}
                {trailingMedia.length === 1 && (
                  <div>{renderGalleryMedia(trailingMedia[0], 2)}</div>
                )}

                {trailingMedia.length === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
                    {trailingMedia.map((item, idx) => renderGalleryMedia(item, idx + 2))}
                  </div>
                )}

                {trailingMedia.length === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
                    {trailingMedia.map((item, idx) => renderGalleryMedia(item, idx + 2))}
                  </div>
                )}

                {trailingMedia.length === 4 && (
                  <div className="space-y-8 md:space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {trailingMedia.slice(0, 3).map((item, idx) => renderGalleryMedia(item, idx + 2))}
                    </div>
                    <div>{renderGalleryMedia(trailingMedia[3], 5)}</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* MODAL: hero video player, freezes scroll */}
      {videoOpen && (
        <div
          ref={modalRef}
          className="fixed inset-0 w-[100vw] h-[100dvh] z-[20050] bg-black/70 backdrop-blur-[6px] flex items-center justify-center p-[clamp(1rem,4vw,2rem)]"
          onClick={closeVideoPlayer}
        >
          <div
            className="relative w-full max-w-[min(90vw,56rem)] sm:max-w-[min(75vw,56rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={project.videoUrl}
              autoPlay
              controls
              preload="metadata"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <button
              onClick={closeVideoPlayer}
              className="absolute -top-[clamp(2rem,4vw,2.5rem)] right-0 text-white text-[clamp(1.5rem,4vw,2.5rem)] hover:text-gray-300"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* MODAL: gallery media — resolución original */}
      {galleryModalIndex !== null && hasGallery && rawGallery[galleryModalIndex] && (
        <div
          ref={galleryModalRef}
          className="fixed inset-0 w-[100vw] h-[100dvh] z-[2147483000] bg-black/90 backdrop-blur-[6px] flex items-center justify-center overflow-hidden"
          onClick={closeGalleryModal}
        >
          <div
            ref={galleryStageRef}
            className="relative w-full h-full flex items-center justify-center px-4 pt-16 pb-24 md:px-8 md:pt-10 md:pb-20"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleGalleryTouchStart}
            onTouchEnd={handleGalleryTouchEnd}
          >
            <div className="absolute inset-0 bg-black/30" />
            {rawGallery.length > 1 && (
              <div className="absolute top-4 left-4 z-40 md:hidden">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/25 bg-black/50 text-[10px] tracking-[0.12em] uppercase text-white/88">
                  <span aria-hidden="true">↔</span>
                  Slide
                </span>
              </div>
            )}
            {previousGalleryModalIndex !== null && rawGallery[previousGalleryModalIndex] && (
              <>
                {rawGallery[previousGalleryModalIndex].type === "video" ? (
                  <video
                    src={rawGallery[previousGalleryModalIndex].src}
                    autoPlay
                    muted
                    playsInline
                    className={`absolute inset-0 w-full h-full object-contain shadow-2xl transition-opacity duration-300 ${
                      isGalleryCrossfading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                ) : (
                  <img
                    src={rawGallery[previousGalleryModalIndex].src}
                    alt={rawGallery[previousGalleryModalIndex].alt || rawGallery[previousGalleryModalIndex].caption || `${project.title} gallery image`}
                    className={`absolute inset-0 w-full h-full object-contain shadow-2xl transition-opacity duration-300 ${
                      isGalleryCrossfading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                )}
              </>
            )}
            {rawGallery[galleryModalIndex].type === "video" ? (
              <video
                src={rawGallery[galleryModalIndex].src}
                autoPlay
                muted
                controls
                playsInline
                onLoadedData={handleIncomingMediaReady}
                onCanPlay={handleIncomingMediaReady}
                className={`absolute inset-0 w-full h-full object-contain shadow-2xl transition-opacity duration-300 ${
                  previousGalleryModalIndex !== null
                    ? isGalleryCrossfading
                      ? "opacity-100"
                      : "opacity-0"
                    : "opacity-100"
                }`}
              />
            ) : (
              <img
                src={rawGallery[galleryModalIndex].src}
                alt={rawGallery[galleryModalIndex].alt || rawGallery[galleryModalIndex].caption || `${project.title} gallery image`}
                onLoad={handleIncomingMediaReady}
                className={`absolute inset-0 w-full h-full object-contain shadow-2xl transition-opacity duration-300 ${
                  previousGalleryModalIndex !== null
                    ? isGalleryCrossfading
                      ? "opacity-100"
                      : "opacity-0"
                    : "opacity-100"
                }`}
              />
            )}
            {rawGallery.length > 1 && (
              <div className="hidden md:flex absolute top-5 left-1/2 -translate-x-1/2 items-center gap-2 z-50">
                <button
                  type="button"
                  onClick={() => navigateGallery("prev")}
                  className="inline-flex items-center px-3 py-1 rounded-full border border-white/25 bg-black/55 text-[10px] tracking-[0.12em] uppercase text-white/92 hover:bg-black/70 transition-colors duration-200"
                  aria-label="Previous media"
                >
                  PREV
                </button>
                <button
                  type="button"
                  onClick={() => navigateGallery("next")}
                  className="inline-flex items-center px-3 py-1 rounded-full border border-white/25 bg-black/55 text-[10px] tracking-[0.12em] uppercase text-white/92 hover:bg-black/70 transition-colors duration-200"
                  aria-label="Next media"
                >
                  NEXT
                </button>
              </div>
            )}
            <button
              onClick={closeGalleryModal}
              className="absolute top-4 right-4 md:top-5 md:right-5 z-50 text-white text-[clamp(1.5rem,4vw,2.5rem)] hover:text-gray-300"
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
