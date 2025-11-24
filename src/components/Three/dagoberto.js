"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial, Text, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { glassMaterialProps, useSlowSpin } from "./common";
import SharedEnvironment from "./SharedEnvironment";
import OptimizedCanvas from "../ui/OptimizedCanvas";
import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";

// Preload del modelo
useGLTF.preload("/assets/models/dagoberto.glb");

function DagobertoModel() {
  const { nodes } = useGLTF("/assets/models/dagoberto.glb");
  const { viewport } = useThree();
  const ref = useRef();
  
  // Responsive breakpoints
  const isMobile = viewport.width < 6;
  const isTablet = viewport.width >= 6 && viewport.width < 10;
  
  // Configuraciones responsive
  const responsiveConfig = useMemo(() => {
    if (isMobile) {
      return {
        fontSize: 1.4,
        position: [-3.1, -1.5, -3],
        dagobertoScale: 5,
        dagobertoPosition: [0, 0.5, 0],
        groupScale: Math.min(viewport.width / 6, viewport.height / 6),
        textContent: "LAUTARO\n       TORRES"
      };
    } else if (isTablet) {
      return {
        fontSize: 2.8,
        position: [0, 1.8, -4],
        dagobertoScale: 6.5,
        dagobertoPosition: [0, -0.2, 0],
        groupScale: Math.min(viewport.width / 15, viewport.height / 7),
        textContent: "LAUTARO TORRES"
      };
    } else {
      return {
        fontSize: 3.2,
        position: [0, 2.5, -5],
        dagobertoScale: 8,
        dagobertoPosition: [0, 0, 0],
        groupScale: Math.min(viewport.width / 8, viewport.height / 8),
        textContent: "LAUTARO TORRES"
      };
    }
  }, [isMobile, isTablet, viewport]);

  // Material como LogoLT (vidrio/transmisivo claro)
  const materialProps = glassMaterialProps;

  // Constant slow spin only
  useSlowSpin(ref, 0.01);

  return (
    <group scale={responsiveConfig.groupScale}>
      <Text 
        position={responsiveConfig.position} 
        rotation={[0, 0, 0]}
        fontSize={responsiveConfig.fontSize} 
        color="white" 
        anchorX={isMobile ? "left" : "center"} 
        anchorY="center"
        maxWidth={isMobile ? 15 : 20}
        lineHeight={isMobile ? 1 : 1.0}
        textAlign={isMobile ? "left" : "center"}
        font="/fonts/Anton-Regular.ttf"
      >
        {responsiveConfig.textContent}
      </Text>
      
      <group ref={ref} position={responsiveConfig.dagobertoPosition} scale={responsiveConfig.dagobertoScale}>
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
    </group>
  );
}

export default function Dagoberto() {
  return (
    <div
      style={{
        position: "absolute",
        top: "5%",
        left: "5%",
        width: "90%",
        height: "90%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <OptimizedCanvas 
        camera={{ position: [0, 2, 8], fov: 50 }}
        dpr={[0.75, 1.25]}
        frameloop="always"
        performance={{ min: 0.7 }}
        gl={{ antialias: false, alpha: true }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight intensity={0.35} />
        <SharedEnvironment />
        <DagobertoModel />
      </OptimizedCanvas>
    </div>
  );
}