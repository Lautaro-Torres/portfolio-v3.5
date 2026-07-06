"use client";

import { ArrowRight, Layers, Sparkles } from "lucide-react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSimpleRouteReady } from "@/hooks/useSimpleRouteReady";
import { showcaseSrc } from "@/components/ui/ShowcaseGallery";

const ACCENT = "text-[#d7ff6a]";
const ACCENT_BG = "bg-[#d7ff6a]";
const ACCENT_BORDER = "border-[#d7ff6a]/25";

const CARDS = [
  {
    id: "overview",
    label: "Overview",
    title: "Project Overview",
    description:
      "A 5-day sprint to build three AI generation systems from scratch. Identity and style locked by architecture; scene is the only variable the user controls.",
    meta: "Gemini · Nano Banana · Nano Banana Pro",
    href: "/monks/overview",
    overviewHref: null,
    ctaLabel: "View overview",
    overviewLabel: "How we built this",
    icon: Sparkles,
    preview: showcaseSrc("task1-showcase", "pale-216811.png"),
    previewPosition: "object-[center_35%]",
  },
  {
    id: "task-1",
    label: "Task 1",
    title: "Campo Alegre",
    description:
      "Lifestyle image generator for a craft beer brand. Sequential Grounding architecture eliminates paste artifacts. 3 products, 3 variants per generation, automatic QA.",
    meta: "3 products · Sequential Grounding · QA loop",
    href: "/monks/task-1",
    overviewHref: "/monks/task-1/overview",
    ctaLabel: "Try the app",
    overviewLabel: "How we built this",
    icon: Layers,
    preview: showcaseSrc("task1-showcase", "pale-113216.png"),
    previewPosition: "object-center",
  },
  {
    id: "task-2",
    label: "Task 2",
    title: "BMW M4 Competition",
    description:
      "3-layer controlled pipeline for automotive lifestyle generation. Product identity locked with 26 reference photos, style locked with the BMW moodboard.",
    meta: "3-layer pipeline · 26 refs · QA loop",
    href: "/lifestyle-generator",
    overviewHref: "/monks/task-2/overview",
    ctaLabel: "Try the app",
    overviewLabel: "How we built this",
    icon: Layers,
    preview: showcaseSrc("task2-showcase", "urban-night (2).png"),
    previewPosition: "object-center",
  },
  {
    id: "task-3",
    label: "Task 3",
    title: "Style Transfer",
    description:
      "Extract a visual moodboard and apply it to generation workflows. The BMW style JSON feeds image, video and music generators.",
    meta: "Style JSON · Image-to-image · Multi-modal",
    href: "/monks/task-3",
    overviewHref: "/monks/task-3/overview",
    ctaLabel: "Try the app",
    overviewLabel: "How we built this",
    icon: Layers,
    preview: "/assets/task3-showcase/bmw-styled.png",
    previewPosition: "object-center",
  },
];

function Card({ card, onNavigate }) {
  const Icon = card.icon;

  return (
    <div className="group flex flex-col rounded-sm border border-white/[0.08] bg-white/[0.02] hover:border-[#d7ff6a]/25 hover:bg-white/[0.035] transition-all duration-200 overflow-hidden">
      {card.preview && (
        <div className="relative aspect-[4/3] overflow-hidden bg-black/40 shrink-0">
          <img
            src={card.preview}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover ${card.previewPosition ?? "object-center"} group-hover:scale-[1.03] transition-transform duration-500`}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-[#0a0a0a]/10 to-transparent" />
        </div>
      )}

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon size={14} className={ACCENT} />
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/40">
            {card.label}
          </span>
        </div>

        <h2 className="font-anton text-[1.5rem] leading-none mb-3 text-white">
          {card.title}
        </h2>

        <p className="text-[12px] leading-relaxed flex-1 text-white/50 mb-4">
          {card.description}
        </p>

        <p className="text-[10px] uppercase tracking-[0.12em] text-white/30">
          {card.meta}
        </p>
      </div>

      <div className="px-6 pb-5 pt-4 border-t border-white/[0.06] flex flex-col gap-2">
        <button
          onClick={() => onNavigate(card.href)}
          className={`w-full inline-flex items-center justify-center gap-2 ${ACCENT_BG} text-black text-[10px] uppercase tracking-[0.14em] font-medium px-4 py-2.5 rounded-sm hover:opacity-90 transition-opacity`}
        >
          {card.ctaLabel}
          <ArrowRight size={12} />
        </button>
        {card.overviewHref && (
          <button
            onClick={() => onNavigate(card.overviewHref)}
            className="w-full inline-flex items-center justify-center border border-white/[0.14] bg-white/[0.02] text-white/55 text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 rounded-sm hover:border-white/25 hover:text-white/80 hover:bg-white/[0.04] transition-colors"
          >
            {card.overviewLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MonksHub() {
  useSimpleRouteReady();
  const { push } = useTransitionRouter();

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-[1900px] mx-auto px-[5%]">
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-2">
            Portfolio · Case study
          </p>
          <h1 className="font-anton text-display text-white leading-none mb-4">Monks</h1>
          <p className="text-white/50 text-[13px] leading-relaxed max-w-xl">
            Three AI generation systems built in a 5-day sprint. Identity and style locked by
            architecture, not by prompt complexity. Scene is the only variable the user controls.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CARDS.map((card) => (
            <Card key={card.id} card={card} onNavigate={push} />
          ))}
        </div>
      </div>
    </main>
  );
}
