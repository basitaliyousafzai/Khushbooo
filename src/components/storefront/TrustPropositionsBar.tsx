'use client';

import React from 'react';
import { Gem, Truck, ShieldCheck, Award } from 'lucide-react';

export function TrustPropositionsBar() {
  const items = [
    {
      icon: Gem,
      title: 'Haute Parfumerie & Attars',
      desc: '35% Extraits & 100% Uncut Pure Oils',
    },
    {
      icon: Truck,
      title: 'Free Nationwide Shipping',
      desc: 'Complimentary on Orders Over Rs. 4,999',
    },
    {
      icon: ShieldCheck,
      title: 'Cash On Delivery',
      desc: 'Hassle-Free Payment Across Pakistan',
    },
    {
      icon: Award,
      title: 'Wax-Sealed Atelier Flacons',
      desc: 'Hand-Numbered & Authenticated Batches',
    },
  ];

  return (
    <section className="bg-[#12100E] border-y border-gold/15 py-6 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gold/10">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-4 ${
                  idx > 0 ? 'pt-4 sm:pt-0 sm:pl-4 lg:pl-6' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0 text-gold shadow-md shadow-gold/5">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm text-white font-semibold tracking-wide">
                    {item.title}
                  </h4>
                  <p className="text-xs text-champagne/60 font-sans mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
