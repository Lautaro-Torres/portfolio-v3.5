"use client";
import LogoLT from "../Three/LogoLT";
import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const logoHostRef = useRef(null);
  const [shouldMountLogo3D, setShouldMountLogo3D] = useState(false);

  useEffect(() => {
    const host = logoHostRef.current;
    if (!host) return;
    if (typeof window === "undefined") {
      setShouldMountLogo3D(true);
      return;
    }

    const preloadAheadPx = 1200;
    const top = host.getBoundingClientRect().top;
    if (top <= window.innerHeight + preloadAheadPx) {
      setShouldMountLogo3D(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setShouldMountLogo3D(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldMountLogo3D(true);
        observer.disconnect();
      },
      {
        root: null,
        rootMargin: `${preloadAheadPx}px 0px`,
        threshold: 0.01,
      }
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      className="relative w-full min-h-screen flex flex-col"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Canvas 3D - Centrado en el footer */}
      <div ref={logoHostRef} className="relative flex-1 flex items-center justify-center">
        {shouldMountLogo3D ? <LogoLT /> : null}
      </div>

      {/* Footer inferior */}
      <div className="relative z-10 w-full border-t border-white/20 px-[5%] py-6">
        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col text-white text-sm font-general">
          {/* Email */}
          <div className="mb-6">
            <a 
              href="mailto:contact@lautor.dev" 
              className="hover:underline flex items-center font-normal uppercase tracking-[0.08em] transition-all duration-300"
            >
              contact@lautor.dev
              <span className="ml-2">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4">
                  <path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </span>
            </a>
          </div>
          
          {/* Social Links */}
          <div className="flex flex-col gap-2">
            <a 
              href="https://www.linkedin.com/in/lautarotorres/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline font-normal uppercase tracking-[0.1em] transition-all duration-300"
            >
              LINKEDIN
            </a>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex max-w-[1600px] mx-auto justify-between items-center text-white text-sm font-general">
          <div className="flex items-center">
            <a 
              href="mailto:contact@lautor.dev" 
              className="hover:underline flex items-center font-normal uppercase tracking-[0.08em] transition-all duration-300"
            >
              contact@lautor.dev
              <span className="ml-2">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4">
                  <path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </span>
            </a>
          </div>
          
          <div>
            <a 
              href="https://www.linkedin.com/in/lautarotorres/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline font-normal uppercase tracking-[0.08em] transition-all duration-300"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 