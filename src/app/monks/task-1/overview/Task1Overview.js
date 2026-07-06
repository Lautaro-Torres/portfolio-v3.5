"use client";

import { ArrowRight } from "lucide-react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSimpleRouteReady } from "@/hooks/useSimpleRouteReady";
import BackButton from "@/components/ui/BackButton";
import ShowcaseGallery, { showcaseSrc } from "@/components/ui/ShowcaseGallery";
import DatasetTurntable from "@/components/ui/DatasetTurntable";
import {
  OverviewShell,
  OverviewHero,
  OverviewSection,
  OverviewSplitSection,
  OverviewCta,
  StoryTimeline,
} from "@/components/ui/OverviewStory";

const ACCENT = "text-[#d7ff6a]";
const ACCENT_BG = "bg-[#d7ff6a]";

const TASK1_SHOWCASE = [
  {
    src: showcaseSrc("task1-showcase", "pale-113216.png"),
    product: "Pale Ale",
    label: "Mountain reservoir · POV hold",
    aspect: "aspect-[9/16]",
  },
  {
    src: showcaseSrc("task1-showcase", "pale-246854.png"),
    product: "Pale Ale",
    label: "Hiking · Mountain trail",
  },
  {
    src: showcaseSrc("task1-showcase", "pale-216811.png"),
    product: "Pale Ale",
    label: "Dock at sunset · Golden hour",
    aspect: "aspect-[9/16]",
  },
  {
    src: showcaseSrc("task1-showcase", "pale-778411.png"),
    product: "Pale Ale",
    label: "Bar rooftop · Friends & toast",
    aspect: "aspect-[9/16]",
  },
  {
    src: showcaseSrc("task1-showcase", "belgian (3).png"),
    product: "Belgian Golden Strong Ale",
    label: "Lakeside picnic · Golden hour",
    aspect: "aspect-[9/16]",
  },
  {
    src: showcaseSrc("task1-showcase", "belgian-165478.png"),
    product: "Belgian Golden Strong Ale",
    label: "Living room at night · Warm lamp light",
  },
  {
    src: showcaseSrc("task1-showcase", "porter-16516.png"),
    product: "Porter",
    label: "Campfire · Night edge case",
    aspect: "aspect-[9/16]",
  },
];

const COMFYUI_PATH = [
  { tool: "SD1.5 (epiCRealism)", takeaway: "Confirmed the classic weakness — bad hands and eyes — but validated the scene approach before committing to something heavier." },
  { tool: "IPAdapter SD1.5", takeaway: "Melted the label into unreadable text. Useful failure: the mechanism itself can't reproduce exact brand text — didn't need to re-test that with other tools." },
  { tool: "Flux fp8", takeaway: "Best human realism of the whole process. Hands still off. Pure text-to-image — couldn't take the label as input at all." },
  { tool: "IPAdapter-Flux + hand LoRA", takeaway: "Failed on ComfyUI version mismatch. Ecosystem fragility, not a concept failure. Pinning versions would've cost more than it was worth." },
  { tool: "Qwen-Image-Edit (cloud)", takeaway: "Right direction on paper — leading text rendering — but 16GB+ VRAM locally vs 4GB available. Cloud test confirmed the label would hold. Hardware ceiling, not a workflow call." },
];

export default function Task1Overview() {
  useSimpleRouteReady();
  const { push } = useTransitionRouter();

  return (
    <OverviewShell>
      <OverviewHero
        backHref={<BackButton href="/monks" />}
        label="Task 1 · Campo Alegre"
        title={<>Lifestyle Image<br />Generator</>}
        subtitle="From Gemini chat experiments to a pipeline anyone on the team can run — and why ComfyUI had to come first."
      />

      <OverviewSection
        label="How we built it"
        title="The pipeline"
        intro="Campo Alegre is a real client — they needed lifestyle imagery without a photo shoot for every new scene. I could've stayed in Gemini's chat UI and kept prompt-engineering my way to one good image at a time. That's where I started. Building an app only made sense once I understood what chat couldn't carry forward from scene to scene."
      >
        <StoryTimeline
          steps={[
            {
              step: 1,
              title: "Start where everyone starts — the chat UI",
              narrative:
                "Single images looked great. Scene 3 broke on scale. Scene 7 broke on label paste. Scene 12 broke on lighting mismatch. Each fix was a better prompt — and the next scene broke somewhere else. Nothing I learned carried over. I was the system holding all that knowledge.",
              decision:
                "Move every decision that doesn't need to change per image into the architecture, once: what the product looks like, what counts as correct, how the label enters the pipeline. Leave only the scene as the variable.",
              outcome:
                "The goal shifted from \"get one perfect image\" to \"build something a new team member can run on day one without re-learning prompt tricks.\"",
            },
            {
              step: 2,
              title: "Set one rule before touching any node",
              narrative:
                "Before ComfyUI, Blender, or any API: never generate the label with AI — condition it or composite it. Any diffusion model hallucinates real brand text. If I wanted brand-accurate output, the client's real artwork had to enter as a source, not come out of a prompt.",
              decision:
                "Every tool test measured against label fidelity as a hard constraint — not aesthetics, not speed. If the mechanism pastes or invents text, it's out regardless of how good the scene looks.",
              outcome:
                "This rule eliminated half the open-source landscape before wasting weeks on fine-tuning.",
            },
            {
              step: 3,
              title: "Build the product in Blender, then walk the ComfyUI path",
              narrative:
                "Three beers modeled manually from real label files — eight angles every 45° plus flat artwork. Then ComfyUI: SD1.5, IPAdapter, Flux, hand LoRAs. The brief required open-source first; this wasn't wasted time — it's what let me identify exactly what the winning approach would need to do differently.",
              decision:
                "Manual Blender modeling over AI mesh tools. Test locally on 4GB VRAM knowing the hardware ceiling was real — don't chase version-pinning rabbit holes when the tool's own docs say it's not built for fine-grained brand consistency.",
              outcome:
                "ComfyUI proved the problem space. It showed that reference-based methods paste or melt labels, and that scene integration requires reasoning about the whole frame — not compositing through a side channel.",
              children: (
                <div className="grid gap-6 xl:grid-cols-2 xl:gap-8">
                  <DatasetTurntable />
                  <div className="grid gap-2 sm:grid-cols-1">
                    {COMFYUI_PATH.map((a) => (
                      <div
                        key={a.tool}
                        className="rounded-xl border border-white/[0.07] bg-black/15 px-4 py-3"
                      >
                        <p className="font-general text-[0.82rem] font-medium text-white/70">{a.tool}</p>
                        <p className="mt-1 font-general text-[0.78rem] leading-[1.5] text-white/38">{a.takeaway}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              step: 4,
              title: "Stop patching — research the right category of tool",
              narrative:
                "Qwen-Image-Edit confirmed the direction in the cloud: a model that reasons about a scene instead of pasting a reference. Gemini landed in the same category — accessible without a hardware wall. First test: perfect label, hyperrealistic person, real scene integration.",
              decision:
                "Choose Gemini not as \"the best model in the abstract\" but as the same class of tool that just worked for Qwen — scene reasoning, not reference compositing — and available within the sprint timeline.",
              outcome:
                "Right model category. Wrong architecture still — 3D packshots as reference still caused paste artifacts. Reference images silently failing to load. Competing instructions about the can that the model averaged together.",
            },
            {
              step: 5,
              title: "Sequential Grounding — fidelity by architecture, not wording",
              narrative:
                "Same lesson from ComfyUI and Gemini chat: you can't prompt your way to consistency. Split generation into a scene pass (no product, hand posed) and a product-install pass. Send the flat label art — not 3D photos — as the reference. A 2D design sheet can't be pasted as a can; the model has to render a new object with that design integrated into the scene lighting.",
              decision:
                "Two-pass Sequential Grounding. Flat etiqueta as sole product reference. Three variants in parallel — the model's non-determinism becomes a selection feature, not a bug.",
              outcome:
                "Paste artifacts gone. Label fidelity held. QA loop scores each variant against the reference label automatically.",
              children: (
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { n: "Pass 1", fn: "generateScene()", body: "Scene only — lifestyle canvas, no product." },
                    { n: "Pass 2 ×3", fn: "installProduct()", body: "Scene + flat label → integrated can, 3× parallel." },
                    { n: "QA ×3", fn: "runQa()", body: "gemini-2.5-flash scores label fidelity per variant." },
                  ].map((p) => (
                    <div key={p.n} className="rounded-xl border border-white/[0.08] bg-black/15 p-4">
                      <p className={`font-anton text-[1.2rem] leading-none ${ACCENT} mb-1`}>{p.n}</p>
                      <p className="font-mono text-[11px] text-white/70 mb-2">{p.fn}</p>
                      <p className="font-general text-[0.78rem] leading-relaxed text-white/40">{p.body}</p>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              step: 6,
              title: "Wire it to the Gemini API — make it a production line",
              narrative:
                "Next.js route at /api/task1/generate, @google/genai SDK, GEMINI_API_KEY server-side, Vercel Pro with 240s timeout. gemini-3.1-flash-image for generation, gemini-2.5-flash for QA. The demo at /monks/task-1 is a live API call — not a gallery of pre-rendered wins.",
              decision:
                "Ship the pipeline, not the prompts. UI disclaimers for known limitations (fine print varies, campfire is the hardest edge case) — honesty about what the model can't guarantee, because the architecture handles what it can.",
              outcome:
                "Three products, three scored variants per run. Fidelity from the pipeline, not from whoever's prompting that day.",
            },
          ]}
        />
      </OverviewSection>

      <OverviewSplitSection
        label="The result"
        title="Real API outputs"
        description="Every image below came through the live pipeline — including the campfire edge case that stress-tests the architecture, not the prompt."
      >
        <ShowcaseGallery items={TASK1_SHOWCASE} />
      </OverviewSplitSection>

      <OverviewCta
        label="Try it"
        title="Run the pipeline yourself"
        description="Pick a beer, describe the scene, get 3 scored variants in ~90 seconds."
        button={
          <button
            onClick={() => push("/monks/task-1")}
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
