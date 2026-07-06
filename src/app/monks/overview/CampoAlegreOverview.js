"use client";

import { ArrowRight } from "lucide-react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSimpleRouteReady } from "@/hooks/useSimpleRouteReady";
import BackButton from "@/components/ui/BackButton";

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
      "BMW Neue Klasse moodboard analyzed with vision model",
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
  "Gemini API",
  "gemini-3.1-flash-image",
  "gemini-2.5-flash",
  "Vercel Pro",
  "Tailwind CSS",
  "GSAP",
  "Cursor",
];

export default function MonksOverview() {
  useSimpleRouteReady();
  const { push } = useTransitionRouter();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 px-[5%] max-w-[1900px] mx-auto">
        <BackButton href="/monks" />
        <div className="mt-10 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-3">
            Monks · Assessment
          </p>
          <h1 className="font-anton text-display text-white leading-none mb-4">
            Monks<br />Assessment
          </h1>
          <p className="text-white/50 text-[16px] leading-relaxed">
            A 5-day sprint to build three AI generation systems from scratch
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
              Three tasks,<br />five days
            </h2>
          </div>
          <div className="space-y-3 max-w-2xl">
            {TASKS.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-4 p-4 rounded-sm border border-white/[0.07] bg-white/[0.02]"
              >
                <span
                  className="text-[10px] uppercase tracking-[0.14em] font-medium shrink-0 mt-0.5"
                  style={{ color: task.color }}
                >
                  {task.label}
                </span>
                <p className="text-white/55 text-[13px] leading-relaxed">
                  <span className="text-white font-medium">{task.title}</span>
                  {" — "}
                  {task.one_liner}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── Timeline ────────────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-10">The Timeline</p>
        <div className="relative max-w-3xl">
          {/* Vertical line */}
          <div className="absolute left-[72px] top-0 bottom-0 w-px bg-white/[0.07]" />

          <div className="space-y-8">
            {TIMELINE.map((day, i) => (
              <div key={day.date} className="flex gap-6">
                {/* Date label */}
                <div className="w-[72px] shrink-0 pt-1 text-right pr-5">
                  <p className="text-white/25 text-[9px] uppercase tracking-[0.10em] leading-tight">
                    {day.date.split(" ")[0]}
                  </p>
                  <p className="text-white/40 text-[9px]">{day.date.split(" ").slice(1).join(" ")}</p>
                </div>

                {/* Dot */}
                <div className="relative shrink-0 mt-1.5">
                  <div className={`w-2 h-2 rounded-full ${i === TIMELINE.length - 1 ? "bg-[#d7ff6a]" : "bg-white/25"}`} />
                </div>

                {/* Content */}
                <div className="pb-2">
                  <p className="text-white text-[13px] font-medium mb-2">{day.title}</p>
                  <ul className="space-y-1.5">
                    {day.events.map((ev) => (
                      <li key={ev} className="text-white/40 text-[11px] leading-relaxed">
                        {ev}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── Stack ───────────────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-start">
          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-2">The Stack</p>
            <h2 className="font-anton text-headline text-white leading-none">Built with</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {STACK.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded-sm border border-white/[0.08] bg-white/[0.02] text-white/60 text-[11px] uppercase tracking-[0.12em]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── Core Principle ──────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-4">Core Principle</p>
          <h2 className="font-anton text-headline text-white leading-none mb-6">
            Controlled creative pipeline
          </h2>
          <p className="text-white/55 text-[15px] leading-relaxed">
            The constraints are intentional. Every system in this assessment is built around the
            same principle: product identity and style are locked by architecture — not by prompt
            complexity. The user controls one variable: the scene.
          </p>
          <p className="text-white/40 text-[14px] leading-relaxed mt-4">
            The result is a pipeline that produces consistent, on-brand outputs regardless of who
            operates it or how they phrase their input. The system is product-agnostic — swap the
            reference dataset and it works for any product with a visual identity to protect.
          </p>
        </div>
      </section>

      <div className="border-t border-white/[0.06]" />

      {/* ── Task cards ──────────────────────────────────────────────────── */}
      <section className="py-16 px-[5%] max-w-[1900px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-10">The Tasks</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {TASKS.map((task) => (
            <div
              key={task.id}
              className="rounded-sm border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col"
              style={{ borderTopColor: task.color, borderTopWidth: "2px" }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.14em] font-medium mb-2"
                style={{ color: task.color }}
              >
                {task.label}
              </p>
              <h3 className="text-white text-[18px] font-medium mb-2">{task.title}</h3>
              <p className="text-white/45 text-[12px] leading-relaxed flex-1 mb-4">
                {task.one_liner}
              </p>
              <p className="text-white/25 text-[10px] uppercase tracking-[0.10em] mb-4 pb-4 border-b border-white/[0.06]">
                {task.meta}
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => push(task.overviewHref)}
                  className="text-white/40 text-[10px] uppercase tracking-[0.14em] hover:text-white/70 transition-colors"
                >
                  How we built this →
                </button>
                <button
                  onClick={() => push(task.href)}
                  className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-medium px-3 py-1.5 rounded-sm ${ACCENT_BG} text-black hover:opacity-90 transition-opacity`}
                >
                  Try it
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
