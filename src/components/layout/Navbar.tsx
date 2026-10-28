'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Sparkles, Menu, X, Compass, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SiteContentMap } from '@/types';

interface NavbarProps {
  content: SiteContentMap;
}

export function Navbar({ content }: NavbarProps) {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const siteName = content.site_name || 'Maison De Parfum';
  const announcement = content.announcement_bar || 'Complimentary nationwide white-glove delivery on orders above Rs. 4,999';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-obsidian/90 border-b border-gold/15">
      {/* 1. Dynamic Announcement Bar */}
      {announcement && (
        <div className="bg-gradient-to-r from-obsidian-300 via-obsidian-200 to-obsidian-300 border-b border-gold/10 py-1.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[11px] md:text-xs text-champagne tracking-widest uppercase font-sans">
            <Sparkles className="w-3 h-3 text-gold animate-pulse hidden sm:inline" />
            <span>{announcement}</span>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-champagne/80 hover:text-gold transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Brand Logo & Name (Dynamically loaded from Supabase: Khushbooo) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-gold/50 flex items-center justify-center bg-obsidian-400 group-hover:border-gold transition-all duration-300 shadow-md shadow-gold/10">
            <span className="font-serif text-gold font-bold text-lg tracking-widest">K</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-white uppercase group-hover:text-gold transition-colors font-bold">
              {siteName}
            </span>
            <span className="text-[9px] tracking-[0.35em] text-gold/80 uppercase font-sans">
              Perfumes & Pure Attars
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-champagne/80">
          <a href="#collection" className="hover:text-gold transition-colors py-1">
            Collection
          </a>
          <a href="#notes-explorer" className="hover:text-gold transition-colors py-1">
            Olfactory Notes
          </a>
          <a href="#heritage" className="hover:text-gold transition-colors py-1">
            Heritage
          </a>
          <a href="#contact" className="hover:text-gold transition-colors py-1">
            Concierge
          </a>
        </nav>

        {/* Right Actions: Admin Link & Cart Button */}
        <div className="flex items-center gap-4">
          {/* Admin Link */}
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/20 text-xs tracking-wider text-champagne/70 hover:text-gold hover:border-gold/50 transition-all bg-obsidian-300/40"
          >
            <Lock className="w-3 h-3 text-gold" />
            <span>Admin</span>
          </Link>

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-obsidian-300/60 border border-gold/30 hover:border-gold text-champagne hover:text-gold transition-all duration-300 flex items-center justify-center group"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-obsidian font-bold text-[10px] flex items-center justify-center shadow-lg shadow-gold/20">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gold/15 bg-obsidian px-6 py-6 flex flex-col gap-5 text-sm uppercase tracking-widest text-champagne/90">
          <a
            href="#collection"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-gold py-1"
          >
            Collection
          </a>
          <a
            href="#notes-explorer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-gold py-1"
          >
            Olfactory Notes
          </a>
          <a
            href="#heritage"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-gold py-1"
          >
            Heritage
          </a>
          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="hover:text-gold py-1"
          >
            Concierge
          </a>
          <Link
            href="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gold py-1"
          >
            <Lock className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>
        </div>
      )}
    </header>
  );
}
