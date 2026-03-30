# Auditoría de Performance - Portfolio v2

## 1. Diagnóstico de Problemas Detectados

### Carga inicial (alto impacto)
| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| **Preload de 4 modelos GLB simultáneos** | `layout.js` | Bloqueaba red y memoria. Solo `mate.glb` (Hero) es crítico arriba del fold. |
| **28+ texturas PBR cargadas al inicio** | `HeroOrb3D.jsx` | Developer, designer, human y director se cargaban en paralelo. Solo developer es visible al cargar. |
| **Console.info en producción** | `HeroOrb3D.jsx` | Costo de I/O y posible ralentización en algunos entornos. |
| **Lottie + JSON cargados al montar** | `InlineLottieGlobe.jsx` | About está below-the-fold; no había razón para cargar antes de scroll. |
| **Monitor 3D + modelo al montar** | `Monitor.js` | Projects está below-the-fold; R3F, modelo y materiales se cargaban inmediatamente. |

### Render y listeners (impacto medio)
| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| **RAF loop continuo en CustomCursor** | `CustomCursor.js` | Corría a 60fps incluso con el mouse quieto, consumiendo CPU innecesariamente. |
| **Múltiples pointermove globales** | `CustomCursor.js`, `AboutPortalCard.jsx`, `HeroOrb3D.jsx` | Cada uno añade trabajo en el main thread por cada movimiento. |
| **Videos autoplay en todas las ProjectCards** | `ProjectCard.js` | 6 videos cargaban/reproducían aunque solo 2-3 estuvieran visibles. |
| **Video fullVideoLoop sin viewport check** | `VideoPoster.js` | Videos de galería cargaban aunque el item estuviera fuera de vista. |

### Assets e imágenes (impacto medio-bajo)
| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| **Galería con img sin loading="lazy"** | `ProjectDetail.js` | Imágenes below-the-fold cargaban de inmediato. |
| **will-change en todos los canvas** | `performance.css` | Promueve cada canvas a capa de compositor; en exceso puede consumir GPU. |

---

## 2. Mejoras Implementadas (ordenadas por impacto)

### ✅ 1. Layout - Reducción de preloads
- **Antes:** Preload de `logo-lt.glb`, `dagoberto.glb`, `mate.glb`, `monitor.glb` + fuente Anton.
- **Después:** Solo `mate.glb` (Hero) y fuente Anton.
- **Efecto:** Menos contención de red, carga inicial más ligera.

### ✅ 2. HeroOrb3D - PBR on-demand
- **Antes:** Carga simultánea de 4 sets PBR (developer, designer, human, director).
- **Después:** Solo developer al montar; designer/human/director se cargan al cambiar modo en WordRotator.
- **Efecto:** ~75% menos texturas en la carga inicial.
- **Nota:** Se eliminaron `console.info` en producción.

### ✅ 3. ProjectCard - Videos lazy
- **Antes:** Todos los videos con `src` y autoplay desde el primer render.
- **Después:** IntersectionObserver; fuera de vista se muestra poster/imagen; video solo cuando entra en viewport.
- **Efecto:** 3-4 videos menos cargando/reproduciendo al inicio.

### ✅ 4. CustomCursor - RAF pausado cuando idle
- **Antes:** `requestAnimationFrame` corriendo permanentemente.
- **Después:** Loop activo solo durante ~150ms tras el último `pointermove`; se detiene si no hay movimiento.
- **Efecto:** Menor uso de CPU cuando el mouse está quieto.

### ✅ 5. InlineLottieGlobe - Defer hasta viewport
- **Antes:** Carga de Lottie y JSON al montar.
- **Después:** IntersectionObserver; solo carga cuando el elemento entra (o está cerca) del viewport.
- **Efecto:** No se bloquea el main thread con Lottie antes de hacer scroll a About.

### ✅ 6. VideoPoster fullVideoLoop - Defer
- **Antes:** `<video src="..." preload="auto">` desde el montar.
- **Después:** Placeholder hasta que `isInView`; entonces se monta el video con `preload="metadata"`.
- **Efecto:** Menos bytes y menos decodificación en galerías.

### ✅ 7. Monitor 3D - Defer
- **Antes:** Canvas, modelo y entorno cargaban al montar Projects.
- **Después:** `MonitorPlaceholder` hasta que la sección entra en viewport; entonces se monta `OptimizedCanvas` + `MonitorModel`.
- **Efecto:** No se carga R3F ni el modelo hasta que el usuario se acerca a Projects.

### ✅ 8. ProjectDetail - Imágenes gallery lazy
- **Antes:** `<img src="...">` sin atributos de carga.
- **Después:** `loading="lazy"` y `decoding="async"` en imágenes de galería.
- **Efecto:** Imágenes below-the-fold cargan solo al aproximarse.

### ✅ 9. performance.css - will-change
- **Antes:** `will-change: transform` en todos los canvas.
- **Después:** Eliminado para limitar capas de composición.
- **Efecto:** Menor presión sobre GPU sin sacrificar la aceleración por `translateZ(0)`.

---

## 3. Resumen de Cambios por Archivo

| Archivo | Cambios |
|---------|---------|
| `src/app/layout.js` | Preload solo mate.glb + Anton |
| `src/components/HeroOrb3D.jsx` | PBR on-demand, eliminación de logs |
| `src/components/ui/ProjectCard.js` | IntersectionObserver + lazy video |
| `src/components/ui/CustomCursor.js` | RAF pausado tras 150ms idle |
| `src/components/InlineLottieGlobe.jsx` | IntersectionObserver para Lottie |
| `src/components/VideoPoster.js` | fullVideoLoop con defer por viewport |
| `src/components/Three/Monitor.js` | Canvas + modelo montados solo cuando inView |
| `src/app/projects/[slug]/ProjectDetail.js` | `loading="lazy"` en imágenes de galería |
| `src/styles/performance.css` | Eliminado `will-change` en canvas |

---

## 4. Qué NO se tocó

- Estética y animaciones existentes
- GSAP ScrollTrigger / ScrollSmoother
- Diseño de componentes
- Arquitectura de rutas y páginas
- HeroSection, AboutSection, Projects en cuanto a su estructura
- AboutPortalCard (pointermove se mantiene para el efecto 3D del card)

---

## 5. Recomendaciones adicionales (futuro)

1. **Videos:** Considerar transcodificar a formatos más ligeros (resolución/bitrate) o usar `<source>` con prioridad para WebM/AV1 donde esté disponible.
2. **HeroOrb3D HDRI:** El HDR se carga al montar; podría evaluarse un env map más liviano o diferido.
3. **AboutPortalCard:** El `pointermove` global podría limitarse a cuando el card esté en viewport, similar a Monitor.
4. **ScrollSmoother:** Si se detectan choques con el scroll nativo o rendimiento, revisar la versión de GSAP y la configuración de `smooth` / `smoothTouch`.
