"use client";

import { useState } from "react";
import { ArrowRight, Music, Video, ImageIcon, Copy, Download, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSimpleRouteReady } from "@/hooks/useSimpleRouteReady";
import BackButton from "@/components/ui/BackButton";
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";
import {
  OverviewShell,
  OverviewHero,
  OverviewSection,
  OverviewSplitSection,
  OverviewCta,
  OverviewCard,
  OverviewLabel,
  StoryTimeline,
} from "@/components/ui/OverviewStory";
import { styleConfig } from "@/config/lifestyle-style";

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
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] px-3 py-1.5 font-general text-[10px] uppercase tracking-[0.14em] text-white/45 transition-colors hover:border-white/25 hover:text-white/70"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? "Collapse JSON" : "View full JSON"}
        </button>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] px-3 py-1.5 font-general text-[10px] uppercase tracking-[0.14em] text-white/45 transition-colors hover:border-white/25 hover:text-white/70"
        >
          {copied ? <Check size={12} className="text-[#d7ff6a]" /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] px-3 py-1.5 font-general text-[10px] uppercase tracking-[0.14em] text-white/45 transition-colors hover:border-white/25 hover:text-white/70"
        >
          <Download size={12} />
          Download
        </button>
      </div>

      <pre
        className={`overflow-x-auto rounded-xl border border-white/[0.08] bg-black/15 p-5 font-mono text-[11px] leading-relaxed text-white/70 transition-all ${
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

const MOODBOARD_CARDS = [
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
];

export default function Task3Overview() {
  useSimpleRouteReady();
  const { push } = useTransitionRouter();

  return (
    <OverviewShell>
      <OverviewHero
        backHref={<BackButton href="/monks" />}
        label="Task 3 · Style Transfer"
        title="Style Translation"
        subtitle="Extending Task 2's style layer into a single JSON — and being honest about what we built vs. what we architected."
      />

      <OverviewSection
        label="How we built it"
        title="One moodboard"
        intro="My first decision on Task 3 was not to build a new system. Task 2 already had style as a swappable layer — the moodboard feeding a style prompt. Task 3 is the same problem extended to two output types Task 2 never needed. So I treated it as extending the existing layer, not a separate build."
      >
        <StoryTimeline
          steps={[
            {
              step: 1,
              title: "Extract style into JSON — analyzed once, reused everywhere",
              narrative:
                "I could've kept describing the moodboard in prose inside each prompt, but then every generator interprets the same board slightly differently — with no way to audit or edit it without rewriting text. I extracted it into a single JSON instead: analyzed once, reused as-is by every generator in the pipeline.",
              decision:
                "Color, lighting and composition translate directly from pixels. music_mapping doesn't — there's no direct visual-to-audio rule. I had to define that translation myself: warm, human, editorial becomes organic downtempo, ~90 BPM, analog synths.",
              outcome:
                "The same object feeds Task 2's lifestyle generator and Task 3's image transfer. Swap the moodboard, re-analyze once, every downstream tool updates.",
            },
            {
              step: 2,
              title: "The moodboard was doing more than \"apply BMW style\"",
              narrative:
                "When I actually broke down the real moodboard, it held three different vehicle eras, glass architecture as a recurring device, a human narrative axis (friendship, romance, celebration, remote work), and a deliberate monochrome treatment for some moments. A style system that only captures the obvious 20% of a moodboard isn't the source of truth it claims to be.",
              decision:
                "Expand the JSON to hold all of that instead of simplifying down. If the style profile is the contract between creative and production, it has to be complete.",
              outcome:
                "Six analysis dimensions — vehicle reference, color grade, lighting, composition, human narrative, texture — all encoded in the style JSON below.",
              children: (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {MOODBOARD_CARDS.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/[0.08] bg-black/15 p-4"
                      style={{ borderLeftColor: `${item.color}50`, borderLeftWidth: "2px" }}
                    >
                      <p
                        className="mb-2 font-general text-[10px] font-medium uppercase tracking-[0.14em]"
                        style={{ color: item.color }}
                      >
                        {item.label}
                      </p>
                      <p className="font-general text-[0.78rem] leading-relaxed text-white/55">{item.value}</p>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              step: 3,
              title: "Built the static image output for real",
              narrative:
                "For scope, I built the image-to-image path end to end — upload a photo, apply the style profile, get a result. The style JSON is transparent: visible to the user before generation, displayed as the active profile during loading. No black box — the creative direction is readable and auditable.",
              decision:
                "Honesty about scope over a rushed attempt at all three outputs. A convincing fake demo for video or music would've undermined the whole point of the style JSON as a source of truth.",
              outcome:
                "Working generator at /monks/task-3. 2K photorealistic output with golden hour color grade, warm/teal film look, preserved subject composition.",
            },
            {
              step: 4,
              title: "Video and music — full technical approach, not a fake demo",
              narrative:
                "For camera movement, the approach is previs-first: block the shot in Blender with a clay render to lock camera movement and timing, export depth and outline control passes, feed those into a video model so it follows the exact motion instead of reinterpreting it. Final edit always in Premiere — no AI tool replaces that step yet. For music, the music_mapping block in the JSON becomes an audio brief for Suno, Udio or Stable Audio.",
              decision:
                "Explain the pipeline in full technical depth instead of shipping something unconvincing. The JSON is designed to feed all three output types — image is built, video and music are architected.",
              outcome:
                "Three output cards below: one Built, two Planned — each with the specific tools and workflow the style JSON was designed for.",
            },
          ]}
        />
      </OverviewSection>

      <div className="grid gap-3 py-4 md:grid-cols-2 md:gap-5 md:py-6">
        <OverviewCard className="p-5 md:p-8">
          <OverviewLabel>Style transfer</OverviewLabel>
          <h2 className="mt-2 font-anton text-[clamp(1.4rem,2.5vw,2rem)] font-normal uppercase leading-none text-white">
            Before &amp; after
          </h2>
          <p className="mt-3 mb-6 font-general text-[0.85rem] leading-relaxed text-white/45">
            Drag the divider to compare the original photograph against the BMW style profile applied by the generator.
          </p>
          <BeforeAfterSlider
            beforeSrc="/assets/task3-showcase/bmw-m4_18.jpg"
            afterSrc="/assets/task3-showcase/bmw-styled.png"
          />
        </OverviewCard>

        <OverviewCard className="p-5 md:p-8">
          <OverviewLabel>The style JSON</OverviewLabel>
          <h2 className="mt-2 font-anton text-[clamp(1.4rem,2.5vw,2rem)] font-normal uppercase leading-none text-white">
            Single source of truth
          </h2>
          <p className="mt-3 mb-6 font-general text-[0.85rem] leading-relaxed text-white/45">
            Extracted from the moodboard via vision model analysis — feeds every generator in the pipeline.
          </p>
          <StyleJsonBlock json={STYLE_JSON} />
        </OverviewCard>
      </div>

      <OverviewSection
        label="Three outputs"
        title="One JSON, three pipelines"
        intro="The style object was designed to feed all three — image built end to end, video and music architected with full technical depth."
      >
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 md:gap-5">
          {OUTPUT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <OverviewCard key={card.title} className="flex flex-col p-5 md:p-7">
                <div className="mb-4 flex items-start justify-between">
                  <Icon size={18} className="text-white/30" />
                  <span className={`rounded-full px-2 py-0.5 font-general text-[9px] font-medium uppercase tracking-[0.12em] ${card.tagStyle}`}>
                    {card.tag}
                  </span>
                </div>
                <h3 className="font-general text-[15px] font-medium text-white">{card.title}</h3>
                <p className="mb-3 font-general text-[11px] text-white/35">{card.subtitle}</p>
                <p className="mb-4 flex-1 font-general text-[0.82rem] leading-relaxed text-white/50">{card.body}</p>
                <div className="border-t border-white/[0.06] pt-4">
                  <p className="mb-2 font-general text-[9px] uppercase tracking-[0.12em] text-white/25">Tools</p>
                  <div className="flex flex-wrap gap-1.5">
                    {card.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/[0.07] px-2 py-0.5 font-general text-[10px] text-white/40"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </OverviewCard>
            );
          })}
        </div>
      </OverviewSection>

      <OverviewCta
        label="Try it"
        title="Apply the style to your image"
        description="Upload any photograph. The BMW style profile is applied in ~30–60 seconds."
        button={
          <button
            onClick={() => push("/monks/task-3")}
            className={`shrink-0 inline-flex items-center gap-2 ${ACCENT_BG} text-black font-general text-[11px] uppercase tracking-[0.16em] font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity`}
          >
            Try the generator
            <ArrowRight size={13} />
          </button>
        }
      />
    </OverviewShell>
  );
}
