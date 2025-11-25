"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { LumaSplatsThree, LumaSplatsSemantics } from "@lumaai/luma-web";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { glassMaterialProps } from "./Three/common";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AvatarLumaSplat() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
    });
    // Cap DPR for performance: 1.0 on mobile, max 1.5 on desktop
    const isMobileDevice = window.innerWidth <= 768;
    const maxDPR = isMobileDevice ? 1.0 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDPR));

    const getSize = () => {
      const width = container.clientWidth || container.offsetWidth || 1;
      const height =
        container.clientHeight || container.offsetHeight || width * 0.75;
      return { width, height };
    };

    const { width, height } = getSize();
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // -----------------------------------------------------------------------
    // 📸 CAMERA
    // -----------------------------------------------------------------------
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);

    // Posición "final" más cercana al personaje
    const baseCameraPosition = new THREE.Vector3(0, 2.0, 2.6);
    const baseLookAt = new THREE.Vector3(0, 1.5, 0);

    // Vista de pájaro inicial: más alta y alejada
    const introStartPosition = new THREE.Vector3(0.3, 6.0, 11.0);
    const introStartLookAt = new THREE.Vector3(0.0, 2.4, 0);

    // FOV y duración de la transición
    const introStartFov = 60;
    const introEndFov = 46;
    const introDuration = 3.6; // animación un poco más lenta y larga

    // Detectamos mobile una sola vez (no necesita ser súper preciso)
    const isMobile = window.innerWidth <= 768;

    // Fase inicial del giro en mobile: arrancamos 120° hacia la izquierda
    // para que el primer frame ya muestre mejor el frente del sujeto
    const mobileOrbitPhase = -Math.PI * (2 / 3);

    // Eje de órbita afinado: pequeño offset manual en X/Z para centrar mejor al personaje
    const mobileOrbitCenterOffset = new THREE.Vector3(-0.18, 0, 0.08);

    camera.position.copy(introStartPosition);
    camera.lookAt(introStartLookAt);
    camera.fov = introStartFov;
    camera.updateProjectionMatrix();

    // -----------------------------------------------------------------------
    // LUMA SPLATS
    // -----------------------------------------------------------------------
    const splats = new LumaSplatsThree({
      source:
        "https://lumalabs.ai/capture/49abe6ae-68ab-4bd6-a459-a96d995a637b",
      particleRevealEnabled: true,
      enableThreeShaderIntegration: true,
    });

    splats.position.y = 1.4;
    splats.rotation.y = Math.PI * -0.5;

    splats.semanticsMask =
      LumaSplatsSemantics.FOREGROUND | LumaSplatsSemantics.BACKGROUND;

    scene.add(splats);

    // -----------------------------------------------------------------------
    // 🌓 BACKDROP CURVO – Fondo negro elegante
    // -----------------------------------------------------------------------
    const backdropGeo = new THREE.CylinderGeometry(
      4.5, // radio arriba (más grande)
      7.0, // radio abajo (mucho más grande, forma "huevo" marcada)
      7, // altura mayor
      64, // más segmentos → más suave
      1,
      true // openEnded
    );

    // Apunta hacia adelante (curvatura hacia nosotros)
    backdropGeo.rotateY(Math.PI);

    // Material físico inspirado en el glass del logo, pero opaco y negro
    const backdropMat = new THREE.MeshPhysicalMaterial({
      color: 0x000000, // base negra
      roughness: glassMaterialProps.roughness,
      transmission: 0, // sin transmisión, fondo sólido
      ior: glassMaterialProps.ior,
      thickness: glassMaterialProps.thickness,
      transparent: false,
      opacity: 1,
      envMapIntensity: 0, // sin reflejos de skybox / splats
      side: THREE.BackSide,
    });

    const backdrop = new THREE.Mesh(backdropGeo, backdropMat);

    // Escala no uniforme para reforzar sensación "huevo" y que cubra más
    backdrop.scale.set(1.3, 1.6, 1.3);

    // Mucho más cerca de la cámara para competir con el splat en profundidad
    backdrop.position.set(0, 1.8, 0.35);

    // Mismo patrón de orden que la máscara de profundidad del logo
    backdrop.renderOrder = 0;

    scene.add(backdrop);

    // -----------------------------------------------------------------------
    // PARALLAX
    // -----------------------------------------------------------------------
    const targetParallax = new THREE.Vector2(0, 0);
    const currentParallax = new THREE.Vector2(0, 0);

    const handlePointerMove = (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      const strength = 0.9; // parallax más fuerte
      targetParallax.set(x * strength, -y * strength);
    };

    window.addEventListener("pointermove", handlePointerMove);

    // Optimized resize handler - only updates what's necessary
    const handleResize = () => {
      const { width: w, height: h } = getSize();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // -----------------------------------------------------------------------
    // INTRO ANIMATION & RENDER LOOP
    // -----------------------------------------------------------------------
    let startTime = null;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    // Wrap animation logic in a function for ScrollTrigger control
    const animate = (now) => {
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) / 1000;
      const raw = Math.min(elapsed / introDuration, 1);
      const t = easeOutCubic(raw);

      // Posición base de la cámara (intro de pájaro → posición final)
      const basePos = new THREE.Vector3().lerpVectors(
        introStartPosition,
        baseCameraPosition,
        t
      );
      const baseLook = new THREE.Vector3().lerpVectors(
        introStartLookAt,
        baseLookAt,
        t
      );

      camera.fov = introStartFov + (introEndFov - introStartFov) * t;
      camera.updateProjectionMatrix();

      currentParallax.lerp(targetParallax, 0.06);

      // Clonamos para poder aplicar orbit en mobile sin romper la base
      let finalPos = basePos.clone();

      // En mobile: leve órbita alrededor del sujeto, manteniendo el mismo punto de mira
      if (isMobile) {
        // Centro de órbita alrededor del punto al que mira la cámara,
        // con un pequeño offset en X/Z para que el personaje quede más centrado
        const center = baseLook.clone().add(mobileOrbitCenterOffset);
        const offset = finalPos.clone().sub(center);

        // Reducimos la amplitud horizontal del giro para mantenerlo más centrado
        offset.x *= 0.55;

        const orbitSpeed = 0.42; // radianes/segundo (más rápido en mobile)
        const angle = elapsed * orbitSpeed + mobileOrbitPhase;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const rx = offset.x * cosA - offset.z * sinA;
        const rz = offset.x * sinA + offset.z * cosA;
        offset.x = rx;
        offset.z = rz;

        finalPos = center.clone().add(offset);
      }

      // Aplicamos parallax encima de la posición (desktop y mobile)
      finalPos.x += currentParallax.x;
      finalPos.y += currentParallax.y * 0.5;

      camera.position.copy(finalPos);

      const look = baseLook.clone();
      look.y -= 0.05;
      camera.lookAt(look);

      renderer.render(scene, camera);
    };

    // Animation loop control - will be managed by ScrollTrigger
    let animationLoopActive = false;
    const startLoop = () => {
      if (!animationLoopActive) {
        renderer.setAnimationLoop(animate);
        animationLoopActive = true;
      }
    };
    const stopLoop = () => {
      if (animationLoopActive) {
        renderer.setAnimationLoop(null);
        animationLoopActive = false;
      }
    };

    // -----------------------------------------------------------------------
    // SCROLLTRIGGER: Animation Loop Control & Scroll Transition Effect
    // -----------------------------------------------------------------------
    // Get the hero section container (parent of AvatarLumaSplat)
    const heroSection = container.closest("section");
    let scrollTriggerInstance = null;
    let wipeTimelineInstance = null;

    if (!heroSection) {
      // Fallback: start animation loop immediately if no hero section found
      startLoop();
    } else {
      // Create ScrollTrigger to control animation loop based on hero visibility
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: heroSection,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          if (self.isActive) {
            startLoop();
          } else {
            stopLoop();
          }
        },
      });

      // Ensure correct initial state
      if (scrollTriggerInstance.isActive) {
        startLoop();
      } else {
        stopLoop();
      }

      // Scroll transition effect: smooth fade/blur/translate on scroll
      wipeTimelineInstance = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: true, // Smooth scrubbing with scroll
          invalidateOnRefresh: true,
        },
      });

      // Smooth transition: slide up, fade out, and blur on scroll down
      wipeTimelineInstance.to(heroSection, {
        y: -80, // Subtle slide up
        opacity: 0.4, // Fade out
        filter: "blur(8px)", // Subtle blur effect
        ease: "power2.inOut",
      });
    }

    // -----------------------------------------------------------------------
    // CLEANUP
    // -----------------------------------------------------------------------
    return () => {
      // Remove event listeners
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);

      // Stop animation loop
      renderer.setAnimationLoop(null);

      // Kill ScrollTrigger instances
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      if (wipeTimelineInstance) {
        wipeTimelineInstance.kill();
      }

      // Dispose Three.js resources
      scene.remove(splats);
      splats.dispose();
      renderer.dispose();

      // Remove renderer DOM element
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden" />
  );
}
