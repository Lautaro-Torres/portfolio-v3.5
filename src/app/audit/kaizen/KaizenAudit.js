"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useSimpleRouteReady } from "../../../hooks/useSimpleRouteReady";
import {
  auditMeta,
  businessUnderstanding,
  benchmarkPatterns,
  benchmarkTakeaway,
  homepageProductAuditRows,
  funnelTrustAuditRows,
  expectedImpactMatrix,
  keyFindings,
  categoryBreakdown,
  conversionFlow,
  roadmap,
  validationInputs,
  measurementNote,
} from "./auditData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Editorial design tokens ─────────────────────────────────────────────────

const ACCENT_TEXT = "text-[#d7ff6a]";
const ACCENT_BG = "bg-[#d7ff6a]";
const ACCENT_BORDER = "border-[#d7ff6a]/25";
const EFFORT_TEXT = "text-cyan-200";
const EFFORT_BG = "bg-cyan-200";

// Muted priority system. Urgency is semantic without loud dashboard colors.
const PRIORITY = {
  P0: {
    label: "Urgent",
    badge: "text-[#d7ff6a] bg-[#d7ff6a]/[0.08] border border-[#d7ff6a]/25",
    dot: ACCENT_BG,
  },
  P1: {
    label: "Next",
    badge: "text-amber-300 bg-amber-300/[0.08] border border-amber-300/20",
    dot: "bg-amber-300",
  },
  P2: {
    label: "Later",
    badge: "text-white/48 bg-white/[0.035] border border-white/[0.08]",
    dot: "bg-white/32",
  },
};

// Category map uses one accent system with different intensities, not a rainbow.
const CATEGORY = {
  Clarity: { opacity: "opacity-90" },
  "CTA UX": { opacity: "opacity-74" },
  IA: { opacity: "opacity-62" },
  Proof: { opacity: "opacity-50" },
  Relevance: { opacity: "opacity-38" },
  Technical: { opacity: "opacity-28" },
};

// ─── Primitives ───────────────────────────────────────────────────────────────

function Card({ children, className = "" }) {
  return (
    <div
      className={`group/card overflow-hidden rounded-[1.35rem] border border-white/[0.075] bg-[linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018)_42%,rgba(255,255,255,0.035))] shadow-[0_24px_80px_rgba(0,0,0,0.24)] transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-[0_30px_90px_rgba(0,0,0,0.32)] ${className}`}
    >
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <span className="font-general text-[11px] uppercase tracking-[0.2em] text-white/32">
      {children}
    </span>
  );
}

function CardHeading({ children, className = "" }) {
  return (
    <h2 className={`font-anton text-white uppercase leading-tight font-normal ${className}`}>
      {children}
    </h2>
  );
}

function PBadge({ level }) {
  const style = PRIORITY[level] ?? PRIORITY.P2;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-general text-[10px] uppercase tracking-[0.16em] ${style.badge}`}>
      <span className={`inline-block w-1 h-1 rounded-full shrink-0 ${style.dot}`} />
      {level} · {style.label}
    </span>
  );
}

function PriorityLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <PBadge level="P0" />
      <PBadge level="P1" />
      <PBadge level="P2" />
    </div>
  );
}

function CatBadge({ category }) {
  const style = CATEGORY[category];
  if (!style) return (
    <span className="rounded-full border border-white/[0.1] px-2 py-1 font-general text-[10px] uppercase tracking-widest text-white/32">
      {category}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.035] px-2 py-1 font-general text-[10px] uppercase tracking-[0.14em] text-white/42">
      <span className={`inline-block h-1 w-1 rounded-full shrink-0 ${ACCENT_BG} ${style.opacity}`} />
      {category}
    </span>
  );
}

// ─── Card 01: CRO Lens ────────────────────────────────────────────────────────

function BusinessCard() {
  return (
    <Card className="flex flex-col gap-7 p-7 md:p-9">
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <Label>01 — Business Understanding</Label>
          <CardHeading className="text-[clamp(1.55rem,2.8vw,2.35rem)]">
            CRO Lens
          </CardHeading>
        </div>
        <span className={`hidden rounded-full border ${ACCENT_BORDER} bg-[#d7ff6a]/[0.06] px-3 py-1.5 font-general text-[10px] uppercase tracking-[0.16em] ${ACCENT_TEXT} md:inline-flex`}>
          Proof-led path
        </span>
      </div>

      <p className="max-w-[660px] font-general text-[0.98rem] leading-[1.7] text-white/62 md:text-base">
        Kaizen already has a memorable identity and broad service coverage. The
        conversion work is to make the B2B decision easier: what the offer is,
        who it helps, where the proof is, and why the next step is low-risk.
      </p>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
        {businessUnderstanding.blocks.map((block) => (
          <div
            key={block.label}
            className="bg-[#121212] p-5"
          >
            <p className="mb-2 font-general text-[11px] uppercase tracking-[0.16em] text-white/32">
              {block.label}
            </p>
            <p className="font-general text-[0.82rem] leading-[1.58] text-white/50">
              {block.content}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.07] pt-5">
        <p className="mb-2 font-general text-[11px] uppercase tracking-[0.18em] text-white/24">
          Core thesis
        </p>
        <p className="font-general text-sm italic leading-[1.65] text-white/48">
          &ldquo;{auditMeta.thesis}&rdquo;
        </p>
      </div>
    </Card>
  );
}

function BenchmarkCard() {
  return (
    <Card className="flex flex-col gap-6 p-7 md:p-9">
      <div className="flex flex-col gap-1.5">
        <Label>02 — Benchmark Patterns Used</Label>
        <CardHeading className="text-[clamp(1.45rem,2.5vw,2.1rem)]">
          Reference Behaviors
        </CardHeading>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {benchmarkPatterns.map((item) => {
          const CardTag = item.url ? "a" : "div";
          const linkProps = item.url
            ? { href: item.url, target: "_blank", rel: "noopener noreferrer" }
            : {};

          return (
          <CardTag
            key={item.benchmark}
            {...linkProps}
            className="rounded-xl border border-white/[0.07] bg-black/15 p-5 transition-colors duration-300 hover:border-white/[0.13]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-anton text-xl uppercase leading-none text-white/84">
                {item.benchmark}
              </p>
              {item.url && <ExternalLink size={12} className="mt-1 shrink-0 text-white/28" />}
            </div>
            <p className="mt-4 font-general text-sm leading-[1.55] text-white/50">
              {item.pattern}
            </p>
            <p className="mt-4 border-t border-white/[0.07] pt-3 font-general text-[0.82rem] leading-[1.5] text-white/34">
              {item.useForClient}
            </p>
          </CardTag>
          );
        })}
      </div>

      <div className={`rounded-xl border ${ACCENT_BORDER} bg-[#d7ff6a]/[0.04] p-5`}>
        <p className="font-general text-sm leading-[1.65] text-white/55">
          <span className={`${ACCENT_TEXT} font-medium`}>Benchmark takeaway: </span>
          {benchmarkTakeaway}
        </p>
      </div>
    </Card>
  );
}

function AuditRow({ row, index, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/[0.06] last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="grid w-full cursor-pointer gap-4 p-4 text-left transition-colors duration-300 hover:bg-white/[0.025] md:grid-cols-[2rem_1.05fr_1.35fr_auto] md:items-center md:p-5"
      >
        <span className="font-anton text-lg leading-none text-white/20">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <p className="font-general text-[0.96rem] font-medium leading-tight text-white/78">
            {row.area}
          </p>
          <p className="mt-1 line-clamp-1 font-general text-[0.8rem] leading-[1.45] text-white/36">
            {row.friction}
          </p>
        </div>
        <p className="line-clamp-1 font-general text-[0.82rem] leading-[1.45] text-white/40">
          {row.metric}
        </p>
        <div className="flex items-center gap-2 md:justify-end">
          <PBadge level={row.priority} />
          <span className="font-general text-[10px] uppercase tracking-[0.16em] text-white/22">
            {isOpen ? "Close" : "Open"}
          </span>
        </div>
      </button>

      <div
        className={`grid bg-white/[0.015] transition-[grid-template-rows,opacity] duration-500 ease-ui-emphasized ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-3 border-t border-white/[0.06] px-4 pb-5 pt-4 md:grid-cols-3 md:px-5">
            {[
              ["Friction", row.friction],
              ["Specific fix", row.fix],
              ["Metric", row.metric],
            ].map(([itemLabel, value]) => (
              <div key={itemLabel} className="rounded-lg border border-white/[0.06] bg-black/12 p-4">
                <p className="mb-2 font-general text-[10px] uppercase tracking-[0.16em] text-white/24">
                  {itemLabel}
                </p>
                <p className="font-general text-[0.84rem] leading-[1.55] text-white/48">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditRowsCard({ label, title, rows }) {
  return (
    <Card className="flex flex-col gap-6 p-7 md:p-9">
      <div className="flex flex-col gap-1.5 md:flex-row md:items-end md:justify-between">
        <div>
          <Label>{label}</Label>
          <CardHeading className="mt-1.5 text-[clamp(1.45rem,2.6vw,2.25rem)]">
            {title}
          </CardHeading>
        </div>
        <p className="font-general text-sm text-white/34">
          {rows.length} audit rows · friction, fix and success metric
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-black/15">
        {rows.map((row, index) => (
          <AuditRow
            key={row.area}
            row={row}
            index={index}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </Card>
  );
}

// ─── Card 02: Impact Matrix ───────────────────────────────────────────────────

function ImpactCard() {
  const p0Count = expectedImpactMatrix.filter((i) => i.priority === "P0").length;
  const p1Count = expectedImpactMatrix.filter((i) => i.priority === "P1").length;

  return (
    <Card className="flex flex-col gap-6 p-7 md:p-9">
      <div className="flex flex-col gap-1.5">
        <Label>08 — Expected Impact Matrix</Label>
        <CardHeading className="text-[clamp(1.45rem,2.4vw,2rem)]">
          Effort vs Impact
        </CardHeading>
        <div className="pt-1">
          <PriorityLegend />
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { value: p0Count, label: "Urgent", dataKey: "p0", accent: "text-white" },
          { value: p1Count, label: "Next", dataKey: "p1", accent: "text-white/62" },
          { value: auditMeta.issueCount, label: "Broken link", dataKey: "broken", accent: "text-white/72" },
        ].map(({ value, label, dataKey, accent }) => (
          <div
            key={dataKey}
            className="rounded-xl border border-white/[0.07] bg-black/15 p-4 text-center"
          >
            <p className={`font-anton text-[2.45rem] leading-none count-up ${accent}`} data-target={value}>
              {value}
            </p>
            <p className="mt-1.5 font-general text-[10px] uppercase tracking-[0.16em] text-white/28">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Effort / Impact rows */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label>Effort vs Impact</Label>
          <div className="hidden gap-3 sm:flex">
            <div className="flex items-center gap-1.5">
              <div className={`h-[2px] w-4 rounded ${EFFORT_BG} opacity-55`} />
              <span className={`font-general text-[10px] uppercase tracking-wider ${EFFORT_TEXT} opacity-65`}>Effort</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`h-[2px] w-4 rounded ${ACCENT_BG} opacity-75`} />
              <span className="font-general text-[10px] uppercase tracking-wider text-white/24">Impact</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {expectedImpactMatrix.map((item) => (
            <div
              key={item.recommendation}
              className="rounded-xl border border-white/[0.06] bg-black/12 p-4"
            >
            <div className="flex items-start justify-between gap-3">
              <p className="font-general text-[0.9rem] font-medium leading-snug text-white/70">
                {item.recommendation}
              </p>
              <PBadge level={item.priority} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <p className="mb-1 font-general text-[10px] uppercase tracking-[0.16em] text-white/24">
                  Effort · {item.effort}
                </p>
                <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                  className={`h-full rounded-full ${EFFORT_BG} opacity-55 anim-bar`}
                    data-width={`${(item.effortScore / 3) * 100}%`}
                    style={{ width: 0 }}
                  />
                </div>
              </div>
              <div>
                <p className="mb-1 font-general text-[10px] uppercase tracking-[0.16em] text-white/24">
                  Impact · {item.impact}
                </p>
                <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full ${item.priority === "P0" ? ACCENT_BG : "bg-amber-300"} opacity-70 anim-bar`}
                    data-width={`${(item.impactScore / 3) * 100}%`}
                    style={{ width: 0 }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-3 border-t border-white/[0.06] pt-3 font-general text-[0.78rem] leading-[1.5] text-white/36">
              <span className="text-white/55">Success metric:</span> {item.successMetric}
            </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Card 03: Key Findings Matrix ────────────────────────────────────────────

function FindingsCard() {
  const total = keyFindings.length;
  const p0 = keyFindings.filter((f) => f.priority === "P0").length;
  const p1 = keyFindings.filter((f) => f.priority === "P1").length;

  return (
    <Card className="flex flex-col gap-6 p-7 md:p-9">
      {/* Header — number and title intentionally separated */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1.5">
          <Label>03 — Key Findings</Label>
          <div className="mt-0.5 flex items-baseline gap-3">
            <span
              className="count-up font-anton text-[clamp(3.2rem,5vw,5.2rem)] leading-none text-white"
              data-target={total}
            >
              {total}
            </span>
            <CardHeading className="text-[clamp(1.3rem,2vw,1.7rem)] text-white/72">
              Findings
            </CardHeading>
          </div>
          <p className="max-w-[520px] font-general text-sm leading-[1.6] text-white/40">
            Executive summary of the conversion friction, ordered by priority and journey sequence.
          </p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <PBadge level="P0" />
          <span className="font-general text-[11px] text-white/30">×{p0}</span>
          <span className="mx-1 text-white/[0.1]">·</span>
          <PBadge level="P1" />
          <span className="font-general text-[11px] text-white/30">×{p1}</span>
        </div>
      </div>

      {/* Category bar — same accent family, different intensity per theme */}
      <div className="flex flex-col gap-2">
        <Label>By category</Label>
        <div className="mt-1 flex h-2 rounded-full bg-white/[0.06]">
          {categoryBreakdown.map((cat, index) => {
            const categoryFindings = keyFindings.filter((finding) => finding.category === cat.label);
            return (
            <div
              key={cat.label}
              className={`group relative ${ACCENT_BG} ${CATEGORY[cat.label]?.opacity ?? "opacity-25"} ${index === 0 ? "rounded-l-full" : ""} ${index === categoryBreakdown.length - 1 ? "rounded-r-full" : ""}`}
              style={{ flex: cat.count }}
            >
              <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 w-[240px] -translate-x-1/2 rounded-xl border border-white/[0.1] bg-[#111111] p-3 opacity-0 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-opacity duration-200 group-hover:opacity-100">
                <p className="font-general text-[11px] uppercase tracking-[0.16em] text-white/65">
                  {cat.label} · {cat.count} finding{cat.count > 1 ? "s" : ""}
                </p>
                <ul className="mt-2 flex flex-col gap-1">
                  {categoryFindings.map((finding) => (
                    <li key={finding.id} className="font-general text-[0.75rem] leading-[1.35] text-white/38">
                      {String(finding.id).padStart(2, "0")} · {finding.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            );
          })}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1.5">
          {categoryBreakdown.map((cat) => {
            const style = CATEGORY[cat.label];
            return (
              <div key={cat.label} className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${ACCENT_BG} ${style?.opacity ?? "opacity-25"}`} />
                <span className="font-general text-[10px] uppercase tracking-wider text-white/38">
                  {cat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rows */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] lg:grid-cols-2">
        {keyFindings.map((f) => (
          <div key={f.id} className="flex min-h-[132px] items-start gap-4 bg-[#121212] p-5">
            <span className="w-7 shrink-0 pt-0.5 font-anton text-lg leading-none text-white/18">
              {String(f.id).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-general text-[0.96rem] font-medium leading-snug text-white/78">
                {f.title}
              </p>
              <p className="mt-2 line-clamp-2 font-general text-[0.82rem] leading-[1.55] text-white/38">
                {f.detail}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <PBadge level={f.priority} />
              <CatBadge category={f.category} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Card 04: Conversion Flow Map ────────────────────────────────────────────

function FlowCard() {
  const intentWords = ["Understand", "Clarify", "Compare", "Trust", "Choose", "Buy", "Retain"];

  return (
    <Card className="relative flex flex-col gap-8 p-7 md:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(215,255,106,0.055),transparent_34%)]" />
      <div className="relative flex flex-col gap-1.5">
        <Label>06 — Conversion Flow</Label>
        <CardHeading className="text-[clamp(1.7rem,3vw,2.8rem)]">
          User Journey Map
        </CardHeading>
        <p className="mt-1 max-w-[480px] font-general text-sm leading-[1.6] text-white/36">
          The key conversion issue is not persuasion volume. It is decision
          sequence: understand, trust, choose, then buy.
        </p>
      </div>

      <div className="relative grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
        {/* Strategic path */}
        <div className="relative rounded-2xl border border-white/[0.07] bg-black/18 p-5 md:p-6">
          <div className="absolute bottom-8 left-[2.65rem] top-8 hidden w-px bg-white/[0.08] md:block" />
          <div className="grid grid-cols-1 gap-3">
            {conversionFlow.map((node, idx) => (
              <div
                key={node.step}
                className="relative grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-white/[0.07] bg-[#121212]/90 p-4 transition-colors duration-300 hover:border-white/[0.14]"
              >
                <div
                  className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border font-anton text-lg ${
                    node.severity === "high"
                      ? `${ACCENT_BORDER} ${ACCENT_TEXT} bg-[#d7ff6a]/[0.045]`
                      : node.severity === "medium"
                      ? "border-amber-300/20 bg-amber-300/[0.04] text-amber-300/80"
                      : "border-white/[0.1] bg-white/[0.025] text-white/45"
                  }`}
                >
                  {node.step}
                </div>
                <div className="min-w-0">
                  <p className="font-general text-[11px] uppercase tracking-[0.16em] text-white/30">
                    {intentWords[idx]}
                  </p>
                  <p className="mt-1 font-general text-base font-medium leading-tight text-white/80">
                    {node.label}
                  </p>
                </div>
                {idx < conversionFlow.length - 1 && (
                  <ArrowRight size={14} className="hidden text-white/18 sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Friction callouts mapped to each step */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {conversionFlow.map((node) => (
            <div
              key={node.step}
              className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 transition-colors duration-300 hover:border-white/[0.12]"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-general text-sm font-medium text-white/65">
                  {String(node.step).padStart(2, "0")} · {node.label}
                </p>
                <span className={`h-1.5 w-1.5 rounded-full ${node.severity === "high" ? ACCENT_BG : node.severity === "medium" ? "bg-amber-300" : "bg-white/25"}`} />
              </div>
              <p className="font-general text-[0.82rem] leading-[1.55] text-white/36">
                {node.friction}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Card 05: Prioritized Roadmap ────────────────────────────────────────────

function RoadmapCard() {
  return (
    <Card className="flex flex-col gap-7 p-7 md:p-10">
      <div className="flex flex-col gap-1.5 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1.5">
          <Label>07 — Prioritized Roadmap</Label>
          <CardHeading className="text-[clamp(1.55rem,2.8vw,2.3rem)]">
            What Changes First
          </CardHeading>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <PriorityLegend />
          <p className="max-w-[420px] font-general text-sm leading-[1.55] text-white/35 md:text-right">
            Ordered by conversion leverage: clarity first, guided commerce second,
            validation third.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-black/15 p-5">
        <div className="mb-3 flex items-center justify-between font-general text-[10px] uppercase tracking-[0.16em] text-white/30">
          <span>0</span>
          <span>Month 3</span>
        </div>
        <div className="grid h-2 overflow-hidden rounded-full bg-white/[0.06] md:grid-cols-[22%_34%_44%]">
          {[
            { label: "Week 1–2", color: ACCENT_BG },
            { label: "Week 3–6", color: "bg-amber-300" },
            { label: "Month 2–3", color: "bg-white/42" },
          ].map((segment) => (
            <div key={segment.label} className="relative overflow-hidden">
              <div
                className={`h-full ${segment.color} opacity-75 anim-timeline`}
                style={{ width: 0 }}
                data-width="100%"
              />
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 font-general text-[11px] uppercase tracking-[0.14em] text-white/34 md:grid-cols-3">
          <span>Week 1–2 · Quick Wins</span>
          <span>Week 3–6 · Medium Improvements</span>
          <span>Month 2–3 · Strategic Enhancements</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {roadmap.map((phase) => (
          <div
            key={phase.phase}
            className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-black/15 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-anton text-[1.35rem] uppercase leading-tight text-white/88">
                  {phase.phase}
                </p>
                <p className="mt-1 font-general text-[11px] uppercase tracking-wider text-white/32">
                  {phase.tag}
                </p>
              </div>
              <PBadge level={phase.priority} />
            </div>

            <div className="h-px w-full bg-white/[0.07]" />

            <ul className="flex flex-col gap-2.5">
              {phase.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 font-general text-[0.86rem] leading-[1.5] text-white/48"
                >
                  <span className={`mt-[7px] h-1 w-1 shrink-0 rounded-full ${phase.priority === "P0" ? ACCENT_BG : "bg-amber-300/80"}`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Card 06: Validation Inputs ───────────────────────────────────────────────

const ICON_PATHS = {
  BarChart2:    "M12 20V10M18 20V4M6 20v-4",
  MousePointer: "M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z",
  MessageSquare:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  FlaskConical: "M10 2v7.31l-4.73 7.64A2 2 0 0 0 7 20h10a2 2 0 0 0 1.73-2.95L14 9.31V2M8.5 2h7",
};

function ValidationCard() {
  return (
    <Card className="flex flex-col gap-5 p-7 md:p-8">
      <div className="flex flex-col gap-1.5">
        <Label>09 — Data to Request</Label>
        <CardHeading className="text-[clamp(1.3rem,2.4vw,1.85rem)]">
          Data to Request
        </CardHeading>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {validationInputs.map((block) => (
          <div
            key={block.label}
            className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-black/10 p-4"
          >
            <div className="flex items-center gap-2.5">
              <svg
                width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className="shrink-0 text-white/28"
              >
                <path d={ICON_PATHS[block.icon] ?? "M12 12h.01"} />
              </svg>
              <p className="font-general text-sm font-medium text-white/62">
                {block.label}
              </p>
            </div>
            <ul className="flex flex-col gap-1.5">
              {block.items.map((item) => (
                <li key={item} className="flex items-start gap-2 font-general text-[0.78rem] leading-[1.48] text-white/34">
                  <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-white/18" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function KaizenAudit() {
  useSimpleRouteReady();
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero reveal
      if (heroRef.current) {
        const els = Array.from(heroRef.current.children);
        gsap.set(els, { y: 22, opacity: 0 });
        gsap.to(els, {
          y: 0, opacity: 1, duration: 0.7,
          stagger: 0.08, ease: "power2.out", delay: 0.1,
        });
      }

      // Above-fold cards
      const aboveFold = gridRef.current?.querySelectorAll(".bento-above");
      if (aboveFold?.length) {
        gsap.set(aboveFold, { y: 22, opacity: 0 });
        gsap.to(aboveFold, {
          y: 0, opacity: 1, duration: 0.7,
          stagger: 0.1, ease: "power2.out", delay: 0.3,
        });
      }

      // Scroll-triggered cards
      gridRef.current?.querySelectorAll(".bento-scroll").forEach((el) => {
        gsap.set(el, { y: 20, opacity: 0 });
        gsap.to(el, {
          y: 0, opacity: 1, duration: 0.65, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none", once: true },
        });
      });

      // Count-up animations
      pageRef.current?.querySelectorAll(".count-up").forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;
        const obj = { value: 0 };
        el.textContent = "0";
        gsap.to(obj, {
          value: target, duration: 1, ease: "power2.out", delay: 0.5,
          onUpdate: () => { el.textContent = Math.round(obj.value); },
        });
      });

      // Bar width animations
      pageRef.current?.querySelectorAll(".anim-bar").forEach((el) => {
        const targetWidth = el.dataset.width ?? "0%";
        gsap.set(el, { width: 0 });
        gsap.to(el, {
          width: targetWidth, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none", once: true },
        });
      });

      pageRef.current?.querySelectorAll(".anim-timeline").forEach((el, index) => {
        const targetWidth = el.dataset.width ?? "100%";
        gsap.set(el, { width: 0 });
        gsap.to(el, {
          width: targetWidth,
          duration: 0.85,
          delay: index * 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none none",
            once: true,
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#0a0a0a] text-white"
    >
      <main className="w-full bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,#0a0a0a_0%,#0d0d0d_48%,#0a0a0a_100%)] pb-10 pt-6 md:pb-12 md:pt-10">
        <div className="mx-auto w-full max-w-[1720px] px-[5%]">

          {/* ── Hero ──────────────────────────────────────────────────── */}
          <div
            ref={heroRef}
            className="grid gap-6 border-b border-white/[0.07] pb-7 pt-8 md:grid-cols-[1fr_360px] md:items-end md:pb-8 md:pt-12"
          >
            <div>
              <span className="font-general text-[11px] uppercase tracking-[0.22em] text-white/26">
                CRO Audit · {auditMeta.platform} · {auditMeta.date}
              </span>
              <h1 className="mt-2 font-anton text-[clamp(4rem,12vw,10.5rem)] font-normal uppercase leading-[0.86] tracking-[0.005em] text-white">
                {auditMeta.client}
              </h1>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-end md:pb-2">
              <p className="max-w-[360px] font-general text-sm leading-[1.62] text-white/42 md:text-right">
                A compact visual cover for the CRO roadmap: offer clarity,
                client proof, qualified lead confidence and measurement.
              </p>
              <a
                href={auditMeta.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-full border ${ACCENT_BORDER} bg-white/[0.08] px-4 py-2.5 font-general text-[0.74rem] uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-white hover:text-[#0a0a0a]`}
              >
                View Audit Document
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* ── Bento grid ────────────────────────────────────────────── */}
          <div ref={gridRef} className="flex flex-col gap-4 pt-4 md:gap-5 md:pt-5">

            <div className="bento-above"><BusinessCard /></div>
            <div className="bento-scroll"><BenchmarkCard /></div>
            <div className="bento-scroll"><FindingsCard /></div>
            <div className="bento-scroll">
              <AuditRowsCard
                label="04 — Homepage, Service & Industry Pages"
                title="Primary B2B Lead Friction"
                rows={homepageProductAuditRows}
              />
            </div>
            <div className="bento-scroll">
              <AuditRowsCard
                label="05 — Funnel, Technical, UX & Trust"
                title="Funnel + Trust Audit"
                rows={funnelTrustAuditRows}
              />
            </div>
            <div className="bento-scroll"><FlowCard /></div>
            <div className="bento-scroll"><RoadmapCard /></div>
            <div className="bento-scroll"><ImpactCard /></div>
            <div className="bento-scroll"><ValidationCard /></div>

          </div>

          {/* ── Intentional close ─────────────────────────────────────── */}
          <div className="mt-5 rounded-[1.35rem] border border-white/[0.07] bg-white/[0.025] p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Label>10 — Measurement Note</Label>
                <p className="mt-2 max-w-[680px] font-general text-sm leading-[1.65] text-white/42">
                  {measurementNote}
                </p>
              </div>
              <a
                href={auditMeta.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border ${ACCENT_BORDER} bg-white/[0.08] px-4 py-2.5 font-general text-[0.74rem] uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-white hover:text-[#0a0a0a]`}
              >
                Full audit document
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
