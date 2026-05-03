"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Points, PointMaterial, Bloom, EffectComposer } from '@react-three/drei';
import * as THREE from 'three';

function NeuralBody() {
  const pointsRef = useRef<any>();
  
  // Create a procedural "Human" shape using particles
  const particlesCount = 8000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      // Procedural human shape logic
      let x, y, z;
      const rand = Math.random();
      
      if (rand > 0.6) { // Torso
        x = (Math.random() - 0.5) * 1.5;
        y = (Math.random() - 0.5) * 4;
        z = (Math.random() - 0.5) * 1;
      } else if (rand > 0.4) { // Head
        x = (Math.random() - 0.5) * 0.8;
        y = 2.5 + Math.random() * 1;
        z = (Math.random() - 0.5) * 0.8;
      } else if (rand > 0.2) { // Arms
        x = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 1.5);
        y = 1 + (Math.random() - 0.5) * 2;
        z = (Math.random() - 0.5) * 0.5;
      } else { // Legs
        x = (Math.random() > 0.5 ? 0.3 : -0.3) + (Math.random() - 0.5) * 0.4;
        y = -2 - Math.random() * 3;
        z = (Math.random() - 0.5) * 0.5;
      }
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.005;
      // Pulsating effect
      const s = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
      pointsRef.current.scale.set(s, s, s);
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#7df9ff"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function HologramBody() {
  return (
    <div className="w-full h-full relative cursor-move">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <NeuralBody />
        </Float>

        {/* Scanning Line */}
        <ScanningLine />
      </Canvas>
      
      {/* HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none border border-cyan-400/10 rounded-3xl" />
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400/10 animate-pulse" />
    </div>
  );
}

function ScanningLine() {
  const lineRef = useRef<any>();
  
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 5;
    }
  });

  return (
    <mesh ref={lineRef}>
      <boxGeometry args={[10, 0.02, 10]} />
      <meshBasicMaterial color="#7df9ff" transparent opacity={0.15} />
    </mesh>
  );
}
