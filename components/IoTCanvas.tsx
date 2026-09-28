"use client";

/**
 * Abstract IoT / Cloud data network — Three.js via React Three Fiber.
 *
 * A small constellation of nodes linked by faint lines with drifting
 * particles, evoking "software + IoT + data + Cloud" without any literal
 * logos. It is intentionally subtle, slowly rotating, and reacts only
 * lightly to the mouse.
 *
 * Performance / robustness:
 *  - geometry is simple Points / LineSegments, no textures, no models;
 *  - the scene is only mounted after WebGL support + lazy-loading checks
 *    (see Hero / DataNetwork3D wrapper);
 *  - particle / node density is reduced on small screens;
 *  - honour prefers-reduced-motion by rendering a static frame.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const TEAL = "#3FBFAE";
const COPPER = "#C9793F";
const INK = "#9AA3AB";

function useReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

type Particle = {
  angle: number;
  radius: number;
  y: number;
  speed: number;
  size: number;
};

function Network({ isMobile }: { isMobile: boolean }) {
  const nodeCount = isMobile ? 40 : 80;
  const linkCount = isMobile ? 120 : 260;
  const particleCount = isMobile ? 60 : 140;

  const reduce = useReduced();
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // --- nodes: scattered in a rough sphere ---
  const nodeGeo = useMemo(() => {
    const positions = new Float32Array(nodeCount * 3);
    const r = 1.9;
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const rad = 0.5 + Math.random() * r;
      positions[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = rad * Math.cos(phi) * 0.7 - 0.2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [nodeCount]);

  // --- links between close nodes ---
  const linkGeo = useMemo(() => {
    const pos = nodeGeo.attributes.position.array as Float32Array;
    const pts: number[] = [];
    const maxDist = 1.55;
    let edges = 0;
    for (let i = 0; i < nodeCount && edges < linkCount; i++) {
      for (let j = i + 1; j < nodeCount && edges < linkCount; j++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        const jx = j * 3, jy = j * 3 + 1, jz = j * 3 + 2;
        const dx = pos[ix] - pos[jx];
        const dy = pos[iy] - pos[jy];
        const dz = pos[iz] - pos[jz];
        if (dx * dx + dy * dy + dz * dz < maxDist * maxDist) {
          pts.push(pos[ix], pos[iy], pos[iz]);
          pts.push(pos[jx], pos[jy], pos[jz]);
          edges++;
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, [nodeCount, linkCount, nodeGeo]);

  // --- drifting particles (data flow) ---
  const particleData = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 0.6 + Math.random() * 1.6,
      y: (Math.random() - 0.5) * 2.4,
      speed: 0.0004 + Math.random() * 0.0012,
      size: 0.02 + Math.random() * 0.03,
    }));
  }, [particleCount]);

  const particleGeo = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [particleCount]);

  useFrame((state) => {
    if (reduce) return;
    const t = state.clock.elapsedTime;

    // extremely slow rotation of the network
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.12;
    }

    // subtle mouse parallax on the points group
    const mouse = state.pointer;
    const targetX = isMobile ? 0 : mouse.x * 0.25;
    const targetY = isMobile ? 0 : mouse.y * 0.18;
    const g = groupRef.current;
    if (g) {
      g.rotation.y += (targetX * 0.4 - (g.rotation.y * 0.2)) * 0.02;
    }

    // move particles along their orbit (data flow)
    if (particlesRef.current) {
      const arr = particlesRef.current.geometry.attributes
        .position.array as Float32Array;
      for (let i = 0; i < particleData.length; i++) {
        const p = particleData[i];
        const a = p.angle + t * p.speed * 100;
        arr[i * 3] = Math.cos(a) * p.radius;
        arr[i * 3 + 1] = p.y + Math.sin(t * 0.3 + i) * 0.15;
        arr[i * 3 + 2] = Math.sin(a) * p.radius * 0.8;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* nodes */}
      <points geometry={nodeGeo}>
        <pointsMaterial
          color={TEAL}
          size={isMobile ? 0.025 : 0.035}
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* links */}
      <lineSegments geometry={linkGeo}>
        <lineBasicMaterial
          color={TEAL}
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </lineSegments>

      {/* data-flow particles */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          color={COPPER}
          size={isMobile ? 0.022 : 0.028}
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* a faint copper accent node */}
      <mesh position={[0.4, 0.15, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={COPPER} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export default function IoTCanvas() {
  const reduce = useReduced();
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      frameloop={reduce ? "demand" : "always"}
      style={{ width: "100%", height: "100%" }}
    >
      <Network isMobile={isMobile} />
    </Canvas>
  );
}
