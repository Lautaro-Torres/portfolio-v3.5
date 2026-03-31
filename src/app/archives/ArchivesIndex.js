"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { archivesData } from "../../data/archives";
import { useTransitionRouter } from "../../hooks/useTransitionRouter";
import { projectsData } from "../../data/projects";
import { useClippedTitleReveal } from "../../hooks/useClippedTitleReveal";
import { useSimpleRouteReady } from "../../hooks/useSimpleRouteReady";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ArchivesIndex() {
  useSimpleRouteReady();
  const { push, isTransitioning } = useTransitionRouter();
  const pageRef = useRef(null);
  const titleRef = useClippedTitleReveal();
  const introRef = useRef(null);
  const tableHeaderRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = listRef.current?.querySelectorAll(".archive-row");
      const targets = [introRef.current, tableHeaderRef.current].filter(Boolean);
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

  const isInternalHref = (href) => typeof href === "string" && href.startsWith("/");
  const validProjectRoutes = new Set(projectsData.map((project) => `/projects/${project.slug}`));

  return (
    <div ref={pageRef} className="min-h-screen text-white bg-[#0a0a0a]">
      <main className="relative w-full pt-20 md:pt-24 pb-14 md:pb-20">
        <div className="w-full max-w-[1900px] mx-auto px-[5%]">
          <header className="relative z-10 pb-8 md:pb-10">
            <h1
              ref={titleRef}
              className="font-anton text-white uppercase leading-[0.84] tracking-[0.01em] font-normal text-[clamp(3.8rem,17vw,17rem)]"
            >
              Archive
            </h1>
            <p ref={introRef} className="mt-5 md:mt-7 text-white/78 text-sm md:text-base font-general font-normal max-w-[560px] leading-[1.45]">
              A quick overview of selected projects developed across different contexts,
              from agency collaborations to independent commissions.
            </p>
          </header>

          <section className="relative z-10 w-full">
            <div
              ref={tableHeaderRef}
              className="hidden md:grid grid-cols-[1.7fr_1.4fr_2fr_0.55fr] gap-4 border-t border-b border-white/30 py-2 text-[10px] font-general font-light uppercase tracking-[0.13em] text-white/70"
            >
              <span>Project</span>
              <span>Role</span>
              <span>Context</span>
              <span className="text-right">Date</span>
            </div>

            <div ref={listRef} className="divide-y divide-white/18 border-b border-white/30">
              {archivesData.map((item) => (
                <article key={item.id} className="archive-row">
                  {(() => {
                    const isValidInternalHref = isInternalHref(item.href) && validProjectRoutes.has(item.href);
                    const hasLink = Boolean(item.href) && (!isInternalHref(item.href) || isValidInternalHref);

                    return hasLink ? (
                    <Link
                      href={item.href}
                      onClick={(event) => {
                        if (!isValidInternalHref) return;
                        event.preventDefault();
                        push(item.href);
                      }}
                      prefetch={isValidInternalHref}
                      className="group block py-3 md:py-2.5 grid grid-cols-2 md:grid-cols-[1.7fr_1.4fr_2fr_0.55fr] gap-y-1 md:gap-4 text-white/92 transition-colors duration-200 hover:bg-white/[0.03] px-2 -mx-2 rounded-sm cursor-pointer"
                      aria-disabled={isTransitioning && isValidInternalHref}
                    >
                      <div className="md:hidden col-span-1 text-[10px] font-general font-light uppercase tracking-[0.12em] text-white/55">
                        Project
                      </div>
                      <p className="col-span-1 text-sm md:text-[12px] font-general font-light leading-[1.3] uppercase tracking-[0.12em] transition-transform duration-200 group-hover:translate-x-1">
                        {item.project}
                      </p>

                      <div className="md:hidden col-span-1 text-[10px] font-general font-light uppercase tracking-[0.12em] text-white/55 mt-2">
                        Context
                      </div>
                      <p className="md:hidden col-span-1 text-xs md:text-[11px] font-general font-light uppercase tracking-[0.12em] text-white/72">
                        {item.context}
                      </p>

                      <p className="hidden md:block text-xs md:text-[11px] font-general font-light uppercase tracking-[0.12em] text-white/78">
                        {item.role}
                      </p>
                      <p className="hidden md:block text-xs md:text-[11px] font-general font-light uppercase tracking-[0.12em] text-white/72">
                        {item.context}
                      </p>

                      <div className="md:hidden col-span-1 text-[10px] font-general font-light uppercase tracking-[0.12em] text-white/55 mt-2">
                        Date
                      </div>
                      <p className="col-span-1 text-xs md:text-[11px] font-general font-light uppercase tracking-[0.12em] text-white/80 md:text-right">
                        {item.date}
                      </p>
                    </Link>
                  ) : (
                    <div className="block py-3 md:py-2.5 grid grid-cols-2 md:grid-cols-[1.7fr_1.4fr_2fr_0.55fr] gap-y-1 md:gap-4 text-white/92 px-2 -mx-2">
                      <div className="md:hidden col-span-1 text-[10px] font-general font-light uppercase tracking-[0.12em] text-white/55">
                        Project
                      </div>
                      <p className="col-span-1 text-sm md:text-[12px] font-general font-light leading-[1.3] uppercase tracking-[0.12em]">
                        {item.project}
                      </p>

                      <div className="md:hidden col-span-1 text-[10px] font-general font-light uppercase tracking-[0.12em] text-white/55 mt-2">
                        Context
                      </div>
                      <p className="md:hidden col-span-1 text-xs md:text-[11px] font-general font-light uppercase tracking-[0.12em] text-white/72">
                        {item.context}
                      </p>

                      <p className="hidden md:block text-xs md:text-[11px] font-general font-light uppercase tracking-[0.12em] text-white/78">
                        {item.role}
                      </p>
                      <p className="hidden md:block text-xs md:text-[11px] font-general font-light uppercase tracking-[0.12em] text-white/72">
                        {item.context}
                      </p>

                      <div className="md:hidden col-span-1 text-[10px] font-general font-light uppercase tracking-[0.12em] text-white/55 mt-2">
                        Date
                      </div>
                      <p className="col-span-1 text-xs md:text-[11px] font-general font-light uppercase tracking-[0.12em] text-white/80 md:text-right">
                        {item.date}
                      </p>
                    </div>
                  );
                  })()}
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
