'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface NotesVisualizer3DProps {
  tier: 'top' | 'heart' | 'base';
}

function TopNotesScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.8;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.4;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.6} floatIntensity={0.8}>
      <group>
        {/* Effervescent Citrus & Saffron Golden Crystal Prism */}
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1.2, 0]} />
          <meshPhysicalMaterial
            color="#FFD700"
            emissive="#FFB800"
            emissiveIntensity={0.3}
            roughness={0.08}
            transmission={0.85}
            thickness={1.2}
            ior={1.6}
            clearcoat={1.0}
          />
        </mesh>

        {/* Orbiting Sparkle Ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.8, 0.03, 16, 64]} />
          <meshStandardMaterial color="#FFF5DB" metalness={0.9} roughness={0.1} />
        </mesh>

        <Sparkles count={50} scale={3.5} size={3} speed={0.8} color="#FFE58F" />
      </group>
    </Float>
  );
}

function HeartNotesScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.5;
      ringRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <group>
        {/* Velvet Damascena Rose & Floral Nectar Sphere */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.1, 32, 32]} />
          <MeshDistortMaterial
            color="#D4AF37"
            emissive="#9A7B1C"
            emissiveIntensity={0.35}
            roughness={0.2}
            metalness={0.4}
            distort={0.35}
            speed={2}
          />
        </mesh>

        {/* Orbiting Floral Petal Ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[1.75, 0.05, 16, 64]} />
          <meshStandardMaterial color="#E6CA65" metalness={0.95} roughness={0.1} />
        </mesh>

        <Sparkles count={45} scale={3.2} size={2.5} speed={0.5} color="#D4AF37" />
      </group>
    </Float>
  );
}

function BaseNotesScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.rotation.x += delta * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.3;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.4}>
      <group>
        {/* Dark Aged Agarwood & Smoked Amber Icosahedron */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.15, 0]} />
          <meshPhysicalMaterial
            color="#3D2B1F"
            emissive="#7A4B1A"
            emissiveIntensity={0.4}
            roughness={0.15}
            metalness={0.7}
            transmission={0.4}
            thickness={2.0}
            clearcoat={1.0}
          />
        </mesh>

        {/* Heavy Smoked Gold Ring */}
        <mesh ref={ringRef} rotation={[-Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.8, 0.04, 16, 64]} />
          <meshStandardMaterial color="#A48222" metalness={0.9} roughness={0.2} />
        </mesh>

        <Sparkles count={40} scale={3} size={2} speed={0.3} color="#C48E2E" />
      </group>
    </Float>
  );
}

export function NotesVisualizer3D({ tier }: NotesVisualizer3DProps) {
  return (
    <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl bg-obsidian-600/70 border border-gold/20 overflow-hidden flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gold-glow pointer-events-none opacity-40 blur-2xl" />

      {/* Dynamic 3D Tag */}
      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-obsidian-400/80 border border-gold/20 text-[9px] uppercase tracking-widest text-gold font-sans backdrop-blur-md">
        3D Olfactory Chamber • {tier.toUpperCase()}
      </div>

      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 3]} intensity={2.2} color="#FFF8E7" />
        <pointLight position={[0, -2, 2]} intensity={0.8} color="#D4AF37" />

        {tier === 'top' && <TopNotesScene />}
        {tier === 'heart' && <HeartNotesScene />}
        {tier === 'base' && <BaseNotesScene />}
      </Canvas>
    </div>
  );
}
