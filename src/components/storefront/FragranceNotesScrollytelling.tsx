'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Clock, Compass, Layers, Droplets, Wind, Flame, Eye, CheckCircle2 } from 'lucide-react';
import { SiteContentMap } from '@/types';

interface FragranceNotesProps {
  content: SiteContentMap;
}

export function FragranceNotesScrollytelling({ content }: FragranceNotesProps) {
  const [activeTier, setActiveTier] = useState<'top' | 'heart' | 'base'>('top');

  const title = content.scrolly_title || 'The Olfactory Architecture';
  const subtitle = content.scrolly_subtitle || 'Every Khushbooo creation unravels through a three-tier olfactory pyramid, maturing on your skin over twelve hours.';

  const tiers = [
    {
      id: 'top' as const,
      name: 'Top Notes',
      subtext: 'The Immediate Sensation (0 – 30 Minutes)',
      duration: '0 – 30 Minutes',
      icon: Wind,
      heroImage: 'https://images.unsplash.com/photo-1590005354167-6da97870c757?auto=format&fit=crop&w=1000&q=80', // Real Bergamot & Citrus Zest
      description: 'The first burst upon spraying. Volatile, sparkling citrus, crisp botanicals, and delicate spices that awaken the senses before gracefully yielding to the heart.',
      ingredients: [
        {
          name: 'Imperial Saffron Stigma',
          origin: 'Kashmir Valley',
          profile: 'Opulent, warm, bittersweet leather facets with golden tint.',
          image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80', // Real Saffron
        },
        {
          name: 'Calabrian Bergamot',
          origin: 'Calabria, Italy',
          profile: 'Sun-drenched, effervescent, sparkling cold-pressed zest.',
          image: 'https://images.unsplash.com/photo-1590005354167-6da97870c757?auto=format&fit=crop&w=600&q=80', // Real Bergamot
        },
        {
          name: 'Madagascar Pink Pepper',
          origin: 'Madagascar',
          profile: 'Dry, vibrant spice with rosy floral nuances.',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', // Real Pink Pepper
        },
      ],
      sillage: '85%',
      projection: 'Instant High Radiance',
    },
    {
      id: 'heart' as const,
      name: 'Heart Notes',
      subtext: 'The Soul & Character (2 – 4 Hours)',
      duration: '2 – 4 Hours',
      icon: Droplets,
      heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80', // Real Damascena Rose petals
      description: 'The signature identity of the fragrance. Once the top notes dissipate, full-bodied florals, aged resins, and rare spices emerge in full harmonic balance.',
      ingredients: [
        {
          name: 'Grasse Rose De Mai',
          origin: 'Grasse, France',
          profile: 'Dewy honeyed centifolia petals hand-plucked at dawn.',
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', // Real Rose
        },
        {
          name: 'Artisanal Cuir Accord',
          origin: 'Smoked Leather',
          profile: 'Supple saddle leather cured over aromatic woodsmoke.',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', // Real Leather
        },
        {
          name: 'Banda Nutmeg Absolute',
          origin: 'Moluccas Archipelago',
          profile: 'Warm woody spice with sensual balsamic warmth.',
          image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80', // Real Nutmeg
        },
      ],
      sillage: '92%',
      projection: 'Enveloping Medium Sillage',
    },
    {
      id: 'base' as const,
      name: 'Base Notes',
      subtext: 'The Enduring Drydown (6 – 12+ Hours)',
      duration: '6 – 12+ Hours',
      icon: Flame,
      heroImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80', // Real Aged Agarwood Oud logs
      description: 'The heavy molecular foundation that anchors the perfume. Precious aged agarwood, creamy santal, and ambergris linger on pulse points and cashmere clothing.',
      ingredients: [
        {
          name: '25-Year Aged Cambodian Oud',
          origin: 'Koh Kong Province',
          profile: 'Deep animalic warmth, smoked resin, peerless dark wood.',
          image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80', // Real Oud
        },
        {
          name: 'Bourbon Vetiver Roots',
          origin: 'Réunion Island',
          profile: 'Smoky, earthy, root-dense with bittersweet cocoa facets.',
          image: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=600&q=80', // Real Vetiver
        },
        {
          name: 'Cured Ambergris Resin',
          origin: 'Atlantic Tides',
          profile: 'Saline minerals, golden warmth, skin-intimate fixative.',
          image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=600&q=80', // Real Amber
        },
      ],
      sillage: '98%',
      projection: 'Sublime Intimate Longevity',
    },
  ];

  const currentTier = tiers.find((t) => t.id === activeTier) || tiers[0];

  return (
    <section id="notes-explorer" className="py-24 bg-obsidian-500 relative border-b border-gold/15 overflow-hidden">
      {/* Dynamic ambient backdrop */}
      <div className="absolute inset-0 bg-gold-glow pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-300/80 border border-gold/30 text-champagne text-xs tracking-[0.2em] uppercase font-sans">
            <Layers className="w-3.5 h-3.5 text-gold" />
            <span>Artisanal Botanical Distillation</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-champagne/70 font-sans leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Tier Selector Buttons (Pyramid Navigation) */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-14">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isSelected = activeTier === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setActiveTier(tier.id)}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-full transition-all duration-300 border text-xs sm:text-sm uppercase tracking-widest font-serif ${
                  isSelected
                    ? 'bg-gold text-obsidian border-gold font-bold shadow-lg shadow-gold/20 scale-105'
                    : 'bg-obsidian-400/60 text-champagne/70 border-gold/20 hover:border-gold/50 hover:text-champagne'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-obsidian' : 'text-gold'}`} />
                <span>{tier.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-obsidian/20 text-obsidian' : 'bg-gold/10 text-gold'}`}>
                  {tier.duration}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scrollytelling Main Card Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-obsidian-400/50 rounded-3xl border border-gold/25 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
          
          {/* Left Column: Real Photographic Hero of the Botanical Tier */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Real Botanical Hero Image with Lens Flare / Amber Hue */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/30 shadow-2xl bg-obsidian-600 group">
              <Image
                src={currentTier.heroImage}
                alt={currentTier.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-85" />

              {/* Tier Pill */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-obsidian-900/85 border border-gold/30 text-[10px] uppercase tracking-widest text-gold font-sans backdrop-blur-md flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-gold" />
                <span>Harvested Extract • {currentTier.name}</span>
              </div>

              {/* Longevity Badge */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end text-xs">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gold font-sans">Evolution Period</div>
                  <div className="font-serif text-lg text-white font-bold">{currentTier.duration}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-champagne/60 font-sans">Scent Sillage</div>
                  <div className="font-serif text-sm text-gold font-medium">{currentTier.projection}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-3xl text-white">
                {currentTier.name}
              </h3>
              <p className="text-xs uppercase tracking-widest text-champagne/60 font-sans">
                {currentTier.subtext}
              </p>
            </div>

            <p className="text-sm text-champagne/80 leading-relaxed font-sans">
              {currentTier.description}
            </p>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gold/15">
              <div className="p-3.5 rounded-xl bg-obsidian-300/40 border border-gold/10">
                <div className="text-[10px] uppercase tracking-widest text-champagne/50">Essence Concentration</div>
                <div className="font-serif text-xl text-gold mt-1">{currentTier.sillage}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-obsidian-300/40 border border-gold/10">
                <div className="text-[10px] uppercase tracking-widest text-champagne/50">Pyramid Longevity</div>
                <div className="font-serif text-base text-champagne mt-1.5">{currentTier.duration}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Real Botanical Extract Photo Cards */}
          <div className="lg:col-span-6 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-champagne/60 font-sans flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold" />
              <span>Real Harvested Extracts in this tier:</span>
            </h4>

            <div className="space-y-4">
              {currentTier.ingredients.map((ing, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-obsidian-300/70 border border-gold/20 hover:border-gold/50 transition-all duration-300 group flex items-center gap-4 shadow-lg"
                >
                  {/* Real Macro Botanical Image */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-gold/30 shrink-0 bg-obsidian-600">
                    <Image
                      src={ing.image}
                      alt={ing.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-serif text-base text-white group-hover:text-gold transition-colors truncate">
                        {ing.name}
                      </h5>
                      <span className="text-[10px] uppercase tracking-wider text-gold/80 font-sans shrink-0 ml-2">
                        {ing.origin}
                      </span>
                    </div>

                    <p className="text-xs text-champagne/70 mt-1 line-clamp-2 leading-relaxed">
                      {ing.profile}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Artisanal distillation note */}
            <div className="p-4 rounded-xl bg-obsidian-300/30 border border-gold/15 text-xs text-champagne/70 flex items-center gap-3 mt-4">
              <Compass className="w-5 h-5 text-gold shrink-0" />
              <span>
                Each raw ingredient is hand-inspected in copper alambics to extract pure essential volatile compounds without synthetic fillers.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
