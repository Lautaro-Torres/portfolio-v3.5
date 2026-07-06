"use client";

import { ArrowRight, Layers, Sparkles } from "lucide-react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSimpleRouteReady } from "@/hooks/useSimpleRouteReady";

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
    overviewLabel: "Project overview →",
    icon: Sparkles,
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
    overviewLabel: "How we built this →",
    icon: Layers,
  },
  {
    id: "task-2",
    label: "Task 2",
    title: "BMW M4 Competition",
    description:
      "3-layer controlled pipeline for automotive lifestyle generation. Product identity locked with 26 reference photos, style locked with the BMW Neue Klasse moodboard.",
    meta: "3-layer pipeline · 26 refs · QA loop",
    href: "/lifestyle-generator",
    overviewHref: "/monks/task-2/overview",
    overviewLabel: "How we built this →",
    icon: Layers,
  },
  {
    id: "task-3",
    label: "Task 3",
    title: "Style Transfer",
    description:
      "Extract a visual moodboard and apply it to generation workflows. The BMW Neue Klasse style JSON feeds image, video and music generators.",
    meta: "Style JSON · Image-to-image · Multi-modal",
    href: "/monks/task-3",
    overviewHref: "/monks/task-3/overview",
    overviewLabel: "How we built this →",
    icon: Layers,
  },
];

function Card({ card, onNavigate }) {
  const Icon = card.icon;

  return (
    <div className="group flex flex-col rounded-sm border border-white/[0.08] bg-white/[0.02] hover:border-[#d7ff6a]/25 hover:bg-white/[0.035] transition-all duration-200">
      {/* Clickable main body */}
      <button
        className="flex flex-col flex-1 p-6 text-left"
        onClick={() => onNavigate(card.href)}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icon size={14} className={ACCENT} />
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/40">
              {card.label}
            </span>
          </div>
          <ArrowRight
            size={16}
            className="text-white/30 group-hover:text-[#d7ff6a] group-hover:translate-x-0.5 transition-all"
          />
        </div>

        <h2 className="font-anton text-[1.5rem] leading-none mb-3 text-white">
          {card.title}
        </h2>

        <p className="text-[12px] leading-relaxed flex-1 text-white/50">
          {card.description}
        </p>
      </button>

      {/* Footer: meta + secondary link */}
      <div className="px-6 pb-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <p className="text-[10px] uppercase tracking-[0.12em] text-white/30 truncate">
          {card.meta}
        </p>
        {card.overviewHref ? (
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate(card.overviewHref); }}
            className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-white/30 hover:text-[#d7ff6a] transition-colors whitespace-nowrap"
          >
            {card.overviewLabel}
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate(card.href); }}
            className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-white/30 hover:text-[#d7ff6a] transition-colors whitespace-nowrap"
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
