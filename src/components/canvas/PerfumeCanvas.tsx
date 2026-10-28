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

      {/* TOP CONTROLS: Camera Angles & Sillage Indicator */}
      <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
        
        {/* Camera Angles Bar */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl bg-obsidian-300/85 backdrop-blur-md border border-gold/25 shadow-lg">
          <button
            onClick={() => setCameraPreset('front')}
            className={`px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider font-sans transition-all flex items-center gap-1 ${
              cameraPreset === 'front'
                ? 'bg-gold text-obsidian font-bold shadow-md shadow-gold/20'
                : 'text-champagne/70 hover:text-white'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => setCameraPreset('cap')}
            className={`px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider font-sans transition-all flex items-center gap-1 ${
              cameraPreset === 'cap'
                ? 'bg-gold text-obsidian font-bold shadow-md shadow-gold/20'
                : 'text-champagne/70 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Cap Detail</span>
          </button>

          <button
            onClick={() => setCameraPreset('facet')}
            className={`px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider font-sans transition-all flex items-center gap-1 ${
              cameraPreset === 'facet'
                ? 'bg-gold text-obsidian font-bold shadow-md shadow-gold/20'
                : 'text-champagne/70 hover:text-white'
            }`}
          >
            <span>Crystal 45°</span>
          </button>
        </div>

        {/* Live Spray Mist Sound Trigger */}
        <button
          onClick={handleSpray}
          className="pointer-events-auto px-3.5 py-1.5 rounded-2xl bg-gold hover:bg-gold-300 text-obsidian text-[10px] uppercase tracking-widest font-serif font-bold transition-all shadow-md shadow-gold/20 flex items-center gap-1.5 active:scale-95"
          title="Spray Artisanal Mist"
        >
          <Droplets className="w-3 h-3" />
          <span>Spray Essence</span>
        </button>
      </div>

      {/* BOTTOM CONTROLS: 3D Custom Engraving & Cap Metal Selector */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
        
        {/* Live 3D Engraving Input on Plaque */}
        <div className="pointer-events-auto w-full sm:w-auto flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-obsidian-300/85 backdrop-blur-md border border-gold/25 shadow-lg">
          <Edit3 className="w-3 h-3 text-gold shrink-0" />
          <span className="text-[10px] uppercase tracking-wider text-champagne/60 font-sans hidden sm:inline">
            3D Engraving:
          </span>
          <input
            type="text"
            maxLength={12}
            placeholder="Type your name..."
            value={engravedName}
            onChange={(e) => setEngravedName(e.target.value)}
            className="w-28 sm:w-32 bg-transparent text-gold font-serif text-xs focus:outline-none uppercase placeholder:text-champagne/30"
          />
          {engravedName && (
            <button
              onClick={() => setEngravedName('')}
              className="text-[10px] text-champagne/50 hover:text-red-400"
              title="Clear engraving"
            >
              ×
            </button>
          )}
        </div>

        {/* Cap Metal Finishes: Gold / Obsidian / Platinum */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl bg-obsidian-300/85 backdrop-blur-md border border-gold/25 shadow-lg">
          <button
            onClick={() => setCapFinish('gold')}
            className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
              capFinish === 'gold' ? 'border-gold scale-110 ring-2 ring-gold/40' : 'border-gold/30 opacity-70'
            }`}
            style={{ backgroundColor: '#D4AF37' }}
            title="24K Satin Gold Cap"
          />
          <button
            onClick={() => setCapFinish('obsidian')}
            className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
              capFinish === 'obsidian' ? 'border-gold scale-110 ring-2 ring-gold/40' : 'border-neutral-700 opacity-70'
            }`}
            style={{ backgroundColor: '#111114' }}
            title="Polished Obsidian Black Cap"
          />
          <button
            onClick={() => setCapFinish('platinum')}
            className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
              capFinish === 'platinum' ? 'border-gold scale-110 ring-2 ring-gold/40' : 'border-neutral-500 opacity-70'
            }`}
            style={{ backgroundColor: '#D8DCE3' }}
            title="Brushed Platinum Cap"
          />
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
