"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { markRouteReady } from "../utils/routeReadyGate";

const PRESETS = {
  developer: {
    color: "#ffffff",
    roughness: 0.75,
    metalness: 0.55,
    emissive: "#111111",
    emissiveIntensity: 0.08,
    envMapIntensity: 0.5,
    normalStrength: 0.6,
    bumpStrength: 0.03,
    displacementStrength: 0.006,
  },
  designer: {
    color: "#ffffff",
    roughness: 0.9,
    metalness: 0.04,
    emissive: "#000000",
    emissiveIntensity: 0,
    envMapIntensity: 0.35,
    normalStrength: 0.85,
    bumpStrength: 0.05,
    displacementStrength: 0.012,
    sheen: 0.1,
    sheenColor: "#9b9288",
    sheenRoughness: 0.95,
    clearcoat: 0,
    specularIntensity: 0.2,
    specularColor: "#7a736c",
  },
  director: {
    color: "#ffffff",
    roughness: 0.28,
    metalness: 0.9,
    emissive: "#000000",
    emissiveIntensity: 0,
    envMapIntensity: 1.15,
    normalStrength: 0.5,
    bumpStrength: 0.02,
    displacementStrength: 0.004,
  },
  human: {
    // In HUMAN the PBR maps drive most of the look.
    color: "#ffffff",
    roughness: 1,
    metalness: 1,
    emissive: "#000000",
    emissiveIntensity: 0,
    envMapIntensity: 0.55,
    normalStrength: 1.35,
    bumpStrength: 0.19,
    displacementStrength: 0.052,
  },
};

const BASE_MODEL_SCALE = 0.22;
const MATE_LOCAL_SCALE = 1.0;
const BASE_POSITION_Y = 0.1;
const BASE_ROTATION_X = -0.2;
const BASE_ROTATION_Y = 0;
// Roll negativo = inclinación hacia la izquierda (escritorio más pronunciado).
const BASE_ROTATION_Z_MOBILE = -0.22;
const BASE_ROTATION_Z_DESKTOP = -0.36;

// Vertical idle bob. Slightly stronger to give more travel before scrolling.
const IDLE_BOB_AMPLITUDE = 0.15;
const IDLE_BOB_FREQUENCY = 1.2;
const IDLE_ROT_X_AMPLITUDE = 0.02;
const IDLE_ROT_X_FREQUENCY = 0.8;
const IDLE_ROT_Y_AMPLITUDE = 0.1;
const IDLE_ROT_Y_FREQUENCY = 0.3;
const IDLE_ROT_Z_AMPLITUDE = 0.026;
const IDLE_ROT_Z_FREQUENCY = 0.45;
const IDLE_SPIN_SPEED = 0.16;
const TRANSITION_SPIN_SPEED = 3;
const SPIN_VELOCITY_DAMPING = 5.2;
// Mobile: escala fija (antes se lerpeaba con innerHeight; al scroll/URL bar el ResizeObserver retocaba escala y aspect).
const MOBILE_MODEL_SCALE_MULTIPLIER_FIXED = 1.2;
// Mobile: bob idle (parallax vertical del grupo sigue en el loop; no toca scale).
const MOBILE_IDLE_BOB_MULTIPLIER = 1.3;
// Slightly lower on mobile so it crosses CREATIVE without hiding it.
const MOBILE_MODEL_Y_OFFSET = 0.55;

// Desktop / tablet landscape: mate scales with viewport width (like headline clamp vw) so it reaches the words;
// clamped so ultrawide and very short heights do not blow up the composition.
const DESKTOP_MODEL_SCALE_MIN_MULT = 1.2;
const DESKTOP_MODEL_SCALE_MAX_MULT = 1.5;
const DESKTOP_MODEL_WIDTH_LERP_START = 768;
const DESKTOP_MODEL_WIDTH_LERP_END = 1400;

function getMobileModelScaleMultiplier() {
  return MOBILE_MODEL_SCALE_MULTIPLIER_FIXED;
}

function getDesktopModelScaleMultiplier(width, height) {
  const w = width;
  const h = height || 800;
  const span = Math.max(DESKTOP_MODEL_WIDTH_LERP_END - DESKTOP_MODEL_WIDTH_LERP_START, 1);
  const t = THREE.MathUtils.clamp((w - DESKTOP_MODEL_WIDTH_LERP_START) / span, 0, 1);
  let mult = THREE.MathUtils.lerp(DESKTOP_MODEL_SCALE_MIN_MULT, DESKTOP_MODEL_SCALE_MAX_MULT, t);
  const shortT = THREE.MathUtils.clamp((h - 640) / (900 - 640), 0, 1);
  mult *= THREE.MathUtils.lerp(0.92, 1, shortT);
  return mult;
}

/** Desktop: escala según viewport. Mobile: constante (ver getMobileModelScaleMultiplier). */
function getModelScaleMultiplier(clientWidth, clientHeight) {
  const w = clientWidth || (typeof window !== "undefined" ? window.innerWidth : 1024);
  const h = clientHeight || (typeof window !== "undefined" ? window.innerHeight : 800);
  if (w <= 768) return getMobileModelScaleMultiplier();
  return getDesktopModelScaleMultiplier(w, h);
}

// Escritorio: el mate “sigue” al puntero con rotación suave (sin mover posición).
const CURSOR_MAX_ROTATION = 0.12;
const CURSOR_DAMPING = 0.09;

const GRASS_DIR = "/textures/grass";
const HUMAN_PBR_MAPS = {
  color: `${GRASS_DIR}/Grass006_1K-JPG_Color.jpg`,
  roughness: `${GRASS_DIR}/Grass006_1K-JPG_Roughness.jpg`,
  normalGL: `${GRASS_DIR}/Grass006_1K-JPG_NormalGL.jpg`,
  ao: `${GRASS_DIR}/Grass006_1K-JPG_AmbientOcclusion.jpg`, // optional
  height: `${GRASS_DIR}/Grass006_1K-JPG_Displacement.jpg`, // lightweight relief via bumpMap
};
const GOLD_DIR = "/textures/gold";
const DIRECTOR_PBR_MAPS = {
  color: `${GOLD_DIR}/Metal048B_1K-JPG_Color.jpg`,
  roughness: `${GOLD_DIR}/Metal048B_1K-JPG_Roughness.jpg`,
  metalness: `${GOLD_DIR}/Metal048B_1K-JPG_Metalness.jpg`,
  normalGL: `${GOLD_DIR}/Metal048B_1K-JPG_NormalGL.jpg`,
  height: `${GOLD_DIR}/Metal048B_1K-JPG_Displacement.jpg`,
};
const METAL_DIR = "/textures/metal";
const FUR_DIR = "/textures/fur";
const DESIGNER_PBR_MAPS = {
  color: `${FUR_DIR}/cow_fur_37_08_diffuse.webp`,
  roughness: `${FUR_DIR}/cow_fur_37_08_roughness.webp`,
  normalGL: `${FUR_DIR}/cow_fur_37_08_normal.webp`,
  ao: `${FUR_DIR}/cow_fur_37_08_ao.webp`,
};
const DEVELOP_DIR = "/textures/develop";
const DEVELOPER_PBR_MAPS = {
  color: `${METAL_DIR}/Rough_Sand_Cast_Aluminium_basecolor_webp.webp`,
  roughness: `${METAL_DIR}/Rough_Sand_Cast_Aluminium_roughness_webp.webp`,
  metalness: `${METAL_DIR}/Rough_Sand_Cast_Aluminium_metallic_webp.webp`,
  normalGL: `${METAL_DIR}/Rough_Sand_Cast_Aluminium_normal_webp.webp`,
  ao: `${METAL_DIR}/Rough_Sand_Cast_Aluminium_ambientocclusion_webp.webp`,
  height: `${METAL_DIR}/Rough_Sand_Cast_Aluminium_height_webp.webp`,
};

const MODE_TEXTURE_REPEAT = {
  developer: { x: 2.20, y: 1.18 },
  designer: { x: 2.20, y: 1.16 },
  human: { x: 2.0, y: 1.18 },
  director: { x: 1.70, y: 1.18 },
};
const MODE_TEXTURE_MIRRORED_WRAP = {
  developer: true,
  designer: false,
  human: true,
  director: true,
};

function getUvRange(uvAttr) {
  if (!uvAttr?.array || uvAttr.count <= 0) return { rangeU: 0, rangeV: 0 };
  let minU = Infinity;
  let maxU = -Infinity;
  let minV = Infinity;
  let maxV = -Infinity;
  for (let i = 0; i < uvAttr.count; i += 1) {
    const u = uvAttr.getX(i);
    const v = uvAttr.getY(i);
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
    if (v < minV) minV = v;
    if (v > maxV) maxV = v;
  }
  return { rangeU: maxU - minU, rangeV: maxV - minV };
}

function generateCylindricalProjectedUV(sourceGeometry) {
  if (!sourceGeometry) return null;
  const geometry = sourceGeometry.index
    ? sourceGeometry.toNonIndexed()
    : sourceGeometry.clone();
  const pos = geometry?.attributes?.position;
  if (!pos || pos.count <= 0) return false;

  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;
  if (!bbox) return null;

  const centerX = (bbox.min.x + bbox.max.x) * 0.5;
  const centerZ = (bbox.min.z + bbox.max.z) * 0.5;
  const height = Math.max(bbox.max.y - bbox.min.y, 1e-6);
  const sizeX = Math.max(bbox.max.x - bbox.min.x, 1e-6);
  const sizeZ = Math.max(bbox.max.z - bbox.min.z, 1e-6);
  const uvArray = new Float32Array(pos.count * 2);
  const capTriangle = new Uint8Array(Math.floor(pos.count / 3));
  // Push seam away from the frontal camera area.
  const seamOffset = 0.12;
  const invTau = 1 / (Math.PI * 2);

  for (let i = 0; i < pos.count; i += 3) {
    const ax = pos.getX(i);
    const ay = pos.getY(i);
    const az = pos.getZ(i);
    const bx = pos.getX(i + 1);
    const by = pos.getY(i + 1);
    const bz = pos.getZ(i + 1);
    const cx = pos.getX(i + 2);
    const cy = pos.getY(i + 2);
    const cz = pos.getZ(i + 2);

    const abx = bx - ax;
    const aby = by - ay;
    const abz = bz - az;
    const acx = cx - ax;
    const acy = cy - ay;
    const acz = cz - az;
    const nx = aby * acz - abz * acy;
    const ny = abz * acx - abx * acz;
    const nz = abx * acy - aby * acx;
    const nLen = Math.max(Math.sqrt(nx * nx + ny * ny + nz * nz), 1e-6);
    const normalY = ny / nLen;
    const isCap = Math.abs(normalY) > 0.72;
    capTriangle[i / 3] = isCap ? 1 : 0;

    for (let j = 0; j < 3; j += 1) {
      const idx = i + j;
      const x = pos.getX(idx);
      const y = pos.getY(idx);
      const z = pos.getZ(idx);
      let u;
      let v;

      if (isCap) {
        // Planar projection on XZ for top/bottom caps avoids pole pinching.
        u = (x - bbox.min.x) / sizeX;
        v = (z - bbox.min.z) / sizeZ;
      } else {
        const cxzX = x - centerX;
        const cxzZ = z - centerZ;
        u = Math.atan2(cxzZ, cxzX) * invTau + seamOffset;
        u = u - Math.floor(u);
        v = THREE.MathUtils.clamp((y - bbox.min.y) / height, 0, 1);
      }

      uvArray[idx * 2] = u;
      uvArray[idx * 2 + 1] = v;
    }
  }

  // Seam-safe correction per triangle to avoid 0..1 wrap stretching.
  for (let i = 0; i < pos.count; i += 3) {
    if (capTriangle[i / 3]) continue;
    const i0 = i * 2;
    const i1 = (i + 1) * 2;
    const i2 = (i + 2) * 2;
    let u0 = uvArray[i0];
    let u1 = uvArray[i1];
    let u2 = uvArray[i2];

    const minU = Math.min(u0, u1, u2);
    const maxU = Math.max(u0, u1, u2);
    if (maxU - minU > 0.5) {
      if (u0 < 0.5) u0 += 1;
      if (u1 < 0.5) u1 += 1;
      if (u2 < 0.5) u2 += 1;
      uvArray[i0] = u0;
      uvArray[i1] = u1;
      uvArray[i2] = u2;
    }
  }

  geometry.setAttribute("uv", new THREE.BufferAttribute(uvArray, 2));
  return geometry;
}

const HeroOrb3D = forwardRef(function HeroOrb3D(_props, ref) {
  const hostRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const materialRef = useRef(null);

  const frameRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const intersectionObserverRef = useRef(null);
  const visibilityRef = useRef(true);
  const spinTweenRef = useRef(null);
  const pointerRafRef = useRef(null);
  const pointerSampleRef = useRef({ x: 0, y: 0, dirty: false });
  const motionStateRef = useRef({
    basePositionY: BASE_POSITION_Y,
    baseRotationX: BASE_ROTATION_X,
    baseRotationY: BASE_ROTATION_Y,
    baseRotationZ: BASE_ROTATION_Z_MOBILE,
    cursorTargetX: 0,
    cursorTargetZ: 0,
    cursorCurrentX: 0,
    cursorCurrentZ: 0,
    spinAngleY: 0,
    spinTransitionY: 0,
    spinVelocityY: IDLE_SPIN_SPEED,
    spinTargetVelocityY: IDLE_SPIN_SPEED,
  });

  // PBR maps cache by mode.
  const modePBRRef = useRef({
    developer: {
      loaded: false,
      maps: DEVELOPER_PBR_MAPS,
      color: null,
      roughness: null,
      normal: null,
      ao: null,
      bump: null,
      displacement: null,
      metalness: null,
      emissive: null,
    },
    designer: {
      loaded: false,
      maps: DESIGNER_PBR_MAPS,
      color: null,
      roughness: null,
      normal: null,
      ao: null,
      bump: null,
      displacement: null,
      metalness: null,
      emissive: null,
    },
    human: {
      loaded: false,
      maps: HUMAN_PBR_MAPS,
      color: null,
      roughness: null,
      normal: null,
      ao: null,
      bump: null,
      displacement: null,
      metalness: null,
      emissive: null,
    },
    director: {
      loaded: false,
      maps: DIRECTOR_PBR_MAPS,
      color: null,
      roughness: null,
      normal: null,
      ao: null,
      bump: null,
      displacement: null,
      metalness: null,
      emissive: null,
    },
  });

  // Runtime mode + deferred map application while textures are loading.
  const activeModeRef = useRef("developer");
  const pendingModeApplyRef = useRef(null);
  const supportsAoRef = useRef(false);
  const isPbrMode = (mode) =>
    mode === "developer" || mode === "designer" || mode === "human" || mode === "director";

  const applyModePBRState = (mode, reason) => {
    const material = materialRef.current;
    if (!material) return;
    const preset = PRESETS[mode] || PRESETS.developer;

    const pbrSet = modePBRRef.current[mode];
      if (isPbrMode(mode)) {
      if (!pbrSet?.loaded) {
        pendingModeApplyRef.current = mode;
        console.info("[HeroOrb3D] PBR pending texture load", { mode, reason });
        return;
      }

      material.map = pbrSet.color;
      material.roughnessMap = pbrSet.roughness;
      material.normalMap = pbrSet.normal;
      material.aoMap = supportsAoRef.current ? pbrSet.ao || null : null;
      material.aoMapIntensity = supportsAoRef.current ? 1 : 0;
      material.bumpMap = pbrSet.bump || null;
      // Displacement on UV seams creates visible "cuts" on this mesh.
      // Keep surface relief via normal+bump only.
      material.displacementMap = null;
      material.metalnessMap = pbrSet.metalness || null;
      material.emissiveMap = pbrSet.emissive || null;
      material.bumpScale = PRESETS[mode]?.bumpStrength || 0;
      material.displacementScale = 0;
      material.displacementBias = 0;
      material.color.set(preset.color || "#ffffff");
      material.emissive.set(preset.emissive || "#000000");
      material.roughness = preset.roughness;
      material.metalness = preset.metalness;
      material.emissiveIntensity = preset.emissiveIntensity;
      material.envMapIntensity = preset.envMapIntensity;
      material.normalScale.set(preset.normalStrength || 0, preset.normalStrength || 0);
      material.sheen = preset.sheen || 0;
      material.sheenColor.set(preset.sheenColor || "#000000");
      material.sheenRoughness = preset.sheenRoughness || 0;
      material.clearcoat = preset.clearcoat || 0;
      material.specularIntensity = preset.specularIntensity ?? 1;
      material.specularColor.set(preset.specularColor || "#ffffff");
      material.needsUpdate = true;

      pendingModeApplyRef.current = null;
      console.info("[HeroOrb3D] Applied mode PBR", {
        mode,
        reason,
        supportsAo: supportsAoRef.current,
        maps: pbrSet.maps,
      });
      return;
    }

    const hadMaps = Boolean(
      material.map || material.roughnessMap || material.normalMap || material.aoMap
    );
    material.map = null;
    material.roughnessMap = null;
    material.normalMap = null;
    material.aoMap = null;
    material.aoMapIntensity = 0;
    material.bumpMap = null;
    material.bumpScale = 0;
    material.displacementMap = null;
    material.displacementScale = 0;
    material.displacementBias = 0;
    material.metalnessMap = null;
    material.emissiveMap = null;
    material.color.set(preset.color || "#ffffff");
    material.emissive.set(preset.emissive || "#000000");
    material.roughness = preset.roughness;
    material.metalness = preset.metalness;
    material.emissiveIntensity = preset.emissiveIntensity;
    material.envMapIntensity = preset.envMapIntensity;
    material.normalScale.set(0, 0);
    material.sheen = 0;
    material.sheenColor.set("#000000");
    material.sheenRoughness = 0;
    material.clearcoat = 0;
    material.specularIntensity = 1;
    material.specularColor.set("#ffffff");
    material.needsUpdate = true;

    pendingModeApplyRef.current = null;
    if (hadMaps) {
      console.info("[HeroOrb3D] Reverted to flat preset", { mode, reason });
    }
  };

  useImperativeHandle(ref, () => ({
    syncMaterialWithTimeline(tl, mode, duration) {
      const material = materialRef.current;
      const preset = PRESETS[mode] || PRESETS.developer;
      if (!tl || !material) return;

      // Apply/remove HUMAN PBR maps at timeline start for strict sync.
      tl.call(
        () => {
          activeModeRef.current = mode;
        },
        [],
        0
      );

      // Material swap at exact middle of word transition.
      tl.call(
        () => {
          applyModePBRState(mode, "timeline-mid");
        },
        [],
        duration * 0.5
      );

      const nextColor = new THREE.Color(preset.color || "#ffffff");
      const nextEmissive = new THREE.Color(preset.emissive || "#000000");
      const nextSheenColor = new THREE.Color(preset.sheenColor || "#000000");
      const nextSpecularColor = new THREE.Color(preset.specularColor || "#ffffff");
      const half = duration * 0.5;

      tl.to(
        material.color,
        {
          r: nextColor.r,
          g: nextColor.g,
          b: nextColor.b,
          duration: half,
          ease: "power3.out",
          overwrite: "auto",
        },
        half
      );

      tl.to(
        material.emissive,
        {
          r: nextEmissive.r,
          g: nextEmissive.g,
          b: nextEmissive.b,
          duration: half,
          ease: "power3.out",
          overwrite: "auto",
        },
        half
      );

      tl.to(
        material,
        {
          roughness: preset.roughness,
          metalness: preset.metalness,
          emissiveIntensity: preset.emissiveIntensity,
          envMapIntensity: preset.envMapIntensity,
          bumpScale: isPbrMode(mode) ? preset.bumpStrength || 0 : 0,
          displacementScale: 0,
          sheen: preset.sheen || 0,
          sheenRoughness: preset.sheenRoughness || 0,
          clearcoat: preset.clearcoat || 0,
          specularIntensity: preset.specularIntensity ?? 1,
          duration: half,
          ease: "power3.out",
          overwrite: "auto",
        },
        half
      );

      // normalScale solo tiene efecto si hay normalMap. En modos no-human queda en 0.
      tl.to(
        material.sheenColor,
        {
          r: nextSheenColor.r,
          g: nextSheenColor.g,
          b: nextSheenColor.b,
          duration: half,
          ease: "power3.out",
          overwrite: "auto",
        },
        half
      );

      tl.to(
        material.specularColor,
        {
          r: nextSpecularColor.r,
          g: nextSpecularColor.g,
          b: nextSpecularColor.b,
          duration: half,
          ease: "power3.out",
          overwrite: "auto",
        },
        half
      );

      tl.to(
        material.normalScale,
        {
          x: isPbrMode(mode) ? preset.normalStrength : 0,
          y: isPbrMode(mode) ? preset.normalStrength : 0,
          duration: half,
          ease: "power3.out",
          overwrite: "auto",
        },
        half
      );

      tl.call(
        () => {
          const motion = motionStateRef.current;
          // Preserve partial transition rotation if a new one starts mid-flight.
          if (motion.spinTransitionY !== 0) {
            motion.spinAngleY += motion.spinTransitionY;
            motion.spinTransitionY = 0;
          }
          spinTweenRef.current?.kill();
          motion.spinTargetVelocityY = TRANSITION_SPIN_SPEED;
          motion.spinVelocityY = Math.max(
            motion.spinVelocityY,
            IDLE_SPIN_SPEED * 1.25
          );
          spinTweenRef.current = gsap.to(motion, {
            spinTransitionY: Math.PI * 2,
            spinTargetVelocityY: IDLE_SPIN_SPEED,
            duration,
            ease: "power2.inOut",
            overwrite: "auto",
            onComplete: () => {
              motion.spinAngleY += motion.spinTransitionY;
              motion.spinTransitionY = 0;
              spinTweenRef.current = null;
            },
          });
        },
        [],
        0
      );
    },
  }));

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 20);
    camera.position.set(0, 0, 3.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    const isMobile = window.innerWidth <= 768;
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.25)
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.background = "transparent";
    renderer.domElement.style.pointerEvents = "none";
    rendererRef.current = renderer;
    host.appendChild(renderer.domElement);

    // HDRI environment for specular response
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    let hdriSourceTexture = null;
    let hdriEnvTexture = null;

    new RGBELoader().load(
      "/hdri/white_studio_05_1k.hdr",
      (hdrTex) => {
        if (disposed) {
          hdrTex.dispose();
          return;
        }
        hdrTex.mapping = THREE.EquirectangularReflectionMapping;
        hdriSourceTexture = hdrTex;
        hdriEnvTexture = pmrem.fromEquirectangular(hdrTex).texture;
        scene.environment = hdriEnvTexture;
      },
      undefined,
      (err) => {
        console.warn(
          "[HeroOrb3D] Failed to load HDRI /hdri/white_studio_05_1k.hdr",
          err
        );
      }
    );

    // Base material (will be re-used; maps are swapped for HUMAN)
    const material = new THREE.MeshPhysicalMaterial({
      color: PRESETS.developer.color,
      roughness: PRESETS.developer.roughness,
      metalness: PRESETS.developer.metalness,
      emissive: new THREE.Color(PRESETS.developer.emissive),
      emissiveIntensity: PRESETS.developer.emissiveIntensity,
      envMapIntensity: PRESETS.developer.envMapIntensity,
      sheen: 0,
      sheenRoughness: 0,
      sheenColor: new THREE.Color("#000000"),
    });
    material.normalScale.set(0, 0);
    materialRef.current = material;

    // ---- Load PBR maps once ----
    const texLoader = new THREE.TextureLoader();
    const loadTex = (
      url,
      {
        srgb = false,
        repeatX = 1.18,
        repeatY = 1.18,
        mirroredWrap = true,
      } = {}
    ) =>
      new Promise((resolve, reject) => {
        texLoader.load(
          url,
          (tex) => {
            if (disposed) {
              tex.dispose();
              return;
            }
            tex.wrapS = mirroredWrap
              ? THREE.MirroredRepeatWrapping
              : THREE.RepeatWrapping;
            tex.wrapT = mirroredWrap
              ? THREE.MirroredRepeatWrapping
              : THREE.RepeatWrapping;
            tex.repeat.set(repeatX, repeatY);
            tex.offset.set(0, 0);
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

            tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
            console.info("[HeroOrb3D] Texture loaded", { url, srgb });

            resolve(tex);
          },
          undefined,
          (err) => {
            console.warn("[HeroOrb3D] Texture failed", { url, err });
            reject(err);
          }
        );
      });
    const loadPbrSet = async (mode, maps) => {
      const repeat = MODE_TEXTURE_REPEAT[mode] || MODE_TEXTURE_REPEAT.developer;
      const mirroredWrap = MODE_TEXTURE_MIRRORED_WRAP[mode] ?? true;
      const [color, roughness, normal, ao, bump, metalness, emissive] = await Promise.all([
        loadTex(maps.color, {
          srgb: true,
          repeatX: repeat.x,
          repeatY: repeat.y,
          mirroredWrap,
        }),
        loadTex(maps.roughness, {
          repeatX: repeat.x,
          repeatY: repeat.y,
          mirroredWrap,
        }),
        loadTex(maps.normalGL, {
          repeatX: repeat.x,
          repeatY: repeat.y,
          mirroredWrap,
        }),
        maps.ao
          ? loadTex(maps.ao, {
              repeatX: repeat.x,
              repeatY: repeat.y,
              mirroredWrap,
            }).catch(() => null)
          : Promise.resolve(null),
        maps.height
          ? loadTex(maps.height, {
              repeatX: repeat.x,
              repeatY: repeat.y,
              mirroredWrap,
            }).catch(() => null)
          : Promise.resolve(null),
        maps.metalness
          ? loadTex(maps.metalness, {
              repeatX: repeat.x,
              repeatY: repeat.y,
              mirroredWrap,
            }).catch(() => null)
          : Promise.resolve(null),
        maps.emissive
          ? loadTex(maps.emissive, {
              srgb: true,
              repeatX: repeat.x,
              repeatY: repeat.y,
              mirroredWrap,
            }).catch(() => null)
          : Promise.resolve(null),
      ]);

      if (disposed) {
        color?.dispose?.();
        roughness?.dispose?.();
        normal?.dispose?.();
        ao?.dispose?.();
        bump?.dispose?.();
        metalness?.dispose?.();
        emissive?.dispose?.();
        return;
      }

      const target = modePBRRef.current[mode];
      if (!target) return;
      target.color = color;
      target.roughness = roughness;
      target.normal = normal;
      target.ao = ao;
      target.bump = bump;
      target.displacement = bump;
      target.metalness = metalness;
      target.emissive = emissive;
      target.loaded = true;

      console.info("[HeroOrb3D] PBR set ready", { mode, maps });
      if (activeModeRef.current === mode || pendingModeApplyRef.current === mode) {
        applyModePBRState(mode, "post-load-active-mode");
      }
    };

    // ---- Load PBR maps once ----
    loadPbrSet("developer", DEVELOPER_PBR_MAPS).catch((err) => {
      console.warn("[HeroOrb3D] Failed to load DEVELOPER facade PBR maps", err);
    });
    loadPbrSet("designer", DESIGNER_PBR_MAPS).catch((err) => {
      console.warn("[HeroOrb3D] Failed to load DESIGNER fur PBR maps", err);
    });
    loadPbrSet("human", HUMAN_PBR_MAPS).catch((err) => {
      console.warn("[HeroOrb3D] Failed to load HUMAN grass PBR maps", err);
    });
    loadPbrSet("director", DIRECTOR_PBR_MAPS).catch((err) => {
      console.warn("[HeroOrb3D] Failed to load DIRECTOR gold PBR maps", err);
    });

    // Group
    const modelGroup = new THREE.Group();
    modelGroup.position.set(0, BASE_POSITION_Y, 0);

    // Escala: desktop sigue al viewport; mobile usa multiplicador fijo (no a innerHeight por resize al scroll).
    // setSize() en mobile ignora micro-cambios de alto (barra de URL, sub-pixel) para no retocar aspect/canvas.
    let mobileCanvasAppliedW = 0;
    let mobileCanvasAppliedH = 0;

    const applyModelGroupLayout = () => {
      const w = host.clientWidth || window.innerWidth || 1024;
      const h = host.clientHeight || window.innerHeight || 800;
      const mult = getModelScaleMultiplier(w, h);
      modelGroup.scale.setScalar(BASE_MODEL_SCALE * mult);
      motionStateRef.current.baseRotationZ =
        w <= 768 ? BASE_ROTATION_Z_MOBILE : BASE_ROTATION_Z_DESKTOP;
    };
    applyModelGroupLayout();
    modelGroup.rotation.set(
      BASE_ROTATION_X,
      BASE_ROTATION_Y,
      motionStateRef.current.baseRotationZ
    );
    modelRef.current = modelGroup;
    scene.add(modelGroup);

    // Model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      "/assets/models/mate.glb",
      (gltf) => {
        if (disposed) return;
        const mate = gltf.scene;

        mate.traverse((obj) => {
          if (obj.isMesh) {
            obj.material = material;
            material.vertexColors = false;

            const uv = obj.geometry?.attributes?.uv || null;
            const uvRange = getUvRange(uv);
            // Force a seam-safe cylindrical projection to avoid harsh cuts
            // from inconsistent GLB UV islands.
            const rebuiltGeometry = obj.geometry
              ? generateCylindricalProjectedUV(obj.geometry)
              : null;
            const generated = Boolean(rebuiltGeometry);
            if (generated) {
              obj.geometry.dispose?.();
              obj.geometry = rebuiltGeometry;
            }
            console.info("[HeroOrb3D] UV diagnostics", {
              mesh: obj.name || "unnamed-mesh",
              generatedUv: generated,
              projection: generated ? "cylindrical-forced-seam-safe" : "model-uv",
              originalRangeU: uvRange.rangeU,
              originalRangeV: uvRange.rangeV,
            });

            // Ensure AO can work if the GLB only has uv but not uv2:
            // If geometry has uv and no uv2, copy uv -> uv2
            if (obj.geometry && obj.geometry.attributes?.uv && !obj.geometry.attributes?.uv2) {
              obj.geometry.setAttribute(
                "uv2",
                new THREE.BufferAttribute(obj.geometry.attributes.uv.array, 2)
              );
              supportsAoRef.current = true;
            } else if (obj.geometry && obj.geometry.attributes?.uv2) {
              supportsAoRef.current = true;
            }
          }
        });

        mate.scale.set(MATE_LOCAL_SCALE, MATE_LOCAL_SCALE * 1.1, MATE_LOCAL_SCALE);
        mate.position.set(0, -0.55 + (isMobile ? MOBILE_MODEL_Y_OFFSET : 0), 0);
        modelGroup.add(mate);

        if (
          isPbrMode(activeModeRef.current) &&
          modePBRRef.current[activeModeRef.current]?.loaded
        ) {
          applyModePBRState(activeModeRef.current, "model-loaded-while-pbr-mode");
        }

        // Home hero: mate mesh is the critical 3D asset for first paint.
        markRouteReady("/");
      },
      undefined,
      (err) => {
        console.warn("[HeroOrb3D] Failed to load /assets/models/mate.glb", err);
      }
    );

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(2.2, 2.6, 3.4);
    scene.add(light);

    // Sizing
    const setSize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      if (w < 32 || h < 32) return;

      const layoutMobile = (host.clientWidth || window.innerWidth || 0) <= 768;

      if (!layoutMobile) {
        mobileCanvasAppliedW = 0;
        mobileCanvasAppliedH = 0;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        applyModelGroupLayout();
        return;
      }

      // Mobile / Safari iOS: dynamic toolbar changes height in ~50–110px steps. Old logic required
      // BOTH dw<72 and dh<72 for "micro" skip, so dh-only changes in the 72–119 band always ran
      // setSize + camera.aspect → apparent zoom + flicker. Stabilize by never shrinking the WebGL
      // buffer on height-only updates; grow on real height increase; always follow width + orientation.
      const rw = mobileCanvasAppliedW;
      const rh = mobileCanvasAppliedH;
      if (rw > 0 && rh > 0) {
        const wasLandscape = rw > rh;
        const nowLandscape = w > h;
        const orientationFlip = wasLandscape !== nowLandscape;
        const dw = Math.abs(w - rw);
        const dh = Math.abs(h - rh);
        const relW = rw > 0 ? dw / rw : 0;
        const relH = rh > 0 ? dh / rh : 0;
        const widthChanged = orientationFlip || dw >= 4 || relW >= 0.03;
        const heightGrew = h > rh + 6;
        const onlyHeightShrink = !orientationFlip && !widthChanged && h < rh - 3;
        const jitterOnly =
          !orientationFlip &&
          !widthChanged &&
          !heightGrew &&
          dw < 8 &&
          dh < 160 &&
          relW < 0.09 &&
          relH < 0.22;

        if (onlyHeightShrink) return;
        if (jitterOnly) return;
      }

      mobileCanvasAppliedW = w;
      mobileCanvasAppliedH = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      applyModelGroupLayout();
    };
    setSize();

    let orientationSetSizeTimer = 0;
    const onOrientationChange = () => {
      mobileCanvasAppliedW = 0;
      mobileCanvasAppliedH = 0;
      window.clearTimeout(orientationSetSizeTimer);
      orientationSetSizeTimer = window.setTimeout(() => {
        orientationSetSizeTimer = 0;
        if (!disposed) setSize();
      }, 280);
    };
    window.addEventListener("orientationchange", onOrientationChange);

    const ro = new ResizeObserver(setSize);
    ro.observe(host);
    resizeObserverRef.current = ro;

    // Visibility-based pause/resume to avoid rendering while off-screen.
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        visibilityRef.current = Boolean(entry?.isIntersecting);
        if (!visibilityRef.current && frameRef.current) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
          return;
        }
        if (visibilityRef.current && !frameRef.current) {
          frameRef.current = requestAnimationFrame(animate);
        }
      },
      {
        root: null,
        rootMargin: isMobile ? "280px 0px 400px 0px" : "120px 0px 120px 0px",
        threshold: 0,
      }
    );
    io.observe(host);
    intersectionObserverRef.current = io;

    const updateCursorRotationTargets = (clientX, clientY) => {
      const bounds = host.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const nx = THREE.MathUtils.clamp(((clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1);
      const ny = THREE.MathUtils.clamp(((clientY - bounds.top) / bounds.height) * 2 - 1, -1, 1);
      const motion = motionStateRef.current;

      motion.cursorTargetX = THREE.MathUtils.clamp(
        -ny * CURSOR_MAX_ROTATION,
        -CURSOR_MAX_ROTATION,
        CURSOR_MAX_ROTATION
      );
      motion.cursorTargetZ = THREE.MathUtils.clamp(
        nx * CURSOR_MAX_ROTATION,
        -CURSOR_MAX_ROTATION,
        CURSOR_MAX_ROTATION
      );
    };

    const flushPointerSample = () => {
      pointerRafRef.current = null;
      if (disposed || isMobile || !pointerSampleRef.current.dirty) return;
      pointerSampleRef.current.dirty = false;
      updateCursorRotationTargets(pointerSampleRef.current.x, pointerSampleRef.current.y);
    };

    const onPointerMove = (event) => {
      if (isMobile || disposed) return;
      pointerSampleRef.current.x = event.clientX;
      pointerSampleRef.current.y = event.clientY;
      pointerSampleRef.current.dirty = true;
      if (!pointerRafRef.current) {
        pointerRafRef.current = requestAnimationFrame(flushPointerSample);
      }
    };

    const resetCursorRotationTargets = () => {
      const motion = motionStateRef.current;
      motion.cursorTargetX = 0;
      motion.cursorTargetZ = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", resetCursorRotationTargets);
    window.addEventListener("blur", resetCursorRotationTargets);

    // Render loop
    const start = performance.now();
    let previousNow = start;
    function animate(now) {
      if (disposed) return;
      const elapsed = (now - start) / 1000;
      const deltaSec = Math.min(Math.max((now - previousNow) / 1000, 0), 0.05);
      previousNow = now;
      const model = modelRef.current;
      if (model) {
        const motion = motionStateRef.current;

        const idleBobAmplitude =
          IDLE_BOB_AMPLITUDE * (isMobile ? MOBILE_IDLE_BOB_MULTIPLIER : 1);
        const idlePosY = Math.sin(elapsed * IDLE_BOB_FREQUENCY) * idleBobAmplitude;
        const idleRotX = Math.sin(elapsed * IDLE_ROT_X_FREQUENCY) * IDLE_ROT_X_AMPLITUDE;
        const idleRotY = Math.sin(elapsed * IDLE_ROT_Y_FREQUENCY) * IDLE_ROT_Y_AMPLITUDE;
        const idleRotZ = Math.sin(elapsed * IDLE_ROT_Z_FREQUENCY) * IDLE_ROT_Z_AMPLITUDE;

        const spinBlend = 1 - Math.exp(-SPIN_VELOCITY_DAMPING * deltaSec);
        motion.spinVelocityY +=
          (motion.spinTargetVelocityY - motion.spinVelocityY) * spinBlend;
        motion.spinAngleY += motion.spinVelocityY * deltaSec;

        if (!isMobile) {
          motion.cursorCurrentX +=
            (motion.cursorTargetX - motion.cursorCurrentX) * CURSOR_DAMPING;
          motion.cursorCurrentZ +=
            (motion.cursorTargetZ - motion.cursorCurrentZ) * CURSOR_DAMPING;
        } else {
          motion.cursorCurrentX = 0;
          motion.cursorCurrentZ = 0;
        }

        model.position.x = 0;
        model.position.y = motion.basePositionY + idlePosY;
        model.position.z = 0;
        model.rotation.x =
          motion.baseRotationX + idleRotX + (isMobile ? 0 : motion.cursorCurrentX);
        model.rotation.y =
          motion.baseRotationY +
          idleRotY +
          motion.spinAngleY +
          motion.spinTransitionY;
        model.rotation.z =
          motion.baseRotationZ + idleRotZ + (isMobile ? 0 : motion.cursorCurrentZ);
      }
      renderer.render(scene, camera);
      frameRef.current = visibilityRef.current ? requestAnimationFrame(animate) : null;
    }
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.clearTimeout(orientationSetSizeTimer);

      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (pointerRafRef.current) cancelAnimationFrame(pointerRafRef.current);
      resizeObserverRef.current?.disconnect();
      intersectionObserverRef.current?.disconnect();
      spinTweenRef.current?.kill();
      window.removeEventListener("orientationchange", onOrientationChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", resetCursorRotationTargets);
      window.removeEventListener("blur", resetCursorRotationTargets);

      // Dispose geometries
      if (modelRef.current) {
        modelRef.current.traverse((obj) => {
          if (obj.isMesh && obj.geometry) obj.geometry.dispose();
        });
      }

      scene.remove(modelGroup);

      // Dispose material + textures
      material.dispose();

      Object.values(modePBRRef.current).forEach((set) => {
        set.color?.dispose?.();
        set.roughness?.dispose?.();
        set.normal?.dispose?.();
        set.ao?.dispose?.();
        set.bump?.dispose?.();
        set.displacement?.dispose?.();
        set.metalness?.dispose?.();
        set.emissive?.dispose?.();
      });

      scene.environment = null;

      if (hdriEnvTexture) hdriEnvTexture.dispose();
      if (hdriSourceTexture) hdriSourceTexture.dispose();
      pmrem.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={hostRef} className="pointer-events-none absolute inset-0 z-[30]" />;
});

export default HeroOrb3D;