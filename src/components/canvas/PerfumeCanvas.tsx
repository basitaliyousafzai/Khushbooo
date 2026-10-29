'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sparkles } from '@react-three/drei';
import { PerfumeBottle3D, playLuxurySpraySound } from './PerfumeBottle3D';
import {
  Sparkles as SparklesIcon,
  Waves,
  Eye,
  Camera,
  Droplets,
  Edit3,
  Check,
  RotateCcw
} from 'lucide-react';

interface PerfumeCanvasProps {
  modelUrl?: string | null;
  perfumeTitle?: string;
  liquidColor?: string;
  className?: string;
  allowZoom?: boolean;
}

export function PerfumeCanvas({
  modelUrl,
  perfumeTitle = 'OUD ROYAL',
  liquidColor = '#D4AF37',
  className = 'h-[540px] md:h-[700px] w-full',
  allowZoom = true,
}: PerfumeCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<'front' | 'cap' | 'facet'>('front');
  const [capFinish, setCapFinish] = useState<'gold' | 'obsidian' | 'platinum'>('gold');
  const [engravedName, setEngravedName] = useState('');
  const [isEditingEngraving, setIsEditingEngraving] = useState(false);
  const [sprayCount, setSprayCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSpray = () => {
    playLuxurySpraySound();
    setSprayCount((c) => c + 1);
  };

  if (!mounted) {
    return (
      <div className={`relative flex items-center justify-center bg-obsidian-400/50 rounded-3xl border border-gold/15 ${className}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border border-gold/30 border-t-gold animate-spin" />
          <span className="text-xs uppercase tracking-widest text-gold/80 font-serif">Distilling 3D Essence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group rounded-3xl overflow-hidden border border-gold/20 bg-obsidian-400/40 backdrop-blur-md shadow-2xl ${className}`}>
      
      {/* Ambient background glow & radial light halo */}
      <div className="absolute inset-0 bg-gold-glow pointer-events-none opacity-50 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/15 rounded-full blur-[100px] pointer-events-none" />

      {/* TOP SUBTLE BADGE: 360° Interactive Studio */}
      <div className="absolute top-4 inset-x-5 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-600/80 backdrop-blur-md border border-gold/20 text-[10px] uppercase tracking-[0.25em] text-champagne/80 font-sans shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span>Interactive 3D Flacon</span>
        </div>

        <span className="text-[10px] uppercase tracking-[0.2em] text-champagne/40 font-mono hidden sm:inline">
          360° Rotation
        </span>
      </div>

      {/* BOTTOM FLOATING MINIMALIST LUXURY DOCK */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full bg-obsidian-600/90 backdrop-blur-xl border border-gold/25 shadow-2xl shadow-black/80">
          
          {/* 1. Atomizer Spray Mist Trigger */}
          <button
            onClick={handleSpray}
            className="px-3.5 py-1.5 rounded-full bg-gold hover:bg-gold-300 text-obsidian text-[11px] uppercase tracking-wider font-serif font-bold transition-all flex items-center gap-1.5 shadow-md shadow-gold/20 active:scale-95"
            title="Experience the pressurized fragrance mist"
          >
            <Droplets className="w-3 h-3" />
            <span>Spray Mist</span>
          </button>

          <div className="w-px h-4 bg-gold/20" />

          {/* 2. Cap Metallic Finish Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] uppercase tracking-widest text-champagne/50 font-sans hidden md:inline mr-1">
              Cap:
            </span>
            <button
              onClick={() => setCapFinish('gold')}
              className={`w-5 h-5 rounded-full border transition-all ${
                capFinish === 'gold' ? 'border-white scale-110 ring-2 ring-gold/60' : 'border-gold/30 opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: '#D4AF37' }}
              title="24K Satin Gold"
            />
            <button
              onClick={() => setCapFinish('obsidian')}
              className={`w-5 h-5 rounded-full border transition-all ${
                capFinish === 'obsidian' ? 'border-white scale-110 ring-2 ring-gold/60' : 'border-neutral-700 opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: '#111114' }}
              title="Polished Obsidian"
            />
            <button
              onClick={() => setCapFinish('platinum')}
              className={`w-5 h-5 rounded-full border transition-all ${
                capFinish === 'platinum' ? 'border-white scale-110 ring-2 ring-gold/60' : 'border-neutral-500 opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: '#D8DCE3' }}
              title="Brushed Platinum"
            />
          </div>

          <div className="w-px h-4 bg-gold/20" />

          {/* 3. Minimal Engraving Trigger */}
          {isEditingEngraving ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                maxLength={10}
                placeholder="YOUR NAME"
                value={engravedName}
                autoFocus
                onChange={(e) => setEngravedName(e.target.value)}
                className="w-24 bg-transparent text-gold font-serif text-xs focus:outline-none uppercase placeholder:text-champagne/30"
              />
              <button
                onClick={() => setIsEditingEngraving(false)}
                className="p-1 rounded-full text-champagne/60 hover:text-gold"
              >
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingEngraving(true)}
              className="text-[10px] uppercase tracking-wider text-champagne/70 hover:text-gold font-sans flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-3 h-3 text-gold" />
              <span>{engravedName ? engravedName.toUpperCase() : 'Engrave'}</span>
            </button>
          )}

        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 5.2], fov: 40 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.9} />
        
        {/* Studio Key Light */}
        <directionalLight
          position={[4, 5, 4]}
          intensity={2.6}
          color="#FFF5DB"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />

        {/* Rim Light */}
        <directionalLight
          position={[-4, 3, -3]}
          intensity={2.0}
          color="#E8F0FE"
        />

        {/* Warm Fill Light */}
        <pointLight
          position={[0, -2, 2]}
          intensity={0.8}
          color="#D4AF37"
        />

        <Suspense fallback={null}>
          {/* Floating Gold Sparkle Dust */}
          <Sparkles
            count={60}
            scale={5}
            size={2.5}
            speed={0.4}
            opacity={0.65}
            color="#D4AF37"
          />

          <PerfumeBottle3D
            modelUrl={modelUrl}
            perfumeTitle={perfumeTitle}
            engravedName={engravedName}
            capFinish={capFinish}
            liquidColor={liquidColor}
            cameraPreset={cameraPreset}
          />

          {/* Studio Contact Shadow */}
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.85}
            scale={5.5}
            blur={2.4}
            far={3.5}
            color="#050505"
          />
        </Suspense>

        <OrbitControls
          enableZoom={allowZoom}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.75}
          dampingFactor={0.06}
        />
      </Canvas>
    </div>
  );
}
