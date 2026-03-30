"use client";

import { useMemo, useEffect, useState } from "react";
import { Environment, Sky, Lightformer } from "@react-three/drei";
import * as React from "react";

// Optimized environment component with reduced resolution and better performance
const SharedEnvironment = React.memo(function SharedEnvironment() {
  // Lightweight mobile check without external hooks
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== "undefined" && window.innerWidth <= 768);
    check();
    if (typeof window !== "undefined") window.addEventListener("resize", check);
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("resize", check);
    };
  }, []);
  
  const config = useMemo(() => ({
    resolution: isMobile ? 64 : 128,
    intensity: isMobile ? 0.42 : 0.5,
    blur: isMobile ? 0.28 : 0.34,
  }), [isMobile]);

  // Memoize the entire environment setup
  const environmentSetup = useMemo(() => (
    <Environment 
      resolution={config.resolution}
      frames={1}
      background={false}
      blur={config.blur}
      intensity={config.intensity}
      // Additional performance optimizations
      preset={null}
    >
      <Sky 
        sunPosition={[3, 4, 2]}
        turbidity={6}
        rayleigh={1}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        inclination={0.4}
        azimuth={0.25}
        // Performance optimizations
        distance={1000}
        segments={8} // Reduce geometry complexity
      />
      {/* Lightformers create crisp highlights useful for premium glass silhouettes */}
      <Lightformer
        form="rect"
        intensity={1.4}
        position={[5, 4, 3]}
        scale={[4, 2.2, 1]}
        color="#f8fbff"
      />
      <Lightformer
        form="rect"
        intensity={0.9}
        position={[-4, 1.2, -2]}
        rotation={[0, Math.PI / 3, 0]}
        scale={[3, 1.5, 1]}
        color="#dce3ec"
      />
    </Environment>
  ), [config.resolution, config.blur, config.intensity]);

  return environmentSetup;
});

export default SharedEnvironment;


