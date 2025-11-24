# 🎯 Guía Completa del Loader con GSAP

Sistema de loading minimalista y optimizado que precarga assets reales y muestra animaciones fluidas con los colores de tu marca.

## 🚀 Características principales

✅ **Gradiente de marca** - Verde/emerald como en tu navegación  
✅ **Precarga real** - Assets 3D, fuentes e imágenes  
✅ **Modo desarrollo** - Loading rápido para dev  
✅ **GSAP optimizado** - Animaciones fluidas y performantes  
✅ **Integración con ScrollSmoother** - Sin conflictos  

## 📁 Archivos creados

### **1. `src/components/LoaderFinal.js`** - Componente principal
- Animaciones GSAP optimizadas
- UI minimalista con gradientes de marca
- Progreso real de carga
- Transiciones suaves de entrada/salida

### **2. `src/hooks/useAssetPreloader.js`** - Lógica de precarga
- Precarga modelos 3D (.glb)
- Precarga fuentes e imágenes
- Manejo de errores gracioso
- Progreso granular por asset

### **3. `src/components/Loader.js`** - Versión básica (backup)
### **4. `src/components/LoaderOptimized.js`** - Versión intermedia (backup)

## 🎨 Diseño visual

### **Colores utilizados:**
```css
/* Fondo */
background: linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)

/* Gradientes animados */
from-green-500/10 via-emerald-500/5 to-transparent
from-green-400/5 via-transparent to-emerald-500/10

/* Logo central */
bg-gradient-to-r from-green-400 to-emerald-500

/* Barra de progreso */
bg-gradient-to-r from-green-400 to-emerald-500
```

### **Elementos visuales:**
- **Logo central** - Círculo con gradiente verde pulsante
- **Anillos animados** - Rotación en direcciones opuestas
- **Barra de progreso** - Gradiente verde con sombra sutil
- **Texto dinámico** - Muestra el asset siendo cargado

## ⚙️ Configuración y uso

### **Uso básico en cualquier página:**
```jsx
import LoaderFinal, { useLoaderFinal } from '../components/LoaderFinal';

function MyPage() {
  const { isLoading } = useLoaderFinal();

  return (
    <>
      {isLoading && <LoaderFinal onComplete={() => console.log('Carga completa')} />}
      {!isLoading && <div>Mi contenido</div>}
    </>
  );
}
```

### **Configuración avanzada:**
```jsx
const { isLoading } = useLoaderFinal({
  enablePreloading: true,        // Precarga real de assets
  fastMode: false,               // Modo desarrollo rápido
  minLoadTime: 800              // Tiempo mínimo en ms
});

<LoaderFinal 
  onComplete={handleComplete}
  options={{
    enablePreloading: true,      // Activar precarga
    fastMode: process.env.NODE_ENV === 'development',
    minLoadTime: 1000           // Mínimo 1 segundo
  }}
/>
```

## 🔧 Assets que se precargan

En **producción** (`enablePreloading: true`):
- `/assets/models/chocolatt.glb` - Modelo Chocolatt
- `/assets/models/logo-lt.glb` - Logo LT
- `/assets/models/dagoberto.glb` - Modelo Dagoberto  
- `/assets/models/mate.glb` - Modelo Mate
- `/assets/models/monitor.glb` - Modelo Monitor
- `/fonts/Anton-Regular.ttf` - Fuente Anton
- `/assets/images/projects/prozy-432632.webp` - Imagen Prozy

En **desarrollo** (`fastMode: true`):
- Simulación rápida sin precarga real
- Duración total ~1.2 segundos

## 🎭 Animaciones GSAP

### **Entrada (0.5s):**
```javascript
// Elementos aparecen desde abajo con bounce
.from([logo, text], {
  opacity: 0,
  scale: 0.9,
  y: 20,
  duration: 0.5,
  ease: "back.out(1.7)",
  stagger: 0.1
})
```

### **Progreso (continuo):**
```javascript
// Barra se expande suavemente
.to('.progress-fill', {
  width: `${progress}%`,
  duration: 0.3,
  ease: "power2.out"
})

// Logo hace pulse según progreso
.to('.logo-core', {
  scale: 1 + (progress / 100) * 0.1,
  duration: 0.3
})
```

### **Salida (0.4s):**
```javascript
// Elementos se desvanecen hacia arriba
.to([logo, progress, text], {
  opacity: 0,
  scale: 0.95,
  y: -15,
  duration: 0.4,
  ease: "power2.inOut",
  stagger: 0.05
})
```

## 🚀 Performance optimizations

### **Will-change aplicado a:**
- `.logo-core` - Para animación de scale
- `.progress-fill` - Para animación de width
- Anillos animados - Para rotación

### **Características de performance:**
- **Z-index alto** (`z-[9999]`) - Siempre visible
- **Backdrop-filter** - Blur sutil sin impacto
- **GPU acceleration** - Transform3d automático con GSAP
- **Cleanup automático** - Timelines se limpian al desmontar

## 🔄 Estados del loader

### **Textos en modo producción:**
1. "Cargando recursos..." (0-30%)
2. "Preparando modelos 3D..." (30-60%) 
3. "Configurando animaciones..." (60-90%)
4. "Optimizando experiencia..." (90-100%)
5. "Completado!" (100%)

### **Textos en modo desarrollo:**
- "Cargando..." (fijo, rápido)

## 🎯 Integración con ScrollSmoother

El loader está perfectamente integrado:

1. **Loader se muestra primero** - `z-index: 9999`
2. **ScrollSmoother se inicializa después** - Cuando `isLoading: false`
3. **Sin conflictos** - Estructuras separadas
4. **Transición suave** - ScrollSmoother está listo cuando aparece

## 🛠️ Personalización rápida

### **Cambiar duración:**
```jsx
const { isLoading } = useLoaderFinal({
  minLoadTime: 1500  // 1.5 segundos mínimo
});
```

### **Deshabilitar precarga:**
```jsx
const { isLoading } = useLoaderFinal({
  enablePreloading: false  // Solo simulación
});
```

### **Solo para producción:**
```jsx
const showLoader = process.env.NODE_ENV === 'production';

{showLoader && isLoading && <LoaderFinal />}
```

### **Personalizar assets a precargar:**
Edita la lista en `src/hooks/useAssetPreloader.js`:

```javascript
const assets = [
  { url: '/mi-asset.glb', name: 'Mi Modelo', type: 'model' },
  { url: '/mi-fuente.woff2', name: 'Mi Fuente', type: 'font' },
  // ... más assets
];
```

## ⚡ Tips de desarrollo

### **Desarrollo rápido:**
```bash
# El loader detecta automáticamente NODE_ENV
npm run dev  # Modo rápido activado
```

### **Testing en producción:**
```bash
npm run build && npm start  # Precarga completa
```

### **Debug del progreso:**
```javascript
// En useAssetPreloader.js, uncomment:
console.log(`Loading ${asset.name}: ${progress}%`);
```

## 🎊 ¡Resultado final!

- **⚡ Carga rápida** - 800ms-2.5s según configuración
- **🎨 Consistente** - Mismos colores que tu marca
- **📱 Responsive** - Se ve perfecto en todos los dispositivos  
- **🔧 Flexible** - Fácil de personalizar y extender
- **⚙️ Optimizado** - Performance de nivel producción

Tu loader está listo y funcionando! 🚀
