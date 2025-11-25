"use client";

import MateGlass from "../components/Three/mateGlass";
import { useState, useEffect, useRef } from "react";
import { experiences } from "../data/experiences";
import { useLetterReveal } from "../hooks/useLetterReveal";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const [openIndex, setOpenIndex] = useState(null);
  
  // Refs for letter reveal animation (titles)
  const getToMobileRef = useLetterReveal();
  const knowMeMobileRef = useLetterReveal({ delay: 0.3 });
  const getToDesktopRef = useLetterReveal();
  const knowMeDesktopRef = useLetterReveal({ delay: 0.3 });
  
  // Refs for paragraph and experiences animation
  const sectionRef = useRef(null);
  const paragraphDesktopRef = useRef(null);
  const paragraphMobileRef = useRef(null);
  const experiencesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split paragraph into lines for line-by-line animation
      const wrapLinesInSpans = (element) => {
        if (!element) return [];
        
        // Get the span element that contains the actual text
        const textSpan = element.querySelector('span');
        if (!textSpan) return [];
        
        // Get all text nodes and br elements
        const children = Array.from(textSpan.childNodes);
        const lines = [];
        let currentLine = document.createElement('span');
        currentLine.style.display = 'block';
        currentLine.style.overflow = 'hidden';
        
        children.forEach(node => {
          if (node.nodeName === 'BR') {
            // End current line and start a new one
            if (currentLine.childNodes.length > 0) {
              lines.push(currentLine);
            }
            currentLine = document.createElement('span');
            currentLine.style.display = 'block';
            currentLine.style.overflow = 'hidden';
          } else {
            // Add node to current line
            currentLine.appendChild(node.cloneNode(true));
          }
        });
        
        // Add the last line
        if (currentLine.childNodes.length > 0) {
          lines.push(currentLine);
        }
        
        // Clear and rebuild with wrapped lines
        textSpan.innerHTML = '';
        lines.forEach(line => {
          const wrapper = document.createElement('span');
          wrapper.style.display = 'block';
          wrapper.style.overflow = 'hidden';
          
          const inner = document.createElement('span');
          inner.style.display = 'block';
          inner.innerHTML = line.innerHTML;
          
          wrapper.appendChild(inner);
          textSpan.appendChild(wrapper);
        });
        
        // Return the inner spans for animation
        return Array.from(textSpan.querySelectorAll('span > span'));
      };

      // Animate desktop paragraph lines
      if (paragraphDesktopRef.current) {
        const lines = wrapLinesInSpans(paragraphDesktopRef.current);
        
        if (lines.length > 0) {
          // Set initial state - lines start below their position
          gsap.set(lines, {
            y: 50,
          });

          // Animate lines up with stagger
          gsap.to(lines, {
            y: 0,
            duration: 0.9,
            stagger: 0.12, // 120ms between each line
            ease: "power2.out",
            scrollTrigger: {
              trigger: paragraphDesktopRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      // Animate mobile paragraph lines
      if (paragraphMobileRef.current) {
        const lines = wrapLinesInSpans(paragraphMobileRef.current);
        
        if (lines.length > 0) {
          // Set initial state - lines start below their position
          gsap.set(lines, {
            y: 40,
          });

          // Animate lines up with stagger
          gsap.to(lines, {
            y: 0,
            duration: 0.9,
            stagger: 0.12, // 120ms between each line
            ease: "power2.out",
            scrollTrigger: {
              trigger: paragraphMobileRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      // Animate experiences list
      if (experiencesRef.current && experiencesRef.current.children.length > 0) {
        const experienceItems = Array.from(experiencesRef.current.children);
        
        // Set initial state for experiences
        gsap.set(experienceItems, {
          opacity: 0,
          y: 40,
        });

        // Animate experiences with stagger
        gsap.to(experienceItems, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15, // 150ms between each experience item
          ease: "power2.out",
          scrollTrigger: {
            trigger: experiencesRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
            invalidateOnRefresh: true,
          },
        });

        // Add radial gradient hover effect to experience items
        experienceItems.forEach((item) => {
          const button = item.querySelector('button');
          if (button) {
            // Add necessary classes for hover effect to the entire experience item
            item.classList.add('group', 'relative', 'overflow-hidden');
            
            // Create radial gradient overlay on the entire experience item container
            const gradientOverlay = document.createElement('span');
            gradientOverlay.className = 'absolute inset-0 pointer-events-none';
            gradientOverlay.style.cssText = `
              background: radial-gradient(ellipse 80% 40% at 50% 100%, 
                #53CA1E0C 0%, 
                #53CA1E06 25%, 
                #53CA1E02 50%, 
                transparent 65%
              );
              opacity: 0;
              transition: opacity 0.4s ease-in-out;
              border-radius: inherit;
            `;
            
            // Insert gradient overlay as first child of the experience item
            item.insertBefore(gradientOverlay, item.firstChild);
            
            // Add hover listeners to the entire experience item
            item.addEventListener('mouseenter', () => {
              gradientOverlay.style.opacity = '1';
            });
            
            item.addEventListener('mouseleave', () => {
              gradientOverlay.style.opacity = '0';
            });
            
            // Ensure all content stays on top
            Array.from(item.children).forEach((child, index) => {
              if (index > 0) { // Skip the gradient overlay
                if (!child.classList.contains('relative')) {
                  child.classList.add('relative', 'z-10');
                }
              }
            });
          }
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full pt-24 min-h-[60vh] mb-12 md:mb-24">
      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col">
        <div className="flex flex-col mb-8">
          <div className="flex items-center mb-2">
            <h1 
              ref={getToMobileRef}
              className="font-anton text-[clamp(2.5rem,7.5vw,6rem)] text-white uppercase leading-[0.9] tracking-[0.04em] font-normal"
              style={{ perspective: "1000px" }}
            >
              GET TO
            </h1>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 ml-2">
              <MateGlass />
            </div>
          </div>
          <h1 
            ref={knowMeMobileRef}
            className="font-anton text-[clamp(2.5rem,7.5vw,6rem)] text-white uppercase leading-[0.9] tracking-[0.04em] font-normal ml-12 sm:ml-20"
            style={{ perspective: "1000px" }}
          >
            KNOW ME
          </h1>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex gap-8 items-start justify-between">
        {/* Left Column - Title */}
        <div className="relative flex-1 flex flex-col justify-center">
          <div className="relative w-fit">
            <div className="flex flex-col">
              <div className="flex items-start">
                <h1 
                  ref={getToDesktopRef}
                  className="font-anton text-[clamp(2.5rem,7.5vw,6rem)] text-white uppercase leading-[0.9] tracking-[0.04em] font-normal"
                  style={{ perspective: "1000px" }}
                >
                  GET TO
                </h1>
                <div className="relative w-24 h-24 lg:w-[120px] lg:h-[120px] ml-4">
                  <div className="absolute top-0 right-0 w-full h-full">
                    <MateGlass />
                  </div>
                </div>
              </div>
              <div className="flex items-end mt-2">
                <h1 
                  ref={knowMeDesktopRef}
                  className="font-anton text-[clamp(2.5rem,7.5vw,6rem)] text-white uppercase leading-[0.9] tracking-[0.04em] font-normal ml-32"
                  style={{ perspective: "1000px" }}
                >
                  KNOW ME
                </h1>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Description */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            <p ref={paragraphDesktopRef} className="text-white text-xl md:text-2xl leading-relaxed">
              <span>
                <i>Lautaro Torres</i>, <b>Creative Developer & Designer</b> from Argentina.<br/>
                Currently <b>Lead Web Developer</b> at <a href="https://nexawave.pro" target="_blank" rel="noopener noreferrer"><b>Nexawave↗</b></a> — handling project management, creative direction, and digital production.<br/>
                Open to collaborations with agencies & studios seeking distinctive digital work.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Content - Description */}
      <div className="flex md:hidden flex-col justify-center mt-8">
        <div className="space-y-3">
          <p ref={paragraphMobileRef} className="text-white text-sm leading-relaxed">
            <span>
              <i>Lautaro Torres</i>, <b>Creative Developer & Designer</b> from Argentina.<br/>
              Currently <b>Lead Web Developer</b> at <a href="https://nexawave.pro" target="_blank" rel="noopener noreferrer"><b>Nexawave↗</b></a> — handling project management, creative direction, and digital production.<br/>
              Open to collaborations with agencies & studios seeking distinctive digital work.
            </span>
          </p>
        </div>
      </div>

      {/* Experiences Section */}
      <div ref={experiencesRef} className="mt-16 md:mt-20">
        {experiences.map((exp, idx) => (
          <div
            key={exp.company}
            className="py-5 md:py-6 border-b border-white/15"
          >
            <button
              className="w-full flex justify-between items-start text-left focus:outline-none cursor-label-click"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <div className="flex-1">
                <span className="block text-xs text-white/60 mb-2">{String(idx + 1).padStart(2, "0")}</span>
                <span className="block text-white text-lg md:text-xl mb-2">{exp.company}</span>
                <div className="flex items-center">
                  <span className="text-white/80 text-base md:text-lg">{exp.role}</span>
                  <span className="text-white/60 mx-2">-</span>
                  <span className="text-white/80 text-base md:text-lg">{exp.period}</span>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 self-center">
                <svg
                  className={`w-5 h-5 text-white/60 transition-transform duration-300 ${openIndex === idx ? "rotate-180" : "rotate-0"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ${
                openIndex === idx ? "max-h-[500px] opacity-100 mt-6" : "max-h-0 opacity-0"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <p className="text-white/90 text-base md:text-lg leading-relaxed">{exp.description}</p>
                </div>
                <div className="space-y-3">
                  {exp.highlights.map((highlight, i) => (
                    <p key={i} className="text-white/70 text-base leading-relaxed">
                      • {highlight}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
