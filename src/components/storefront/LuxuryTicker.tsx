import React from 'react';
import { Sparkles } from 'lucide-react';

export function LuxuryTicker() {
  const items = [
    'Artisanal Extrait De Parfum',
    '35% Pure Essence Concentration',
    'Aged Wild Cambodian Agarwood',
    'Dawn-Harvested Rose De Mai',
    'Tuscan Orris Butter',
    '12+ Hours Sillage Longevity',
    'Cash on Delivery Nationwide',
    'Hand-Numbered & Wax-Sealed Flacons',
  ];

  return (
    <div className="relative py-4 bg-obsidian-700 border-y border-gold/15 overflow-hidden select-none">
      <div className="flex w-max animate-marquee space-x-8">
        {[...items, ...items].map((text, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-champagne/80 font-sans"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse shrink-0" />
            <span className="whitespace-nowrap">{text}</span>
            <span className="text-gold/40">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
