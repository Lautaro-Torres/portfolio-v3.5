export const product = {
  id: "bmw-m4-competition",
  displayName: "BMW M4 Competition",
  subtitle: "Vehículo de referencia",
  identityPrompt: `Usá el vehículo mostrado en las imágenes de referencia adjuntas. \
Es un BMW M4 Competition blanco perla con franjas M negras. \
Mantené EXACTAMENTE idénticos: color de carrocería blanco perla, franjas negras en el capó, \
diseño de la grilla frontal doble riñón M, diseño de llantas M forjadas, \
proporciones del coupé de 2 puertas, badges M4 y BMW, líneas de carrocería características. \
No inventes detalles ni cambies el modelo. \
El auto debe ser el protagonista principal de la imagen.`,
  // 14 imágenes de referencia (máximo soportado por la API)
  // Selección diversa: frente, lateral, trasera, 3/4, detalles
  // Dataset completo (26 fotos) en public/datasets/bmw-m4/ — ver README ahí
  referencePack: [
    "/datasets/bmw-m4/bmw-m4_01.jpg",
    "/datasets/bmw-m4/bmw-m4_06.jpg",
    "/datasets/bmw-m4/bmw-m4_11.jpg",
    "/datasets/bmw-m4/bmw-m4_13.jpg",
    "/datasets/bmw-m4/bmw-m4_03.jpg",
    "/datasets/bmw-m4/bmw-m4_09.jpg",
    "/datasets/bmw-m4/bmw-m4_10.jpg",
    "/datasets/bmw-m4/bmw-m4_14.jpg",
    "/datasets/bmw-m4/bmw-m4_18.jpg",
    "/datasets/bmw-m4/bmw-m4_19.jpg",
    "/datasets/bmw-m4/bmw-m4_20.jpg",
    "/datasets/bmw-m4/bmw-m4_21.jpg",
    "/datasets/bmw-m4/bmw-m4_22.jpg",
    "/datasets/bmw-m4/bmw-m4_04.jpg",
  ],
  heroImage: "/datasets/bmw-m4/bmw-m4_01.jpg",
};
