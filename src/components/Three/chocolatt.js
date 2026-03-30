"use client";
import { useThree } from "@react-three/fiber";
import { Text, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as React from "react";
import OptimizedCanvas from "../ui/OptimizedCanvas";

// Memoized text component for better performance
const Title3D = React.memo(function Title3D() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 6;
  const isTablet = viewport.width >= 6 && viewport.width < 10;

  const config = React.useMemo(() => {
    if (isMobile) {
      return {
        fontSize: 1.4,
        position: [-3.1, -1.5, -3],
        groupScale: Math.min(viewport.width / 6, viewport.height / 6),
        textContent: "LAUTARO\n       TORRES",
        anchorX: "left",
        textAlign: "left",
        maxWidth: 15,
      };
    } else if (isTablet) {
      return {
        fontSize: 2.8,
        position: [0, 1.8, -4],
        groupScale: Math.min(viewport.width / 15, viewport.height / 7),
        textContent: "LAUTARO TORRES",
        anchorX: "center",
        textAlign: "center",
        maxWidth: 20,
      };
    } else {
      return {
        fontSize: 3.2,
        position: [0, 2.5, -5],
        groupScale: Math.min(viewport.width / 8, viewport.height / 8),
        textContent: "LAUTARO TORRES",
        anchorX: "center",
        textAlign: "center",
        maxWidth: 20,
      };
    }
  }, [isMobile, isTablet, viewport]);

  return (
    <group scale={config.groupScale}>
      <Text 
        position={config.position}
        rotation={[0, 0, 0]}
        fontSize={config.fontSize}
        color="white"
        anchorX={config.anchorX}
        anchorY="center"
        maxWidth={config.maxWidth}
        lineHeight={config.textAlign === "left" ? 1 : 1.0}
        textAlign={config.textAlign}
        font="/fonts/anton/Anton-Regular.ttf"
        // Performance optimizations
        castShadow={false}
        receiveShadow={false}
        frustumCulled={true}
      >
        {config.textContent}
      </Text>
    </group>
  );
});

export default function Chocolatt() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <OptimizedCanvas 
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        performance={{ min: 0.5 }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        {/* Optimized lighting - single ambient light for better performance */}
        <ambientLight intensity={0.6} />
        <Title3D />
      </OptimizedCanvas>
    </div>
  );
} 