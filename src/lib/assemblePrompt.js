import { product } from "@/config/lifestyle-product";
import { style } from "@/config/lifestyle-style";

/**
 * Assembles the 3-layer prompt for a given scene.
 * Layer 1 (IDENTITY): fixed product description → forces visual consistency
 * Layer 2 (STYLE): fixed photographic style → consistent look & feel
 * Layer 3 (SCENE): variable environment + human interaction
 *
 * @param {object} scene - Scene object from lifestyle-scenes.js
 * @param {string|null} customSceneText - Optional override for layer 3 (advanced mode)
 * @returns {{ text: string, referenceImages: string[] }}
 */
export function assemblePrompt(scene, customSceneText = null) {
  const layer3 = customSceneText
    ? customSceneText
    : `${scene.environmentPrompt}. ${scene.interactionPrompt}`;

  const text = `${product.identityPrompt}\n\n${style.stylePrompt}\n\n${layer3}`;

  return {
    text,
    referenceImages: product.referencePack,
  };
}
