'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Grid, Package, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function MobileStickyDock() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-obsidian-500/95 backdrop-blur-xl border-t border-gold/20 py-2 px-4 shadow-2xl">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-champagne/70 hover:text-gold transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] uppercase font-sans tracking-wider">Home</span>
        </Link>

        <a
          href="#collection"
          className="flex flex-col items-center gap-1 text-champagne/70 hover:text-gold transition-colors"
        >
          <Grid className="w-4 h-4" />
          <span className="text-[10px] uppercase font-sans tracking-wider">Catalog</span>
        </a>

        <Link
          href="/track"
          className="flex flex-col items-center gap-1 text-champagne/70 hover:text-gold transition-colors"
        >
          <Package className="w-4 h-4" />
          <span className="text-[10px] uppercase font-sans tracking-wider">Track</span>
        </Link>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 text-champagne/70 hover:text-gold transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[10px] uppercase font-sans tracking-wider">Bag</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-gold text-obsidian font-bold text-[9px] flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
