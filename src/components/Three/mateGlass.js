"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { glassMaterialProps, useSlowSpin } from "./common";
import SharedEnvironment from "./SharedEnvironment";
import OptimizedCanvas from "../ui/OptimizedCanvas";
import * as THREE from "three";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Preload del modelo para mejor performance inicial
useGLTF.preload("/assets/models/mate.glb");

function MateGlassModel({ position = [1, .5, 0], containerRef }) {
  const { nodes } = useGLTF("/assets/models/mate.glb");
  const ref = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const viewportWidth = useThree((state) => state.viewport.width);

  // Detectar tamaño de viewport (mobile/tablet/desktop)
  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Animate on scroll
  useEffect(() => {
    if (!containerRef?.current || !ref.current) return;

    // Set initial state - hidden
    ref.current.scale.set(0, 0, 0);
    ref.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = 0;
        child.material.transparent = true;
      }
    });

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 75%",
      onEnter: () => {
        // Animate scale and opacity
        gsap.to(ref.current.scale, {
          x: responsiveScale,
          y: responsiveScale,
          z: responsiveScale,
          duration: 0.9,
          ease: "back.out(1.4)"
        });

        ref.current.traverse((child) => {
          if (child.isMesh && child.material) {
            gsap.to(child.material, {
              opacity: 1,
              duration: 0.9,
              ease: "power2.out"
            });
          }
        });
      },
      once: true,
    });

    return () => trigger.kill();
  }, [containerRef, isMobile, isTablet]);

  // Material similar a LogoLT con buena visibilidad
  const materialProps = glassMaterialProps;

  // Constant slow spin only
  useSlowSpin(ref, 0.01);

  // Valores responsive para posición y escala
  const responsivePosition = isMobile ? [position[0], 0, position[2]] : position;
  // Scale based on R3F viewport width for consistent apparent size across laptop widths
  const responsiveScale = (() => {
    if (isMobile) return 0.82;          // keep mobile slightly smaller
    if (isTablet) return 0.9;           // tablet medium
    // Desktop/laptops: adapt to viewport width in world units
    if (viewportWidth < 5) return 0.72; // small laptops
    if (viewportWidth < 7) return 0.78; // 13-14"
    if (viewportWidth < 9) return 0.84; // 15"
    return 0.88;                        // large/ultra-wide
  })();

  return (
    <group ref={ref} scale={responsiveScale} rotation={[0.2, 0, 0.15]} position={responsivePosition}>
      {Object.keys(nodes).map((key) => {
        const node = nodes[key];
        if (node.isMesh) {
          return (
            <mesh key={key} {...node}>
              <MeshTransmissionMaterial {...materialProps} />
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
}

// Hook para detectar el tamaño de pantalla
function useResponsiveCanvasStyles() {
  const [styles, setStyles] = useState({
    top: "-50%",
    left: "-40%",
    width: "200%",
    height: "200%"
  });

  useEffect(() => {
    const updateStyles = () => {
      const width = window.innerWidth;
      
      if (width <= 768) { // Mobile (keep as-is per user's note)
        setStyles({
          top: "-30%",
          left: "-20%",
          width: "175%",
          height: "150%"
        });
      } else if (width <= 1024) { // Tablet
        setStyles({
          top: "-18%",
          left: "-18%",
          width: "135%",
          height: "135%"
        });
      } else { // Desktop
        setStyles({
          top: "-10%",
          left: "-10%",
          width: "120%",
          height: "120%"
        });
      }
    };

    updateStyles();
    window.addEventListener('resize', updateStyles);
    
    return () => window.removeEventListener('resize', updateStyles);
  }, []);

  return styles;
}

export default function MateGlass({ position }) {
  const canvasStyles = useResponsiveCanvasStyles();
  const [isMobile, setIsMobile] = useState(false);
  const [mountCanvas, setMountCanvas] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Defer Canvas mount on mobile until browser is idle
  useEffect(() => {
    if (!isMobile) return;
    setMountCanvas(false);
    const init = () => setMountCanvas(true);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(init, { timeout: 1500 });
    } else {
      setTimeout(init, 200);
    }
  }, [isMobile]);
  
  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        ...canvasStyles, // Aplicamos los estilos responsive
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {mountCanvas && (
      <OptimizedCanvas
        camera={{ position: [0, 2, 5], fov: 50 }}
        dpr={[0.75, 1.25]}
        frameloop="always" 
        performance={{ min: 0.6 }}
        gl={{ antialias: false, alpha: true }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight intensity={0.35} />
        <SharedEnvironment />
        <MateGlassModel position={position} containerRef={containerRef} />
      </OptimizedCanvas>
      )}
    </div>
  );
}
