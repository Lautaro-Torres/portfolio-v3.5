export const scenes = [
  {
    id: "dique-tarde",
    title: "Dique Campo Alegre",
    environmentPrompt:
      "orillas del Dique Campo Alegre, agua turquesa, montañas verdes de fondo, tarde soleada",
    interactionPrompt: "tomando una cerveza fría sentado en las rocas mirando el agua",
    moods: ["pale"],
  },
  {
    id: "cafayate-vinas",
    title: "Cafayate entre viñedos",
    environmentPrompt:
      "viñedos de Cafayate, Salta, montañas áridas de fondo, hora dorada",
    interactionPrompt: "caminando entre las vides con la cerveza en la mano",
    moods: ["pale", "belgian"],
  },
  {
    id: "puna-estrellas",
    title: "Puna bajo las estrellas",
    environmentPrompt:
      "Puna salteña de noche, cielo con Vía Láctea, cactus cardón en silueta, sin contaminación lumínica",
    interactionPrompt: "sentado junto a una fogata sosteniendo la lata, mirando el cielo estrellado",
    moods: ["porter"],
  },
  {
    id: "cachi-pueblo",
    title: "Cachi al atardecer",
    environmentPrompt:
      "pueblo de Cachi, Salta, arquitectura de adobe blanco, montañas al fondo, atardecer cálido",
    interactionPrompt: "apoyado en una pared de adobe con la cerveza, relajado",
    moods: ["pale", "porter"],
  },
  {
    id: "cerro-san-bernardo",
    title: "Cerro San Bernardo",
    environmentPrompt:
      "Cerro San Bernardo, vista panorámica de la ciudad de Salta, vegetación verde, tarde",
    interactionPrompt: "de pie en el mirador con la cerveza, ciudad de Salta de fondo",
    moods: ["pale", "belgian"],
  },
  {
    id: "yungas-cascada",
    title: "Yungas salteñas",
    environmentPrompt:
      "yungas de Salta, vegetación subtropical densa, cascada o río de montaña, neblina suave, luz filtrada",
    interactionPrompt: "sentado en una roca junto al río, tomando la cerveza después de una caminata",
    moods: ["belgian"],
  },
  {
    id: "plaza-julio-noche",
    title: "Plaza 9 de Julio de noche",
    environmentPrompt:
      "Plaza 9 de Julio, Salta capital, arquitectura colonial iluminada, noche, luces cálidas de la plaza",
    interactionPrompt: "sentado en los bancos de la plaza con la cerveza, ambiente nocturno urbano",
    moods: ["porter", "pale"],
  },
  {
    id: "depto-cerros",
    title: "Departamento con vista a los cerros",
    environmentPrompt:
      "interior de departamento moderno en Salta, ventana grande con vista a los cerros salteños, luz natural entrando",
    interactionPrompt: "de pie junto a la ventana sosteniendo la cerveza, mirando los cerros",
    moods: ["belgian", "pale", "porter"],
  },
  {
    id: "puna-amanecer",
    title: "Puna al amanecer",
    environmentPrompt:
      "Puna salteña al amanecer, cielo naranja y rosa, silencio, vastedad, cactus cardón",
    interactionPrompt: "de pie mirando el horizonte con la cerveza, primer trago del día",
    moods: ["porter", "pale"],
  },
];

export function scenesForProduct(productId) {
  return scenes.filter((s) => s.moods.includes(productId));
}
