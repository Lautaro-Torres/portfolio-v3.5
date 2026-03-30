"use client";
import { useEffect, useState, useCallback } from 'react';

const PER_ASSET_TIMEOUT_MS = 4000;
const TOTAL_PRELOAD_TIMEOUT_MS = 10000;
const ASSETS = [
  { url: '/assets/models/logo-lt.glb', name: 'Logo LT', type: 'model' },
  { url: '/assets/models/dagoberto.glb', name: 'Modelo Dagoberto', type: 'model' },
  { url: '/assets/models/mate.glb', name: 'Modelo Mate', type: 'model' },
  { url: '/assets/models/monitor.glb', name: 'Modelo Monitor', type: 'model' },
  { url: '/assets/images/projects/prozy-432632.webp', name: 'Imagen Prozy', type: 'image' }
];

function withTimeout(promise, timeoutMs, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(new Error(`Timeout loading ${label} (${timeoutMs}ms)`));
      }, timeoutMs);
    }),
  ]);
}

export function useAssetPreloader() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentAsset, setCurrentAsset] = useState('');

  const preloadAsset = useCallback((asset) => {
    const job = new Promise((resolve, reject) => {
      if (asset.type === 'model') {
        // Para modelos 3D
        fetch(asset.url)
          .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${asset.url}`);
            return response.blob();
          })
          .then(() => resolve())
          .catch(reject);
      } else if (asset.type === 'image') {
        // Para imágenes
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = asset.url;
      } else if (asset.type === 'font') {
        // Para fuentes
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = asset.url;
        link.as = 'font';
        link.type = 'font/ttf';
        link.crossOrigin = 'anonymous';
        link.onload = () => resolve();
        link.onerror = reject;
        document.head.appendChild(link);
      } else {
        // Fallback para otros tipos
        fetch(asset.url)
          .then(() => resolve())
          .catch(reject);
      }
    });
    return withTimeout(job, PER_ASSET_TIMEOUT_MS, asset.name);
  }, []);

  const startPreloading = useCallback(async () => {
    setIsComplete(false);
    setLoadingProgress(0);

    await withTimeout(
      (async () => {
        for (let i = 0; i < ASSETS.length; i++) {
          const asset = ASSETS[i];
          setCurrentAsset(asset.name);

          try {
            await preloadAsset(asset);
          } catch (error) {
            console.warn(`Failed to preload ${asset.name}:`, error);
            // Continuar con el siguiente asset aunque falle uno
          }

          // Actualizar progreso
          const progress = ((i + 1) / ASSETS.length) * 100;
          setLoadingProgress(progress);
        }
      })(),
      TOTAL_PRELOAD_TIMEOUT_MS,
      "preload batch"
    ).catch((error) => {
      console.warn("Preload batch timeout/failure, continuing app startup:", error);
    });

    setCurrentAsset('Completado');
    setIsComplete(true);
  }, [preloadAsset]);

  return {
    loadingProgress,
    isComplete,
    currentAsset,
    startPreloading,
    totalAssets: ASSETS.length
  };
}

// Hook simplificado que funciona con el loader
export function useSmartLoader(options = {}) {
  const {
    enablePreloading = true,
    fastMode = process.env.NODE_ENV === 'development',
    minLoadTime = 1000
  } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Inicializando...');
  
  const { 
    loadingProgress, 
    isComplete, 
    currentAsset, 
    startPreloading 
  } = useAssetPreloader();

  useEffect(() => {
    let mounted = true;
    const startTime = Date.now();

    const handleLoading = async () => {
      if (enablePreloading && !fastMode) {
        // Precargar assets reales
        setCurrentTask('Cargando recursos...');
        
        try {
          await startPreloading();
          
          if (!mounted) return;
          
          setProgress(100);
          setCurrentTask('Completado!');
        } catch (error) {
          console.warn('Preloading failed, falling back to simulation:', error);
          // Fallback a simulación si falla la precarga
          await simulateLoading();
        }
      } else {
        // Simulación para desarrollo
        await simulateLoading();
      }

      // Asegurar tiempo mínimo
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsed);
      
      setTimeout(() => {
        if (mounted) {
          setIsLoading(false);
        }
      }, remainingTime);
    };

    const simulateLoading = async () => {
      const steps = [
        { progress: 15, task: 'Inicializando componentes...' },
        { progress: 30, task: 'Cargando modelos 3D...' },
        { progress: 50, task: 'Preparando animaciones...' },
        { progress: 70, task: 'Configurando escena...' },
        { progress: 85, task: 'Optimizando...' },
        { progress: 100, task: 'Listo!' }
      ];

      for (let i = 0; i < steps.length; i++) {
        if (!mounted) return;
        
        const step = steps[i];
        setProgress(step.progress);
        setCurrentTask(step.task);
        
        // Delay más corto para mejor UX
        const delay = fastMode ? 300 : 600;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    };

    handleLoading();

    return () => {
      mounted = false;
    };
  }, [enablePreloading, fastMode, minLoadTime, startPreloading]);

  // Usar progreso real si está precargando
  const finalProgress = enablePreloading && !fastMode ? loadingProgress : progress;
  const finalTask = enablePreloading && !fastMode ? currentAsset : currentTask;

  return {
    isLoading,
    progress: Math.round(finalProgress),
    currentTask: finalTask,
    fastMode
  };
}
