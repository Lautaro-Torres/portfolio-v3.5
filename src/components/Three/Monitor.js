"use client";
import { useFrame } from "@react-three/fiber";
import { useGLTF, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { glassMaterialProps, useSlowSpin } from "./common";
import { useRef, useEffect, useMemo, useState } from "react";
import * as React from "react";
import OptimizedCanvas from "../ui/OptimizedCanvas";
import SharedEnvironment from "./SharedEnvironment";
import MonitorPlaceholder from "./MonitorPlaceholder";

// Preload del modelo
useGLTF.preload("/assets/models/monitor.glb");

// Ultra-optimized model component with aggressive performance settings
const MonitorModel = React.memo(function MonitorModel() {
  const { nodes } = useGLTF("/assets/models/monitor.glb");
  const ref = useRef();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Shared glass material
  const materialProps = glassMaterialProps;

  // Unified constant slow spin (no interaction)
  useSlowSpin(ref, 0.01);

  // Posición responsive with reduced scale for mobile
  const responsivePosition = useMemo(() => 
    isMobile ? [-.25, 0, 0] : [-.25, .25, 0], 
    [isMobile]
  );

  const responsiveScale = useMemo(() => 
    isMobile ? 5.5 : 5.5, // Bigger to compensate for model base size
    [isMobile]
  );

  // Aggressively optimized mesh rendering - limit to first 5 meshes
  const meshes = useMemo(() => {
    return Object.keys(nodes).slice(0, 5).map((key) => {
      const node = nodes[key];
      if (node.isMesh) {
        return (
          <mesh 
            key={key} 
            geometry={node.geometry}
            position={node.position}
            rotation={node.rotation}
            scale={node.scale}
            // Maximum performance optimizations
            castShadow={false}
            receiveShadow={false}
            frustumCulled={true}
            // Material will be applied below via MeshTransmissionMaterial
          />
        );
      }
      return null;
    });
  }, [nodes]);

  return (
    <group ref={ref} scale={responsiveScale} position={responsivePosition}>
      {Object.keys(nodes).slice(0, 5).map((key) => {
        const node = nodes[key];
        if (node.isMesh) {
          return (
            <mesh key={key} geometry={node.geometry} position={node.position} rotation={node.rotation} scale={node.scale}>
              <MeshTransmissionMaterial {...materialProps} />
            </mesh>
          );
        }
        return null;
      })}
    </group>
  );
});

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
      
      if (width <= 768) { // Mobile: keep inside container
        setStyles({
          top: "0%",
          left: "0%",
          width: "100%",
          height: "100%"
        });
      } else if (width <= 1024) { // Tablet
        setStyles({
          top: "-20%",
          left: "-20%",
          width: "140%",
          height: "140%"
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

export default function Monitor() {
  const canvasStyles = useResponsiveCanvasStyles();
  const [usePlaceholder, setUsePlaceholder] = useState(false);

  // Detect device performance and choose appropriate model
  useEffect(() => {
    const checkPerformance = () => {
      const isLowEndDevice = (navigator.hardwareConcurrency || 8) <= 4; // 4 cores or less
      const hasLowMemory = (navigator.deviceMemory || 8) <= 2; // very low memory
      
      // Only use placeholder on truly low-end devices
      if (isLowEndDevice && hasLowMemory) {
        setUsePlaceholder(true);
      }
    };

    checkPerformance();
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        ...canvasStyles, // Aplicamos los estilos responsive
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <OptimizedCanvas 
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={[0.75, 1.25]} // Balanced clarity and performance
        frameloop="always"
        performance={{ min: 0.3 }} // Lower performance threshold
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        {/* Minimal lights + shared environment for glass reflections */}
        <ambientLight intensity={0.35} />
        <SharedEnvironment />
        {usePlaceholder ? <MonitorPlaceholder /> : <MonitorModel />}
      </OptimizedCanvas>
    </div>
  );
} 