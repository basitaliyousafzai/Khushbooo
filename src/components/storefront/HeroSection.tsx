'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PerfumeCanvas } from '@/components/canvas/PerfumeCanvas';
import { DynamicBackgroundRenderer } from '@/components/canvas/DynamicBackgroundRenderer';
import { Product, SiteContentMap } from '@/types';
import { Sparkles, ArrowRight, ShieldCheck, Waves } from 'lucide-react';

interface HeroSectionProps {
  content: SiteContentMap;
  featuredProducts: Product[];
}

export function HeroSection({ content, featuredProducts }: HeroSectionProps) {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);

  const activeProduct = featuredProducts[selectedProductIndex] || featuredProducts[0];

  // Dynamic Site Content values
  const heroTagline = content.hero_tagline || 'The Soul of Scent, Sculpted in Time';
  const heroDescription =
    content.hero_description ||
    'Explore bespoke French extraits de parfum and pure aged Cambodian oud attars hand-distilled from ethical botanicals across Grasse, Kannauj, and Assam.';
  const heroCtaText = content.hero_cta_text || 'Explore Fragrances';
  const heroSecondaryCta = content.hero_secondary_cta || 'Discover The Notes';

  // Admin switchable 3D bottle toggle (Defaults to false for maximum responsive clean design)
  const show3DBottle = content.show_3d_bottle === 'true';
  const heroImageUrl =
    content.hero_image ||
    activeProduct?.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85';

  return (
    <section className="relative min-h-[72vh] sm:min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-obsidian py-6 sm:py-10 lg:py-12 border-b border-gold/15">
      {/* Isolated Ambient & 3D Background Container */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* 3D Dynamic Animated Background System (Admin Controlled) */}
        <DynamicBackgroundRenderer targetSection="hero" className="w-full h-full" />

        {/* Decorative ambient background lights & luxury halo */}
        <div className="absolute top-1/4 left-1/4 w-[280px] sm:w-[480px] h-[280px] sm:h-[480px] bg-gold/10 rounded-full blur-[120px] sm:blur-[160px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[240px] sm:w-[420px] h-[240px] sm:h-[420px] bg-gold-dark/15 rounded-full blur-[100px] sm:blur-[140px]" />

        {/* Subtle luxury geometric grid watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div
          className={`grid grid-cols-1 ${
            show3DBottle ? 'lg:grid-cols-12' : 'lg:grid-cols-12'
          } gap-6 sm:gap-8 lg:gap-12 items-center`}
        >
          {/* Main Content Column */}
          <div
            className={`${
              show3DBottle
                ? 'lg:col-span-6 text-center lg:text-left space-y-4 sm:space-y-6'
                : 'lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-7'
            }`}
          >
            {/* Haute Parfumerie Crest Pill */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-obsidian-300/90 border border-gold/30 text-champagne text-[9px] sm:text-xs tracking-[0.25em] uppercase font-sans shadow-lg shadow-black/40">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold animate-pulse" />
              <span>Haute Parfumerie • Pure Extrait 35%</span>
            </div>

            {/* Dynamic Hero Tagline */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-6xl text-white tracking-tight leading-[1.15] sm:leading-[1.12]">
              {heroTagline}
            </h1>

            {/* Dynamic Hero Description */}
            <p className="text-xs sm:text-base lg:text-lg text-champagne/75 font-sans leading-relaxed max-w-xl mx-auto lg:mx-0">
              {heroDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1">
              <a
                href="#collection"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gold/25 hover:scale-[1.02]"
              >
                <span>{heroCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#notes-explorer"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-gold/40 hover:border-gold text-champagne hover:text-white font-serif text-xs uppercase tracking-[0.2em] transition-all duration-300 bg-obsidian-400/40 hover:bg-obsidian-300/60 flex items-center justify-center"
              >
                <span>{heroSecondaryCta}</span>
              </a>
            </div>

            {/* Interactive Switcher (Only if multiple products available) */}
            {featuredProducts.length > 1 && (
              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-champagne/60 font-sans mb-2 text-center lg:text-left">
                  Featured Blends:
                </p>

                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {featuredProducts.slice(0, 4).map((prod, idx) => (
                    <button
                      key={prod.id}
                      onClick={() => setSelectedProductIndex(idx)}
                      className={`px-3 py-1.5 rounded-full text-[11px] tracking-wider transition-all border font-sans ${
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
          </div>

          {/* Right Showcase Column (Responsive 3D or Editorial Visual) */}
          <div
            className={`${
              show3DBottle
                ? 'lg:col-span-6 flex items-center justify-center'
                : 'lg:col-span-5 flex items-center justify-center'
            }`}
          >
            {show3DBottle ? (
              <div className="w-full max-w-[480px]">
                <PerfumeCanvas
                  className="h-[420px] sm:h-[520px] md:h-[600px] w-full"
                  modelUrl={activeProduct?.model_3d_url}
                  perfumeTitle={activeProduct?.title || 'OUD ROYAL'}
                  liquidColor={
                    selectedProductIndex === 1
                      ? '#8C531B'
                      : selectedProductIndex === 2
                      ? '#E8C15A'
                      : selectedProductIndex === 3
                      ? '#5C381E'
                      : '#D4AF37'
                  }
                />
              </div>
            ) : (
              /* Highly Responsive Editorial Showcase Frame */
              <div className="relative w-full max-w-[320px] sm:max-w-[440px] lg:max-w-[480px] aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border border-gold/30 shadow-2xl bg-obsidian-400 group">
                <Image
                  src={heroImageUrl}
                  alt={activeProduct?.title || 'Khushbooo Haute Parfumerie'}
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />

                {/* Overlaid Flacon Label */}
                <div className="absolute bottom-3 sm:bottom-6 inset-x-3 sm:inset-x-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-obsidian-500/90 backdrop-blur-md border border-gold/30 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-gold uppercase tracking-[0.25em] font-sans">
                      Featured Atelier Creation
                    </span>
                    <h3 className="font-serif text-sm sm:text-lg text-white font-medium">
                      {activeProduct?.title || 'Oud Royal Extrait'}
                    </h3>
                  </div>
                  <span className="font-serif text-gold font-bold text-sm sm:text-base">
                    Rs. {(activeProduct?.price || 14500).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
