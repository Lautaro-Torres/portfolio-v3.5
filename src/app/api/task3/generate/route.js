import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 120;

const MODEL = "gemini-3.1-flash-image";

// BMW style profile (from moodboard) — source of truth for the style transfer prompt
const STYLE_PROMPT = `Apply the following cinematic style to this photograph while preserving its subject, composition and narrative exactly:

BRAND FEELING: BMW — warm, human, cinematic, effortless luxury. Not cold showroom luxury; the brand lives in lived moments, not static product shots.

LIGHTING: Golden hour preferred; low-angle lateral or backlit illumination. Warm directional light hitting subjects from the side or behind, creating rim light separation and occasional soft sun flares. Shadows are long and soft. For overcast/rain scenes: flat diffuse blue-hour light with medium-low contrast.

COLOR GRADE: Film-like warm highlights (#D3A878, #EAC9A0 — amber/honey tones) with opposing teal-leaning shadows (#22B4D6 tone in shadow areas). Warm base palette: terracotta (#E08A3C), golden (#E8B93C), desert sand (#C4A576). Cool accent punctuation: pool blue (#2FA5C9), muted green (#9BC4A0). One controlled pop of warm red-orange (#E8481C) where the scene allows. Soft contrast — never crushed blacks or blown highlights.

ATMOSPHERE: Subtle film grain texture overlay. Shallow depth of field on portraits and interior details; deep on landscapes. Slight warm haze or atmospheric glow on golden-hour shots. Brand mood: warm, aspirational, filmic, sun-drenched, nostalgic, candid.

MATERIALITY: Enhance physical textures to match the brand system — vermouth leather (warm), chrome/metal (reflecting warm ambient light), glass (clean with soft reflections), sand/desert tones, cream boucle upholstery where present.

COMPOSITION: Preserve the original subject and framing exactly. Human and vehicle in the same frame whenever both are present. The car is a companion in a life being lived, not a showroom object.

Output: photorealistic, 2K editorial quality, no artificial sharpening, no over-saturation.`;

function getAI() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY no está configurada en las variables de entorno.");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

async function withRetry(fn, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = err?.status ?? err?.httpStatusCode;
      if (status === 429 && attempt < retries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
}

async function callWithImageRetry(fn) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const interaction = await withRetry(fn);
    const imgOut = interaction.output_image;
    if (imgOut?.data) return imgOut;
    console.warn(`[task3] Intento ${attempt + 1}: modelo sin imagen — reintentando...`);
    if (attempt < 2) await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("El modelo no devolvió imagen tras 3 intentos.");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { imageBase64, imageMime = "image/jpeg" } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: "No se recibió imagen" }, { status: 400 });
    }

    const ai = getAI();

    const result = await callWithImageRetry(() =>
      ai.interactions.create({
        model: MODEL,
        input: [
          { type: "image", mime_type: imageMime, data: imageBase64 },
          { type: "text", text: STYLE_PROMPT },
        ],
        response_format: { type: "image", image_size: "2K" },
      })
    );

    return NextResponse.json({
      image: `data:${result.mime_type ?? "image/png"};base64,${result.data}`,
    });
  } catch (err) {
    console.error("[task3/generate]", err?.message ?? err);
    return NextResponse.json({ error: err?.message ?? "Error generando imagen" }, { status: 500 });
  }
}
