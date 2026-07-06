"use client";

import { ArrowRight } from "lucide-react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSimpleRouteReady } from "@/hooks/useSimpleRouteReady";
import BackButton from "@/components/ui/BackButton";

const ACCENT = "text-[#d7ff6a]";
const ACCENT_BG = "bg-[#d7ff6a]";

const JOURNEY = [
  {
    tool: "epiCRealism SD1.5",
    result: "Partial success",
    status: "partial",
    detail:
      "Good base image quality. Failed on hands (extra fingers, deformed grip) and eyes. Label reproduced from training data, not from reference images — incorrect colors.",
  },
  {
    tool: "UNO Flux",
    result: "Hardware crash",
    status: "fail",
    detail:
      "Required ~24GB VRAM. Access violation crash on RTX 3050 Ti 4GB. Model never ran. Confirmed that Flux-based approaches are blocked by the hardware constraint.",
  },
  {
    tool: "IPAdapter SD1.5",
    result: "Label destroyed",
    status: "fail",
    detail:
      'The model melted the label design — text became illegible gibberish ("PHDLLEN"). Confirmed that no open-source method based on image reference can reproduce brand text faithfully.',
  },
  {
    tool: "Flux fp8 (pure text-to-image)",
    result: "Best skin/face quality",
    status: "partial",
    detail:
      "Best photorealistic skin and face of all open-source attempts. Hands still failed. No reference image input — label invented from training data, wrong in every generation.",
  },
  {
    tool: "IPAdapter-Flux + hand LoRA",
    result: "Incompatibility error",
    status: "fail",
    detail:
      "ComfyUI 0.27 version incompatibility. IPAdapter-Flux node failed to load. Hand LoRA never executed. Combination never ran.",
  },
  {
    tool: "Gemini 3.1 Flash Image",
    result: "Winner",
    status: "win",
    detail:
      "Perfect label fidelity, hyperrealistic person, correct proportions. Sequential Grounding architecture eliminated paste artifacts. Etiqueta plana as sole reference was the key unlock.",
  },
];

const INSIGHTS = [
  {
    n: "01",
    title: "Generate variations, don't chase one-shot perfection",
    body: "Generating 2–3 variants and selecting the best is more reliable than iterating a single prompt to perfection. The model's non-determinism is a feature, not a bug.",
  },
  {
    n: "02",
    title: "Fine label text is probabilistically inconsistent",
    body: "Small print (ABV, ingredients) will vary between generations. The logo and main artwork are stable. Communicate this to the user with a UI disclaimer.",
  },
  {
    n: "03",
    title: "Nighttime point-light scenes are the hardest edge case",
    body: "Harsh single-source lighting (fire, lamp) makes can integration harder. Diffuse light (overcast, interior ambient) is much more forgiving and gives better results.",
  },
  {
    n: "04",
    title: "2K sometimes wins over 4K on label text fidelity",
    body: "4K output doesn't always mean better label accuracy — the model allocates tokens differently. 2K can render brand text more accurately than 4K in some generations.",
  },
  {
    n: "05",
    title: "Flat label art as reference was the architectural unlock",
    body: "3D product photos caused paste artifacts. The 2D label artwork couldn't be 'pasted' as a can — the model was forced to render the label design on a freshly generated 3D object.",
  },
];

export default function Task1Overview() {
  useSimpleRouteReady();
  const { push } = useTransitionRouter();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 px-[5%] max-w-[1900px] mx-auto">
        <BackButton href="/monks" />
        <div className="mt-10 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-3">
            Task 1 · Campo Alegre
          </p>
          <h1 className="font-anton text-display text-white leading-none mb-4">
            Lifestyle Image<br />Generator
          </h1>
          <p className="text-white/50 text-[16px] leading-relaxed">
            Building a photorealistic lifestyle generator for a craft beer brand
          </p>
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── The Challenge ───────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <div className="grid lg:grid-cols-[260px_1fr] gap-10">
          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-2">The Challenge</p>
            <h2 className="font-anton text-headline text-white leading-none">
              The paste<br />artifact
            </h2>
          </div>
          <div className="space-y-4 text-white/55 text-[14px] leading-relaxed max-w-2xl">
            <p>
              Generate photorealistic lifestyle images of Campo Alegre craft beer cans with
              exact label fidelity across multiple scene types — open-source first, then
              closed-source if needed.
            </p>
            <p>
              The core problem: when you give an image generation model a product photo plus a
              scene prompt in a single pass, the model composites the product image onto the
              scene background. The result is a can with studio lighting dropped into a natural
              scene — visually incoherent, obviously fake.
            </p>
            <div className="mt-2 space-y-2">
              {[
                "Can with studio softbox light in a nighttime outdoor scene",
                "Scale 2× larger than a real hand",
                "No contact shadow, no ambient color reflection on metal",
                "Collage appearance — not a photograph",
              ].map((issue) => (
                <div key={issue} className="flex items-start gap-2 text-[12px] text-white/40">
                  <span className="text-red-400/60 mt-0.5 shrink-0">✕</span>
                  {issue}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── The Journey ─────────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-10">The Journey</p>
        <div className="space-y-3 max-w-3xl">
          {JOURNEY.map((item) => (
            <div
              key={item.tool}
              className={`rounded-sm border p-5 ${
                item.status === "win"
                  ? "border-[#d7ff6a]/25 bg-[#d7ff6a]/[0.04]"
                  : item.status === "partial"
                  ? "border-amber-400/20 bg-amber-400/[0.03]"
                  : "border-white/[0.07] bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <p
                  className={`text-[13px] font-medium ${
                    item.status === "win"
                      ? "text-[#d7ff6a]"
                      : item.status === "partial"
                      ? "text-amber-400"
                      : "text-white/60"
                  }`}
                >
                  {item.tool}
                </p>
                <span
                  className={`shrink-0 text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-sm font-medium ${
                    item.status === "win"
                      ? "bg-[#d7ff6a]/15 text-[#d7ff6a]"
                      : item.status === "partial"
                      ? "bg-amber-400/10 text-amber-400"
                      : "bg-white/[0.06] text-white/35"
                  }`}
                >
                  {item.result}
                </span>
              </div>
              <p className="text-white/45 text-[12px] leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── Architecture ────────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-10">
          The Architecture — Sequential Grounding
        </p>

        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          {[
            {
              n: "Pass 1",
              title: "generateScene()",
              label: "The canvas",
              color: "#d7ff6a",
              body: "Text-only prompt → lifestyle scene without any product. The person's hand is posed ready to hold something. Output: 1K image used as the base for Pass 2.",
            },
            {
              n: "Pass 2 ×3",
              title: "installProduct()",
              label: "Identity Locking",
              color: "#22B4D6",
              body: 'Scene image + flat label artwork as "Image 1" (canonical source). The model reads the label design and renders a new 3D can integrated into the scene. Runs 3× in parallel.',
            },
            {
              n: "QA ×3",
              title: "runQa()",
              label: "Verification",
              color: "#E08A3C",
              body: "gemini-2.5-flash compares the reference label vs each generated image. Returns { consistent, score 0–100, discrepancies[] }. Each variant gets its own score.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="rounded-sm border border-white/[0.08] bg-white/[0.02] p-5"
              style={{ borderTopColor: step.color, borderTopWidth: "2px" }}
            >
              <p className="font-anton text-[1.6rem] leading-none mb-1" style={{ color: step.color }}>
                {step.n}
              </p>
              <p className="text-white text-[13px] font-medium mb-0.5">{step.title}</p>
              <p className="text-white/30 text-[10px] uppercase tracking-[0.12em] mb-3">{step.label}</p>
              <p className="text-white/50 text-[12px] leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-sm border border-[#d7ff6a]/20 bg-[#d7ff6a]/[0.03] p-5 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#d7ff6a] mb-2">Key insight</p>
          <p className="text-white/65 text-[13px] leading-relaxed">
            Using the flat label artwork (not 3D product photos) as the reference was the
            architectural unlock. A 2D design sheet cannot be &quot;pasted&quot; as a can — the model is
            forced to read the design and render a new 3D object that integrates with the scene.
          </p>
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── Key Insights ────────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-10">Key Insights</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INSIGHTS.map((item) => (
            <div key={item.n} className="rounded-sm border border-white/[0.08] bg-white/[0.02] p-5">
              <span className={`font-anton text-[1.6rem] leading-none ${ACCENT} block mb-3`}>
                {item.n}
              </span>
              <h3 className="text-white text-[13px] font-medium mb-2">{item.title}</h3>
              <p className="text-white/40 text-[11px] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <div className="rounded-sm border border-[#d7ff6a]/20 bg-[#d7ff6a]/[0.04] p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-2">Try it</p>
            <h2 className="font-anton text-[1.8rem] text-white leading-none mb-2">
              Generate your lifestyle shot
            </h2>
            <p className="text-white/45 text-[12px]">
              Pick a beer, describe the scene, get 3 variants in ~90 seconds.
            </p>
          </div>
          <button
            onClick={() => push("/monks/task-1")}
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
