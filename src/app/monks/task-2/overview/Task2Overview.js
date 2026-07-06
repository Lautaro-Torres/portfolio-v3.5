"use client";

import { ArrowRight, Layers, Lock, Eye } from "lucide-react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSimpleRouteReady } from "@/hooks/useSimpleRouteReady";
import BackButton from "@/components/ui/BackButton";

const ACCENT = "text-[#d7ff6a]";
const ACCENT_BG = "bg-[#d7ff6a]";

const LAYERS = [
  {
    n: "Layer 1",
    title: "Product Identity",
    badge: "Locked",
    icon: Lock,
    color: "#d7ff6a",
    items: [
      "26 multi-angle reference photos of the BMW M4 Competition",
      "gemini-3.1-flash-image — supports 10+ reference objects (Pro only supports 6)",
      "References cover: front, 3/4, side, rear, interior, wheel, badge close-ups",
      "Close-up shots of distinctive elements (kidney grille, M badge) as a drift fallback",
    ],
  },
  {
    n: "Layer 2",
    title: "Style Direction",
    badge: "Locked",
    icon: Eye,
    color: "#22B4D6",
    items: [
      "BMW Neue Klasse moodboard — same creative direction as Task 3",
      "Golden hour, warm film grade, human + product in frame",
      "Not cold studio luxury — warm, cinematic, effortless",
      "Shared universe: Task 2 and Task 3 draw from the same visual language",
    ],
  },
  {
    n: "Layer 3",
    title: "Scene",
    badge: "Variable",
    icon: Layers,
    color: "#E08A3C",
    items: [
      "Free text input from the user",
      "Any location, lighting condition, human presence",
      "The only variable in the pipeline — everything else is locked",
    ],
  },
];

const DECISIONS = [
  {
    title: "No LoRA for Task 2",
    body: "LoRA / ComfyUI was documented in Task 1 as the 'precise path' for truly locked product identity. Task 2 deliberately stays fully closed-source to show what's achievable without local training.",
  },
  {
    title: "Flash, not Pro, for 10+ references",
    body: "gemini-3.1-flash-image supports more than 10 reference objects; Pro is limited to 6. For 26 reference images, Flash was not a compromise — it was the correct choice.",
  },
  {
    title: "Drift fallback: close-up elements",
    body: "When the model drifts on the main body shape, close-up references of distinctive elements (kidney grille, M Competition badge) are added as a separate emphasis block with higher weight.",
  },
  {
    title: "Shared creative direction with Task 3",
    body: "The BMW moodboard analysis done in Task 3 feeds directly into Task 2's style layer. The same visual language governs both tasks — a unified BMW creative system.",
  },
];

export default function Task2Overview() {
  useSimpleRouteReady();
  const { push } = useTransitionRouter();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 px-[5%] max-w-[1900px] mx-auto">
        <BackButton href="/monks" />
        <div className="mt-10 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-3">
            Task 2 · BMW M4 Competition
          </p>
          <h1 className="font-anton text-display text-white leading-none mb-4">
            Product<br />Consistency
          </h1>
          <p className="text-white/50 text-[16px] leading-relaxed">
            A 3-layer controlled pipeline for automotive lifestyle generation
          </p>
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── The Brief ───────────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <div className="grid lg:grid-cols-[260px_1fr] gap-10">
          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-2">The Brief</p>
            <h2 className="font-anton text-headline text-white leading-none">
              Closed-source<br />only
            </h2>
          </div>
          <div className="space-y-4 text-white/55 text-[14px] leading-relaxed max-w-2xl">
            <p>
              Keep the BMW M4 Competition visually consistent across lifestyle images with humans
              in varied environments. Fully closed-source. No local training, no ComfyUI, no LoRA.
            </p>
            <p>
              Three questions to answer: detailed description of the process, what to do if the
              model doesn't know the product natively, and the closed-source solution.
            </p>
            <div className="mt-4 space-y-2">
              {[
                "26 multi-angle reference photos → product identity layer",
                "BMW Neue Klasse moodboard → style layer (shared with Task 3)",
                "Free user input → scene layer (the only variable)",
                "gemini-2.5-flash QA loop → automatic consistency verification",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-[12px] text-[#d7ff6a]/80">
                  <span className="mt-0.5 shrink-0">→</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── Architecture ────────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-10">
          The Architecture — 3-Layer Controlled Pipeline
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {LAYERS.map((layer) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.n}
                className="rounded-sm border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col"
                style={{ borderTopColor: layer.color, borderTopWidth: "2px" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-anton text-[1.4rem] leading-none mb-1" style={{ color: layer.color }}>
                      {layer.n}
                    </p>
                    <p className="text-white text-[14px] font-medium">{layer.title}</p>
                  </div>
                  <span
                    className="text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-sm font-medium"
                    style={{
                      backgroundColor: `${layer.color}15`,
                      color: layer.color,
                    }}
                  >
                    {layer.badge}
                  </span>
                </div>
                <ul className="flex-1 space-y-2">
                  {layer.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[11px] text-white/50">
                      <span className="mt-1 shrink-0 w-1 h-1 rounded-full bg-white/20" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── Key Decisions ───────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-10">Key Decisions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          {DECISIONS.map((d) => (
            <div key={d.title} className="rounded-sm border border-white/[0.08] bg-white/[0.02] p-5">
              <h3 className="text-white text-[13px] font-medium mb-2">{d.title}</h3>
              <p className="text-white/45 text-[11px] leading-relaxed">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── Core Principle ──────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <div className="grid lg:grid-cols-[260px_1fr] gap-10">
          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-2">Core Principle</p>
            <h2 className="font-anton text-headline text-white leading-none">
              Controlled<br />pipeline
            </h2>
          </div>
          <div className="space-y-4 max-w-2xl">
            <p className="text-white/55 text-[14px] leading-relaxed">
              The constraints are intentional. The architecture guarantees product consistency
              without depending on the operator's skill. A trained copywriter, a junior designer,
              or an automated system can use the same pipeline and get the same product fidelity.
            </p>
            <p className="text-white/55 text-[14px] leading-relaxed">
              The system is product-agnostic. Swap the reference dataset and it works for any
              vehicle, any product. The three-layer structure (identity locked, style locked,
              scene variable) is a reusable pattern for any brand with a visual identity to protect.
            </p>
            <div className="mt-4 rounded-sm border border-[#d7ff6a]/20 bg-[#d7ff6a]/[0.03] p-4">
              <p className={`text-[10px] uppercase tracking-[0.14em] ${ACCENT} mb-2`}>
                Product-agnostic
              </p>
              <p className="text-white/55 text-[12px] leading-relaxed">
                Layer 1 (references) → swap dataset for any product.
                Layer 2 (style) → swap moodboard for any brand.
                Layer 3 (scene) → always free. The pattern holds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <div className="rounded-sm border border-[#d7ff6a]/20 bg-[#d7ff6a]/[0.04] p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-2">Try it</p>
            <h2 className="font-anton text-[1.8rem] text-white leading-none mb-2">
              Generate a BMW lifestyle shot
            </h2>
            <p className="text-white/45 text-[12px]">
              Select a scene, choose your mode, and generate a product-consistent lifestyle image.
            </p>
          </div>
          <button
            onClick={() => push("/lifestyle-generator")}
            className={`shrink-0 inline-flex items-center gap-2 ${ACCENT_BG} text-black text-[11px] uppercase tracking-[0.16em] font-medium px-6 py-3 rounded-sm hover:opacity-90 transition-opacity`}
          >
            Try the generator
            <ArrowRight size={13} />
          </button>
        </div>
      </section>

    </main>
  );
}
