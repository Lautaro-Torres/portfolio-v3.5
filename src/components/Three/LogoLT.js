"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, Text, AdaptiveEvents, MeshTransmissionMaterial } from "@react-three/drei";
import { useDragPauseSpin } from "./common";
import SharedEnvironment from "./SharedEnvironment";
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
  
  // Stable glass profile so transmission can be adjusted
  // without breaking the look.
  const materialProps = useMemo(
    () => ({
      thickness: 0.5,
      roughness: 0,
      transmission: 1,
      ior: 0.85,
      chromaticAberration: 0.025,
      anisotropicBlur: 0,
      distortion: 0.02,
      distortionScale: 1,
      temporalDistortion: 0.5,
      backside: false,
      envMapIntensity: 0.1,
      resolution: isMobile ? 512 : 1024,
      samples: isMobile ? 8 : 12,
      opacity: 1,
    }),
    [isMobile]
  );

  // Memoize text properties
  const textProps = useMemo(() => ({
    common: {
      color: "white",
      letterSpacing: 0.04,
      font: "/fonts/anton/Anton-Regular.ttf",
    },
    mobile: {
      fontSize: 2.75,
      maxWidth: 18,
    },
    desktop: {
      fontSize: 4.15,
      maxWidth: 26,
    }
  }), []);

  // LT-only: pause auto-spin while dragging, resume with easing
  // 'isVisible' comes from parent component (below) to pause when off-screen
  const dragHandlers = useDragPauseSpin(ref, 0.01, isActive);

  // Memoize text components to prevent unnecessary rerenders
  const mobileText = useMemo(() => (
    <Text
      position={[0, 3.05, -12]}
      anchorX="center"
      anchorY="center"
      textAlign="left"
      lineHeight={1.06}
      {...textProps.common}
      {...textProps.mobile}
    >
      {"LET\u2019S\nBUILD\nTOGETHER"}
    </Text>
  ), [textProps]);

  const desktopText = useMemo(() => (
    <>
      <Text 
        position={[-11.2, 3.35, -12]} 
        anchorX="left" 
        anchorY="center"
        textAlign="left"
        {...textProps.common}
        {...textProps.desktop}
      >
        LET&apos;S BUILD
      </Text>
      
      <Text 
        position={[11.2, 0.15, -12]} 
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

  const meshes = useMemo(
    () => Object.keys(nodes).map((key) => nodes[key]).filter((node) => node?.isMesh),
    [nodes]
  );

  // Slightly smaller scale + camera pulled back so rotated mesh stays inside frustum (no top/bottom clip).
  const sceneScale = Math.min(viewport.width / 7.75, viewport.height / 7.75);

  return (
    <group scale={sceneScale}>
      {isMobile ? mobileText : desktopText}
      
      <group 
        ref={ref} 
        position={isMobile ? [0, -0.5, 2.8] : [0, 0, 2.8]} 
        scale={isMobile ? 0.8 : 0.55}
        {...dragHandlers}
      >
        {meshes.length > 0
          ? meshes.map((node, idx) => (
            <mesh
              key={node.uuid || idx}
              geometry={node.geometry}
              position={[node.position.x, node.position.y, node.position.z]}
              rotation={[node.rotation.x, node.rotation.y, node.rotation.z]}
              scale={[node.scale.x, node.scale.y, node.scale.z]}
            >
              <MeshTransmissionMaterial {...materialProps} />
            </mesh>
          ))
          : (
            <mesh>
              <torusKnotGeometry args={[0.8, 0.18, 128, 16]} />
              <MeshTransmissionMaterial {...materialProps} />
            </mesh>
          )}
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
    position: [0, 0, 15],
    fov: 45,
    near: 0.1,
    far: 1000,
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
        overflow: "visible",
        pointerEvents: isMobile ? "none" : "auto",
        touchAction: isMobile ? "pan-y" : "none",
        transform: "translateZ(0)",
        perspective: "1000px",
      }}
    >
      {/* Mobile: sólo la zona central captura gestos (drag del logo); el resto deja pasar el scroll. */}
      <div
        style={
          isMobile
            ? {
                pointerEvents: "auto",
                touchAction: "none",
                width: "min(78vw, 320px)",
                height: "min(52vh, 380px)",
                maxWidth: "100%",
                maxHeight: "100%",
                overflow: "visible",
              }
            : {
                width: "100%",
                height: "100%",
                overflow: "visible",
                pointerEvents: "auto",
                touchAction: "none",
              }
        }
      >
        <Canvas
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            backfaceVisibility: "visible",
            WebkitBackfaceVisibility: "visible",
          }}
          camera={cameraSettings}
          dpr={[1, 1.8]}
          frameloop="always"
          performance={{ min: 0.5 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: true,
          }}
        >
          <>
            <AdaptiveEvents />
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 10]} intensity={0.58} castShadow={false} />
            <directionalLight position={[-8, 5, -6]} intensity={0.28} castShadow={false} />
            <pointLight position={[0, -2.5, 4]} intensity={0.32} distance={18} />
            <LogoLTModel isActive={isVisible} />
            <SharedEnvironment />
          </>
        </Canvas>
      </div>
    </div>
  );
} 