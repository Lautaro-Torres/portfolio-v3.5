"use client";

import { useFrame } from "@react-three/fiber";
import { useGLTF, Center, AdaptiveDpr, AdaptiveEvents, MeshTransmissionMaterial } from "@react-three/drei";
import { useRef } from "react";
import SharedEnvironment from "../Three/SharedEnvironment";
import OptimizedCanvas from "../ui/OptimizedCanvas";
import { glassMaterialProps } from "../Three/common";
import GlassSurface from "../ui/GlassSurface";

useGLTF.preload("/assets/models/dagoberto.glb");

function TinyDagoberto() {
  const { nodes } = useGLTF("/assets/models/dagoberto.glb");
  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.02;
  });
  return (
    <Center>
      <group ref={ref} scale={3}>
        {Object.keys(nodes).map((key) => {
          const node = nodes[key];
          if (node.isMesh) {
            return (
              <mesh key={key} {...node}>
                <MeshTransmissionMaterial {...glassMaterialProps} />
              </mesh>
            );
          }
          return null;
        })}
      </group>
    </Center>
  );
}

export default function DagobertoBadge() {
  return (
    <div
      className={`
        fixed z-[2147483647] w-28 h-28
        right-3 bottom-3
        md:right-[2.5%] md:bottom-auto md:top-3
      `}
      style={{ contain: "layout paint size" }}
    >
      <a
        href="mailto:"
        aria-label="Contact via email"
        className="block w-full h-full rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <GlassSurface className="w-full h-full rounded-full" borderRadius="50%" contentFill>
          <OptimizedCanvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          dpr={[0.75, 1.25]}
          frameloop="always"
          performance={{ min: 0.6 }}
          gl={{ antialias: false, alpha: true }}
          >
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            <ambientLight intensity={0.35} />
            <SharedEnvironment />
            <TinyDagoberto />
          </OptimizedCanvas>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 2 }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path id="circlePath" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" pathLength="220" />
            </defs>
            <g>
              <text fill="white" fontSize="9" style={{ letterSpacing: "0.4em" }}>
                <textPath href="#circlePath" startOffset="50%" textAnchor="middle" method="align" spacing="auto">
                  OPEN TO WORK - 2025.ARG -
                </textPath>
              </text>
              <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="12s" repeatCount="indefinite" />
            </g>
          </svg>
        </div>
        </GlassSurface>
      </a>
    </div>
  );
}
