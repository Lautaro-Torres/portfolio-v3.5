"use client";
import { experimentsData } from "../../data/experiments";
import WorkCard from "../../components/ui/WorkCard";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLetterReveal } from "../../hooks/useLetterReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EXPERIMENTS_ENABLED = false;

export default function ExperimentsIndex() {
  const pageRef = useRef(null);
  const titleRef = useLetterReveal();
  const countRef = useRef(null);
  const descriptionRef = useRef(null);
  const desktopGridRef = useRef(null);
  const mobileGridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate count
      if (countRef.current) {
        gsap.set(countRef.current, { x: 20, opacity: 0 });
        gsap.to(countRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: countRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }

      // Animate description
      if (descriptionRef.current) {
        gsap.set(descriptionRef.current, { y: 30, opacity: 0 });
        gsap.to(descriptionRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }

      // Animate desktop grid cards
      if (desktopGridRef.current) {
        const cards = desktopGridRef.current.querySelectorAll(".work-card-wrapper");
        if (cards.length > 0) {
          gsap.set(cards, { y: 60, opacity: 0 });
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: desktopGridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      // Animate mobile grid cards
      if (mobileGridRef.current) {
        const cards = mobileGridRef.current.querySelectorAll(".work-card-wrapper");
        if (cards.length > 0) {
          gsap.set(cards, { y: 60, opacity: 0 });
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: mobileGridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        }
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // MISMA LÓGICA QUE PROJECTS (pero con experimentsData)
  const createDesktopRows = () => {
    const rows = [];
    let i = 0;
    let index = 0;

    while (index < experimentsData.length) {
      const remainingItems = experimentsData.length - index;
      // Solo 2 y 3 columnas (nunca 4)
      const defaultCols = [2, 3][i % 2];

      // Exception 1: si queda solo 1 → full-width
      if (remainingItems === 1) {
        const slice = experimentsData.slice(index, index + 1);
        rows.push({ cols: 1, items: slice, isFullWidth: true });
        index += 1;
        break;
      }

      // Exception 2: evitar dos filas seguidas de 2 columnas
      const currentRowWouldBe2 = defaultCols === 2;
      const lastRowWas2 =
        rows.length > 0 && rows[rows.length - 1].cols === 2;

      if (currentRowWouldBe2 && lastRowWas2) {
        if (remainingItems >= 3) {
          const slice = experimentsData.slice(index, index + 3);
          rows.push({ cols: 3, items: slice, isFullWidth: false });
          index += 3;
        } else if (remainingItems === 2) {
          const slice = experimentsData.slice(index, index + 2);
          rows.push({ cols: 2, items: slice, isFullWidth: false });
          index += 2;
        }
      } else {
        const actualCols = Math.min(defaultCols, remainingItems);
        const slice = experimentsData.slice(index, index + actualCols);

        rows.push({ cols: actualCols, items: slice, isFullWidth: false });
        index += actualCols;
      }

      i++;
    }
    return rows;
  };

  // MISMA LÓGICA MOBILE QUE PROJECTS
  const createMobileRows = () => {
    const rows = [];
    let index = 0;
    let rowIndex = 0;

    while (index < experimentsData.length) {
      const remainingItems = experimentsData.length - index;
      const isOddRow = rowIndex % 2 === 0; // 0, 2, 4... → 1ra, 3ra, 5ta fila

      if (isOddRow) {
        // Filas impares: 1 card full-width
        const slice = experimentsData.slice(index, index + 1);
        rows.push({ cols: 1, items: slice, isFullWidth: true, isMobile: true });
        index += 1;
      } else {
        // Filas pares: intentamos 2 cards
        if (remainingItems >= 2) {
          const slice = experimentsData.slice(index, index + 2);
          rows.push({ cols: 2, items: slice, isFullWidth: false, isMobile: true });
          index += 2;
        } else if (remainingItems === 1) {
          const slice = experimentsData.slice(index, index + 1);
          rows.push({ cols: 1, items: slice, isFullWidth: true, isMobile: true });
          index += 1;
        }
      }
      rowIndex++;
    }
    return rows;
  };

  const desktopRows = createDesktopRows();
  const mobileRows = createMobileRows();

  if (!EXPERIMENTS_ENABLED) {
    return null;
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen text-white"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Main Content */}
      <main className="relative w-full pt-20">
        <div className="w-full max-w-[1900px] mx-auto px-[5%]">
          {/* Page Title */}
          <div className="py-12 mb-0 flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
            <h1
              ref={titleRef}
              className="font-montreal text-white uppercase leading-[0.9] tracking-[0.04em] font-normal text-[clamp(2.5rem,7.5vw,6rem)]"
            >
              Experiments
            </h1>
            <div ref={countRef} className="text-left sm:text-right">
              <span className="text-lg md:text-xl font-montreal text-white/70 uppercase tracking-[0.08em]">
                №{experimentsData.length}↘
              </span>
            </div>
          </div>

          {/* Description */}
          <div ref={descriptionRef} className="w-full mb-8">
            <p className="text-white/80 text-lg md:text-xl font-montreal max-w-2xl">
              Experimental works merging creativity and technology.
            </p>
          </div>

          {/* Desktop Grid */}
          <div ref={desktopGridRef} className="w-full hidden md:block">
            <div className="flex flex-col gap-y-6">
              {desktopRows.map((row, rowIdx) => {
                const rowHeight = "min-h-[260px] md:min-h-[40vh]";

                const getGridClass = (cols, isFullWidth) => {
                  if (isFullWidth) return "grid gap-4 grid-cols-1";
                  switch (cols) {
                    case 2:
                      return "grid gap-4 grid-cols-2";
                    case 3:
                      return "grid gap-4 grid-cols-3";
                    default:
                      return "grid gap-4 grid-cols-1";
                  }
                };

                return (
                  <div
                    key={rowIdx}
                    className={getGridClass(row.cols, row.isFullWidth)}
                  >
                    {row.items.map((experiment) => (
                      <div key={experiment.id} className="work-card-wrapper">
                        <WorkCard
                          title={experiment.title}
                          imageUrl={experiment.imageUrl}
                          logoUrl={experiment.logoUrl}
                          tags={experiment.tags}
                          href={`/experiments/${experiment.slug}`}
                          containerClassName={rowHeight}
                          ariaLabel={`View details for ${experiment.title}`}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Grid */}
          <div ref={mobileGridRef} className="w-full block md:hidden">
            <div className="flex flex-col gap-y-3 md:gap-y-6">
              {mobileRows.map((row, rowIdx) => {
                const rowHeight = "min-h-[220px]";

                const getGridClass = (cols, isFullWidth) => {
                  if (isFullWidth)
                    return "grid gap-2 md:gap-4 grid-cols-1";
                  return "grid gap-2 md:gap-4 grid-cols-2";
                };

                return (
                  <div
                    key={`mobile-${rowIdx}`}
                    className={getGridClass(row.cols, row.isFullWidth)}
                  >
                    {row.items.map((experiment) => (
                      <div key={experiment.id} className="work-card-wrapper">
                        <WorkCard
                          title={experiment.title}
                          imageUrl={experiment.imageUrl}
                          logoUrl={experiment.logoUrl}
                          tags={experiment.tags}
                          href={`/experiments/${experiment.slug}`}
                          containerClassName={rowHeight}
                          ariaLabel={`View details for ${experiment.title}`}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
