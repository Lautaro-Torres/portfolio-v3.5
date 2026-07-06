"use client";

import { useState } from "react";
import {
  Download,
  RefreshCw,
  Check,
  AlertTriangle,
  ChevronRight,
  Loader2,
  Info,
  Monitor,
  Smartphone,
  Instagram,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { useImageLightbox, ImageLightbox, LightboxTrigger } from "@/components/ui/ImageLightbox";
import { productList } from "@/config/task1-products";
import { useSimpleRouteReady } from "@/hooks/useSimpleRouteReady";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";

// ─── Design tokens ────────────────────────────────────────────────────────────
const ACCENT = "text-[#d7ff6a]";
const ACCENT_BG = "bg-[#d7ff6a]";
const ACCENT_BORDER = "border-[#d7ff6a]/25";

// ─── Format options ───────────────────────────────────────────────────────────
const FORMATS = {
  "9:16": {
    label: "Stories / Reels",
    dims: "1080×1920",
    icon: Smartphone,
    aspectClass: "aspect-[9/16]",
  },
  "4:5": {
    label: "Instagram Feed",
    dims: "1080×1350",
    icon: Instagram,
    aspectClass: "aspect-[4/5]",
  },
  "16:9": {
    label: "Display",
    dims: "1920×1080",
    icon: Monitor,
    aspectClass: "aspect-video",
  },
};

// ─── Resolution options ───────────────────────────────────────────────────────
const RESOLUTIONS = {
  "2K": {
    label: "2K",
    description: "Good quality, ideal for social media. Faster generation.",
  },
  "4K": {
    label: "4K",
    description: "Maximum resolution, ideal for print or large displays. May take longer.",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename ?? "campo-alegre.png";
  a.click();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function QaBadge({ qa }) {
  if (!qa) return null;

  if (qa.warning) {
    return (
      <div className="flex items-start gap-2 px-3 py-2 rounded border border-white/[0.08] bg-white/[0.03] text-white/48 text-[11px]">
        <Info size={13} className="mt-0.5 shrink-0" />
        <span>{qa.warning}</span>
      </div>
    );
  }

  if (qa.error) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded border border-red-400/20 bg-red-400/[0.06] text-red-400 text-[11px]">
        <AlertTriangle size={13} className="shrink-0" />
        <span>Verification error: {qa.error}</span>
      </div>
    );
  }

  const isConsistent = qa.consistent && qa.score >= 70;

  return (
    <div
      className={`rounded border p-3 text-[11px] ${
        isConsistent
          ? "border-[#d7ff6a]/25 bg-[#d7ff6a]/[0.05]"
          : "border-amber-400/25 bg-amber-400/[0.05]"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          {isConsistent ? (
            <Check size={13} className="text-[#d7ff6a]" />
          ) : (
            <AlertTriangle size={13} className="text-amber-400" />
          )}
          <span
            className={`uppercase tracking-[0.12em] font-medium ${
              isConsistent ? "text-[#d7ff6a]" : "text-amber-400"
            }`}
          >
            {isConsistent ? "Consistent" : "Differences detected"}
          </span>
        </div>
        {qa.score != null && (
          <span className="text-white/48">Score: {qa.score}/100</span>
        )}
      </div>
      {qa.discrepancies?.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-white/55">
          {qa.discrepancies.map((d, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-amber-400 mt-0.5">·</span>
              {d}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-white/20 flex items-center gap-1">
        <Info size={10} className="shrink-0" />
        Image includes invisible SynthID watermark
      </p>
    </div>
  );
}

function FormatSelector({ format, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Object.entries(FORMATS).map(([key, f]) => {
        const Icon = f.icon;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex flex-col items-center gap-2 rounded-sm border p-4 transition-all ${
              format === key
                ? "border-[#d7ff6a]/35 bg-[#d7ff6a]/[0.05]"
                : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.13]"
            }`}
          >
            <div
              className={`w-10 rounded-sm border ${f.aspectClass} flex items-center justify-center ${
                format === key ? "border-[#d7ff6a]/40" : "border-white/[0.15]"
              }`}
            >
              <Icon size={13} className={format === key ? ACCENT : "text-white/40"} />
            </div>
            <div className="text-center">
              <p className={`text-[10px] leading-tight ${format === key ? ACCENT : "text-white/55"}`}>
                {f.label}
              </p>
              <p className="text-white/25 text-[9px] mt-0.5">{f.dims}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ModeSelector({ mode, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {Object.entries(MODES).map(([key, m]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 rounded-sm border p-4 text-left transition-all ${
            mode === key
              ? "border-[#d7ff6a]/35 bg-[#d7ff6a]/[0.05]"
              : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.13] hover:bg-white/[0.035]"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className={`text-[12px] font-medium ${mode === key ? ACCENT : "text-white/70"}`}>
                {m.label}
              </span>
              <span className={`text-[9px] uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-sm ${m.tagStyle}`}>
                {m.tag}
              </span>
            </div>
            <p className={`text-[16px] font-medium ${mode === key ? ACCENT : "text-white/60"}`}>
              {m.costLabel}
            </p>
          </div>
          <p className="text-white/25 text-[9px] mt-1">{m.speedLabel}</p>
        </button>
      ))}
    </div>
  );
}

function ResultImage({ image, loading, error, aspectClass, onOpenLightbox }) {
  if (loading) {
    return (
      <div className={`relative w-full ${aspectClass} rounded-sm border border-white/[0.08] bg-white/[0.025] flex flex-col items-center justify-center gap-3`}>
        <Loader2 size={28} className="text-[#d7ff6a] animate-spin" />
        <p className="text-white/48 text-[12px] uppercase tracking-[0.12em]">Generating…</p>
        <p className="text-white/28 text-[11px] text-center px-6">
          Expanding prompt and generating image — may take 15–35 seconds
        </p>
      </div>
    );
  }

  if (error) {
    const isBilling =
      error.includes("429") || error.includes("quota") || error.includes("RESOURCE_EXHAUSTED");
    return (
      <div className={`relative w-full ${aspectClass} rounded-sm border border-red-400/20 bg-red-400/[0.04] flex flex-col items-center justify-center gap-3 px-8 text-center`}>
        <AlertTriangle size={24} className="text-red-400/70" />
        {isBilling ? (
          <p className="text-white/40 text-[11px] leading-relaxed max-w-xs">
            API quota exhausted. Check billing in Google Cloud.
          </p>
        ) : (
          <p className="text-red-400/80 text-[13px]">{error}</p>
        )}
      </div>
    );
  }

  if (!image) return null;

  const content = (
    <img src={image} alt="Generated lifestyle image" className="h-full w-full object-cover" draggable={false} />
  );

  return (
    <div className={`relative w-full ${aspectClass} overflow-hidden rounded-sm border border-white/[0.08]`}>
      {onOpenLightbox ? (
        <LightboxTrigger
          items={[{ src: image, alt: "Generated lifestyle image" }]}
          onOpen={onOpenLightbox}
          className="h-full w-full"
        >
          {content}
        </LightboxTrigger>
      ) : (
        content
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Task1Generator() {
  useSimpleRouteReady();
  const { push } = useTransitionRouter();
  const lightbox = useImageLightbox();

  const [screen, setScreen] = useState("product"); // "product" | "config" | "result"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [format, setFormat] = useState("4:5");
  const [imageSize, setImageSize] = useState("2K");
  const [situacion, setSituacion] = useState("");

  // variants: array of { image, qaResult } — up to 3
  const [variants, setVariants] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const aspectClass = FORMATS[format].aspectClass;
  const selectedVariant = selectedIdx !== null ? variants[selectedIdx] : null;

  async function generate() {
    setLoading(true);
    setError(null);
    setVariants([]);
    setSelectedIdx(null);
    setScreen("result");

    try {
      const res = await fetch("/api/task1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: selectedProduct.id, situacion, format, imageSize }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error generating image");
      setVariants(data.variants ?? []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // ─── SCREEN: Product ───────────────────────────────────────────────────────
  if (screen === "product") {
    return (
      <main className="h-dvh flex flex-col bg-[#0a0a0a] pt-16 pb-4 overflow-hidden">
        <div className="max-w-[1900px] mx-auto px-[5%] flex flex-col flex-1 min-h-0 w-full">
          <BackButton href="/monks" />

          <div className="mt-6 mb-4 shrink-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-1">
              Task 1 · Campo Alegre
            </p>
            <h1 className="font-anton text-display text-white leading-none">
              Choose your beer
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 min-h-0">
            {productList.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setSituacion("");
                  setScreen("config");
                }}
                className="group flex flex-col rounded-sm border border-white/[0.08] bg-white/[0.02] hover:border-[#d7ff6a]/30 hover:bg-white/[0.035] transition-all duration-200 overflow-hidden text-left min-h-0"
              >
                <div className="relative flex-1 min-h-[200px] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.07)_0%,transparent_72%)]" />
                  <img
                    src={product.heroImage}
                    alt={product.displayName}
                    className="relative z-10 h-[82%] w-auto max-w-[68%] object-contain mix-blend-screen drop-shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4 shrink-0 border-t border-white/[0.06]">
                  <h2 className="text-white text-[15px] font-medium mb-0.5">
                    {product.displayName}
                  </h2>
                  <p className="text-white/40 text-[11px] mb-2">{product.heroDescriptor}</p>
                  <div className="flex items-center gap-1 text-[#d7ff6a] text-[10px] uppercase tracking-[0.14em] opacity-0 group-hover:opacity-100 transition-opacity">
                    Select
                    <ChevronRight size={11} />
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => push("/monks/task-1/overview")}
            className="mt-4 shrink-0 text-white/35 text-[10px] uppercase tracking-[0.14em] hover:text-white/60 transition-colors text-center"
          >
            See how we built this →
          </button>
        </div>
      </main>
    );
  }

  // ─── SCREEN: Config ────────────────────────────────────────────────────────
  if (screen === "config") {
    return (
      <main className="h-dvh flex flex-col bg-[#0a0a0a] pt-16 pb-4 overflow-y-auto">
        <div className="max-w-[1900px] mx-auto px-[5%] w-full">
          <button
            onClick={() => setScreen("product")}
            className="flex items-center gap-1.5 text-white/40 text-[11px] uppercase tracking-[0.14em] hover:text-white/70 transition-colors mb-8"
          >
            ← Beer
          </button>

          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-2">
              {selectedProduct.displayName}
            </p>
            <h1 className="font-anton text-headline text-white leading-none">
              Configure your image
            </h1>
          </div>

          <div className="flex flex-col gap-10 max-w-3xl">
            {/* Scene */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-3">
                Scene
              </p>
              <p className="text-white/30 text-[10px] mb-2 flex items-center gap-1.5">
                <Info size={10} />
                The product stays locked — describe any scene you want
              </p>
              <textarea
                value={situacion}
                onChange={(e) => setSituacion(e.target.value)}
                placeholder="e.g. a person drinking the beer on the beach at sunset"
                rows={5}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-sm px-3 py-3 text-white/70 text-[13px] leading-relaxed placeholder:text-white/25 focus:outline-none focus:border-[#d7ff6a]/30 resize-none"
              />
              <p className="text-white/25 text-[10px] mt-2">
                Short, simple phrases work better than overly detailed descriptions.
              </p>
            </div>

            {/* Formato */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-3">
                Format / channel
              </p>
              <FormatSelector format={format} onChange={setFormat} />
            </div>

            {/* Resolution */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-3">
                Resolution
              </p>
              <div className="flex gap-3 mb-4">
                {Object.entries(RESOLUTIONS).map(([key, r]) => (
                  <button
                    key={key}
                    onClick={() => setImageSize(key)}
                    className={`flex-1 rounded-sm border p-4 text-left transition-all ${
                      imageSize === key
                        ? "border-[#d7ff6a]/35 bg-[#d7ff6a]/[0.05]"
                        : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.13] hover:bg-white/[0.035]"
                    }`}
                  >
                    <p className={`text-[13px] font-medium mb-1 ${imageSize === key ? ACCENT : "text-white/70"}`}>
                      {r.label}
                    </p>
                    <p className="text-white/35 text-[10px] leading-relaxed">{r.description}</p>
                  </button>
                ))}
              </div>
              <p className="text-white/25 text-[10px] leading-relaxed border-l border-white/[0.08] pl-3">
                Small label text (specs, ingredients) may vary slightly between
                generations — a known AI model limitation. The logo and main design
                stay faithful.
              </p>
            </div>

            <div>
              <button
                onClick={generate}
                disabled={!situacion.trim()}
                className={`inline-flex items-center gap-2 ${ACCENT_BG} text-black text-[11px] uppercase tracking-[0.16em] font-medium px-6 py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                Generate image
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── SCREEN: Result ────────────────────────────────────────────────────────
  const variantLightboxItems = variants.map((variant, idx) => ({
    src: variant.image,
    alt: `Variant ${idx + 1}`,
    label: `Variant ${idx + 1}`,
  }));

  return (
    <main className="h-dvh flex flex-col bg-[#0a0a0a] pt-16 pb-4 overflow-y-auto">
      <div className="max-w-[1900px] mx-auto px-[5%] w-full flex flex-col flex-1 min-h-0">
        <button
          onClick={() => setScreen("config")}
          className="flex items-center gap-1.5 text-white/40 text-[11px] uppercase tracking-[0.14em] hover:text-white/70 transition-colors mb-6 shrink-0"
        >
          ← Configuration
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-white/30 text-[11px] uppercase tracking-[0.14em]">
                {selectedProduct.displayName}
              </span>
              <span className="text-white/20">·</span>
              <span className="text-white/40 text-[11px]">{FORMATS[format].label}</span>
              <span className="text-[9px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-sm border text-white/30 border-white/[0.06] bg-white/[0.02]">
                {imageSize}
              </span>
            </div>
            {!loading && variants.length > 0 && (
              <p className="text-white/25 text-[10px] mt-1">
                {selectedIdx !== null
                  ? "Variant selected — download or regenerate"
                  : "Select the best variant"}
              </p>
            )}
          </div>

          {!loading && variants.length > 0 && (
            <div className="flex gap-3">
              {selectedVariant && (
                <button
                  onClick={() => downloadDataUrl(selectedVariant.image, `${selectedProduct.id}.png`)}
                  className="inline-flex items-center gap-2 text-black text-[11px] uppercase tracking-[0.14em] font-medium bg-[#d7ff6a] px-4 py-2 rounded-sm hover:opacity-90 transition-opacity"
                >
                  <Download size={12} />
                  Download
                </button>
              )}
              <button
                onClick={generate}
                className="inline-flex items-center gap-2 text-white/55 text-[11px] uppercase tracking-[0.14em] border border-white/[0.08] px-4 py-2 rounded-sm hover:border-white/20 hover:text-white/75 transition-all"
              >
                <RefreshCw size={12} />
                Regenerate 3
              </button>
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={28} className="text-[#d7ff6a] animate-spin" />
              <p className="text-white/48 text-[12px] uppercase tracking-[0.12em]">Generating…</p>
              <p className="text-white/28 text-[11px] text-center max-w-[220px]">
                Scene + 3 variants in parallel — ~90–120 sec
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 px-8 text-center">
              <AlertTriangle size={24} className="text-red-400/70" />
              <p className="text-red-400/80 text-[13px]">{error}</p>
            </div>
          </div>
        )}

        {/* 3-variant grid — fills remaining height, images scale to fit */}
        {!loading && variants.length > 0 && (
          <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {variants.map((v, i) => {
              const isSelected = selectedIdx === i;
              const qa = v.qaResult;
              const qaOk = qa?.consistent && qa?.score >= 70;
              return (
                <div
                  key={i}
                  className={`flex flex-col rounded-sm border overflow-hidden transition-all cursor-pointer min-h-0 ${
                    isSelected
                      ? "border-[#d7ff6a]/50 shadow-[0_0_0_1px_rgba(215,255,106,0.2)]"
                      : "border-white/[0.08] hover:border-white/[0.18]"
                  }`}
                  onClick={() => setSelectedIdx(i)}
                >
                  <div className="relative flex-1 min-h-0 bg-white/[0.02]">
                    <LightboxTrigger
                      items={variantLightboxItems}
                      index={i}
                      onOpen={lightbox.open}
                      className="absolute inset-0 h-full w-full"
                    >
                      <img
                        src={v.image}
                        alt={`Variant ${i + 1}`}
                        className="absolute inset-0 h-full w-full object-cover"
                        draggable={false}
                      />
                    </LightboxTrigger>
                    {isSelected && (
                      <div className="pointer-events-none absolute top-3 right-3 rounded-full bg-[#d7ff6a] p-1">
                        <Check size={12} className="text-black" />
                      </div>
                    )}
                    <div className="pointer-events-none absolute top-3 left-3 rounded-sm bg-black/50 px-2 py-0.5 backdrop-blur-sm">
                      <span className="text-[9px] uppercase tracking-[0.14em] text-white/70">
                        #{i + 1}
                      </span>
                    </div>
                  </div>

                  {/* Footer: QA + select */}
                  <div className="shrink-0 p-3 bg-white/[0.02] flex items-center justify-between gap-2">
                    {qa && !qa.error && !qa.warning && qa.score != null ? (
                      <div className={`flex items-center gap-1.5 text-[10px] ${qaOk ? "text-[#d7ff6a]" : "text-amber-400"}`}>
                        {qaOk ? <Check size={10} /> : <AlertTriangle size={10} />}
                        <span>QA {qa.score}/100</span>
                      </div>
                    ) : (
                      <span className="text-white/25 text-[10px]">QA —</span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedIdx(i); }}
                      className={`text-[10px] uppercase tracking-[0.14em] px-3 py-1 rounded-sm border transition-all ${
                        isSelected
                          ? "border-[#d7ff6a]/40 text-[#d7ff6a] bg-[#d7ff6a]/[0.08]"
                          : "border-white/[0.1] text-white/40 hover:border-white/25 hover:text-white/65"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ImageLightbox
        items={lightbox.items}
        index={lightbox.index}
        onClose={lightbox.close}
        onNavigate={lightbox.go}
      />
    </main>
  );
}
