"use client";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState, useMemo } from "react";

export default function OptimizedCanvas({ 
  children, 
  frameloop = "demand", 
  performance = { min: 0.5 },
  dpr,
  ...props 
}) {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Intersection Observer to detect visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "50px" // Start rendering 50px before entering viewport
      }
    );

    observer.observe(canvasRef.current);

    return () => {
      if (canvasRef.current) {
        observer.unobserve(canvasRef.current);
      }
    };
  }, []);

  // Track mobile breakpoint for DPR/antialias
  useEffect(() => {
    const update = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 768);
    update();
    if (typeof window !== 'undefined') window.addEventListener('resize', update);
    return () => { if (typeof window !== 'undefined') window.removeEventListener('resize', update); };
  }, []);

  // Pause rendering when not visible
  const effectiveFrameloop = isIntersecting ? frameloop : "never";

  // Default DPR caps per device if not provided by caller
  const effectiveDpr = useMemo(() => {
    if (typeof dpr !== 'undefined') return dpr;
    return isMobile ? [0.75, 1] : [1, 1.25];
  }, [dpr, isMobile]);

  return (
    <div ref={canvasRef} style={{ width: "100%", height: "100%" }}>
      <Canvas
        dpr={effectiveDpr}
        frameloop={effectiveFrameloop}
        performance={performance}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? "low-power" : "high-performance",
          // Performance optimizations
          logarithmicDepthBuffer: false,
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
          // Additional optimizations
          failIfMajorPerformanceCaveat: false,
          premultipliedAlpha: false,
        }}
        {...props}
      >
        {children}
      </Canvas>
    </div>
  );
}

