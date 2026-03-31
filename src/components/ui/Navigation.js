// Navigation.jsx
"use client";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { useTransitionRouter } from "../../hooks/useTransitionRouter";
import GlassPortalPill from "./GlassPortalPill";

const EXPERIMENTS_ENABLED = false;
const DESKTOP_NAV_ITEMS = [
  { label: "Projects", href: "/projects" },
  { label: "Archives", href: "/archives" },
  { label: "Experience", href: "/experience" },
];

function DesktopNavAnimatedLabel({ label }) {
  const chars = label.split("");

  return (
    <span className="relative inline-flex h-[1em] items-center overflow-hidden leading-none" aria-hidden="true">
      <span className="inline-flex items-center">
        {chars.map((char, index) => (
          <span
            key={`base-${char}-${index}`}
            className="inline-block will-change-transform transition-transform duration-500 ease-ui-emphasized group-hover:-translate-y-full"
            style={{ transitionDelay: `${index * 18}ms` }}
          >
            {char}
          </span>
        ))}
      </span>
      <span className="absolute inset-0 inline-flex items-center">
        {chars.map((char, index) => (
          <span
            key={`hover-${char}-${index}`}
            className="inline-block translate-y-full will-change-transform transition-transform duration-500 ease-ui-emphasized group-hover:translate-y-0"
            style={{ transitionDelay: `${index * 18}ms` }}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);
  const { push, isTransitioning } = useTransitionRouter();
  const transformDurationMs = 900;
  const opacityDurationMs = 220;
  const baseItemClass = "transform-gpu";
  const itemOpenClass = "opacity-100 translate-y-0";
  const itemClosedClass = "opacity-0 translate-y-6";
  const itemClosingClass = "opacity-0 translate-y-6";
  const menuContainerRef = useRef(null);
  const itemsTlRef = useRef(null);
  const splitsRef = useRef(null);
  const overlayRef = useRef(null);
  const overlayTlRef = useRef(null);
  const scrolledToHashRef = useRef(false);

  // Handle hash scrolling on page load/navigation
  useEffect(() => {
    
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash && !scrolledToHashRef.current) {
        const sectionId = hash.replace('#', '');
        
        // Single attempt with delay to allow content to load
        const timer = setTimeout(() => {
          const targetElement = document.getElementById(sectionId);
          if (targetElement && !scrolledToHashRef.current) {
            scrolledToHashRef.current = true;
            const smoother = ScrollSmoother.get();
            if (smoother) {
              smoother.scrollTo(targetElement, true, "power2.inOut");
            } else {
              targetElement.scrollIntoView({ behavior: "auto" });
            }
          }
        }, 800); // Wait for dynamic sections to load
        
        return () => clearTimeout(timer);
      }
    };

    const cleanup = handleHashScroll();
    
    // Listen for hash changes
    const onHashChange = () => {
      scrolledToHashRef.current = false;
      handleHashScroll();
    };
    
    window.addEventListener('hashchange', onHashChange);
    
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      if (cleanup) cleanup();
    };
  }, []);

  const getItemStyle = (index) => {
    const staggerMs = index * 90;
    const timing = "ease-in-out";
    if (isMenuOpen) {
      return {
        transitionProperty: "transform, opacity",
        transitionDuration: `${transformDurationMs}ms, ${opacityDurationMs}ms`,
        transitionTimingFunction: `${timing}, ${timing}`,
        transitionDelay: `${staggerMs}ms, ${staggerMs + transformDurationMs}ms`,
      };
    }
    return {
      transitionProperty: "transform, opacity",
      transitionDuration: `${transformDurationMs}ms, ${opacityDurationMs}ms`,
      transitionTimingFunction: `${timing}, ${timing}`,
      transitionDelay: `${staggerMs}ms, ${staggerMs + transformDurationMs - opacityDurationMs}ms`,
    };
  };

  const startClose = () => {
    setIsClosing(true);
    setIsMenuOpen(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setIsClosing(false), transformDurationMs + 50);
  };

   // Overlay GSAP timeline
  useLayoutEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    // Ensure element is initially hidden with GSAP (no conflicts with inline styles)
    gsap.set(el, { 
      yPercent: -100, 
      opacity: 0,
      visibility: 'visible' // Ensure it's visible in DOM but positioned off-screen
    });

    overlayTlRef.current = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.inOut", duration: 0.7 },
    }).to(el, {
      yPercent: 0,
      opacity: 1,
      onStart: () => { 
        el.style.pointerEvents = "auto"; 
      },
      onComplete: () => {},
      onReverseComplete: () => { 
        el.style.pointerEvents = "none"; 
      },
    });

    return () => {
      if (overlayTlRef.current) {
        overlayTlRef.current.kill();
        overlayTlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!overlayTlRef.current) return;

    if (isMenuOpen) {
      overlayTlRef.current.timeScale(1).play();
    } else {
      overlayTlRef.current.timeScale(1).reverse();
    }
  }, [isMenuOpen]);

  // Items GSAP timeline
  useEffect(() => {
    gsap.registerPlugin(SplitText);
    if (isMenuOpen) {
      const container = menuContainerRef.current;
      if (!container) return;
      if (splitsRef.current) {
        splitsRef.current.forEach((s) => s.revert());
        splitsRef.current = null;
      }
      const containers = Array.from(container.querySelectorAll('.menu-item .menu-link_container'));
      if (itemsTlRef.current) {
        itemsTlRef.current.kill();
        itemsTlRef.current = null;
      }
      gsap.set(containers, { yPercent: 100, opacity: 0 });
      const tl = gsap.timeline({ paused: true });
      tl.to(containers, {
        duration: 0.7,
        yPercent: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power2.inOut",
      });
      itemsTlRef.current = tl;
      tl.play(0);
    } else if (isClosing && itemsTlRef.current) {
      itemsTlRef.current.timeScale(1).reverse();
    }
  }, [isMenuOpen, isClosing]);

  const pillAnchorRef = useRef(null);

  return (
    <nav data-main-nav className="fixed top-0 left-0 right-0 z-[10000] mt-3 md:mt-[1%]">
      <div className="max-w-[1900px] mx-auto px-[5%]">
        <div className="relative flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center relative z-[10003]">
            <button
              onClick={() => push('/')}
              className={`transition-transform duration-200 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              disabled={isTransitioning}
            >
              <Image
                src="/assets/images/logos/logo-lt-4327568.svg"
                alt="LT Logo"
                width={32}
                height={32}
              />
            </button>
          </div>

          {/* Center: Desktop nav (perfectly centered on desktop) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <div className="relative inline-block" ref={pillAnchorRef}>
              <div className="flex h-[42px] md:h-[46px] flex-row items-center justify-center px-5 md:px-6">
                <div className="flex flex-row items-center gap-5 md:gap-6">
                  {DESKTOP_NAV_ITEMS.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => push(item.href)}
                      aria-label={item.label}
                      className={`group relative inline-flex items-center overflow-hidden text-white font-general font-normal text-xs md:text-sm leading-none tracking-[0.1em] uppercase transition-colors duration-300 ${isTransitioning ? "opacity-50 cursor-not-allowed" : "hover:text-white/80"}`}
                      disabled={isTransitioning}
                    >
                      <DesktopNavAnimatedLabel label={item.label} />
                      <span className="sr-only">{item.label}</span>
                    </button>
                  ))}
                  {EXPERIMENTS_ENABLED && (
                    <button
                      onClick={() => push("/experiments")}
                      aria-label="Experiments"
                      className={`group relative inline-flex items-center overflow-hidden text-white font-general font-normal text-xs md:text-sm leading-none tracking-[0.1em] uppercase transition-colors duration-300 ${isTransitioning ? "opacity-50 cursor-not-allowed" : "hover:text-white/80"}`}
                      disabled={isTransitioning}
                    >
                      <DesktopNavAnimatedLabel label="Experiments" />
                      <span className="sr-only">Experiments</span>
                    </button>
                  )}
                </div>
              </div>
              {/* Portal glass pill aligned to this anchor */}
              <GlassPortalPill anchorRef={pillAnchorRef} blur={18} backgroundOpacity={0.12} className="rounded-[999px] shadow-2xl" />
            </div>
          </div>

          {/* Right: Hamburger */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => (isMenuOpen ? startClose() : setIsMenuOpen(true))}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0a0a0a]/80 border border-white/10 text-white hover:bg-[#0a0a0a]/70 transition-colors relative z-[10004]"
          >
            <div className="relative w-5 h-5">
              <span className={`absolute left-0 right-0 h-[2px] bg-white rounded transition-all duration-300 ease-in-out ${isMenuOpen ? 'top-[9px] rotate-45' : 'top-[5px] rotate-0'}`}></span>
              <span className={`absolute left-0 right-0 h-[2px] bg-white rounded transition-all duration-300 ease-in-out ${isMenuOpen ? 'top-[9px] opacity-0 scale-x-0' : 'top-[9px] opacity-100 scale-x-100'}`}></span>
              <span className={`absolute left-0 right-0 h-[2px] bg-white rounded transition-all duration-300 ease-in-out ${isMenuOpen ? 'top-[9px] -rotate-45' : 'top-[13px] rotate-0'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <div
        ref={overlayRef}
        className="md:hidden fixed top-0 left-0 right-0 bottom-0 z-[10001] bg-[#0a0a0a]/95 backdrop-blur-md flex flex-col pointer-events-none"
        style={{ isolation: "isolate" }}
      >
        <div className="px-[5%] pt-16 sm:pt-20 flex-grow relative z-[10002]" ref={menuContainerRef}>
          <ul className="divide-y divide-white/10">
            <li
              className={`menu-item ${baseItemClass} ${
                isMenuOpen ? itemOpenClass : isClosing ? itemClosingClass : itemClosedClass
              }`}
              style={getItemStyle(0)}
            >
              <div className="menu-link_container">
                <button
                  onClick={() => {
                    startClose();
                    push("/projects");
                  }}
                  className="w-full text-left text-white font-general font-normal uppercase tracking-[0.1em] leading-[1.2] py-3 sm:py-4 overflow-hidden"
                  style={{ fontSize: "clamp(2.2rem, 9vw, 3rem)" }}
                >
                  <span className="split inline-block">Projects</span>
                </button>
              </div>
            </li>
            <li
              className={`menu-item ${baseItemClass} ${
                isMenuOpen ? itemOpenClass : isClosing ? itemClosingClass : itemClosedClass
              }`}
              style={getItemStyle(1)}
            >
              <div className="menu-link_container">
                <button
                  onClick={() => {
                    startClose();
                    push("/archives");
                  }}
                  className="w-full text-left text-white font-general font-normal uppercase tracking-[0.1em] leading-[1.2] py-3 sm:py-4 overflow-hidden"
                  style={{ fontSize: "clamp(2.2rem, 9vw, 3rem)" }}
                >
                  <span className="split inline-block">Archives</span>
                </button>
              </div>
            </li>
            <li
              className={`menu-item ${baseItemClass} ${
                isMenuOpen ? itemOpenClass : isClosing ? itemClosingClass : itemClosedClass
              }`}
              style={getItemStyle(2)}
            >
              <div className="menu-link_container">
                <button
                  onClick={() => {
                    startClose();
                    push("/experience");
                  }}
                  className="w-full text-left text-white font-general font-normal uppercase tracking-[0.1em] leading-[1.2] py-3 sm:py-4 overflow-hidden"
                  style={{ fontSize: "clamp(2.2rem, 9vw, 3rem)" }}
                >
                  <span className="split inline-block">Experience</span>
                </button>
              </div>
            </li>
            {EXPERIMENTS_ENABLED && (
              <li
                className={`menu-item ${baseItemClass} ${
                  isMenuOpen ? itemOpenClass : isClosing ? itemClosingClass : itemClosedClass
                }`}
                style={getItemStyle(3)}
              >
                <div className="menu-link_container">
                  <button
                    onClick={() => {
                      startClose();
                      push("/experiments");
                    }}
                    className="w-full text-left text-white font-general font-normal uppercase tracking-[0.1em] leading-[1.2] py-3 sm:py-4 overflow-hidden"
                    style={{ fontSize: "clamp(2.2rem, 9vw, 3rem)" }}
                  >
                    <span className="split inline-block">Experiments</span>
                  </button>
                </div>
              </li>
            )}
          </ul>
        </div>

        {/* Footer links */}
        <div className="px-[5%] pb-8 text-white/80">
          <div className="space-y-1">
            <a
              href="https://wa.me/543876121599"
              target="_blank"
              rel="noreferrer"
              className="block font-general font-normal uppercase text-sm leading-[1.2] tracking-[0.08em]"
            >
              +54 387 612 1599
            </a>
          </div>
          <div className="space-y-1 mt-4">
            <a
              href="https://www.linkedin.com/in/lautarotorres/"
              target="_blank"
              rel="noreferrer"
              className="block font-general font-normal uppercase text-sm leading-[1.2] tracking-[0.08em]"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
