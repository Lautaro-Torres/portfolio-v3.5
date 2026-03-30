"use client";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useMemo } from "react";
import * as React from "react";

// Ultra-lightweight placeholder for monitor
const MonitorPlaceholder = React.memo(function MonitorPlaceholder() {
  const ref = useRef();

  // Simple box geometry instead of complex model
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 0.6, 0.1), []);
  
  // Basic material
  const material = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#d8dde7",
    transparent: true,
    opacity: 0.72,
  }), []);

  // Very slow rotation
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      ref.current.rotation.y = time * 0.05; // Extremely slow rotation
    }
  });

  return (
    <mesh ref={ref} geometry={geometry} material={material} scale={[2, 1.2, 0.2]} />
  );
});

export default MonitorPlaceholder;

