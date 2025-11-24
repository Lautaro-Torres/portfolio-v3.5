# 🚀 Guía Completa de ScrollSmoother con GSAP

Esta guía explica cómo implementar smooth scroll en tu proyecto Next.js/React usando GSAP ScrollSmoother.

## 📋 Resumen de la implementación

✅ **GSAP 3.13.0** ya instalado (incluye ScrollSmoother)  
✅ **Estructura HTML** configurada en `layout.js`  
✅ **Componente ScrollSmoother** creado  
✅ **CSS optimizado** para smooth scroll  
✅ **Controles** para habilitar/deshabilitar  

## 🗂️ Archivos modificados/creados

### 1. **`src/app/layout.js`** - Estructura HTML base
```jsx
<body>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      {children}
    </div>
  </div>
</body>
```

### 2. **`src/components/ScrollSmoother.js`** - Componente principal
- Inicializa ScrollSmoother automáticamente
- Hook `useScrollSmoother()` para controlar desde otros componentes
- Configuración optimizada para móviles y desktop

### 3. **`src/components/ScrollController.js`** - Controles de usuario
- Botones para activar/desactivar smooth scroll
- Navegación programática a secciones
- Componente de debug para desarrollo

### 4. **`src/app/page.js`** - Página principal
- Incluye `<ScrollSmootherWrapper />` para inicializar
- Mantiene toda la estructura de contenido intacta

### 5. **`src/app/globals.css`** - Estilos CSS
```css
/* ScrollSmoother requiere estas reglas */
html, body { 
  height: 100%; 
  overflow: hidden; 
}

#smooth-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

#smooth-content {
  position: relative;
  width: 100%;
  min-height: 100%;
  will-change: transform;
}
```

## 🎛️ Selectores importantes

### **Selectores requeridos por ScrollSmoother:**
- `#smooth-wrapper` - Contenedor fijo que maneja el viewport
- `#smooth-content` - Contenido que se desplaza suavemente

### **Selectores para navegación:**
- `#about` - Sección About
- `#projects` - Sección Projects  
- `#contact` - Sección Contact

## 🔧 Cómo usar en tu código

### **Navegación programática:**
```jsx
import { useScrollSmoother } from '../components/ScrollSmoother';

function MyComponent() {
  const { scrollTo } = useScrollSmoother();
  
  const goToAbout = () => {
    scrollTo('#about', true, 1); // target, smooth, duration
  };
  
  return <button onClick={goToAbout}>Ir a About</button>;
}
```

### **Controlar smooth scroll:**
```jsx
import { useScrollSmoother } from '../components/ScrollSmoother';

function ToggleButton() {
  const { enable, disable, getScrollSmoother } = useScrollSmoother();
  
  const toggle = () => {
    const smoother = getScrollSmoother();
    if (smoother?.enabled) {
      disable();
    } else {
      enable();
    }
  };
  
  return <button onClick={toggle}>Toggle Smooth Scroll</button>;
}
```

## ⚙️ Configuración de ScrollSmoother

En `src/components/ScrollSmoother.js`, puedes ajustar:

```jsx
ScrollSmoother.create({
  wrapper: wrapper,           // Elemento wrapper (#smooth-wrapper)
  content: content,          // Elemento content (#smooth-content)
  smooth: 1,                 // Intensidad: 0 = sin smooth, 2 = máximo
  effects: true,             // Habilitar efectos de paralaje
  smoothTouch: 0.1,          // Smooth en móviles: 0 = deshabilitado
  normalizeScroll: true,     // Normalizar scroll entre navegadores
  ignoreMobileResize: true,  // Ignorar resize en móviles
});
```

### **Valores recomendados:**
- **Desktop:** `smooth: 1` (fluido pero no exagerado)
- **Móviles:** `smoothTouch: 0.1` (ligero para mejor performance)
- **Efectos:** `effects: true` (para paralaje y animaciones)

## 🚫 Cómo deshabilitar smooth scroll

### **Método 1: Usando el hook**
```jsx
import { useScrollSmoother } from '../components/ScrollSmoother';

function DisableButton() {
  const { disable } = useScrollSmoother();
  
  return <button onClick={disable}>Deshabilitar Smooth Scroll</button>;
}
```

### **Método 2: Usando props**
```jsx
// En page.js
<ScrollSmootherWrapper disabled={true} />
```

### **Método 3: Usando funciones globales (desde console)**
```javascript
// En consola del navegador
window.toggleSmoothScroll(false); // Deshabilitar
window.toggleSmoothScroll(true);  // Habilitar
```

## 🐛 Debugging y controles de desarrollo

Para probar durante el desarrollo, agrega el componente de control:

```jsx
// En cualquier página
import ScrollController from '../components/ScrollController';

export default function Page() {
  return (
    <>
      {/* Tu contenido */}
      <ScrollController /> {/* Solo para desarrollo */}
    </>
  );
}
```

## 📱 Compatibilidad móvil

ScrollSmoother está configurado para funcionar bien en móviles:

- **`smoothTouch: 0.1`** - Scroll suave ligero en touch devices
- **`ignoreMobileResize: true`** - Evita bugs al rotar pantalla
- **`normalizeScroll: true`** - Comportamiento consistente

## 🔄 Refrescar ScrollTrigger

Si usas animaciones con ScrollTrigger, puedes refrescar:

```jsx
import { useScrollSmoother } from '../components/ScrollSmoother';

function MyComponent() {
  const { refresh } = useScrollSmoother();
  
  useEffect(() => {
    // Después de cambios en el DOM
    refresh();
  }, [someState]);
}
```

## ⚠️ Notas importantes

1. **No duplicar estructura**: Los divs `#smooth-wrapper` y `#smooth-content` ya están en `layout.js`

2. **CSS crítico**: Las reglas `overflow: hidden` en `html, body` son esenciales

3. **Performance**: ScrollSmoother usa `will-change: transform` automáticamente

4. **SSR**: El componente maneja la hidratación correctamente con `isMounted`

5. **Cleanup**: ScrollSmoother se limpia automáticamente al desmontar componentes

## 🎯 Próximos pasos

- ✅ El smooth scroll está funcionando globalmente
- ✅ Puedes controlarlo desde cualquier componente
- ✅ Funciona en móviles y desktop
- ✅ No interfiere con tu layout existente

¡Tu implementación está completa y lista para usar! 🚀
