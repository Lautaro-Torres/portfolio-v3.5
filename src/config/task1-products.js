/**
 * Reference pack strategy:
 *
 * Gemini's object fidelity system is designed to INSERT the referenced object
 * into the scene — not to use it as a design guide. Sending studio packshots
 * (e.g. pale_00.png — clean front-facing can on black background) causes the
 * model to cut-and-paste the image instead of generating a new rendering.
 *
 * Solution: send ONLY the flat label artwork (etiqueta). It is a 2D design
 * sheet — the model cannot paste it as a can because it has no can shape.
 * Instead it reads the label design and renders it on a freshly generated can
 * that integrates with the scene's lighting and perspective.
 */
function buildReferencePack(slug) {
  return [`/datasets/${slug}/etiqueta-${slug}-2022.png`];
}

export const products = {
  belgian: {
    id: "belgian",
    displayName: "Belgian Golden Strong Ale",
    heroDescriptor: "Aventura en las yungas",
    heroImage: "/datasets/belgian/belgian_00.png",
    briefEN: `a Campo Alegre Belgian Golden Strong Ale can — lush tropical jungle label with illustrated turquoise-green canopy and a large tree, bold white CAMPO ALEGRE logotype, BELGIAN GOLDEN STRONG ALE subtitle, metallic silver top and bottom`,
    referencePack: buildReferencePack("belgian"),
  },
  porter: {
    id: "porter",
    displayName: "Porter",
    heroDescriptor: "Noches en la Puna",
    heroImage: "/datasets/porter/porter_00.png",
    briefEN: `a Campo Alegre Porter can — deep navy-to-burgundy gradient label with white constellation line-art and a dark mountain silhouette at the base, bold white CAMPO ALEGRE logotype, PORTER subtitle`,
    referencePack: buildReferencePack("porter"),
  },
  pale: {
    id: "pale",
    displayName: "Pale Ale",
    heroDescriptor: "Tardes en el dique",
    heroImage: "/datasets/pale/pale_00.png",
    briefEN: `a Campo Alegre Pale Ale can — terracotta orange label with an illustrated mountain reservoir, blue-and-orange peaks, green vegetation and birds in flight, bold white CAMPO ALEGRE logotype, PALE ALE subtitle, metallic silver top and bottom`,
    referencePack: buildReferencePack("pale"),
  },
};

export const productList = Object.values(products);
