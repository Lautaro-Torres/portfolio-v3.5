import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { products } from "@/config/task1-products";
import { assembleScenePrompt, assembleInstallPrompt } from "@/lib/task1AssemblePrompt";

// 1 scene pass + 3 parallel install passes + 3 parallel QA ≈ 150s worst case
export const maxDuration = 240;

const MODEL = "gemini-3.1-flash-image";
const MODEL_QA = "gemini-2.5-flash";

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
    console.warn(`[task1] Intento ${attempt + 1}: modelo sin imagen — reintentando...`);
    if (attempt < 2) await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("El modelo no devolvió imagen tras 3 intentos.");
}

function loadImageAsBase64(publicRelativePath) {
  const fullPath = join(process.cwd(), "public", publicRelativePath);
  if (!existsSync(fullPath)) return null;
  return readFileSync(fullPath).toString("base64");
}

function mimeFromPath(p) {
  return p.endsWith(".png") ? "image/png" : "image/jpeg";
}

/**
 * Pass 1 — scene only (no product).
 * Generates the lifestyle scene at 1K for speed; output is the canvas for Pass 2.
 */
async function generateScene(ai, situacion, aspectRatio) {
  const scenePrompt = assembleScenePrompt(situacion);
  console.log("[PASS 1 — SCENE]", scenePrompt);

  const sceneImg = await callWithImageRetry(() =>
    ai.interactions.create({
      model: MODEL,
      input: [{ type: "text", text: scenePrompt }],
      response_format: { type: "image", aspect_ratio: aspectRatio, image_size: "1K" },
    })
  );

  console.log("[PASS 1] scene OK");
  return sceneImg;
}

/**
 * Pass 2 — install product into existing scene.
 * Input: text → scene image (base) → etiqueta reference (Image 1, canonical).
 * Identity Locking: Image 1 is named as the definitive label source in the prompt.
 */
async function installProduct(ai, product, sceneImg, aspectRatio, imageSize) {
  const installPrompt = assembleInstallPrompt(product);

  const installInput = [
    { type: "text", text: installPrompt },
    { type: "image", mime_type: sceneImg.mime_type ?? "image/png", data: sceneImg.data },
  ];

  // etiqueta = Image 1 (canonical label reference)
  for (const imgPath of product.referencePack) {
    const data = loadImageAsBase64(imgPath);
    if (data) installInput.push({ type: "image", mime_type: mimeFromPath(imgPath), data });
  }

  const finalImg = await callWithImageRetry(() =>
    ai.interactions.create({
      model: MODEL,
      input: installInput,
      response_format: { type: "image", aspect_ratio: aspectRatio, image_size: imageSize },
    })
  );

  return { imageBase64: finalImg.data, imageMime: finalImg.mime_type ?? "image/png" };
}

const QA_INSTRUCTION = `Compará el producto (lata de cerveza) de estas dos imágenes. \
La primera imagen es la referencia original del producto, la segunda es la imagen generada por IA. \
Respondé SOLO JSON válido sin markdown, sin bloques de código: \
{"consistent": boolean, "score": number 0-100, "discrepancies": string[]}. \
Enumerá en "discrepancies" cualquier diferencia en color, tipografía, ilustración de etiqueta, \
proporciones o finish metálico. Si no hay diferencias, usá un array vacío.`;

async function runQa(ai, generatedBase64, generatedMime, referencePack) {
  let refData = null;
  let refMime = "image/jpeg";
  for (const refPath of referencePack) {
    const data = loadImageAsBase64(refPath);
    if (data) { refData = data; refMime = mimeFromPath(refPath); break; }
  }

  if (!refData) {
    return { consistent: null, score: null, discrepancies: [], warning: "No hay imágenes de referencia para comparar." };
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_QA,
      contents: [{
        parts: [
          { inlineData: { mimeType: refMime, data: refData } },
          { inlineData: { mimeType: generatedMime, data: generatedBase64 } },
          { text: QA_INSTRUCTION },
        ],
      }],
    });

    const rawText = response.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text ?? "";
    const clean = rawText.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.warn("[task1/generate] QA falló:", err?.message ?? err);
    return { consistent: null, score: null, discrepancies: [], error: "QA no disponible" };
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, situacion, format = "4:5", imageSize = "2K" } = body;

    const product = products[productId];
    if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 400 });
    if (!situacion?.trim()) return NextResponse.json({ error: "Describe the scene to continue" }, { status: 400 });

    const ai = getAI();

    // ── Pass 1: generate scene (shared canvas for all 3 variants) ─────────────
    const sceneImg = await generateScene(ai, situacion, format);

    // ── Pass 2: 3 parallel product installs on the same scene ─────────────────
    console.log("[PASS 2] Lanzando 3 variantes en paralelo...");
    const [r1, r2, r3] = await Promise.all([
      installProduct(ai, product, sceneImg, format, imageSize),
      installProduct(ai, product, sceneImg, format, imageSize),
      installProduct(ai, product, sceneImg, format, imageSize),
    ]);
    console.log("[PASS 2] 3 variantes generadas.");

    // ── QA: 3 parallel checks ─────────────────────────────────────────────────
    const [qa1, qa2, qa3] = await Promise.all([
      runQa(ai, r1.imageBase64, r1.imageMime, product.referencePack),
      runQa(ai, r2.imageBase64, r2.imageMime, product.referencePack),
      runQa(ai, r3.imageBase64, r3.imageMime, product.referencePack),
    ]);

    return NextResponse.json({
      variants: [
        { image: `data:${r1.imageMime};base64,${r1.imageBase64}`, qaResult: qa1 },
        { image: `data:${r2.imageMime};base64,${r2.imageBase64}`, qaResult: qa2 },
        { image: `data:${r3.imageMime};base64,${r3.imageBase64}`, qaResult: qa3 },
      ],
    });
  } catch (err) {
    console.error("[task1/generate]", err?.message ?? err);
    return NextResponse.json({ error: err?.message ?? "Error generando imagen" }, { status: 500 });
  }
}
