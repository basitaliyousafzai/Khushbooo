'use client';

import React, { useState } from 'react';
import { PerfumeCanvas } from '@/components/canvas/PerfumeCanvas';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Sparkles, ArrowRight, Truck, Droplets, Flame, Award, Waves } from 'lucide-react';

interface ScrollStory3DProps {
  products: Product[];
}

export function ScrollStory3D({ products }: ScrollStory3DProps) {
  const { buyNow, addToCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);

  // 4 Featured Highlights: Perfumes & Attars
  const storyItems = [
    {
      product: products[0] || {
        id: 'p1',
        title: 'Oud Royal Extrait',
        price: 14500,
        discount_price: 12900,
        category_type: 'perfume',
        volume: '100ml Extrait Spray',
        short_description: 'A majestic French-oriental extrait composed of 25-year aged wild Cambodian oud, golden saffron, and Damascena rose.',
        top_notes: ['Golden Saffron', 'Bergamot', 'Pink Peppercorn'],
      },
      liquidColor: '#D4AF37', // Imperial Gold
      tag: 'Haute Extrait Perfume',
      badge: '35% Concentration',
      sillage: '14+ Hours Longevity',
    },
    {
      product: products[1] || {
        id: 'p2',
        title: 'Dehn Al Oud Qadeem',
        price: 16500,
        discount_price: 14900,
        category_type: 'attar',
        volume: '12ml Pure Oil Tola',
        short_description: 'Pure 100% uncut concentrated attar oil distilled in vintage copper stills from rare Assam & Cambodian agarwood trees.',
        top_notes: ['Wild Agarwood Smoke', 'Aged Resins', 'Balsamic Sweetness'],
      },
      liquidColor: '#8C531B', // Deep Vintage Oud Amber
      tag: 'Pure Concentrated Attar (Ittar)',
      badge: '100% Alcohol-Free Oil',
      sillage: '24+ Hours Longevity',
    },
    {
      product: products[2] || {
        id: 'p3',
        title: 'Soleil Doré Flacon',
        price: 11500,
        discount_price: 9900,
        category_type: 'perfume',
        volume: '100ml Extrait Spray',
        short_description: 'Incandescent Mediterranean sunburst of honeyed neroli, creamy tuberose petals, and Tahitian bourbon vanilla.',
        top_notes: ['Neroli Sunburst', 'Mandarin Zest', 'Cardamom'],
      },
      liquidColor: '#E8C15A', // Golden Honey Amber
      tag: 'Solar Floral Extrait',
      badge: 'French Formulation',
      sillage: '12+ Hours Longevity',
    },
    {
      product: products[3] || {
        id: 'p4',
        title: 'Kasturi Musk Ghazal',
        price: 8900,
        discount_price: 7800,
        category_type: 'attar',
        volume: '12ml Pure Oil Tola',
        short_description: 'Silken imperial black musk attar with fossilized amber veins and Mysore sandalwood oil base. Pure intimate warmth.',
        top_notes: ['Spiced Saffron', 'Imperial Black Musk', 'Mysore Sandalwood'],
      },
      liquidColor: '#5C381E', // Dark Silken Musk
      tag: 'Pure Concentrated Attar (Ittar)',
      badge: '100% Pure Essential Oil',
      sillage: '20+ Hours Longevity',
    },
  ];

  const current = storyItems[activeIndex] || storyItems[0];
  const prod = current.product;

  return (
    <section className="py-24 bg-obsidian-700 relative border-b border-gold/15 overflow-hidden">
      {/* Dynamic 3D ambient aura that shifts color with the active perfume/attar */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none transition-colors duration-1000 opacity-20"
        style={{ backgroundColor: current.liquidColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-400 border border-gold/30 text-champagne text-xs tracking-[0.2em] uppercase font-sans">
            <Waves className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span>Interactive 3D Olfactory Journey</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Perfumes & Concentrated Attars
          </h2>

          <p className="text-xs sm:text-sm text-champagne/70 font-sans max-w-xl mx-auto">
            Khushbooo crafts both western Haute Extraits de Parfum and traditional Eastern Pure Ittar Oils. Select any creation to morph the 3D flacon in real-time.
          </p>
        </div>

        {/* Main 3D Display Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-obsidian-500/60 rounded-3xl border border-gold/25 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
          
          {/* Left Column: 3D Flacon with Live Color Morphing */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            
            {/* Volume Pill Overlay */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-400/90 border border-gold/30 text-[10px] uppercase tracking-wider text-gold backdrop-blur-md font-sans">
              <Droplets className="w-3.5 h-3.5 text-gold" />
              <span>{prod.volume || '100ml Extrait'}</span>
            </div>

            {/* Sillage Pill Overlay */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-400/90 border border-gold/30 text-[10px] uppercase tracking-wider text-champagne backdrop-blur-md font-sans">
              <Award className="w-3.5 h-3.5 text-gold" />
              <span>{current.sillage}</span>
            </div>

            <div className="w-full max-w-[540px]">
              <PerfumeCanvas
                perfumeTitle={prod.title}
                liquidColor={current.liquidColor}
                className="h-[460px] sm:h-[560px] w-full"
              />
            </div>
          </div>

          {/* Right Column: Interactive Story Steps & Pricing */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Step Selector Pills */}
            <div className="grid grid-cols-2 gap-2">
              {storyItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activeIndex === idx
                      ? 'bg-gold/20 border-gold shadow-lg shadow-gold/15 scale-[1.02]'
                      : 'bg-obsidian-400/40 border-gold/15 hover:border-gold/30 text-champagne/60'
                  }`}
                >
                  <div className="text-[9px] uppercase tracking-wider text-gold font-sans font-semibold">
                    {item.tag}
                  </div>
                  <div className={`font-serif text-xs truncate mt-0.5 ${activeIndex === idx ? 'text-white font-bold' : 'text-champagne/80'}`}>
                    {item.product.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Product Details Card */}
            <div className="p-6 rounded-2xl bg-obsidian-400/80 border border-gold/25 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-gold/15 border border-gold/30 text-gold font-sans font-bold">
                  {current.badge}
                </span>
                <span className="text-[11px] text-champagne/60 font-mono">
                  {prod.volume}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-white">
                  {prod.title}
                </h3>
                <p className="text-xs text-champagne/75 font-sans leading-relaxed mt-2">
                  {prod.short_description}
                </p>
              </div>

              {/* Fragrance Notes */}
              <div className="pt-2 border-t border-gold/15">
                <div className="text-[10px] uppercase tracking-widest text-gold/80 font-sans mb-1.5">
                  Prominent Notes:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {prod.top_notes?.map((n, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md bg-obsidian-300 border border-gold/15 text-[10px] text-champagne font-sans"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & Order CTA */}
              <div className="pt-4 border-t border-gold/15 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-serif text-2xl text-gold font-bold">
                    Rs. {(prod.discount_price || prod.price).toLocaleString()}
                  </div>
                  {prod.discount_price && (
                    <div className="text-xs text-champagne/40 line-through">
                      Rs. {prod.price.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCart(prod as Product)}
                    className="px-4 py-2.5 rounded-full border border-gold/30 hover:border-gold text-champagne text-xs uppercase tracking-wider transition-all font-sans"
                  >
                    Add to Bag
                  </button>
                  <button
                    onClick={() => buyNow(prod as Product)}
                    className="px-5 py-2.5 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-gold/25 flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Buy COD</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-champagne/60 font-sans text-center">
              <span>✨ 100% Authentic • Sealed with Khushbooo Signature Insignia</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
