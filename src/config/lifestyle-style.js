/**
 * BMW visual style system — extracted from the client moodboard.
 * Single source of truth for Task 3 style transfer and lifestyle generation.
 */

export const styleConfig = {
  brand_cue: "BMW — warm, human, cinematic, effortless luxury. Not cold showroom luxury; the brand lives in lived moments, not static product shots.",

  mood: ["warm", "aspirational", "filmic", "sun-drenched", "nostalgic", "candid", "romantic", "adventurous"],

  vehicle_reference: {
    primary: {
      model: "BMW concept car — futuristic sedan/coupé silhouette",
      identity_markers: ["minimalist white/wood-tone steering wheel", "clean unbadged dash", "silver-white or white body paint", "smooth uninterrupted body lines"],
      role: "hero product, the future-facing face of the brand",
    },
    secondary: {
      model: "BMW SUV, current generation",
      context: "rain, wet asphalt, low-visibility overcast light",
      role: "everyday/real-world usage counterpoint to the hero shot",
    },
    heritage: {
      model: "vintage BMW coupé, E30/M3 era, red paint",
      context: "styled interior/showroom setting with cream boucle furniture",
      role: "brand heritage anchor — past and future in the same visual system",
    },
    usage_note: "the moodboard deliberately mixes three eras of the brand — do not treat 'BMW' as one single silhouette; the style system must accommodate concept, current, and heritage vehicles under the same lighting/color rules.",
  },

  color: {
    temperature: "warm base with cool accent punctuation",
    grade: "film-like, warm highlights, teal/green shadows, soft contrast, occasional desaturated monochrome passages",
    base_palette: ["#D3A878", "#EAC9A0", "#E08A3C", "#E8B93C", "#C9A876"],
    accent_palette: ["#22B4D6", "#9BC4A0", "#2E6B3E", "#8A9BA8", "#1B5E7A"],
    pop_color: "#E8481C",
    secondary_accents: {
      pool_blue: "#2FA5C9 — saturated swimming-pool/water blue, appears as a standalone scene-setting color, not just an accent",
      snake_print_textile: "#3A5F6E — muted teal-grey patterned fabric (swimwear/accessory), recurring motif appearing twice in the moodboard",
      sunset_orange: "#E8781C — caps, car interior accents, cocktail garnish",
      desert_sand: "#C4A576 — dominant in road-trip and landscape imagery",
    },
    monochrome_passages: "a portion of the moodboard is treated in full black & white, grainy, archival/candid photography style — this is a deliberate secondary treatment, not a lighting failure, used specifically for friendship/nostalgia moments",
  },

  lighting: {
    primary: "golden hour",
    secondary: "blue hour / overcast diffuse (for rain and interior shots)",
    direction: "low lateral / backlit for hero product shots; flat diffuse for candid human moments",
    quality: "soft with occasional direct sun flares; hard/grainy for the monochrome archival passages",
    contrast: "medium-low for color imagery, higher contrast for black & white passages",
  },

  composition: {
    signature: "shooting through glass/windshield — car and human always visible together through a reflective surface",
    architecture_motif: "modern glass-walled houses with the car visible parked inside or just outside, blurring the line between architecture and showroom — recurring device, not incidental background",
    subject_logic: "human + product in same frame, never a solo product shot",
    angle: "eye-level or slightly low heroic for vehicles",
    depth_of_field: "shallow on portraits and interior details, deep on landscape and architecture shots",
  },

  narrative: {
    human_moments: [
      "friendship — group of friends around the car at a golden-hour picnic/cookout, palm trees, casual laughter",
      "romance — a couple walking hand-in-hand in a desert landscape; a handwritten note reading 'I love you too'",
      "celebration — cocktails on the car hood, caps and swimwear, poolside leisure",
      "solitude/reflection — a single figure looking out at a coastal landscape, laptop and coffee, remote-work stillness",
      "archival/candid — black & white grainy photography of friends laughing, someone taking a photo, evoking analog memory rather than staged campaign",
    ],
    role: "the human narrative is as central as the product — the car is a companion in a life being lived, not the subject of a showroom photo",
  },

  texture: ["vermouth leather", "chrome/metal", "glass", "sand", "film grain", "cream boucle upholstery", "patterned textile (snake-print swimwear fabric)", "water/pool surface"],

  lifestyle_props: ["caps (orange, navy with logo)", "cocktails/drinks on the car hood or poolside", "handwritten notes", "laptop + coffee in a coastal setting", "swimwear and pool accessories", "minimalist steering wheel detail shots"],

  camera: {
    focal_feel: "35–85mm, occasional wide landscape shots",
    flares: "soft direct sun flares in golden-hour shots; none in monochrome/archival passages",
  },

  music_mapping: {
    genre: "organic electronic / cinematic downtempo, with an acoustic/nostalgic secondary layer for the archival black & white moments",
    bpm: "85-100 for hero/product moments; 70-85 for romantic/reflective moments",
    energy: "medium, hopeful",
    instrumentation: "warm analog synths, organic live percussion, pads, round bass; light acoustic guitar or tape-warmed piano for nostalgic passages",
    avoid: "aggressive, distorted, dark trap, anything overtly electronic/cold that contradicts the warm-human brand cue",
  },
};

/**
 * Derived prompt string — used by assemblePrompt() in the lifestyle generator.
 */
export const style = {
  stylePrompt: `Photorealistic commercial photography. \
BMW visual system: warm, human, cinematic, effortless luxury — not cold showroom luxury. \
LIGHTING: Golden hour preferred; low lateral or backlit illumination, soft shadows, occasional direct sun flares. \
COLOR GRADE: Film-like warm highlights (#D3A878, #EAC9A0) with teal-leaning shadows (#22B4D6 tone). \
Warm base palette with terracotta (#E08A3C), golden (#E8B93C) and desert sand (#C4A576) accents. \
Cool accent punctuation: pool blue (#2FA5C9), green (#9BC4A0). One pop of warm red-orange (#E8481C) where the scene allows. \
Soft contrast — never crushed blacks or blown highlights. Subtle film grain. \
COMPOSITION: Human + vehicle in the same frame. Shoot through glass/windshield where possible. \
Shallow depth of field on portraits and interior details; deep on landscapes. \
35–85mm focal feel. The car is a companion in a life being lived, not a showroom object. \
Render quality: photorealistic, 2K editorial, no artificial sharpening, no over-saturation.`,
};
