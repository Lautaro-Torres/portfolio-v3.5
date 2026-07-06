"use client";

import { ArrowRight } from "lucide-react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSimpleRouteReady } from "@/hooks/useSimpleRouteReady";
import BackButton from "@/components/ui/BackButton";
import ShowcaseGallery, { showcaseSrc } from "@/components/ui/ShowcaseGallery";
import {
  OverviewShell,
  OverviewHero,
  OverviewSection,
  OverviewSplitSection,
  OverviewCta,
  StoryTimeline,
} from "@/components/ui/OverviewStory";

const ACCENT_BG = "bg-[#d7ff6a]";

const TASK2_SHOWCASE = [
  {
    src: showcaseSrc("task2-showcase", "urban-night (1).png"),
    label: "Urban street at night · Wet asphalt, neon reflections",
  },
  {
    src: showcaseSrc("task2-showcase", "urban-night (2).png"),
    label: "Coastal road · Golden hour, human in frame",
  },
];

export default function Task2Overview() {
  useSimpleRouteReady();
  const { push } = useTransitionRouter();

  return (
    <OverviewShell>
      <OverviewHero
        backHref={<BackButton href="/monks" />}
        label="Task 2 · BMW M4 Competition"
        title={<>Product<br />Consistency</>}
        subtitle="How to architect trust into a closed-source black box — without local training, without LoRA, without depending on prompt skill."
      />

      <OverviewSection
        label="How we built it"
        title="Three layers"
        intro="Task 2 required a fully closed-source solution. The question wasn't which tool to fight with — it was how to build a system where consistency doesn't depend on how well someone writes a prompt that day. Task 1 already explored the trainable local path; Task 2 needed to prove what's possible with zero local infrastructure."
      >
        <StoryTimeline
          steps={[
            {
              step: 1,
              title: "Split the problem into layers — each with exactly one job",
              narrative:
                "A black-box model will drift if you ask it to hold product identity, brand style, and scene composition in a single prompt. I split it into three layers: product identity locked, style locked, scene variable. That's the only way to guarantee consistency without a human prompt engineer in the loop.",
              decision:
                "Fewer degrees of freedom for the operator means their skill level matters less to the result. Same principle as Task 1 — architecture holds fidelity, not wording.",
              outcome:
                "A reusable pattern: swap the reference dataset (Layer 1), swap the moodboard (Layer 2), scene always free (Layer 3).",
              children: (
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { n: "Layer 1", title: "Product identity", badge: "Locked", color: "#d7ff6a", body: "26 multi-angle reference photos. BMW M4 Competition grounded before any scene generation." },
                    { n: "Layer 2", title: "Style direction", badge: "Locked", color: "#22B4D6", body: "BMW moodboard from Task 3 — one creative universe, not two disconnected directions." },
                    { n: "Layer 3", title: "Scene", badge: "Variable", color: "#E08A3C", body: "Free user input. The only thing that changes per generation." },
                  ].map((l) => (
                    <div
                      key={l.n}
                      className="rounded-xl border border-white/[0.08] bg-black/15 p-4"
                      style={{ borderTopColor: l.color, borderTopWidth: "2px" }}
                    >
                      <p className="font-anton text-[1.2rem] leading-none mb-1" style={{ color: l.color }}>{l.n}</p>
                      <p className="font-general text-[0.82rem] font-medium text-white">{l.title}</p>
                      <span
                        className="mt-1 mb-2 inline-block rounded-full px-2 py-0.5 font-general text-[8px] uppercase tracking-[0.12em]"
                        style={{ color: l.color, backgroundColor: `${l.color}15` }}
                      >
                        {l.badge}
                      </span>
                      <p className="font-general text-[0.78rem] leading-relaxed text-white/40">{l.body}</p>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              step: 2,
              title: "Layer 1 — 26 references, and Flash over Pro for a real reason",
              narrative:
                "The BMW M4 Competition isn't something the model knows with brand accuracy out of the box. Twenty-six multi-angle photos ground it before generation. gemini-3.1-flash-image over Pro because Pro caps at 6 reference objects and Flash supports 10+. With 26 images, Flash wasn't a quality compromise — it was the only model that could use the full dataset.",
              decision:
                "Close-up shots of the kidney grille and M Competition badge as a separate, higher-weight fallback — those are the two things a viewer notices first if something drifts.",
              outcome:
                "Product identity held across scene types. QA loop (gemini-2.5-flash) scores each output automatically.",
            },
            {
              step: 3,
              title: "Deliberately no LoRA — that's Task 1's path, not this one",
              narrative:
                "I'd already gone down the ComfyUI / LoRA / local training route in Task 1. Task 2's brief was explicit: fully closed-source, no local infrastructure. Keeping Task 1 as the trainable path and Task 2 as the closed path lets the assessment show two different valid architectures.",
              decision:
                "Don't force one tool to prove both cases. Task 2 answers: \"what can you build on someone else's API alone?\"",
              outcome:
                "LifestyleGenerator at /lifestyle-generator — scene picker, QA scores, batch generation. No GPU required.",
            },
            {
              step: 4,
              title: "Answer the brief's hard question — what if the model doesn't know the product?",
              narrative:
                "That's exactly what Layer 1 solves. References ground the model in the real vehicle before any scene prompt runs. If drift still happens on a specific element, the fallback is close-up references of distinctive features fed as a separate emphasis block — not a better paragraph of prompt text.",
              decision:
                "Treat \"the model doesn't know the product\" as an architecture problem, not a prompting problem. The brief asked for this answer explicitly.",
              outcome:
                "A system a junior operator can run. Product-agnostic: swap the 26-photo dataset and the three-layer structure holds for any vehicle.",
            },
          ]}
        />
      </OverviewSection>

      <OverviewSplitSection
        label="The result"
        title="Generated outputs"
        description="Product identity from 26 refs, style from the shared BMW moodboard, scene as the only variable the user controls."
      >
        <ShowcaseGallery items={TASK2_SHOWCASE} columns="grid-cols-1 lg:grid-cols-2" />
      </OverviewSplitSection>

      <OverviewCta
        label="Try it"
        title="Generate a BMW lifestyle shot"
        description="Select a scene — product and style are already locked."
        button={
          <button
            onClick={() => push("/lifestyle-generator")}
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
