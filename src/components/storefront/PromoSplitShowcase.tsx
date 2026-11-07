'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Crown } from 'lucide-react';

export function PromoSplitShowcase() {
  return (
    <section className="py-16 lg:py-20 bg-obsidian-600/60 border-b border-gold/15 relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Dark Obsidian Atelier Story */}
          <div className="relative rounded-2xl p-8 sm:p-10 lg:p-12 overflow-hidden border border-gold/30 bg-gradient-to-br from-[#1C1814] via-[#14110E] to-[#0D0A08] shadow-2xl flex flex-col justify-between group">
            {/* Gilded Corner Accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all duration-700" />

            <div className="space-y-5 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] tracking-[0.25em] uppercase font-sans">
                <Crown className="w-3 h-3 text-gold" />
                <span>Crafted For Excellence</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium leading-snug">
                Every flacon tells a story of heritage, rare aged ouds, and timeless French perfumery.
              </h3>

              <p className="text-sm text-champagne/70 font-sans leading-relaxed max-w-lg">
                Hand-poured extraits de parfum and pure concentrated alcohol-free attar oils distilled from ethical harvests across Grasse, Kannauj, Cambodia, and Assam.
              </p>
            </div>

            <div className="pt-8 relative z-10">
              <a
                href="#heritage"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-obsidian-300 hover:bg-gold hover:text-obsidian text-champagne font-serif text-xs uppercase tracking-[0.2em] border border-gold/40 hover:border-gold transition-all duration-300 shadow-lg shadow-black/40 group-hover:scale-[1.02]"
              >
                <span>Our Heritage & Atelier</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Card 2: Luxury Champagne Discovery Collection */}
          <div className="relative rounded-2xl p-8 sm:p-10 lg:p-12 overflow-hidden border border-gold/30 bg-gradient-to-br from-[#2E2419] via-[#1E1710] to-[#120E0A] shadow-2xl flex flex-col justify-between group">
            {/* Ambient amber halo */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gold/15 rounded-full blur-3xl group-hover:bg-gold/25 transition-all duration-700" />

            <div className="space-y-5 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B263E]/30 border border-[#8B263E]/60 text-rose-300 text-[10px] tracking-[0.25em] uppercase font-sans">
                <Sparkles className="w-3 h-3 text-rose-300 animate-pulse" />
                <span>Haute Parfumerie & Pure Attars</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium leading-snug">
                Bespoke Discovery Flacons & Pure Cambodian Ouds
              </h3>

              <p className="text-sm text-champagne/70 font-sans leading-relaxed max-w-lg">
                From high-radiance extrait sprays for evenings of prestige to intimate, velvety pure attar tolas that linger for days.
              </p>
            </div>

            <div className="pt-8 relative z-10">
              <a
                href="#collection"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-lg shadow-gold/25 group-hover:scale-[1.02]"
              >
                <span>Shop Masterpiece Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
