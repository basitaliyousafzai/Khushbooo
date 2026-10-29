'use client';

import React, { useState } from 'react';
import { PerfumeCanvas } from '@/components/canvas/PerfumeCanvas';
import { DynamicBackgroundRenderer } from '@/components/canvas/DynamicBackgroundRenderer';
import { Product, SiteContentMap } from '@/types';
import { useCart } from '@/context/CartContext';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Compass, Award, Droplets, Waves } from 'lucide-react';

interface HeroSectionProps {
  content: SiteContentMap;
  featuredProducts: Product[];
}

export function HeroSection({ content, featuredProducts }: HeroSectionProps) {
  const { buyNow, addToCart } = useCart();
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);

  const activeProduct = featuredProducts[selectedProductIndex] || featuredProducts[0];

  // Dynamic Site Content values
  const heroTagline = content.hero_tagline || 'The Art of Scent, Sculpted in Time';
  const heroDescription = content.hero_description || 'Experience artisanal luxury fragrances crafted with rare aged Cambodian oud, delicate Damascena roses, and precious Tuscan orris butter.';
  const heroCtaText = content.hero_cta_text || 'Explore Fragrances';
  const heroSecondaryCta = content.hero_secondary_cta || 'Discover The Notes';

  return (
    <section className="relative min-h-[96vh] flex items-center justify-center overflow-hidden bg-obsidian py-14 lg:py-8 border-b border-gold/15">
      {/* 3D Dynamic Animated Background System (Admin Controlled) */}
      <DynamicBackgroundRenderer targetSection="hero" className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Decorative ambient background lights & luxury halo */}
      <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-gold/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[420px] h-[420px] bg-gold-dark/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle luxury geometric grid watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Dynamic Hero Content */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            
            {/* Haute Parfumerie Crest Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-obsidian-300/90 border border-gold/30 text-champagne text-xs tracking-[0.25em] uppercase font-sans shadow-lg shadow-black/40">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span>Haute Parfumerie • Pure Extrait 35%</span>
            </div>

            {/* Dynamic Hero Tagline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
              {heroTagline}
            </h1>

            {/* Dynamic Hero Description */}
            <p className="text-base sm:text-lg text-champagne/75 font-sans leading-relaxed max-w-xl mx-auto lg:mx-0">
              {heroDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
              <a
                href="#collection"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gold/25 hover:scale-[1.02]"
              >
                <span>{heroCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#notes-explorer"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-gold/40 hover:border-gold text-champagne hover:text-white font-serif text-xs uppercase tracking-[0.2em] transition-all duration-300 bg-obsidian-400/40 hover:bg-obsidian-300/60 flex items-center justify-center"
              >
                <span>{heroSecondaryCta}</span>
              </a>
            </div>

            {/* Interactive 3D Flacon Switcher */}
            {featuredProducts.length > 1 && (
              <div className="pt-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-champagne/60 font-sans mb-3 text-center lg:text-left">
                  Inspect Flacon:
                </p>

                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {featuredProducts.slice(0, 4).map((prod, idx) => (
                    <button
                      key={prod.id}
                      onClick={() => setSelectedProductIndex(idx)}
                      className={`px-3.5 py-1.5 rounded-full text-[11px] tracking-wider transition-all border font-sans ${
                        selectedProductIndex === idx
                          ? 'border-gold bg-gold text-obsidian font-bold shadow-md shadow-gold/20'
                          : 'border-gold/20 text-champagne/70 hover:border-gold/50 hover:text-white bg-obsidian-500/60'
                      }`}
                    >
                      {prod.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sleek Prestige Hallmarks */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gold/15 text-center lg:text-left">
              <div>
                <div className="font-serif text-sm text-gold font-bold">100% Uncut</div>
                <div className="text-[10px] uppercase tracking-wider text-champagne/50">Pure Attar Oils</div>
              </div>
              <div>
                <div className="font-serif text-sm text-gold font-bold">35% Extrait</div>
                <div className="text-[10px] uppercase tracking-wider text-champagne/50">Haute Parfumerie</div>
              </div>
              <div>
                <div className="font-serif text-sm text-gold font-bold">Free Shipping</div>
                <div className="text-[10px] uppercase tracking-wider text-champagne/50">Nationwide COD</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Interactive Canvas */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full max-w-[560px]">
              <PerfumeCanvas
                modelUrl={activeProduct?.model_3d_url}
                perfumeTitle={activeProduct?.title || 'OUD ROYAL'}
                liquidColor={
                  selectedProductIndex === 1
                    ? '#8C531B' // Dehn Al Oud (Rich Aged Amber)
                    : selectedProductIndex === 2
                    ? '#E8C15A' // Soleil Doré (Warm Honey)
                    : selectedProductIndex === 3
                    ? '#5C381E' // Kasturi Musk (Dark Silken Amber)
                    : '#D4AF37' // Oud Royal (Imperial Gold)
                }
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
