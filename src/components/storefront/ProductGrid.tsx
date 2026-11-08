'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Eye, ShoppingBag, Truck, Flame, ShieldAlert, Waves } from 'lucide-react';
import { Product, SiteContentMap } from '@/types';
import { useCart } from '@/context/CartContext';
import { ProductQuickViewModal } from './ProductQuickViewModal';

interface ProductGridProps {
  products: Product[];
  content: SiteContentMap;
}

export function ProductGrid({ products, content }: ProductGridProps) {
  const { addToCart, buyNow } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const title = content.catalogue_title || 'Curated Perfumes & Pure Attars';
  const subtitle = content.catalogue_subtitle || 'Each piece is hand-numbered and sealed with our signature wax insignia.';

  // Category label formatter
  const formatCategoryLabel = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'perfume':
        return 'Artisanal Perfumes';
      case 'attar':
        return 'Pure Concentrated Attars';
      case 'oud':
        return 'Rare Aged Oud';
      case 'bakhoor':
        return 'Luxury Bakhoor & Incense';
      case 'gift_set':
        return 'Discovery Gift Sets';
      case 'solid_perfume':
        return 'Solid Perfume Balms';
      case 'body_mist':
        return 'Body & Hair Mists';
      case 'home_scent':
        return 'Home Diffusers';
      default:
        return cat.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  // Derive dynamic filter tabs from products currently in catalogue
  const availableCategories = React.useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const cat = p.category_type || 'perfume';
      set.add(cat);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'all') return true;
    const cat = (p.category_type || 'perfume').toLowerCase();
    if (activeFilter.toLowerCase() === 'oud') {
      return cat === 'oud' || p.title.toLowerCase().includes('oud') || p.base_notes?.some((n) => n.toLowerCase().includes('oud'));
    }
    return cat === activeFilter.toLowerCase();
  });

  return (
    <section id="collection" className="py-12 sm:py-20 lg:py-24 bg-obsidian-600 relative border-b border-gold/15">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-obsidian-400 border border-gold/30 text-champagne text-[10px] sm:text-xs tracking-[0.2em] uppercase font-sans">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold" />
            <span>Khushbooo Atelier Collection</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            {title}
          </h2>

          <p className="text-xs sm:text-base text-champagne/70 font-sans leading-relaxed">
            {subtitle}
          </p>

          {/* Dynamic Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5 pt-2 sm:pt-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs uppercase tracking-wider font-sans transition-all border ${
                activeFilter === 'all'
                  ? 'bg-gold text-obsidian border-gold font-bold shadow-md shadow-gold/20'
                  : 'bg-obsidian-400/60 text-champagne/70 border-gold/20 hover:border-gold/40 hover:text-white'
              }`}
            >
              All Collections ({products.length})
            </button>

            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs uppercase tracking-wider font-sans transition-all border ${
                  activeFilter === cat
                    ? 'bg-gold text-obsidian border-gold font-bold shadow-md shadow-gold/20'
                    : 'bg-obsidian-400/60 text-champagne/70 border-gold/20 hover:border-gold/40 hover:text-white'
                }`}
              >
                {formatCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid: 2 Columns on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
          {filteredProducts.map((product) => {
            const isSoldOut = product.stock_quantity <= 0;
            const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
            const thumbnail = product.images?.find((img) => img.is_thumbnail)?.image_url ||
              product.images?.[0]?.image_url ||
              'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group relative rounded-xl sm:rounded-2xl bg-obsidian-400/60 border border-gold/15 hover:border-gold/40 transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-xl cursor-pointer hover:-translate-y-1"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-obsidian-500">
                  <Image
                    src={thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-500 via-transparent to-transparent opacity-80" />

                  {/* Real-time Stock Indicator Badge */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                    {isSoldOut ? (
                      <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-serif uppercase tracking-widest bg-red-950/80 border border-red-500/40 text-red-300 backdrop-blur-md">
                        Sold Out
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-serif uppercase tracking-widest bg-amber-950/80 border border-amber-500/50 text-amber-300 backdrop-blur-md animate-pulse">
                        <Flame className="w-2.5 h-2.5 text-amber-400" />
                        <span className="hidden sm:inline">Only</span> {product.stock_quantity} left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-serif uppercase tracking-widest bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="hidden sm:inline">In</span> Stock
                      </span>
                    )}
                  </div>

                  {/* 3D View Ready Badge */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] uppercase tracking-wider font-sans bg-obsidian-900/80 border border-gold/30 text-champagne backdrop-blur-md">
                      <Waves className="w-2.5 h-2.5 text-gold" />
                      <span>3D</span>
                    </span>
                  </div>

                  {/* Hover Quick Action Buttons (Desktop / Tablet) */}
                  <div className="hidden sm:flex absolute inset-x-3 bottom-3 z-10 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-obsidian-300/90 hover:bg-obsidian-200 text-champagne text-[11px] uppercase tracking-wider border border-gold/30 hover:border-gold transition-all flex items-center justify-center gap-1 backdrop-blur-md"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold" />
                      <span>3D View</span>
                    </button>
                    <button
                      disabled={isSoldOut}
                      onClick={(e) => {
                        e.stopPropagation();
                        buyNow(product);
                      }}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1 backdrop-blur-md ${
                        isSoldOut
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : 'bg-gold hover:bg-gold-300 text-obsidian shadow-md shadow-gold/20'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Buy COD</span>
                    </button>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-2.5 sm:p-5 space-y-2 sm:space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1 sm:space-y-1.5">
                    <div className="text-[9px] sm:text-[10px] text-gold uppercase tracking-widest font-sans font-medium truncate">
                      {product.volume || (product.category_type === 'attar' ? '12ml Attar Oil' : '100ml Extrait')}
                    </div>

                    <h3 className="font-serif text-xs sm:text-base lg:text-lg text-white group-hover:text-gold transition-colors truncate font-medium">
                      {product.title}
                    </h3>

                    <p className="hidden sm:block text-[11px] text-champagne/70 line-clamp-2 font-sans leading-relaxed">
                      {product.short_description || product.long_description}
                    </p>

                    {/* Scent Accord Tag Pills */}
                    {product.top_notes && product.top_notes.length > 0 && (
                      <div className="hidden md:flex flex-wrap gap-1 pt-1.5">
                        {product.top_notes.slice(0, 2).map((note, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-obsidian-300/60 border border-gold/15 text-[9px] text-champagne/80 font-sans uppercase tracking-wider"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pricing & Add to Bag Trigger */}
                  <div className="pt-2 sm:pt-3 border-t border-gold/15 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-serif text-xs sm:text-base text-gold font-bold truncate">
                        Rs. {(product.discount_price || product.price).toLocaleString()}
                      </div>
                      {product.discount_price && (
                        <div className="text-[9px] sm:text-[10px] text-champagne/40 line-through">
                          Rs. {product.price.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <button
                      disabled={isSoldOut}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className={`p-1.5 sm:p-2 rounded-full border transition-all ${
                        isSoldOut
                          ? 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                          : 'border-gold/30 hover:border-gold text-champagne hover:text-gold bg-obsidian-300/50 hover:bg-gold/10'
                      }`}
                      title={isSoldOut ? 'Sold out' : 'Add to Shopping Bag'}
                    >
                      <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Quick View 3D Modal */}
      <ProductQuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
