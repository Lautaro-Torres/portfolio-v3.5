"use client";
import { useMemo } from "react";
import * as THREE from "three";
import * as React from "react";

// Lightweight environment component for better performance
const LightweightEnvironment = React.memo(function LightweightEnvironment() {
  // Simple gradient background instead of expensive sky
  const background = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 2);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a1a1a');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    
    return texture;
  }, []);

  return (
    <primitive object={new THREE.Scene()} attach="background" />
  );
});

export default LightweightEnvironment;

