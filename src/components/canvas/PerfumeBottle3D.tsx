'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

interface PerfumeBottle3DProps {
  modelUrl?: string | null;
  perfumeTitle?: string;
  engravedName?: string;
  capFinish?: 'gold' | 'obsidian' | 'platinum';
  liquidColor?: string;
  cameraPreset?: 'front' | 'cap' | 'facet' | 'top';
  onSpray?: () => void;
}

/**
 * Procedural Web Audio API luxury atomizer spray sound
 */
export function playLuxurySpraySound() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const bufferSize = Math.floor(ctx.sampleRate * 0.35);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3400;
    filter.Q.value = 1.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {
    // Graceful fallback
  }
}

/**
 * GLB Model loader component with fallback to procedural model
 */
function GLBModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2} position={[0, -1, 0]} />;
}

/**
 * Masterpiece 3D Interactive Perfume Flacon
 */
export function PerfumeBottle3D({
  modelUrl,
  perfumeTitle = 'OUD ROYAL',
  engravedName = '',
  capFinish = 'gold',
  liquidColor = '#D4AF37',
  cameraPreset = 'front',
  onSpray,
}: PerfumeBottle3DProps) {
  const [sprayBurst, setSprayBurst] = useState(0);

  const handleTriggerSpray = () => {
    playLuxurySpraySound();
    setSprayBurst((prev) => prev + 1);
    if (onSpray) onSpray();
  };

  if (modelUrl && modelUrl.endsWith('.glb')) {
    return (
      <React.Suspense fallback={<ProceduralBottle title={perfumeTitle} liquidColor={liquidColor} />}>
        <GLBModel url={modelUrl} />
      </React.Suspense>
    );
  }

  return (
    <ProceduralBottle
      title={perfumeTitle}
      engravedName={engravedName}
      capFinish={capFinish}
      liquidColor={liquidColor}
      cameraPreset={cameraPreset}
      sprayBurst={sprayBurst}
      onTriggerSpray={handleTriggerSpray}
    />
  );
}

function ProceduralBottle({
  title,
  engravedName,
  capFinish = 'gold',
  liquidColor = '#D4AF37',
  cameraPreset = 'front',
  sprayBurst = 0,
  onTriggerSpray,
}: {
  title: string;
  engravedName?: string;
  capFinish?: 'gold' | 'obsidian' | 'platinum';
  liquidColor?: string;
  cameraPreset?: 'front' | 'cap' | 'facet' | 'top';
  sprayBurst?: number;
  onTriggerSpray?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mistRef = useRef<THREE.Points>(null);
  const goldFlakesRef = useRef<THREE.Points>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const liquidMeshRef = useRef<THREE.Mesh>(null);

  // 1. Suspended 24k Gold Flakes inside liquid
  const goldFlakeCount = 100;
  const [flakePositions] = useMemo(() => {
    const pos = new Float32Array(goldFlakeCount * 3);
    for (let i = 0; i < goldFlakeCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.1;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.4 - 0.15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.55;
    }
    return [pos];
  }, [goldFlakeCount]);

  // 2. Mist particles
  const particleCount = 200;
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 1.6;
      pos[i * 3 + 2] = 0;

      vel[i * 3] = (Math.random() - 0.5) * 0.08;
      vel[i * 3 + 1] = Math.random() * 0.12 + 0.04;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
    }
    return [pos, vel];
  }, [particleCount]);

  const capColor = useMemo(() => {
    if (capFinish === 'obsidian') return '#18181c';
    if (capFinish === 'platinum') return '#E2E6EE';
    return '#D4AF37'; // 24k gold
  }, [capFinish]);

  const capMetalness = capFinish === 'obsidian' ? 0.7 : 0.98;
  const capRoughness = capFinish === 'obsidian' ? 0.25 : 0.14;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    let targetRotY = time * 0.35;
    let targetRotX = 0;
    let targetPosY = -0.35;

    if (cameraPreset === 'cap') {
      targetRotX = 0.35;
      targetPosY = -1.1;
    } else if (cameraPreset === 'facet') {
      targetRotY = time * 0.35 + Math.PI / 4;
      targetRotX = -0.15;
    } else if (cameraPreset === 'top') {
      targetRotX = 0.8;
      targetPosY = -0.6;
    }

    const mouseX = state.pointer.x * 0.4;
    const mouseY = state.pointer.y * 0.22;

    groupRef.current.rotation.y += delta * 0.35;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX - mouseY, 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -mouseX * 0.2, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.05);

    if (liquidMeshRef.current) {
      liquidMeshRef.current.scale.y = 1 + Math.sin(time * 2.8) * 0.015;
    }

    // Gold flakes swirl
    if (goldFlakesRef.current) {
      const posAttr = goldFlakesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < goldFlakeCount; i++) {
        arr[i * 3] += Math.sin(time + i) * 0.001;
        arr[i * 3 + 1] += Math.cos(time * 0.9 + i) * 0.0014;
        arr[i * 3 + 2] += Math.sin(time * 0.6 + i) * 0.0008;

        if (arr[i * 3 + 1] > 0.6) arr[i * 3 + 1] = -0.85;
        if (arr[i * 3 + 1] < -0.85) arr[i * 3 + 1] = 0.6;
      }
      posAttr.needsUpdate = true;
    }

    // Sillage Rings
    const animateRing = (ring: THREE.Mesh | null, offset: number) => {
      if (!ring) return;
      const progress = ((time * 0.75 + offset) % 1.6) / 1.6;
      const scale = 0.3 + progress * 2.4;
      ring.scale.set(scale, scale, scale);
      ring.position.y = 1.6 + progress * 1.6;
      const mat = ring.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.sin((1 - progress) * Math.PI) * 0.45;
      }
    };

    animateRing(ring1Ref.current, 0.0);
    animateRing(ring2Ref.current, 0.55);
    animateRing(ring3Ref.current, 1.1);

    // Mist spray
    if (mistRef.current) {
      const positionAttr = mistRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = positionAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        array[i * 3] += velocities[i * 3];
        array[i * 3 + 1] += velocities[i * 3 + 1];
        array[i * 3 + 2] += velocities[i * 3 + 2];

        if (array[i * 3 + 1] > 3.6) {
          array[i * 3] = (Math.random() - 0.5) * 0.1;
          array[i * 3 + 1] = 1.6;
          array[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
        }
      }
      positionAttr.needsUpdate = true;
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group
        ref={groupRef}
        position={[0, -0.35, 0]}
        onClick={onTriggerSpray}
      >
        {/* ================= INTERNAL CAUSTIC GLOW LIGHT ================= */}
        <pointLight
          position={[0, -0.1, 0]}
          intensity={2.4}
          distance={3.0}
          color={liquidColor}
        />

        {/* ================= 1. HEAVY CRYSTAL BOTTLE BODY ================= */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 2.1, 0.9]} />
          <meshPhysicalMaterial
            roughness={0.04}
            transmission={0.92}
            thickness={1.3}
            ior={1.52}
            clearcoat={1.0}
            clearcoatRoughness={0.04}
            attenuationColor="#F5ECCB"
            attenuationDistance={1.8}
            color="#FFFFFF"
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Outer Crystal Chamfer Shell */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.54, 2.14, 0.94]} />
          <meshPhysicalMaterial
            roughness={0.03}
            transmission={0.95}
            ior={1.56}
            transparent
            opacity={0.4}
            color="#FFFFFF"
          />
        </mesh>

        {/* ================= 2. LIQUID CORE (AMBER / GOLD / ROSE) ================= */}
        <mesh ref={liquidMeshRef} position={[0, -0.15, 0]}>
          <boxGeometry args={[1.26, 1.65, 0.68]} />
          <meshPhysicalMaterial
            roughness={0.08}
            transmission={0.78}
            thickness={0.9}
            ior={1.42}
            color={liquidColor}
            attenuationColor={liquidColor}
            attenuationDistance={0.8}
            emissive={liquidColor}
            emissiveIntensity={0.24}
            transparent
          />
        </mesh>

        {/* Suspended 24k Gold Flakes */}
        <points ref={goldFlakesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={goldFlakeCount}
              array={flakePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.035}
            color="#FFE58F"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Gold Dip Tube */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 1.7, 16]} />
          <meshStandardMaterial
            color="#E6CA65"
            metalness={0.95}
            roughness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* ================= 3. GOLD FRONT LABEL PLAQUE WITH DYNAMIC ENGRAVING ================= */}
        <group position={[0, 0, 0.465]}>
          {/* Label Plate */}
          <mesh>
            <planeGeometry args={[1.05, 1.25]} />
            <meshStandardMaterial
              color="#0d0d10"
              roughness={0.3}
              metalness={0.3}
            />
          </mesh>

          {/* Gilded Border on Plaque */}
          <mesh position={[0, 0, 0.002]}>
            <ringGeometry args={[0.48, 0.5, 4]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={0.98}
              roughness={0.12}
            />
          </mesh>

          {/* Typography on Plaque (Using Built-in Safe Font - No Network Delay) */}
          <Text
            position={[0, 0.38, 0.006]}
            fontSize={0.075}
            color="#D4AF37"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.16}
          >
            MAISON DE PARFUM
          </Text>

          <Text
            position={[0, 0.04, 0.006]}
            fontSize={0.11}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.12}
          >
            {title.length > 14 ? title.substring(0, 14) + '...' : title.toUpperCase()}
          </Text>

          {/* Custom Engraving Field */}
          {engravedName && (
            <Text
              position={[0, -0.12, 0.008]}
              fontSize={0.065}
              color="#E6CA65"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.18}
            >
              « {engravedName.toUpperCase()} »
            </Text>
          )}

          <Text
            position={[0, -0.27, 0.006]}
            fontSize={0.05}
            color="#C4B48A"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.22}
          >
            EXTRAIT DE PARFUM
          </Text>

          <Text
            position={[0, -0.42, 0.006]}
            fontSize={0.045}
            color="#D4AF37"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.1}
          >
            100 ML • 3.4 FL. OZ
          </Text>
        </group>

        {/* ================= 4. ATOMIZER COLLAR & NECK ================= */}
        <mesh position={[0, 1.15, 0]}>
          <cylinderGeometry args={[0.26, 0.3, 0.22, 32]} />
          <meshStandardMaterial
            color={capColor}
            metalness={capMetalness}
            roughness={capRoughness}
          />
        </mesh>

        <mesh position={[0, 1.28, 0]}>
          <cylinderGeometry args={[0.23, 0.23, 0.08, 32]} />
          <meshStandardMaterial
            color="#F5ECCB"
            metalness={0.98}
            roughness={0.12}
          />
        </mesh>

        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.18, 32]} />
          <meshStandardMaterial
            color={capColor}
            metalness={capMetalness}
            roughness={capRoughness}
          />
        </mesh>

        {/* ================= 5. LUXURY FACETED CAP ================= */}
        <group position={[0, 1.85, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.38, 0.42, 0.72, 8]} />
            <meshStandardMaterial
              color={capColor}
              metalness={capMetalness}
              roughness={capRoughness}
            />
          </mesh>

          <mesh position={[0, 0.365, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.02, 32]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={0.98}
              roughness={0.14}
            />
          </mesh>

          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.43, 0.43, 0.06, 32]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={0.95}
              roughness={0.18}
            />
          </mesh>
        </group>

        {/* ================= 6. SILLAGE RINGS ================= */}
        <mesh ref={ring1Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.6, 0]}>
          <ringGeometry args={[0.4, 0.44, 32]} />
          <meshBasicMaterial
            color="#D4AF37"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh ref={ring2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.6, 0]}>
          <ringGeometry args={[0.4, 0.44, 32]} />
          <meshBasicMaterial
            color="#F5ECCB"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh ref={ring3Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.6, 0]}>
          <ringGeometry args={[0.4, 0.44, 32]} />
          <meshBasicMaterial
            color="#BF9927"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* ================= 7. SPRAY MIST PARTICLES ================= */}
        <points ref={mistRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.048}
            color="#F5ECCB"
            transparent
            opacity={0.75}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </Float>
  );
}
