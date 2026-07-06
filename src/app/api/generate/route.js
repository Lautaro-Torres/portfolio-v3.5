import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { assemblePrompt } from "@/lib/assemblePrompt";
import { scenes } from "@/config/lifestyle-scenes";

export const maxDuration = 90;

// Nano Banana 2 — excels at multiple reference image processing + 4K generation
const MODEL_DRAFT = "gemini-3.1-flash-image";
const MODEL_FINAL = "gemini-3.1-flash-image";

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

function loadImageAsBase64(publicRelativePath) {
  const fullPath = join(process.cwd(), "public", publicRelativePath);
  if (!existsSync(fullPath)) return null;
  return readFileSync(fullPath).toString("base64");
}

function mimeFromPath(p) {
  return p.endsWith(".png") ? "image/png" : "image/jpeg";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sceneId, mode = "draft", customScene } = body;

    let scene;
    if (sceneId === "__custom__" && customScene) {
      scene = { id: "__custom__", title: "Escena personalizada" };
    } else {
      scene = scenes.find((s) => s.id === sceneId);
      if (!scene) {
        return NextResponse.json({ error: "Escena no encontrada" }, { status: 400 });
      }
    }

    const { text, referenceImages } = assemblePrompt(
      scene,
      sceneId === "__custom__" ? customScene : null
    );

    // Text prompt first, then reference images (up to 10 for gemini-3.1-flash-image)
    const input = [{ type: "text", text }];
    let loadedRefs = 0;
    for (const imgPath of referenceImages.slice(0, 10)) {
      const data = loadImageAsBase64(imgPath);
      if (data) {
        input.push({ type: "image", mime_type: mimeFromPath(imgPath), data });
        loadedRefs++;
      }
    }

    if (loadedRefs === 0) {
      console.warn(
        "[generate] No se encontraron imágenes de referencia en public/datasets/bmw-m4/. " +
          "La consistencia del producto depende de ellas — agregá las fotos del BMW."
      );
    }

    const imageSize = mode === "final" ? "4K" : "2K";
    const ai = getAI();

    let imgOut = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const interaction = await withRetry(() =>
        ai.interactions.create({
          model: mode === "final" ? MODEL_FINAL : MODEL_DRAFT,
          input,
          response_format: {
            type: "image",
            aspect_ratio: "16:9",
            image_size: imageSize,
          },
        })
      );
      imgOut = interaction.output_image;
      if (imgOut?.data) break;
      console.warn(`[generate] Intento ${attempt + 1}: modelo no devolvió imagen. Reintentando...`);
      if (attempt < 2) await new Promise((r) => setTimeout(r, 2000));
    }

    if (!imgOut?.data) {
      return NextResponse.json(
        { error: "El modelo no devolvió imagen tras 3 intentos." },
        { status: 500 }
      );
    }

    const imageMime = imgOut.mime_type ?? "image/png";

    return NextResponse.json({
      image: `data:${imageMime};base64,${imgOut.data}`,
    });
  } catch (err) {
    console.error("[generate]", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? "Error generando imagen" },
      { status: 500 }
    );
  }
}
