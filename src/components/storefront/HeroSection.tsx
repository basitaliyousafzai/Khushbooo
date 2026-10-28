'use client';

import React, { useState } from 'react';
import { PerfumeCanvas } from '@/components/canvas/PerfumeCanvas';
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

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
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
              <div className="pt-6 border-t border-gold/15">
                <div className="flex items-center justify-center lg:justify-between mb-3">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-champagne/60 font-sans flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-gold" />
                    <span>Select 3D Flacon to Inspect:</span>
                  </p>
                  <span className="text-[10px] text-gold/80 font-mono hidden sm:inline">
                    Interactive 3D Engine
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                  {featuredProducts.map((prod, idx) => (
                    <button
                      key={prod.id}
                      onClick={() => setSelectedProductIndex(idx)}
                      className={`px-4 py-2 rounded-xl text-xs tracking-wider transition-all border font-sans ${
                        selectedProductIndex === idx
                          ? 'border-gold bg-gold/20 text-gold font-bold shadow-md shadow-gold/20 scale-105'
                          : 'border-gold/20 text-champagne/60 hover:border-gold/40 hover:text-champagne bg-obsidian-400/40'
                      }`}
                    >
                      {prod.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Pricing & Instant Buy Now Bar */}
            {activeProduct && (
              <div className="p-5 rounded-2xl bg-obsidian-400/70 border border-gold/25 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-champagne/50">Selected Flacon</div>
                  <div className="font-serif text-lg text-white font-medium">{activeProduct.title}</div>
                  <div className="flex items-center gap-2.5 mt-0.5">
                    <span className="font-serif text-gold font-bold text-xl">
                      Rs. {(activeProduct.discount_price || activeProduct.price).toLocaleString()}
                    </span>
                    {activeProduct.discount_price && (
                      <span className="text-xs text-champagne/40 line-through">
                        Rs. {activeProduct.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => addToCart(activeProduct)}
                    className="px-5 py-2.5 rounded-full border border-gold/30 hover:border-gold text-champagne text-xs uppercase tracking-wider transition-all bg-obsidian-300/40 hover:bg-gold/10 font-sans"
                  >
                    Add to Bag
                  </button>
                  <button
                    onClick={() => buyNow(activeProduct)}
                    className="px-5 py-2.5 rounded-full bg-gold hover:bg-gold-300 text-obsidian text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-gold/20 font-serif"
                  >
                    Instant COD
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: 3D Interactive Canvas */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Top Badge: Sillage & Longevity */}
            <div className="absolute top-4 left-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-400/90 border border-gold/30 text-[10px] uppercase tracking-wider text-champagne backdrop-blur-md">
              <Award className="w-3.5 h-3.5 text-gold" />
              <span>12+ Hours Sillage Guarantee</span>
            </div>

            {/* Bottom Badge: Hand Poured */}
            <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-400/90 border border-gold/30 text-[10px] uppercase tracking-wider text-champagne backdrop-blur-md">
              <Droplets className="w-3.5 h-3.5 text-gold" />
              <span>Hand-Poured & Wax-Sealed</span>
            </div>

            <div className="w-full max-w-[580px]">
              <PerfumeCanvas
                modelUrl={activeProduct?.model_3d_url}
                perfumeTitle={activeProduct?.title || 'OUD ROYAL'}
                liquidColor={
                  selectedProductIndex === 1
                    ? '#E8C15A' // Soleil Doré (Golden Amber)
                    : selectedProductIndex === 2
                    ? '#8C6239' // Nocturne Ébène (Smoked Obsidian)
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
