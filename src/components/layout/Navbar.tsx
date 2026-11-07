'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Crown,
  Sparkles,
  Lock,
  ArrowRight,
  Droplets,
  Flame,
  Compass,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SiteContentMap } from '@/types';

interface NavbarProps {
  content: SiteContentMap;
}

export function Navbar({ content }: NavbarProps) {
  const { totalItems, setIsCartOpen } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const siteName = content.site_name || 'Khushbooo';
  const announcement =
    content.announcement_bar ||
    'Free Shipping on Orders Over Rs. 4,999 — Artisanal Perfumes & Pure Attars';

  return (
    <>
      {/* 1. Top Announcement Bar */}
      {announcement && (
        <div className="bg-[#171412] text-champagne/90 border-b border-gold/15 py-2 px-4 text-center text-xs tracking-widest font-sans uppercase">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span className="text-gold font-serif">&mdash;</span>
            <span>{announcement}</span>
            <span className="text-gold font-serif">&mdash;</span>
          </div>
        </div>
      )}

      {/* 2. Main Site Header (Template 09 Layout) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-obsidian-500/95 border-b border-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left: Clean "Categories" Sidebar Button */}
          <div className="flex-1 flex items-center">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-gold/30 hover:border-gold text-champagne hover:text-white bg-obsidian-400/80 hover:bg-obsidian-300 transition-all text-xs uppercase tracking-widest font-sans shadow-md"
              title="Browse Categories & Collections"
            >
              <Menu className="w-4 h-4 text-gold" />
              <span className="hidden sm:inline font-semibold">Categories</span>
            </button>
          </div>

          {/* Center: Crown Emblem + KHUSHBOOO Brand Logo */}
          <div className="flex-1 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2.5 text-decoration-none group"
            >
              <Crown className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-white uppercase group-hover:text-gold transition-colors">
                {siteName}
              </span>
            </Link>
          </div>

          {/* Right Action Icons: Search, Admin/Account, Wishlist, Cart */}
          <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
            {/* Search Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-10 h-10 rounded-full border border-gold/20 hover:border-gold text-champagne hover:text-gold bg-obsidian-400/60 flex items-center justify-center transition-all"
              title="Search fragrances and attars"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Admin / Account Portal */}
            <Link
              href="/admin"
              className="w-10 h-10 rounded-full border border-gold/20 hover:border-gold text-champagne hover:text-gold bg-obsidian-400/60 flex items-center justify-center transition-all"
              title="Admin Portal"
            >
              <Lock className="w-4 h-4" />
            </Link>

            {/* Wishlist Link */}
            <a
              href="#collection"
              className="relative w-10 h-10 rounded-full border border-gold/20 hover:border-gold text-champagne hover:text-gold bg-obsidian-400/60 flex items-center justify-center transition-all"
              title="My Wishlist"
            >
              <Heart className="w-4 h-4" />
            </a>

            {/* Cart / Shopping Bag Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 rounded-full border border-gold/30 hover:border-gold text-champagne hover:text-gold bg-obsidian-400/90 flex items-center justify-center transition-all shadow-md group"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-obsidian font-bold text-[10px] flex items-center justify-center shadow-lg shadow-gold/20 animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Dropdown Live Search Bar (Expandable) */}
        {isSearchOpen && (
          <div className="border-t border-gold/15 bg-obsidian-400/95 py-3 px-4 sm:px-8 transition-all">
            <div className="max-w-3xl mx-auto flex items-center gap-3 bg-obsidian-600 rounded-full border border-gold/40 px-4 py-2">
              <Search className="w-4 h-4 text-gold shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search French extraits, pure aged Cambodian oud, Kasturi musk..."
                className="w-full bg-transparent text-sm text-white placeholder-champagne/40 focus:outline-none font-sans"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-champagne/60 hover:text-gold font-sans uppercase"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-champagne/60 hover:text-gold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. Slide-In Categories & Collections Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-obsidian border-r border-gold/20 p-6 flex flex-col justify-between z-10 shadow-2xl">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gold/15">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-gold" />
                  <span className="font-serif text-lg font-bold text-white tracking-widest uppercase">
                    Categories
                  </span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-full text-champagne/70 hover:text-gold hover:bg-obsidian-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Category Links */}
              <nav className="space-y-2">
                <a
                  href="#collection"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-obsidian-400 text-sm font-serif tracking-wider text-white hover:text-gold transition-colors"
                >
                  <span>All Masterpieces</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </a>

                <a
                  href="#collection"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-obsidian-400 text-sm font-serif tracking-wider text-white hover:text-gold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>Haute Parfumerie (Extraits 35%)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </a>

                <a
                  href="#collection"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-obsidian-400 text-sm font-serif tracking-wider text-white hover:text-gold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Droplets className="w-4 h-4 text-amber-400" />
                    <span>Pure Concentrated Attars (Ittars)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </a>

                <a
                  href="#notes-explorer"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-obsidian-400 text-sm font-serif tracking-wider text-white hover:text-gold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-gold" />
                    <span>Olfactory Notes Explorer</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </a>

                <a
                  href="#heritage"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-obsidian-400 text-sm font-serif tracking-wider text-white hover:text-gold transition-colors"
                >
                  <span>Our Heritage & Atelier</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </a>
              </nav>
            </div>

            {/* Drawer Footer info */}
            <div className="pt-6 border-t border-gold/15 space-y-3">
              <Link
                href="/admin"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-obsidian-400 border border-gold/30 hover:border-gold text-champagne text-xs font-serif uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-gold" />
                <span>Admin Studio Portal</span>
              </Link>
              <p className="text-[11px] text-champagne/40 text-center font-sans">
                Khushbooo Haute Parfumerie & Pure Attars
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
