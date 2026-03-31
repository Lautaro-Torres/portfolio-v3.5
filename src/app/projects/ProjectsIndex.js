"use client";
import { projectsData } from "../../data/projects";
import { getProjectCardVideoUrl } from "../../utils/projectUtils";
import WorkCard from "../../components/ui/WorkCard.js";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { markRouteReady, normalizeRoutePath } from "../../utils/routeReadyGate";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useClippedTitleReveal } from "../../hooks/useClippedTitleReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

/** Same breakpoint as Tailwind `md:` — must match grid visibility classes. */
const MD_UP = "(min-width: 768px)";
const MD_DOWN = "(max-width: 767px)";

const SCROLLER = "#smooth-wrapper";

function refreshSmootherLayout() {
  ScrollTrigger.refresh();
  const smoother = ScrollSmoother.get();
  if (smoother && typeof smoother.refresh === "function") {
    smoother.refresh();
  }
}

export default function ProjectsIndex() {
  const pathname = usePathname();
  const pageRef = useRef(null);
  const titleRef = useClippedTitleReveal();
  const desktopGridRef = useRef(null);
  const mobileGridRef = useRef(null);

  useEffect(() => {
    if (normalizeRoutePath(pathname) !== "/projects") return;
    const root = pageRef.current;
    if (!root) return;
    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      markRouteReady("/projects");
      // Una vez que consideramos la ruta lista, refrescamos el layout del smoother/ScrollTrigger
      // sólo una vez para evitar recalcular alturas en cada pequeño cambio de las cards.
      requestAnimationFrame(() => {
        refreshSmootherLayout();
      });
    };
    const imgs = Array.from(root.querySelectorAll("img"));
    const videos = Array.from(root.querySelectorAll("video"));
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
    videos.forEach((v) => {
      if (v.readyState >= 2) return;
      pending.push(
        new Promise((resolve) => {
          v.addEventListener("loadeddata", resolve, { once: true });
          v.addEventListener("error", resolve, { once: true });
        })
      );
    });
    if (pending.length === 0) {
      requestAnimationFrame(() => requestAnimationFrame(fire));
    } else {
      Promise.all(pending).finally(() => requestAnimationFrame(fire));
    }
    const t = setTimeout(fire, 16000);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Only register triggers for the grid that is actually visible (display:none breaks ST / ScrollSmoother refresh).
    mm.add(MD_UP, () => {
      const grid = desktopGridRef.current;
      if (!grid) return;
      const cards = grid.querySelectorAll(".work-card-wrapper");
      if (!cards.length) return;
      gsap.set(cards, { y: 44, opacity: 0 });
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.11,
        ease: "power2.out",
        scrollTrigger: {
          trigger: grid,
          scroller: SCROLLER,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
          invalidateOnRefresh: true,
        },
      });
    });

    mm.add(MD_DOWN, () => {
      const grid = mobileGridRef.current;
      if (!grid) return;
      const cards = grid.querySelectorAll(".work-card-wrapper");
      if (!cards.length) return;
      gsap.set(cards, { y: 44, opacity: 0 });
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.11,
        ease: "power2.out",
        scrollTrigger: {
          trigger: grid,
          /* Sin ScrollSmoother el scroll es el viewport; #smooth-wrapper no es scroller. */
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
          invalidateOnRefresh: true,
        },
      });
    });

    const refreshAfterMatchMedia = requestAnimationFrame(() => {
      refreshSmootherLayout();
    });

    return () => {
      mm.revert();
      cancelAnimationFrame(refreshAfterMatchMedia);
      requestAnimationFrame(refreshSmootherLayout);
    };
  }, []);

  // Create both desktop and mobile layouts
  const createDesktopRows = () => {
    const rows = [];
    let i = 0;
    let index = 0;

    while (index < projectsData.length) {
      const remainingItems = projectsData.length - index;
      // Nuevo patrón: solo 2 y 3 columnas (nunca 4)
      const defaultCols = [2, 3][i % 2];
      
      // Exception 1: If only 1 project left → full-width
      if (remainingItems === 1) {
        const slice = projectsData.slice(index, index + 1);
        rows.push({ cols: 1, items: slice, isFullWidth: true });
        index += 1;
        break;
      }
      
      // Exception 2: Avoid consecutive rows of 2
      const currentRowWouldBe2 = defaultCols === 2;
      const lastRowWas2 = rows.length > 0 && rows[rows.length - 1].cols === 2;
      
      if (currentRowWouldBe2 && lastRowWas2) {
        if (remainingItems >= 3) {
          const slice = projectsData.slice(index, index + 3);
          rows.push({ cols: 3, items: slice, isFullWidth: false });
          index += 3;
        } else if (remainingItems === 2) {
          const slice = projectsData.slice(index, index + 2);
          rows.push({ cols: 2, items: slice, isFullWidth: false });
          index += 2;
        }
      } else {
        const actualCols = Math.min(defaultCols, remainingItems);
        const slice = projectsData.slice(index, index + actualCols);
        
        rows.push({ cols: actualCols, items: slice, isFullWidth: false });
        index += actualCols;
      }
      
      i++;
    }
    return rows;
  };

  // Create mobile-specific rows with rhythmic pattern
  const createMobileRows = () => {
    const rows = [];
    let index = 0;
    let rowIndex = 0;

    while (index < projectsData.length) {
      const remainingItems = projectsData.length - index;
      const isOddRow = rowIndex % 2 === 0; // 0, 2, 4... are odd rows (1st, 3rd, 5th...)
      
      if (isOddRow) {
        // Odd rows (1st, 3rd, 5th...): single card spanning both columns
        const slice = projectsData.slice(index, index + 1);
        rows.push({ cols: 1, items: slice, isFullWidth: true, isMobile: true });
        index += 1;
      } else {
        // Even rows (2nd, 4th, 6th...): try to place 2 cards
        if (remainingItems >= 2) {
          // Normal case: 2 cards in 2 columns
          const slice = projectsData.slice(index, index + 2);
          rows.push({ cols: 2, items: slice, isFullWidth: false, isMobile: true });
          index += 2;
        } else if (remainingItems === 1) {
          // Last item on even row: span both columns
          const slice = projectsData.slice(index, index + 1);
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

  return (
    <div ref={pageRef} className="min-h-screen text-white" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Main Content */}
      <main className="relative w-full pt-20 md:pt-24">
        <div className="w-full max-w-[1900px] mx-auto px-[5%]">
        {/* Page Title */}
        <div className="relative z-10 pb-5 md:pb-10">
          <h1
            ref={titleRef}
            className="font-anton text-white uppercase leading-[0.84] tracking-[0.01em] font-normal text-[clamp(3.1rem,14vw,17rem)]"
          >
            Projects
          </h1>
        </div>

        {/* Desktop Grid */}
        <div ref={desktopGridRef} className="w-full hidden md:block">
          <div className="flex flex-col gap-y-6">
            {desktopRows.map((row, rowIdx) => {
              // Altura uniforme para todas las tarjetas de escritorio (un poco más altas), con mínimo cómodo en pantallas bajas
              const rowHeight = "h-[70vh] min-h-[320px]";
              
              const getGridClass = (cols, isFullWidth) => {
                if (isFullWidth) return 'grid gap-4 grid-cols-1';
                switch (cols) {
                  case 2: return 'grid gap-4 grid-cols-2';
                  case 3: return 'grid gap-4 grid-cols-3';
                  default: return 'grid gap-4 grid-cols-1';
                }
              };
              
              return (
                <div
                  key={rowIdx}
                  className={getGridClass(row.cols, row.isFullWidth)}
                >
                  {row.items.map((project) => (
                    <div key={project.id} className={`work-card-wrapper ${rowHeight}`}>
                      <WorkCard
                        title={project.title}
                        videoUrl={getProjectCardVideoUrl(project)}
                        posterUrl={project.imageUrl}
                        logoUrl={project.logoUrl}
                        tags={project.tags}
                        href={`/projects/${project.slug}`}
                        containerClassName="h-full"
                        isFullWidthCard={row.isFullWidth}
                        ariaLabel={`View details for ${project.title}`}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Grid */}
        <div ref={mobileGridRef} className="w-full block md:hidden -mt-1">
          <div className="flex flex-col gap-y-3 md:gap-y-6">
            {mobileRows.map((row, rowIdx) => {
              // Altura uniforme en mobile: suficiente para ver título + primera card en el mismo viewport.
              const rowHeight = "h-[44vh] min-h-[240px]";
              
              const getGridClass = (cols, isFullWidth) => {
                if (isFullWidth) return 'grid gap-2 md:gap-4 grid-cols-1';
                return 'grid gap-2 md:gap-4 grid-cols-2';
              };
              
              return (
                <div
                  key={`mobile-${rowIdx}`}
                  className={getGridClass(row.cols, row.isFullWidth)}
                >
                  {row.items.map((project) => (
                    <div key={project.id} className={`work-card-wrapper ${rowHeight}`}>
                      <WorkCard
                        title={project.title}
                        videoUrl={getProjectCardVideoUrl(project)}
                        posterUrl={project.imageUrl}
                        logoUrl={project.logoUrl}
                        tags={project.tags}
                        href={`/projects/${project.slug}`}
                        containerClassName="h-full"
                        isFullWidthCard={row.isFullWidth}
                        ariaLabel={`View details for ${project.title}`}
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
