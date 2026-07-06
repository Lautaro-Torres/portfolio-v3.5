"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Download,
  RefreshCw,
  Lock,
  Check,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Layers,
  Loader2,
  ImageIcon,
  Info,
} from "lucide-react";
import Button from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";
import { scenes } from "@/config/lifestyle-scenes";
import { product } from "@/config/lifestyle-product";

// ─── Design tokens (matches existing audit pages) ────────────────────────────
const ACCENT = "text-[#d7ff6a]";
const ACCENT_BG = "bg-[#d7ff6a]";
const ACCENT_BORDER = "border-[#d7ff6a]/25";

// ─── Pricing / model metadata ────────────────────────────────────────────────
const MODES = {
  draft: {
    label: "Draft",
    modelName: "Nano Banana",
    modelId: "gemini-2.5-flash-image",
    costUsd: 0.039,
    costLabel: "~$0.04",
    speedLabel: "~10 seg",
    qualityLabel: "Alta",
    description: "Exploración rápida de escenas. Calidad comercial.",
    tag: "Recomendado",
    tagStyle: `${ACCENT_BG} text-black`,
  },
  final: {
    label: "Final",
    modelName: "Nano Banana Pro",
    modelId: "gemini-3-pro-image-preview",
    costUsd: 0.12,
    costLabel: "~$0.12",
    speedLabel: "~25 seg",
    qualityLabel: "Máxima",
    description: "Máxima fidelidad y detalle. Para entregables finales.",
    tag: "Pro",
    tagStyle: "bg-white/[0.08] text-white/60",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename ?? "lifestyle.png";
  a.click();
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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
        <span>Error al verificar: {qa.error}</span>
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
            {isConsistent ? "Consistente" : "Diferencias detectadas"}
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
      <p className="mt-2 text-white/30 flex items-center gap-1">
        <Info size={10} className="shrink-0" />
        Imagen con marca de agua SynthID invisible
      </p>
    </div>
  );
}

function ModeSelector({ mode, onChange, compact = false }) {
  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-1">
          Modo de generación
        </p>
        {Object.entries(MODES).map(([key, m]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-start justify-between gap-3 rounded-sm border px-3 py-2.5 text-left transition-all ${
              mode === key
                ? "border-[#d7ff6a]/30 bg-[#d7ff6a]/[0.05]"
                : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12]"
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`text-[10px] font-medium ${mode === key ? ACCENT : "text-white/60"}`}>
                  {m.label}
                </span>
                <span className="text-white/25 text-[9px]">·</span>
                <span className="text-white/35 text-[9px]">{m.modelName}</span>
              </div>
              <p className="text-white/30 text-[10px]">{m.speedLabel} · {m.qualityLabel} calidad</p>
            </div>
            <span className="text-[11px] font-medium text-white/55 shrink-0">{m.costLabel}</span>
          </button>
        ))}
        <p className="text-white/20 text-[10px]">por imagen generada</p>
      </div>
    );
  }

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
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[12px] font-medium ${mode === key ? ACCENT : "text-white/70"}`}>
                  {m.label}
                </span>
                <span className={`text-[9px] uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-sm ${m.tagStyle}`}>
                  {m.tag}
                </span>
              </div>
              <p className="text-white/35 text-[10px]">{m.modelName}</p>
            </div>
            {/* Cost */}
            <div className="text-right">
              <p className={`text-[18px] font-medium leading-none ${mode === key ? ACCENT : "text-white/60"}`}>
                {m.costLabel}
              </p>
              <p className="text-white/30 text-[9px] mt-0.5">por imagen</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: "Velocidad", value: m.speedLabel },
              { label: "Calidad", value: m.qualityLabel },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/[0.03] rounded-sm px-2 py-1.5">
                <p className="text-white/30 text-[9px] uppercase tracking-[0.1em] mb-0.5">{label}</p>
                <p className="text-white/65 text-[11px]">{value}</p>
              </div>
            ))}
          </div>

          <p className="text-white/40 text-[11px] leading-relaxed">{m.description}</p>

          {/* Model ID */}
          <p className="mt-2 text-white/20 text-[9px] font-mono truncate">{m.modelId}</p>
        </button>
      ))}
    </div>
  );
}

function SceneCard({ scene, onSelect, loading }) {
  return (
    <button
      onClick={() => onSelect(scene)}
      disabled={loading}
      className="group relative flex flex-col justify-end rounded-sm border border-white/[0.08] bg-white/[0.025] hover:border-[#d7ff6a]/30 hover:bg-white/[0.04] transition-all duration-200 p-4 min-h-[140px] text-left disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-center gap-1.5 mb-1">
        <ImageIcon size={11} className="text-white/30" />
        <span className="text-[10px] uppercase tracking-[0.14em] text-white/30">Escena</span>
      </div>
      <p className="text-white/85 text-[13px] font-medium leading-snug">{scene.title}</p>
      <p className="mt-1 text-white/35 text-[11px] leading-relaxed line-clamp-2">
        {scene.environmentPrompt}
      </p>
      <div className="mt-3 flex items-center gap-1 text-[#d7ff6a] text-[10px] uppercase tracking-[0.14em] opacity-0 group-hover:opacity-100 transition-opacity">
        Generar
        <ChevronRight size={11} />
      </div>
    </button>
  );
}

function ResultImage({ image, loading, error }) {
  if (loading) {
    return (
      <div className="relative w-full aspect-[4/3] rounded-sm border border-white/[0.08] bg-white/[0.025] flex flex-col items-center justify-center gap-3">
        <Loader2 size={28} className="text-[#d7ff6a] animate-spin" />
        <p className="text-white/48 text-[12px] uppercase tracking-[0.12em]">Generando…</p>
        <p className="text-white/28 text-[11px]">Esto puede tardar 10–30 segundos</p>
      </div>
    );
  }

  if (error) {
    const isBilling =
      error.includes("429") ||
      error.includes("quota") ||
      error.includes("RESOURCE_EXHAUSTED") ||
      error.includes("free_tier");
    return (
      <div className="relative w-full aspect-[4/3] rounded-sm border border-red-400/20 bg-red-400/[0.04] flex flex-col items-center justify-center gap-3 px-8 text-center">
        <AlertTriangle size={24} className="text-red-400/70" />
        {isBilling ? (
          <>
            <p className="text-red-400/80 text-[13px] font-medium">
              Cuota de API agotada
            </p>
            <p className="text-white/40 text-[11px] leading-relaxed max-w-xs">
              Los modelos de imagen requieren billing activado en Google Cloud.
              Activalo en{" "}
              <a
                href="https://console.cloud.google.com/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d7ff6a] underline underline-offset-2"
              >
                console.cloud.google.com/billing
              </a>{" "}
              y vinculá una tarjeta al proyecto.
            </p>
          </>
        ) : (
          <p className="text-red-400/80 text-[13px]">{error}</p>
        )}
      </div>
    );
  }

  if (!image) return null;

  return (
    <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden border border-white/[0.08]">
      <img
        src={image}
        alt="Imagen lifestyle generada"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function BatchGallery({ results, loading, progress }) {
  if (!loading && results.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/85 text-[13px] uppercase tracking-[0.14em]">
          Galería batch
        </h3>
        {loading && (
          <span className="text-white/40 text-[11px]">
            {progress.current} / {progress.total} escenas
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {results.map(({ scene, image, qa, error: err }) => (
          <div key={scene.id} className="flex flex-col gap-1.5">
            {image ? (
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-white/[0.08]">
                <img
                  src={image}
                  alt={scene.title}
                  className="w-full h-full object-cover"
                />
                {qa && (
                  <div className="absolute top-2 right-2">
                    {qa.consistent && qa.score >= 70 ? (
                      <span className="flex items-center gap-1 bg-[#d7ff6a]/90 text-black text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm font-medium">
                        <Check size={9} /> OK
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-amber-400/90 text-black text-[9px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm font-medium">
                        <AlertTriangle size={9} /> Rev
                      </span>
                    )}
                  </div>
                )}
                <button
                  onClick={() => downloadDataUrl(image, `${scene.id}.png`)}
                  className="absolute bottom-2 right-2 p-1.5 rounded-sm bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-colors"
                  title="Descargar"
                >
                  <Download size={12} />
                </button>
              </div>
            ) : err ? (
              <div className="aspect-[4/3] rounded-sm border border-red-400/20 bg-red-400/[0.04] flex items-center justify-center">
                <AlertTriangle size={16} className="text-red-400/60" />
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-sm border border-white/[0.08] bg-white/[0.025] flex items-center justify-center">
                <Loader2 size={16} className="text-white/30 animate-spin" />
              </div>
            )}
            <p className="text-white/48 text-[10px] truncate">{scene.title}</p>
          </div>
        ))}
        {/* Pending slots during batch */}
        {loading &&
          Array.from({ length: scenes.length - results.length }).map((_, i) => (
            <div key={`pending-${i}`} className="flex flex-col gap-1.5">
              <div className="aspect-[4/3] rounded-sm border border-white/[0.04] bg-white/[0.01] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border border-white/[0.08] animate-pulse" />
              </div>
              <div className="h-3 w-16 rounded bg-white/[0.05] animate-pulse" />
            </div>
          ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LifestyleGenerator() {
  const [step, setStep] = useState("product"); // "product" | "scenes" | "result"
  const [selectedScene, setSelectedScene] = useState(null);
  const [mode, setMode] = useState("draft");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [qaResult, setQaResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [customScene, setCustomScene] = useState("");

  async function generate(scene, selectedMode = mode) {
    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    setQaResult(null);
    setStep("result");

    try {
      const body =
        advancedOpen && customScene
          ? { sceneId: "__custom__", customScene, mode: selectedMode }
          : { sceneId: scene.id, mode: selectedMode };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error generando imagen");

      setGeneratedImage(data.image);

      // Auto-run QA verify
      try {
        const vRes = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: data.image }),
        });
        if (vRes.ok) setQaResult(await vRes.json());
      } catch {
        // QA is best-effort; don't fail the whole flow
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function generateAll() {
    setBatchLoading(true);
    setBatchResults([]);
    setBatchProgress({ current: 0, total: scenes.length });
    setStep("result");
    setGeneratedImage(null);
    setQaResult(null);

    const results = [];
    for (let i = 0; i < scenes.length; i++) {
      setBatchProgress({ current: i + 1, total: scenes.length });
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sceneId: scenes[i].id, mode }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Error");

        let qa = null;
        try {
          const vRes = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: data.image }),
          });
          if (vRes.ok) qa = await vRes.json();
        } catch {}

        results.push({ scene: scenes[i], image: data.image, qa });
      } catch (e) {
        results.push({ scene: scenes[i], error: e.message });
      }
      setBatchResults([...results]);
    }
    setBatchLoading(false);
  }

  function handleSceneSelect(scene) {
    setSelectedScene(scene);
    generate(scene);
  }

  // ─── STEP: Product ────────────────────────────────────────────────────────
  if (step === "product") {
    return (
      <main className="min-h-screen bg-[#0a0a0a] pt-20 pb-16">
        <div className="max-w-[1900px] mx-auto px-[5%]">
          <BackButton />

          <div className="mt-10 mb-6 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Lifestyle Generator
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: product info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lock size={12} className="text-white/30" />
                <span className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                  Producto bloqueado
                </span>
              </div>

              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 mb-1">
                  {product.subtitle ?? "Vehículo"}
                </p>
                <h1 className="font-anton text-display text-white leading-none">
                  {product.displayName}
                </h1>
              </div>

              <p className="text-white/55 text-[13px] leading-relaxed mb-6 max-w-sm">
                Tu producto se mantiene idéntico en cada imagen generada. La
                consistencia visual no depende de cómo escribás el prompt — la
                garantiza la arquitectura.
              </p>

              <div className="flex flex-col gap-2 mb-8 text-[11px] text-white/40 border border-white/[0.06] rounded-sm p-4 bg-white/[0.015]">
                <div className="flex items-center gap-2">
                  <Check size={11} className={ACCENT} />
                  Color de carrocería bloqueado
                </div>
                <div className="flex items-center gap-2">
                  <Check size={11} className={ACCENT} />
                  Grilla, llantas y badges idénticos
                </div>
                <div className="flex items-center gap-2">
                  <Check size={11} className={ACCENT} />
                  Proporciones y líneas de carrocería preservadas
                </div>
                <div className="flex items-center gap-2">
                  <Check size={11} className={ACCENT} />
                  Verificación QA automática por imagen
                </div>
              </div>

              <button
                onClick={() => setStep("scenes")}
                className={`inline-flex items-center gap-2 ${ACCENT_BG} text-black text-[11px] uppercase tracking-[0.16em] font-medium px-5 py-2.5 rounded-sm hover:opacity-90 transition-opacity`}
              >
                Elegir escena
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Right: hero image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-white/[0.08] bg-white/[0.025]">
                {product.heroImage && (
                  <img
                    src={product.heroImage}
                    alt={product.displayName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-sm border border-white/[0.08]">
                <Lock size={10} className="text-white/40" />
                <span className="text-[9px] uppercase tracking-[0.14em] text-white/40">
                  Producto fijo
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── STEP: Scenes ─────────────────────────────────────────────────────────
  if (step === "scenes") {
    return (
      <main className="min-h-screen bg-[#0a0a0a] pt-20 pb-16">
        <div className="max-w-[1900px] mx-auto px-[5%]">
          <button
            onClick={() => setStep("product")}
            className="flex items-center gap-1.5 text-white/40 text-[11px] uppercase tracking-[0.14em] hover:text-white/70 transition-colors mb-10"
          >
            ← Producto
          </button>

          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-2">
              Paso 2 de 3
            </p>
            <h1 className="font-anton text-headline text-white leading-none mb-6">
              Elegí una escena
            </h1>
            <ModeSelector mode={mode} onChange={setMode} />
          </div>

          {/* Scene grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {scenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                onSelect={handleSceneSelect}
                loading={loading}
              />
            ))}
          </div>

          {/* Advanced mode toggle */}
          <div className="border-t border-white/[0.06] pt-6">
            <button
              onClick={() => setAdvancedOpen((v) => !v)}
              className="flex items-center gap-2 text-white/35 text-[11px] uppercase tracking-[0.14em] hover:text-white/55 transition-colors"
            >
              <ChevronDown
                size={13}
                className={`transition-transform ${advancedOpen ? "rotate-180" : ""}`}
              />
              Modo avanzado
            </button>

            {advancedOpen && (
              <div className="mt-4 max-w-xl">
                <label className="block text-[10px] uppercase tracking-[0.14em] text-white/40 mb-2">
                  Escena libre (reemplaza la capa 3)
                </label>
                <textarea
                  value={customScene}
                  onChange={(e) => setCustomScene(e.target.value)}
                  placeholder="Ej: en una playa privada al amanecer, una persona meditando sobre el capó…"
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-sm px-3 py-2.5 text-white/70 text-[12px] placeholder:text-white/25 focus:outline-none focus:border-[#d7ff6a]/30 resize-none"
                />
                {customScene.trim() && (
                  <button
                    onClick={() =>
                      generate(
                        { id: "__custom__", title: "Escena personalizada" },
                        mode
                      )
                    }
                    className={`mt-3 inline-flex items-center gap-2 ${ACCENT_BG} text-black text-[11px] uppercase tracking-[0.16em] font-medium px-4 py-2 rounded-sm hover:opacity-90 transition-opacity`}
                  >
                    Generar escena libre
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ─── STEP: Result ─────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-20 pb-16">
      <div className="max-w-[1900px] mx-auto px-[5%]">
        <button
          onClick={() => {
            setStep("scenes");
            setBatchResults([]);
          }}
          className="flex items-center gap-1.5 text-white/40 text-[11px] uppercase tracking-[0.14em] hover:text-white/70 transition-colors mb-10"
        >
          ← Escenas
        </button>

        <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Left: generated image */}
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-white/30 text-[11px] uppercase tracking-[0.14em]">
                {product.displayName}
              </span>
              {selectedScene && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-white/55 text-[13px]">
                    {selectedScene.title}
                  </span>
                </>
              )}
              <span
                className={`text-[9px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-sm border ${
                  mode === "final"
                    ? `${ACCENT} ${ACCENT_BORDER} bg-[#d7ff6a]/[0.06]`
                    : "text-white/30 border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                {mode === "final" ? "Final · Pro" : "Draft"}
              </span>
            </div>

            <ResultImage
              image={generatedImage}
              loading={loading}
              error={error}
            />

            {/* Action buttons */}
            {generatedImage && !loading && (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => generate(selectedScene, mode)}
                  className="inline-flex items-center gap-2 text-white/55 text-[11px] uppercase tracking-[0.14em] border border-white/[0.08] px-4 py-2 rounded-sm hover:border-white/20 hover:text-white/75 transition-all"
                >
                  <RefreshCw size={12} />
                  Regenerar
                </button>
                <button
                  onClick={() =>
                    downloadDataUrl(
                      generatedImage,
                      `${selectedScene?.id ?? "lifestyle"}.png`
                    )
                  }
                  className="inline-flex items-center gap-2 text-white/55 text-[11px] uppercase tracking-[0.14em] border border-white/[0.08] px-4 py-2 rounded-sm hover:border-white/20 hover:text-white/75 transition-all"
                >
                  <Download size={12} />
                  Descargar
                </button>
                <button
                  onClick={generateAll}
                  disabled={batchLoading}
                  className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] px-4 py-2 rounded-sm transition-all ${
                    batchLoading
                      ? "text-white/25 border border-white/[0.04] cursor-not-allowed"
                      : `${ACCENT_BG} text-black font-medium hover:opacity-90`
                  }`}
                >
                  {batchLoading ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Generando {batchProgress.current}/{batchProgress.total}…
                    </>
                  ) : (
                    <>
                      <Layers size={12} />
                      Generar todas las escenas
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Batch gallery */}
            <BatchGallery
              results={batchResults}
              loading={batchLoading}
              progress={batchProgress}
            />
          </div>

          {/* Right: QA panel + scene info */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-3">
                Verificación QA
              </p>
              {loading ? (
                <div className="flex items-center gap-2 text-white/35 text-[11px]">
                  <Loader2 size={13} className="animate-spin" />
                  Generando y verificando…
                </div>
              ) : (
                <QaBadge qa={qaResult} />
              )}
            </div>

            {/* Scene details */}
            {selectedScene && selectedScene.id !== "__custom__" && (
              <div className="border border-white/[0.06] rounded-sm p-4 bg-white/[0.015] text-[11px] space-y-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                  Escena
                </p>
                <div>
                  <p className="text-white/30 mb-0.5">Entorno</p>
                  <p className="text-white/55 leading-relaxed">
                    {selectedScene.environmentPrompt}
                  </p>
                </div>
                <div>
                  <p className="text-white/30 mb-0.5">Interacción</p>
                  <p className="text-white/55 leading-relaxed">
                    {selectedScene.interactionPrompt}
                  </p>
                </div>
              </div>
            )}

            <ModeSelector
              mode={mode}
              onChange={(m) => {
                setMode(m);
                if (!loading && selectedScene) generate(selectedScene, m);
              }}
              compact
            />
          </div>
        </div>
      </div>
    </main>
  );
}
