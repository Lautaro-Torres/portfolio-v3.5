"use client";

import { useState } from "react";
import { ArrowRight, Music, Video, ImageIcon, Copy, Download, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSimpleRouteReady } from "@/hooks/useSimpleRouteReady";
import BackButton from "@/components/ui/BackButton";
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";
import { styleConfig } from "@/config/lifestyle-style";

const ACCENT = "text-[#d7ff6a]";
const ACCENT_BG = "bg-[#d7ff6a]";

const STYLE_JSON = JSON.stringify(styleConfig, null, 2);

function StyleJsonBlock({ json }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  function handleDownload() {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bmw-moodboard-style.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-white/45 border border-white/[0.1] px-3 py-1.5 rounded-sm hover:border-white/25 hover:text-white/70 transition-colors"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? "Collapse JSON" : "View full JSON"}
        </button>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-white/45 border border-white/[0.1] px-3 py-1.5 rounded-sm hover:border-white/25 hover:text-white/70 transition-colors"
        >
          {copied ? <Check size={12} className="text-[#d7ff6a]" /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-white/45 border border-white/[0.1] px-3 py-1.5 rounded-sm hover:border-white/25 hover:text-white/70 transition-colors"
        >
          <Download size={12} />
          Download
        </button>
      </div>

      <pre
        className={`bg-white/[0.03] border border-white/[0.08] rounded-sm p-5 text-[11px] text-white/70 leading-relaxed overflow-x-auto font-mono transition-all ${
          expanded ? "max-h-[min(70vh,640px)] overflow-y-auto" : "max-h-48 overflow-y-auto"
        }`}
      >
        <code>{json}</code>
      </pre>
    </div>
  );
}

const OUTPUT_CARDS = [
  {
    icon: ImageIcon,
    title: "Static Image",
    subtitle: "Image-to-image style transfer",
    body: "The style JSON feeds the generation prompt directly. The model applies color grade, lighting logic and materiality to the input image while preserving subject and composition.",
    tools: ["Flux Redux / IP-Adapter", "Midjourney --sref", "Gemini image edit"],
    tag: "Built",
    tagStyle: "bg-[#d7ff6a]/15 text-[#d7ff6a]",
  },
  {
    icon: Video,
    title: "Camera Movement",
    subtitle: "Image → video with motion",
    body: "Block the shot in Blender with a clay render (geometry only, no materials) to lock camera movement, lens choice and timing — this is previs, the same technique used across the film industry before committing to a full shot. Export depth and outline control passes from the animated scene. Feed those passes into a video generation model (Wan VACE, Kling, Veo) so the AI-generated footage follows the exact camera motion and composition from the previs, not a random reinterpretation. Final color and edit in Premiere — AI generation replaces the expensive full-CG render, not the edit.",
    tools: ["Wan VACE", "Veo 3.1 (~$0.15–0.40 / 8s)", "Kling"],
    tag: "Planned",
    tagStyle: "bg-white/[0.06] text-white/40",
  },
  {
    icon: Music,
    title: "Music",
    subtitle: "Style JSON → audio brief",
    body: "The music_mapping block is inferred from the visual style system — genre, BPM, instrumentation and energy translated into an audio brief. Organic electronic / cinematic downtempo at 85–100 BPM for hero moments; 70–85 BPM for romantic and reflective passages. Warm analog synths, organic live percussion, round bass — with light acoustic guitar or tape-warmed piano for the archival black & white moments. Avoid aggressive, cold or overtly electronic sounds that contradict the warm-human brand cue.",
    tools: ["Suno", "Udio", "Stable Audio"],
    tag: "Planned",
    tagStyle: "bg-white/[0.06] text-white/40",
  },
];

const NEXT_STEPS = [
  {
    title: "Style fidelity loop",
    body: "A vision model scores alignment between the output and the source moodboard. Score below threshold → regenerate automatically.",
  },
  {
    title: "Real video with Veo 3.1",
    body: "Generate a 8-second golden hour product scene with camera movement. ~$0.25 per clip at current pricing.",
  },
  {
    title: "Real music with Suno/Udio",
    body: "Feed the music_mapping block directly to a music generation API. Cinematic downtempo, 90 BPM, warm analog texture.",
  },
  {
    title: "Upscaling with Magnific",
    body: "2K → 4K+ with Magnific AI's structure-preserving upscaler. Adds film grain, texture detail and micro-contrast.",
  },
];

export default function Task3Overview() {
  useSimpleRouteReady();
  const { push } = useTransitionRouter();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 px-[5%] max-w-[1900px] mx-auto">
        <BackButton href="/monks" />
        <div className="mt-10 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-3">
            Task 3 · Style Transfer
          </p>
          <h1 className="font-anton text-display text-white leading-none mb-4">
            Style Translation
          </h1>
          <p className="text-white/50 text-[16px] leading-relaxed">
            How we translated a visual moodboard into a generation system
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
              Three outputs,<br />one moodboard
            </h2>
          </div>
          <div className="space-y-4 text-white/55 text-[14px] leading-relaxed max-w-2xl">
            <p>
              Analyze the BMW visual moodboard and translate its style into generation
              workflows for three distinct outputs: a photorealistic still image, a shot with camera
              movement, and a music track.
            </p>
            <p>
              The brief required a systematic approach — not just &quot;make it look like BMW,&quot; but extract
              the specific visual logic, encode it as a structured data object, and make that object
              the single source of truth for every generator.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── Moodboard Analysis ──────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-10">
          Moodboard Analysis
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: "Vehicle Reference",
              value: "Three distinct eras, not one silhouette: the concept car (silver-white, minimalist cabin, smooth uninterrupted body lines) as the hero; a current-gen SUV in rain and wet asphalt; a vintage red coupé E30/M3-era in a cream boucle showroom. The style system must hold across all three.",
              color: "#D3A878",
            },
            {
              label: "Color & Film Grade",
              value: "Warm base with cool accent punctuation. Highlights: amber/honey (#D3A878, #EAC9A0). Shadows: teal-leaning (#22B4D6). Accents: pool blue (#2FA5C9), muted green (#9BC4A0), one pop of warm red-orange (#E8481C). Soft contrast — never crushed blacks. A portion of the moodboard is full black & white, grainy archival/candid style — a deliberate treatment for friendship and nostalgia moments, not a lighting failure.",
              color: "#22B4D6",
            },
            {
              label: "Lighting",
              value: "Golden hour preferred — low lateral or backlit, warm rim light, occasional direct sun flares, long soft shadows. Secondary: flat diffuse blue-hour for rain and interior shots. The monochrome archival passages use harder contrast and grain.",
              color: "#E08A3C",
            },
            {
              label: "Composition & Architecture",
              value: "Shooting through glass/windshield is the signature device — car and human always visible together through a reflective surface. Modern glass-walled houses with the car visible inside or just outside is a recurring architectural motif, blurring architecture and showroom. Never a solo product shot.",
              color: "#9BC4A0",
            },
            {
              label: "Human Narrative",
              value: "Five narrative archetypes: friendship (golden-hour picnic, palm trees, casual laughter); romance (couple in a desert landscape, handwritten note); celebration (cocktails on the hood, poolside caps and swimwear); solitude/reflection (single figure at a coastal landscape, laptop and coffee); archival/candid (black & white, grainy, friends laughing, analog memory).",
              color: "#E8B93C",
            },
            {
              label: "Texture & Materiality",
              value: "Vermouth leather, chrome and metal catching warm ambient light, clean glass with soft reflections, sand and desert tones, cream boucle upholstery in heritage shots, snake-print textile as a recurring accessory motif, pool water surface. Subtle film grain across color imagery; harder grain in the monochrome archival passages.",
              color: "#E8481C",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-sm border border-white/[0.08] bg-white/[0.02] p-5"
              style={{ borderLeftColor: `${item.color}50`, borderLeftWidth: "2px" }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.14em] font-medium mb-2"
                style={{ color: item.color }}
              >
                {item.label}
              </p>
              <p className="text-white/55 text-[12px] leading-relaxed">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── Before / After ──────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-start">
          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-2">Style Transfer</p>
            <h2 className="font-anton text-headline text-white leading-none mb-4">
              Before &amp;<br />after
            </h2>
            <p className="text-white/45 text-[12px] leading-relaxed">
              Drag the divider to compare the original photograph against the BMW
              style profile applied by the generator.
            </p>
          </div>
          <BeforeAfterSlider
            beforeSrc="/assets/task3-showcase/bmw-m4_18.jpg"
            afterSrc="/assets/task3-showcase/bmw-styled.png"
          />
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── Style JSON ──────────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-start">
          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-2">The Style JSON</p>
            <h2 className="font-anton text-headline text-white leading-none mb-4">
              Single source<br />of truth
            </h2>
            <p className="text-white/45 text-[12px] leading-relaxed">
              This object is extracted from the moodboard via vision model analysis
              and feeds every generator in the pipeline.
            </p>
          </div>
          <StyleJsonBlock json={STYLE_JSON} />
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── How We'd Approach Each Output ───────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-10">
          How We&apos;d Approach Each Output
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {OUTPUT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-sm border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon size={18} className="text-white/30" />
                  <span className={`text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-sm font-medium ${card.tagStyle}`}>
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-white text-[15px] font-medium mb-1">{card.title}</h3>
                <p className="text-white/35 text-[11px] mb-3">{card.subtitle}</p>
                <p className="text-white/50 text-[12px] leading-relaxed flex-1 mb-4">{card.body}</p>
                <div className="border-t border-white/[0.06] pt-4">
                  <p className="text-[9px] uppercase tracking-[0.12em] text-white/25 mb-2">Tools</p>
                  <div className="flex flex-wrap gap-1.5">
                    {card.tools.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] text-white/40 px-2 py-0.5 border border-white/[0.07] rounded-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── What We Built ───────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <div className="grid lg:grid-cols-[260px_1fr] gap-10">
          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-2">What We Built</p>
            <h2 className="font-anton text-headline text-white leading-none">
              Functional<br />demo
            </h2>
          </div>
          <div className="space-y-3 text-white/55 text-[14px] leading-relaxed max-w-2xl">
            <p>
              A working image-to-image style transfer tool where users upload any photograph and
              the system applies the BMW style profile via Gemini.
            </p>
            <p>
              The style JSON is transparent — visible to the user before generation. The same
              object that feeds the prompt is displayed as the active style profile during loading.
              No black box: the creative direction is readable and auditable.
            </p>
            <p>
              Output: 2K photorealistic image with golden hour color grade, warm/teal film
              look, and preserved subject composition.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── What's Next ─────────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-10">
          What&apos;s Next
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NEXT_STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-sm border border-white/[0.08] bg-white/[0.02] p-5"
            >
              <span className={`font-anton text-[1.6rem] leading-none ${ACCENT} block mb-3`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-white text-[13px] font-medium mb-2">{step.title}</h3>
              <p className="text-white/40 text-[11px] leading-relaxed">{step.body}</p>
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
              Apply the style to your image
            </h2>
            <p className="text-white/45 text-[12px]">
              Upload any photograph. The BMW style profile is applied in ~30–60 seconds.
            </p>
          </div>
          <button
            onClick={() => push("/monks/task-3")}
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
