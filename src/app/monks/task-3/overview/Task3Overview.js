"use client";

import { ArrowRight, Music, Video, ImageIcon, Zap } from "lucide-react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSimpleRouteReady } from "@/hooks/useSimpleRouteReady";
import BackButton from "@/components/ui/BackButton";

const ACCENT = "text-[#d7ff6a]";
const ACCENT_BG = "bg-[#d7ff6a]";

const STYLE_JSON = `{
  "brand_cue": "BMW Neue Klasse — warm, human, cinematic",
  "mood": ["warm", "aspirational", "filmic", "sun-drenched"],
  "color": {
    "grade": "film-like, warm highlights, teal shadows",
    "base_palette": ["#D3A878", "#EAC9A0", "#E08A3C", "#E8B93C"],
    "accent_palette": ["#22B4D6", "#9BC4A0"],
    "pop_color": "#E8481C"
  },
  "lighting": {
    "primary": "golden hour",
    "direction": "low lateral / backlit"
  },
  "composition": {
    "signature": "shooting through glass",
    "subject_logic": "human + product in same frame"
  },
  "texture": ["cognac leather", "chrome/metal", "film grain"]
}`;

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
    body: "The generated image becomes the first frame. An image-to-video model adds camera movement: push-in, orbit, crane up. The style is preserved through motion.",
    tools: ["Higgsfield", "Veo 3.1 (~$0.15–0.40 / 8s)", "Kling"],
    tag: "Planned",
    tagStyle: "bg-white/[0.06] text-white/40",
  },
  {
    icon: Music,
    title: "Music",
    subtitle: "Style JSON → audio brief",
    body: "The music_mapping block defines genre, BPM and instrumentation. Organic electronic / cinematic downtempo, 85–100 BPM, warm analog synths, organic percussion.",
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
              Analyze the BMW Neue Klasse visual moodboard and translate its style into generation
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
              label: "Brand Cue",
              value: "Warm, human, cinematic, effortless luxury — not cold studio luxury.",
              color: "#D3A878",
            },
            {
              label: "Color",
              value: "Warm base (golden hour, cognac leather, sand) + cold accents (turquoise, slate). Film grade: warm highlights, teal shadows, soft contrast.",
              color: "#22B4D6",
            },
            {
              label: "Lighting",
              value: "Golden hour. Low and lateral, backlit with occasional lens flares. Long, soft shadows.",
              color: "#E08A3C",
            },
            {
              label: "Composition",
              value: "Shooting through glass as a recurring device. Human + product always in the same frame — never a solo product shot.",
              color: "#9BC4A0",
            },
            {
              label: "Texture",
              value: "Cognac leather, chrome/metal reflecting warm ambient light, subtle film grain overlay.",
              color: "#E8B93C",
            },
            {
              label: "Music Mapping",
              value: "Organic electronic / cinematic downtempo. 85–100 BPM. Warm analog synths, organic percussion, cinematic swells.",
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
          <div className="min-w-0">
            <pre className="bg-white/[0.03] border border-white/[0.08] rounded-sm p-5 text-[11px] text-white/70 leading-relaxed overflow-x-auto font-mono">
              <code>{STYLE_JSON}</code>
            </pre>
          </div>
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
              the system applies the BMW Neue Klasse style profile via Gemini.
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
              Upload any photograph. The BMW Neue Klasse style profile is applied in ~30–60 seconds.
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
