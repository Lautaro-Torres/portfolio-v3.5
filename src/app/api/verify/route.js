import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { product } from "@/config/lifestyle-product";

export const maxDuration = 30;

const MODEL_TEXT = "gemini-2.5-flash";

function getAI() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY no está configurada en las variables de entorno.");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

function loadImageAsBase64(publicRelativePath) {
  const fullPath = join(process.cwd(), "public", publicRelativePath);
  if (!existsSync(fullPath)) return null;
  return readFileSync(fullPath).toString("base64");
}

function mimeFromPath(p) {
  return p.endsWith(".png") ? "image/png" : "image/jpeg";
}

const QA_INSTRUCTION = `Compará el vehículo de estas dos imágenes. \
La primera imagen es la referencia original del producto, la segunda es la imagen generada por IA. \
Respondé SOLO JSON válido sin markdown, sin bloques de código: \
{"consistent": boolean, "score": number 0-100, "discrepancies": string[]}. \
Enumerá en "discrepancies" cualquier diferencia en color de carrocería, grilla frontal, llantas, \
proporciones, badges o líneas de carrocería. Si no hay diferencias, usá un array vacío.`;

export async function POST(request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Imagen requerida" }, { status: 400 });
    }

    // Find the first available canonical reference image
    let refData = null;
    let refMime = "image/jpeg";
    for (const refPath of product.referencePack) {
      const data = loadImageAsBase64(refPath);
      if (data) {
        refData = data;
        refMime = mimeFromPath(refPath);
        break;
      }
    }

    if (!refData) {
      // No reference images available — return a neutral result
      return NextResponse.json({
        consistent: null,
        score: null,
        discrepancies: [],
        warning: "No hay imágenes de referencia para comparar. Agregá fotos del BMW en public/datasets/bmw-m4/.",
      });
    }

    // Strip data URL prefix if present
    const generatedData = image.startsWith("data:") ? image.split(",")[1] : image;
    const generatedMime = image.startsWith("data:image/png") ? "image/png" : "image/jpeg";

    const parts = [
      { inlineData: { mimeType: refMime, data: refData } },
      { inlineData: { mimeType: generatedMime, data: generatedData } },
      { text: QA_INSTRUCTION },
    ];

    const ai = getAI();

    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: [{ parts }],
    });

    const rawText =
      response.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text ?? "";

    // Strip markdown code fences if model adds them
    const clean = rawText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    let result;
    try {
      result = JSON.parse(clean);
    } catch {
      console.warn("[verify] JSON parse failed, raw:", rawText);
      result = { consistent: null, score: null, discrepancies: [], raw: rawText };
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[verify]", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? "Error verificando imagen" },
      { status: 500 }
    );
  }
}
