"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial, Text, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { glassMaterialProps, useDragPauseSpin } from "./common";
import SharedEnvironment from "./SharedEnvironment";
import * as THREE from "three";
import { useRef, useEffect, useMemo, useState } from "react";

// Preload del modelo
useGLTF.preload("/assets/models/logo-lt.glb");

function LogoLTModel({ isActive = true }) {
  const { nodes } = useGLTF("/assets/models/logo-lt.glb");
  const { viewport } = useThree();
  const ref = useRef();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 768);
    checkMobile();
    if (typeof window !== 'undefined') window.addEventListener('resize', checkMobile);
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('resize', checkMobile);
    };
  }, []);
  // const clock = useRef(new THREE.Clock()); // Not used
  
  // Memoize material properties
  const materialProps = glassMaterialProps;

  // Use loaded nodes directly to avoid breaking model structure

  // Memoize text properties
  const textProps = useMemo(() => ({
    common: {
      color: "white",
      letterSpacing: 0.04,
      // Use PP Neue Montreal font file (troika-three-text requires a URL)
      // Note: Using .woff fallback because .woff2 is not present in /public/fonts/montreal
      font: "/fonts/montreal/PPNeueMontreal-Medium.woff",
    },
    mobile: {
      fontSize: 1.5,
      maxWidth: 15,
    },
    desktop: {
      fontSize: 3.0,
      maxWidth: 20,
    }
  }), []);

  // LT-only: pause auto-spin while dragging, resume with easing
  // 'isVisible' comes from parent component (below) to pause when off-screen
  const dragHandlers = useDragPauseSpin(ref, 0.01, isActive);

  // Memoize text components to prevent unnecessary rerenders
  const mobileText = useMemo(() => (
    <>
      <Text 
        position={[-2.2, 2, -8]} 
        anchorX="center" 
        anchorY="center"
        textAlign="left"
        {...textProps.common}
        {...textProps.mobile}
      >
        LET'S
      </Text>
      
      <Text 
        position={[-2, 0.5, -8]} 
        anchorX="center" 
        anchorY="center"
        textAlign="left"
        {...textProps.common}
        {...textProps.mobile}
      >
        BUILD
      </Text>
      
      <Text 
        position={[0, -1, -8]} 
        anchorX="center" 
        anchorY="center"
        textAlign="left"
        {...textProps.common}
        {...textProps.mobile}
      >
        TOGETHER
      </Text>
    </>
  ), [textProps]);

  const desktopText = useMemo(() => (
    <>
      <Text 
        position={[-10, 3, -8]} 
        anchorX="left" 
        anchorY="center"
        textAlign="left"
        {...textProps.common}
        {...textProps.desktop}
      >
        LET'S BUILD
      </Text>
      
      <Text 
        position={[10, 0, -8]} 
        anchorX="right" 
        anchorY="center"
        textAlign="right"
        {...textProps.common}
        {...textProps.desktop}
      >
        TOGETHER
      </Text>
    </>
  ), [textProps]);

  return (
    <group scale={Math.min(viewport.width / 7, viewport.height / 7)}>
      {isMobile ? mobileText : desktopText}
      
      <group 
        ref={ref} 
        position={isMobile ? [0, -0.5, 0] : [0, 0, 0]} 
        scale={isMobile ? 0.9 : 0.7}
        {...dragHandlers}
      >
        {Object.keys(nodes).map((key) => {
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
    </group>
  );
}

// Custom hook for visibility detection
const useIsVisible = (ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
};

export default function LogoLT() {
  const containerRef = useRef();
  const isVisible = useIsVisible(containerRef);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 768);
    checkMobile();
    if (typeof window !== 'undefined') window.addEventListener('resize', checkMobile);
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Memoize camera settings
  const cameraSettings = useMemo(() => ({
    position: [0, 0, 12],
    fov: 45,
    near: 0.1,
    far: 1000
  }), []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        pointerEvents: "none",
        // Hardware acceleration
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        perspective: "1000px"
      }}
    >
      <Canvas 
        camera={cameraSettings}
        dpr={[0.75, 1.25]} // Lower DPR cap for performance
        frameloop={isVisible ? "always" : "never"}
        performance={{ min: 0.5 }}
        gl={{
          antialias: !isMobile, // Disable antialiasing on mobile
          powerPreference: "high-performance",
          alpha: true, // Transparent canvas to show page background (same as Monitor)
          stencil: false, // Disable stencil buffer if not needed
          depth: true,
        }}
      >
        <>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <directionalLight 
            position={[10, 10, 10]} 
            intensity={0.4} 
            castShadow={false}
          />
          {/* Pass visibility down so inner hook can skip updates when hidden */}
          <LogoLTModel isActive={isVisible} />
          <SharedEnvironment />
          {/* Keep the scene minimal; enable external stats button if needed */}
        </>
      </Canvas>
    </div>
  );
} 