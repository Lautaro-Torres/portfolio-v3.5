/**
 * Task 1 — Sequential Grounding prompts (two-pass generation)
 *
 * Pass 1 — assembleScenePrompt:
 *   Generates the lifestyle scene (person + environment + light) with NO product.
 *   The hand is posed ready to hold something, but the can is absent.
 *
 * Pass 2 — assembleInstallPrompt:
 *   Takes the Pass 1 scene image as the base + 10 product reference images.
 *   Asks the model to "install" the can into the existing scene.
 *   Because the model receives a real scene image as input, it must calculate
 *   how the can interacts with existing lighting and surfaces — physically
 *   accurate integration instead of flat compositing.
 */

export function assembleScenePrompt(situacion) {
  return `Photorealistic lifestyle photograph. ${situacion}. The person's hand is relaxed, slightly raised, fingers loosely curled as if about to hold a can. Shot on a 50mm lens, shallow depth of field, background gently blurred, sharp focus on face and hand. Candid, authentic lifestyle photography. Natural color grading, no HDR, no plastic skin.`;
}

export function assembleInstallPrompt(product) {
  return `The person in this photograph is holding a beer can. Image 1 (the flat label artwork) is the DEFINITIVE and canonical source for the label's exact design, typography, colors and all printed text — reproduce it faithfully from Image 1. Do not insert or paste Image 1; use it as a design reference to generate a brand-new photographic rendering of ${product.briefEN}. The can fits naturally in the person's hand, palm-sized, and integrates with the scene's existing light, shadows and depth of field — as if photographed there, not composited.`;
}
