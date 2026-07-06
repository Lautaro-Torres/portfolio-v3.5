"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Upload,
  Download,
  RefreshCw,
  ArrowRight,
  Loader2,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";
import BackButton from "@/components/ui/BackButton";
import { useImageLightbox, ImageLightbox, LightboxTrigger } from "@/components/ui/ImageLightbox";
import { useSimpleRouteReady } from "@/hooks/useSimpleRouteReady";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";

// ─── Design tokens ────────────────────────────────────────────────────────────
const ACCENT = "text-[#d7ff6a]";
const ACCENT_BG = "bg-[#d7ff6a]";

// ─── Style profile (BMW moodboard) ────────────────────────────────────────────
const STYLE_PROFILE = {
  brand_cue: "BMW — warm, human, cinematic",
  mood: ["warm", "aspirational", "filmic", "sun-drenched"],
  color: {
    grade: "film-like, warm highlights, teal shadows",
    base_palette: ["#D3A878", "#EAC9A0", "#E08A3C", "#E8B93C"],
    accent_palette: ["#22B4D6", "#9BC4A0"],
    pop_color: "#E8481C",
  },
  lighting: { primary: "golden hour", direction: "low lateral / backlit" },
  composition: {
    signature: "shooting through glass",
    subject_logic: "human + product in same frame",
  },
  texture: ["vermouth leather", "chrome/metal", "film grain"],
};

// Flat list of chips to show during loading
const STYLE_CHIPS = [
  STYLE_PROFILE.brand_cue,
  ...STYLE_PROFILE.mood,
  STYLE_PROFILE.color.grade,
  `lighting: ${STYLE_PROFILE.lighting.primary}`,
  `direction: ${STYLE_PROFILE.lighting.direction}`,
  `composition: ${STYLE_PROFILE.composition.signature}`,
  ...STYLE_PROFILE.texture,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename ?? "style-transfer.png";
  a.click();
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function dataURLtoBase64AndMime(dataURL) {
  const [header, base64] = dataURL.split(",");
  const mime = header.match(/data:([^;]+)/)?.[1] ?? "image/jpeg";
  return { base64, mime };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StyleChip({ label, color }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-[0.12em] border border-white/[0.08] bg-white/[0.04] text-white/55 font-medium"
      style={color ? { borderColor: `${color}40`, color } : {}}
    >
      {label}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Task3Generator() {
  useSimpleRouteReady();
  const { push } = useTransitionRouter();
  const lightbox = useImageLightbox();

  const [screen, setScreen] = useState("upload"); // "upload" | "loading" | "result"
  const [uploadedFile, setUploadedFile] = useState(null); // { previewUrl, dataURL, name }
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const generateCalledRef = useRef(false);

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const previewUrl = URL.createObjectURL(file);
    const dataURL = await readFileAsDataURL(file);
    setUploadedFile({ previewUrl, dataURL, name: file.name });
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // ── Generation ────────────────────────────────────────────────────────────
  function startGenerate() {
    if (!uploadedFile) return;
    generateCalledRef.current = false;
    setGeneratedImage(null);
    setError(null);
    setScreen("loading");
  }

  // Fire the API call when the loading screen mounts
  useEffect(() => {
    if (screen !== "loading" || !uploadedFile || generateCalledRef.current) return;
    generateCalledRef.current = true;

    const { base64, mime } = dataURLtoBase64AndMime(uploadedFile.dataURL);

    fetch("/api/task3/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64, imageMime: mime }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Error generating image");
        setGeneratedImage(data.image);
        setScreen("result");
      })
      .catch((e) => {
        setError(e.message);
        setScreen("result");
      });
  }, [screen, uploadedFile]);

  // ── SCREEN: Upload ─────────────────────────────────────────────────────────
  if (screen === "upload") {
    return (
      <main className="h-dvh flex flex-col bg-[#0a0a0a] pt-16 pb-4 overflow-hidden">
        <div className="max-w-[1900px] mx-auto px-[5%] flex flex-col flex-1 min-h-0 w-full">
          <BackButton href="/monks" />

          <div className="mt-6 mb-6 shrink-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-1">
              Task 3 · Style Transfer
            </p>
            <h1 className="font-anton text-display text-white leading-none">
              Apply the style
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            {/* Drop zone */}
            <div
              className={`flex-1 min-h-0 flex flex-col rounded-sm border-2 border-dashed transition-all cursor-pointer ${
                isDragging
                  ? "border-[#d7ff6a]/50 bg-[#d7ff6a]/[0.04]"
                  : uploadedFile
                  ? "border-white/[0.12] bg-white/[0.02]"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18]"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !uploadedFile && fileInputRef.current?.click()}
            >
              {uploadedFile ? (
                <div className="relative flex-1 min-h-0">
                  <img
                    src={uploadedFile.previewUrl}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/60 text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-sm border border-white/[0.1] hover:text-white transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
                  <div className="w-12 h-12 rounded-full border border-white/[0.1] flex items-center justify-center">
                    <ImageIcon size={20} className="text-white/30" />
                  </div>
                  <p className="text-white/40 text-[13px] text-center">
                    Drag an image here or click to upload
                  </p>
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.12em]">
                    JPG · PNG · WebP
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>

            {/* Right panel: style info + action */}
            <div className="lg:w-72 shrink-0 flex flex-col gap-4">
              <div className="rounded-sm border border-white/[0.08] bg-white/[0.02] p-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/30 mb-3">
                  Style Profile
                </p>
                <p className={`text-[11px] font-medium mb-3 ${ACCENT}`}>
                  BMW
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {STYLE_CHIPS.map((chip) => (
                    <StyleChip key={chip} label={chip} />
                  ))}
                </div>
              </div>

              <button
                onClick={startGenerate}
                disabled={!uploadedFile}
                className={`inline-flex items-center justify-center gap-2 ${ACCENT_BG} text-black text-[11px] uppercase tracking-[0.16em] font-medium px-6 py-3 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                Apply Style
                <ArrowRight size={13} />
              </button>

              <button
                onClick={() => push("/monks/task-3/overview")}
                className="text-white/35 text-[10px] uppercase tracking-[0.14em] hover:text-white/60 transition-colors text-center"
              >
                How we built this →
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── SCREEN: Loading ────────────────────────────────────────────────────────
  if (screen === "loading") {
    return (
      <main className="h-dvh flex flex-col items-center justify-center bg-[#0a0a0a] px-[5%]">
        <div className="max-w-lg w-full flex flex-col items-center gap-8">
          <Loader2 size={32} className="text-[#d7ff6a] animate-spin" />

          <div className="text-center">
            <p className="text-white text-[13px] font-medium mb-1">
              Applying BMW style...
            </p>
            <p className="text-white/35 text-[11px]">~30–60 seconds</p>
          </div>

          <div className="w-full">
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/25 mb-3 text-center">
              Active style profile
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {STYLE_CHIPS.map((chip, i) => (
                <span
                  key={chip}
                  className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-[0.10em] border border-white/[0.08] bg-white/[0.03] font-medium"
                  style={{
                    color: i === 0 ? "#d7ff6a" : undefined,
                    borderColor: i === 0 ? "rgba(215,255,106,0.3)" : undefined,
                    opacity: i === 0 ? 1 : 0.5 + (i % 3) * 0.15,
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Color swatches */}
          <div className="flex gap-1.5">
            {[...STYLE_PROFILE.color.base_palette, ...STYLE_PROFILE.color.accent_palette, STYLE_PROFILE.color.pop_color].map(
              (color) => (
                <div
                  key={color}
                  className="w-5 h-5 rounded-full border border-white/10"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              )
            )}
          </div>
        </div>
      </main>
    );
  }

  // ── SCREEN: Result ─────────────────────────────────────────────────────────
  return (
    <main className="h-dvh flex flex-col bg-[#0a0a0a] pt-16 pb-4 overflow-hidden">
      <div className="max-w-[1900px] mx-auto px-[5%] flex flex-col flex-1 min-h-0 w-full">
        <div className="flex items-center justify-between mb-4 shrink-0 flex-wrap gap-3">
          <button
            onClick={() => { setScreen("upload"); setGeneratedImage(null); setError(null); }}
            className="flex items-center gap-1.5 text-white/40 text-[11px] uppercase tracking-[0.14em] hover:text-white/70 transition-colors"
          >
            ← Try another
          </button>

          <div className="flex items-center gap-3">
            {generatedImage && (
              <button
                onClick={() => downloadDataUrl(generatedImage, "bmw-styled.png")}
                className={`inline-flex items-center gap-2 ${ACCENT_BG} text-black text-[11px] uppercase tracking-[0.14em] font-medium px-4 py-2 rounded-sm hover:opacity-90 transition-opacity`}
              >
                <Download size={12} />
                Download
              </button>
            )}
            <button
              onClick={() => push("/monks/task-3/overview")}
              className="inline-flex items-center gap-2 text-white/45 text-[11px] uppercase tracking-[0.14em] border border-white/[0.08] px-4 py-2 rounded-sm hover:border-white/20 hover:text-white/70 transition-all"
            >
              See how we built this
              <ArrowRight size={11} />
            </button>
          </div>
        </div>

        {error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center px-8">
              <AlertTriangle size={24} className="text-red-400/70" />
              <p className="text-red-400/80 text-[13px]">{error}</p>
              <button
                onClick={() => { setScreen("upload"); setError(null); }}
                className="text-white/40 text-[11px] uppercase tracking-[0.14em] hover:text-white/70 mt-2"
              >
                ← Volver
              </button>
            </div>
          </div>
        )}

        {generatedImage && (
          <div className="flex-1 min-h-0 flex gap-4">
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm border border-white/[0.08]">
              <LightboxTrigger
                items={[
                  ...(uploadedFile
                    ? [{ src: uploadedFile.previewUrl, alt: "Original", label: "Original" }]
                    : []),
                  { src: generatedImage, alt: "Style transfer result", label: "BMW styled" },
                ]}
                index={uploadedFile ? 1 : 0}
                onOpen={lightbox.open}
                className="absolute inset-0 h-full w-full"
              >
                <img
                  src={generatedImage}
                  alt="Style transfer result"
                  className="absolute inset-0 h-full w-full bg-black object-contain"
                  draggable={false}
                />
              </LightboxTrigger>
              <div className="pointer-events-none absolute top-3 left-3 rounded-sm bg-black/50 px-2 py-0.5 backdrop-blur-sm">
                <span className={`text-[9px] uppercase tracking-[0.14em] ${ACCENT}`}>
                  BMW
                </span>
              </div>
            </div>

            {uploadedFile && (
              <div className="hidden shrink-0 gap-2 lg:flex lg:w-56 lg:flex-col">
                <p className="shrink-0 text-[9px] uppercase tracking-[0.14em] text-white/25">
                  Original
                </p>
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm border border-white/[0.06]">
                  <LightboxTrigger
                    items={[
                      { src: uploadedFile.previewUrl, alt: "Original", label: "Original" },
                      { src: generatedImage, alt: "Style transfer result", label: "BMW styled" },
                    ]}
                    index={0}
                    onOpen={lightbox.open}
                    className="absolute inset-0 h-full w-full"
                  >
                    <img
                      src={uploadedFile.previewUrl}
                      alt="Original"
                      className="absolute inset-0 h-full w-full bg-black/50 object-contain"
                      draggable={false}
                    />
                  </LightboxTrigger>
                </div>
              </div>
            )}
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
