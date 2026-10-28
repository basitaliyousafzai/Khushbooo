import React from 'react';
import Image from 'next/image';
import { Sparkles, Compass, Award, Shield } from 'lucide-react';
import { SiteContentMap } from '@/types';

interface HeritageSectionProps {
  content: SiteContentMap;
}

export function HeritageSection({ content }: HeritageSectionProps) {
  const title = content.about_title || 'The Haute Parfumerie Legacy';
  const story = content.about_story || 'Hand-poured extracts distilled from ethical botanicals across the world. Each flacon is an homage to timeless perfumery traditions, hand-finished with 24k gold leaf accents and matured over six months for peerless depth.';

  return (
    <section id="heritage" className="py-24 bg-obsidian relative border-b border-gold/15 overflow-hidden">
      {/* Ambient gold glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-gold/25 shadow-2xl bg-obsidian-400">
              <Image
                src="https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1000&q=80"
                alt="Artisanal perfume distillation"
                fill
                className="object-cover opacity-85"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
            </div>

            {/* Overlapping Floating Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 p-5 rounded-2xl bg-obsidian-300/90 border border-gold/40 shadow-2xl backdrop-blur-md max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold flex items-center justify-center text-gold shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm text-white">6-Month Maceration</h4>
                  <p className="text-[11px] text-champagne/70 mt-0.5">Matured in French oak barrels</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Heritage Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-300/80 border border-gold/30 text-champagne text-xs tracking-[0.2em] uppercase font-sans">
              <Compass className="w-3.5 h-3.5 text-gold" />
              <span>Artisanal Heritage</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              {title}
            </h2>

            <p className="text-base text-champagne/80 font-sans leading-relaxed">
              {story}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gold/15">
              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl text-gold">100%</div>
                <div className="text-xs uppercase tracking-widest text-champagne/60 font-sans">Ethically Sourced</div>
              </div>

              <div className="space-y-1">
                <div className="font-serif text-2xl sm:text-3xl text-gold">35%</div>
                <div className="text-xs uppercase tracking-widest text-champagne/60 font-sans">Extrait Concentration</div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-3 text-xs text-champagne/70 font-sans">
                <Shield className="w-4 h-4 text-gold shrink-0" />
                <span>Individually inspected and signed by the master perfumer.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
