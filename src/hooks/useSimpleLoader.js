"use client";
import { useState, useEffect } from 'react';

export function useSimpleLoader(options = {}) {
  const {
    fastMode = process.env.NODE_ENV === 'development',
    minLoadTime = 1200,
    enablePreloading = true
  } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Iniciando...');

  useEffect(() => {
    let mounted = true;
    let progressInterval;
    const startTime = Date.now();

    const runLoader = async () => {
      try {
        if (fastMode) {
          // Modo desarrollo - progreso rápido y fluido
          await smoothProgress([
            { progress: 0, task: 'Iniciando...', delay: 100 },
            { progress: 25, task: 'Inicializando...', delay: 200 },
            { progress: 50, task: 'Cargando...', delay: 300 },
            { progress: 75, task: 'Casi listo...', delay: 200 },
            { progress: 100, task: 'Completado!', delay: 100 }
          ]);
        } else {
          // Modo producción - simulación más lenta
          await smoothProgress([
            { progress: 0, task: 'Cargando experiencia...', delay: 200 },
            { progress: 15, task: 'Inicializando componentes...', delay: 400 },
            { progress: 35, task: 'Cargando modelos 3D...', delay: 600 },
            { progress: 55, task: 'Preparando animaciones...', delay: 500 },
            { progress: 75, task: 'Configurando escena...', delay: 400 },
            { progress: 90, task: 'Optimizando...', delay: 300 },
            { progress: 100, task: 'Completado!', delay: 200 }
          ]);
        }

        // Tiempo mínimo de visualización
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsed);

        setTimeout(() => {
          if (mounted) {
            setIsLoading(false);
          }
        }, remainingTime);

      } catch (error) {
        console.error('❌ Error en loader:', error);
        // Fallback de emergencia
        setProgress(100);
        setCurrentTask('Completado!');
        setTimeout(() => {
          if (mounted) setIsLoading(false);
        }, 500);
      }
    };

    const smoothProgress = async (steps) => {
      for (let i = 0; i < steps.length; i++) {
        if (!mounted) {
          return;
        }

        const step = steps[i];
        const prevStep = i > 0 ? steps[i - 1] : { progress: 0 };

        // Animación fluida del progreso
        await animateProgress(prevStep.progress, step.progress, step.task, step.delay);
      }
    };

    const animateProgress = (from, to, task, duration) => {
      return new Promise((resolve) => {
        setCurrentTask(task);
        
        const steps = 20; // Número de frames para la animación
        const increment = (to - from) / steps;
        const stepDuration = duration / steps;
        let currentProgress = from;
        let step = 0;

        const animate = () => {
          if (!mounted) {
            resolve();
            return;
          }

          currentProgress = Math.min(to, from + (increment * step));
          setProgress(Math.round(currentProgress));
          
          if (step < steps) {
            step++;
            setTimeout(animate, stepDuration);
          } else {
            resolve();
          }
        };

        animate();
      });
    };

    runLoader();

    return () => {
      mounted = false;
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [fastMode, minLoadTime, enablePreloading]);

  return {
    isLoading,
    progress,
    currentTask,
    fastMode
  };
}
