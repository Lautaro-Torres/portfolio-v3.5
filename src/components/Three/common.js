"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Shared transmission glass props: neutral, editorial, controlled
export const glassMaterialProps = {
  color: "#f3f5f8",
  transmission: 1,
  roughness: 0.08,
  thickness: 0.36,
  ior: 1.22,
  chromaticAberration: 0.0006,
  anisotropicBlur: 0.06,
  envMapIntensity: 1.05,
  backside: true,
  backsideThickness: 0.28,
  transparent: true,
  opacity: 0.92,
  resolution: 256,
  samples: 6,
  clearcoat: 0.55,
  clearcoatRoughness: 0.22,
  toneMapped: true,
};

// Unified slow spin + horizontal drag interaction
// Constant slow spin (no interaction)
export function useSlowSpin(targetRef, baseSpeed = 0.01) {
  useFrame(() => {
    const obj = targetRef.current;
    if (!obj) return;
    obj.rotation.y += baseSpeed;
  });
}

// LT-only: drag to rotate horizontally with pause and easing
export function useDragPauseSpin(targetRef, baseSpeed = 0.01, isActive = true) {
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const spinningRef = useRef(true);
  const pointerIdRef = useRef(null);

  const onPointerDown = (e) => {
    // unify mouse/touch with Pointer events
    draggingRef.current = true;
    spinningRef.current = false;
    lastXRef.current = e.clientX ?? e.pageX ?? 0;
    pointerIdRef.current = e.pointerId ?? null;
    try { e.target.setPointerCapture && e.target.setPointerCapture(pointerIdRef.current); } catch {}
  };

  const endDrag = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try { e?.target?.releasePointerCapture && e.target.releasePointerCapture(pointerIdRef.current); } catch {}
    // ensure it rotates again even if there was almost no movement
    if (Math.abs(velocityRef.current) < 0.00005) {
      velocityRef.current = 0;
      spinningRef.current = true; // immediate resume if no inertia
    }
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const obj = targetRef.current;
    if (!obj) return;
    const x = e.clientX ?? e.pageX ?? lastXRef.current;
    const dx = x - lastXRef.current;
    lastXRef.current = x;
    // rotation sensitivity
    const delta = dx * 0.005;
    obj.rotation.y += delta;
    // store velocity for inertial continuation
    velocityRef.current = delta;
  };

  useFrame(() => {
    if (!isActive) return; // pause updates when not visible to save CPU/GPU
    const obj = targetRef.current;
    if (!obj) return;
    if (!draggingRef.current) {
      if (Math.abs(velocityRef.current) > 0) {
        obj.rotation.y += velocityRef.current;
        // friction
        velocityRef.current *= 0.93;
        if (Math.abs(velocityRef.current) < 0.00005) {
          velocityRef.current = 0;
          spinningRef.current = true; // resume slow spin after inertia ends
        }
      } else if (spinningRef.current) {
        obj.rotation.y += baseSpeed;
      }
    }
  });

  return {
    onPointerDown,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onPointerOut: endDrag,
    onPointerMove,
  };
}


