"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ExperienceAccordion from "../../components/ui/ExperienceAccordion";
import { useClippedTitleReveal } from "../../hooks/useClippedTitleReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ExperienceIndex() {
  const pageRef = useRef(null);
  const titleRef = useClippedTitleReveal();
  const introRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = [introRef.current].filter(Boolean);
      if (targets.length) {
        gsap.set(targets, { y: 28, opacity: 0 });
        gsap.to(targets, {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: "power2.out",
        });
      }

      const rows = listRef.current?.querySelectorAll(".experience-row");
      if (!rows?.length) return;
      gsap.set(rows, { y: 26, opacity: 0 });
      gsap.to(rows, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
          invalidateOnRefresh: true,
        },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen text-white bg-[#0a0a0a]">
      <main className="relative w-full pt-20 md:pt-24 pb-14 md:pb-20">
        <div className="w-full max-w-[1900px] mx-auto px-[5%]">
          <header className="relative z-10 pb-8 md:pb-10">
            <h1
              ref={titleRef}
              className="font-anton text-white uppercase leading-[0.84] tracking-[0.01em] font-normal text-[clamp(3.8rem,17vw,17rem)]"
            >
              Experience
            </h1>
            <p ref={introRef} className="mt-5 md:mt-7 text-white/78 text-sm md:text-base font-general font-normal max-w-[560px] leading-[1.45]">
              Roles, responsibilities and impact across product design, web development and
              creative production over the last years.
            </p>
          </header>

          <div ref={listRef}>
            <ExperienceAccordion className="relative z-10" />
          </div>
        </div>
      </main>
    </div>
  );
}
