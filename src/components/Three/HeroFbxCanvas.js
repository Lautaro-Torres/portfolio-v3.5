"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useFBX, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as React from "react";
import { Suspense, useRef, useEffect } from "react";
import * as THREE from "three";

function FbxModel() {
  const model = useFBX("/assets/models/model.fbx");
  const breathing = useFBX("/assets/models/Breathing Idle.fbx");
  const { camera, size } = useThree();

  const groupRef = useRef();
  const mixer = useRef();
  const headRef = useRef(null);
  const neckRef = useRef(null);
  const spine2Ref = useRef(null);

  // 🖱️ Vectores del mouse
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const smoothedMouse = useRef(new THREE.Vector2(0, 0));

  // 🦴 Buscar huesos del rig
  useEffect(() => {
    model.traverse((obj) => {
      if (!obj.isBone) return;
      const n = obj.name.toLowerCase();
      if (n.includes("head")) headRef.current = obj;
      if (n.includes("neck")) neckRef.current = obj;
      if (n.includes("spine2")) spine2Ref.current = obj;
    });
  }, [model]);

  // 🖱️ Movimiento del mouse (centrado dinámicamente)
  useEffect(() => {
    const onMove = (e) => {
      const rect = document.body.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      // Calcular posición relativa del mouse respecto al centro real de la pantalla
      mouseRef.current.x = (e.clientX - cx) / cx;
      mouseRef.current.y = (e.clientY - cy) / cy;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ⚙️ Animación de respiración
  useEffect(() => {
    if (breathing.animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(model);
      const clip = breathing.animations[0];
      const action = mixer.current.clipAction(clip);
      action.play();
    }
  }, [breathing, model]);

  // 🎞️ Movimiento cinematográfico + seguimiento estable
  useFrame((state, delta) => {
    mixer.current?.update(delta);

    // suavizado
    smoothedMouse.current.lerp(mouseRef.current, 0.08);

    // Rango natural, proporcional a viewport
    const tY = smoothedMouse.current.x * 6; // horizontal sensible
    const tX = -smoothedMouse.current.y * 2.5; // vertical (invertido para seguir sentido real)

    // torso → cuello → cabeza
    if (spine2Ref.current) {
      spine2Ref.current.rotation.y += (tY * 0.25 - spine2Ref.current.rotation.y) * 0.1;
      spine2Ref.current.rotation.x += (tX * 0.15 - spine2Ref.current.rotation.x) * 0.1;
    }

    if (neckRef.current) {
      neckRef.current.rotation.y += (tY * 0.6 - neckRef.current.rotation.y) * 0.18;
      neckRef.current.rotation.x += (tX * 0.45 - neckRef.current.rotation.x) * 0.18;
    }

    if (headRef.current) {
      const followSpeed = 0.35;
      headRef.current.rotation.y += (tY * 1.4 - headRef.current.rotation.y) * followSpeed;
      headRef.current.rotation.x += (tX * 1.0 - headRef.current.rotation.x) * followSpeed;
    }
  });

  // 📌 Fijar posición y escala estable
  const scale = 1.3;
  const offset = new THREE.Vector3(0, -1, 0);

  return (
    <group ref={groupRef} scale={scale} position={offset} frustumCulled={false}>
      <primitive object={model} />
    </group>
  );
}

export default function HeroFbxCanvas() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        dpr={[0.75, 1.25]}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        frameloop="always"
        onCreated={({ camera }) => {
          camera.position.set(0, 0, 5);
          camera.lookAt(0, 0, 0);
        }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 4]} intensity={0.8} />
        <Suspense fallback={null}>
          <FbxModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
