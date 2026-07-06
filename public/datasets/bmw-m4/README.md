# Dataset — BMW M4 Competition

Fotos de catálogo del BMW M4 Competition usadas como referencia para
garantizar la consistencia visual del producto en `/lifestyle-generator`
(Task 2).

## Archivos

`bmw-m4_01.jpg` … `bmw-m4_26.jpg` — 26 tomas de catálogo del vehículo
(frente, lateral, trasera, 3/4, detalles). A diferencia de los datasets de
Task 1 (que usan ángulos fijos en grados), estas son tomas de stock sin
ángulo normalizado, numeradas secuencialmente.

De las 26, se seleccionan 14 en `src/config/lifestyle-product.js` →
`referencePack` (límite de imágenes de referencia soportado por la API).

## Requisitos

- Formato JPEG o PNG
- Fondo limpio o neutro (mejora la consistencia del producto generado)
- Resolución mínima recomendada: 800×600 px

## Convención del proyecto

Todos los datasets de producto viven bajo `public/datasets/<slug>/` con
archivos `<slug>_NN.jpg`, para que cada nueva task del sistema (Task 1, 2, 3…)
siga la misma estructura escalable. Ver también `public/datasets/belgian/`,
`public/datasets/porter/` y `public/datasets/pale/` (Task 1).
