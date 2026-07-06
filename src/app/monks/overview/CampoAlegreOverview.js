"use client";

import { ArrowRight } from "lucide-react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSimpleRouteReady } from "@/hooks/useSimpleRouteReady";
import BackButton from "@/components/ui/BackButton";
import {
  OverviewShell,
  OverviewHero,
  OverviewSection,
  OverviewCard,
  OverviewLabel,
} from "@/components/ui/OverviewStory";

const ACCENT = "text-[#d7ff6a]";
const ACCENT_BG = "bg-[#d7ff6a]";

const TIMELINE = [
  {
    date: "Mon Jun 30",
    title: "Research & Setup",
    events: [
      "Landscape research 2026 — open-source vs closed-source tradeoffs",
      "ComfyUI setup, first SD1.5 tests (epiCRealism)",
      "Hardware wall confirmed: 4GB VRAM blocks Flux and IPAdapter-Flux",
      "UNO Flux crash: access violation, never ran",
    ],
  },
  {
    date: "Tue Jul 1",
    title: "Pivot to Gemini",
    events: [
      "IPAdapter-SD1.5 confirmation: label text is destroyed ('PHDLLEN') — open-source can't reproduce brand text",
      "Pivot to Gemini after first test: perfect label fidelity, hyperrealistic person",
      "Sequential Grounding architecture designed and implemented",
      "Task 1 functional: 3 beer products, 3 variants, QA loop",
    ],
  },
  {
    date: "Wed Jul 2",
    title: "Task 2 — BMW",
    events: [
      "3-layer controlled pipeline: product identity (26 refs) + style (locked) + scene (variable)",
      "gemini-3.1-flash-image chosen over Pro: supports 10+ refs vs Pro's 6",
      "QA loop with gemini-2.5-flash: score + discrepancies per generation",
      "Task 2 functional: LifestyleGenerator at /lifestyle-generator",
    ],
  },
  {
    date: "Thu Jul 3",
    title: "Task 3 — Style Transfer",
    events: [
      "BMW moodboard analyzed with vision model",
      "Style JSON extracted: color, lighting, composition, texture, music mapping",
      "Image-to-image style transfer implemented with Gemini",
      "Task 3 functional: upload → apply style → download",
    ],
  },
  {
    date: "Fri–Sun Jul 4–6",
    title: "UI & Deploy",
    events: [
      "Overview pages for each task",
      "UI polish: h-dvh layouts, transition fix (markRouteReady), variant grid",
      "MonksHub updated: all tasks enabled, documentation links",
      "Deploy prep: Vercel Pro for maxDuration 240s, environment variables",
    ],
  },
];

const TASKS = [
  {
    id: "task-1",
    label: "Task 1",
    title: "Campo Alegre",
    one_liner: "Lifestyle images for a craft beer brand — product consistency open-source first, then closed-source.",
    meta: "3 products · Sequential Grounding · 3 variants",
    href: "/monks/task-1",
    overviewHref: "/monks/task-1/overview",
    color: "#d7ff6a",
  },
  {
    id: "task-2",
    label: "Task 2",
    title: "BMW M4 Competition",
    one_liner: "BMW M4 lifestyle images — product consistency with closed-source tools only.",
    meta: "3-layer pipeline · 26 refs · QA loop",
    href: "/lifestyle-generator",
    overviewHref: "/monks/task-2/overview",
    color: "#22B4D6",
  },
  {
    id: "task-3",
    label: "Task 3",
    title: "Style Translation",
    one_liner: "Extract a visual moodboard and apply it to image, video and music generation workflows.",
    meta: "Style JSON · Image-to-image · Multi-modal",
    href: "/monks/task-3",
    overviewHref: "/monks/task-3/overview",
    color: "#E08A3C",
  },
];

const STACK = [
  "Next.js 15 App Router",
  "Tailwind CSS",
  "GSAP",
  "Vercel Pro",
  "Gemini API",
  "gemini-3.1-flash-image",
  "gemini-2.5-flash",
  "ComfyUI",
  "Blender",
  "Stable Diffusion 1.5",
  "epiCRealism",
  "Flux",
  "IPAdapter",
  "Midjourney",
  "Wan VACE",
  "Veo 3.1",
  "Kling",
  "Suno",
  "Udio",
  "Adobe Premiere",
];

export default function MonksOverview() {
  useSimpleRouteReady();
  const { push } = useTransitionRouter();

  return (
    <OverviewShell>
      <OverviewHero
        backHref={<BackButton href="/monks" />}
        label="Monks · Assessment"
        title={<>Monks<br />Assessment</>}
        subtitle="A 5-day sprint to build three AI generation systems from scratch — and prove the architecture, not just the images."
      />

      <OverviewSection
        label="The brief"
        title="Three tasks, five days"
      >
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {TASKS.map((task) => (
            <OverviewCard
              key={task.id}
              className="p-5 md:p-6"
              style={{ borderTopColor: task.color, borderTopWidth: "2px" }}
            >
              <p
                className="mb-2 font-general text-[10px] font-medium uppercase tracking-[0.14em]"
                style={{ color: task.color }}
              >
                {task.label}
              </p>
              <h3 className="mb-2 font-general text-[16px] font-medium text-white">{task.title}</h3>
              <p className="font-general text-[0.82rem] leading-relaxed text-white/50">{task.one_liner}</p>
            </OverviewCard>
          ))}
        </div>
      </OverviewSection>

      <div className="grid gap-3 py-4 md:grid-cols-12 md:gap-5 md:py-6">
        <OverviewCard className="md:col-span-7 p-5 md:p-8">
          <OverviewLabel>The timeline</OverviewLabel>
          <h2 className="mt-2 font-anton text-[clamp(1.4rem,2.5vw,2rem)] font-normal uppercase leading-none text-white">
            Five-day sprint
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {TIMELINE.map((day, i) => (
              <div
                key={day.date}
                className="rounded-xl border border-white/[0.07] bg-black/15 p-4"
              >
                <div className="mb-2 flex items-center gap-3">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      i === TIMELINE.length - 1 ? "bg-[#d7ff6a]" : "bg-white/25"
                    }`}
                  />
                  <div>
                    <p className="font-general text-[9px] uppercase tracking-[0.1em] text-white/30">
                      {day.date}
                    </p>
                    <p className="font-general text-[13px] font-medium text-white">{day.title}</p>
                  </div>
                </div>
                <ul className="space-y-1.5 pl-5">
                  {day.events.map((ev) => (
                    <li key={ev} className="font-general text-[0.75rem] leading-relaxed text-white/40">
                      {ev}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </OverviewCard>

        <OverviewCard className="md:col-span-5 p-5 md:p-8">
          <OverviewLabel>Core principle</OverviewLabel>
          <h2 className="mt-2 font-anton text-[clamp(1.4rem,2.5vw,2rem)] font-normal uppercase leading-none text-white">
            Why build an app at all?
          </h2>
          <div className="mt-5 space-y-4">
            <p className="font-general text-[0.88rem] leading-[1.65] text-white/55">
              Every one of these three tasks could&apos;ve been solved by opening Gemini&apos;s web UI
              and typing prompts until something looked right. That&apos;s actually how this started.
              It worked, eventually, for a single image — but every new scene broke a different way.
            </p>
            <p className="font-general text-[0.84rem] leading-[1.6] text-white/42">
              A brand doesn&apos;t need one perfect image — it needs hundreds of consistent ones,
              made by whoever&apos;s on the team that week. If output quality depends on how well
              someone prompts on a given day, nothing&apos;s actually been solved.
            </p>
            <div className="rounded-xl border border-[#d7ff6a]/20 bg-[#d7ff6a]/[0.04] p-4">
              <p className={`mb-2 font-general text-[10px] uppercase tracking-[0.14em] ${ACCENT}`}>
                What we locked in architecture
              </p>
              <p className="font-general text-[0.82rem] leading-relaxed text-white/55">
                What this product looks like from every angle. What &quot;on-brand&quot; means in
                structured terms. What counts as a correct result. Once those are locked, the only
                thing left variable is the scene. The deliverable isn&apos;t three sets of images —
                it&apos;s a pattern for turning a one-off creative request into a repeatable
                production line.
              </p>
            </div>
          </div>
        </OverviewCard>
      </div>

      <OverviewSection label="The stack" title="Built with">
        <div className="flex flex-wrap gap-2">
          {STACK.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/[0.08] bg-black/15 px-3 py-1.5 font-general text-[11px] uppercase tracking-[0.12em] text-white/55"
            >
              {item}
            </span>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection label="The tasks" title="Try or read">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 md:gap-4">
          {TASKS.map((task) => (
            <OverviewCard
              key={task.id}
              className="flex flex-col p-6"
              style={{ borderTopColor: task.color, borderTopWidth: "2px" }}
            >
              <p
                className="mb-2 font-general text-[10px] font-medium uppercase tracking-[0.14em]"
                style={{ color: task.color }}
              >
                {task.label}
              </p>
              <h3 className="mb-2 font-general text-[18px] font-medium text-white">{task.title}</h3>
              <p className="mb-4 flex-1 font-general text-[0.82rem] leading-relaxed text-white/45">
                {task.one_liner}
              </p>
              <p className="mb-4 border-b border-white/[0.06] pb-4 font-general text-[10px] uppercase tracking-[0.1em] text-white/25">
                {task.meta}
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => push(task.overviewHref)}
                  className="font-general text-[10px] uppercase tracking-[0.14em] text-white/40 transition-colors hover:text-white/70"
                >
                  How we built this →
                </button>
                <button
                  onClick={() => push(task.href)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-general text-[10px] font-medium uppercase tracking-[0.14em] ${ACCENT_BG} text-black transition-opacity hover:opacity-90`}
                >
                  Try it
                  <ArrowRight size={10} />
                </button>
              </div>
            </OverviewCard>
          ))}
        </div>
      </OverviewSection>
    </OverviewShell>
  );
}
