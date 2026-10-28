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
  const [activeFilter, setActiveFilter] = useState<'All' | 'Perfumes' | 'Attars' | 'Oud'>('All');

  const title = content.catalogue_title || 'Curated Perfumes & Pure Attars';
  const subtitle = content.catalogue_subtitle || 'Each piece is hand-numbered and sealed with our signature wax insignia.';

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Perfumes') return p.category_type === 'perfume' || !p.category_type || p.volume?.includes('Spray');
    if (activeFilter === 'Attars') return p.category_type === 'attar' || p.volume?.includes('Tola') || p.title.toLowerCase().includes('oud') || p.title.toLowerCase().includes('musk') || p.title.toLowerCase().includes('attar');
    if (activeFilter === 'Oud') return p.title.toLowerCase().includes('oud') || p.base_notes.some((n) => n.toLowerCase().includes('oud'));
    return true;
  });

  return (
    <section id="collection" className="py-24 bg-obsidian-600 relative border-b border-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-400 border border-gold/30 text-champagne text-xs tracking-[0.2em] uppercase font-sans">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Khushbooo Atelier Collection</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-champagne/70 font-sans leading-relaxed">
            {subtitle}
          </p>

          {/* Olfactory Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 pt-4">
            {[
              { label: 'All Collections', value: 'All' },
              { label: 'Artisanal Perfumes (100ml)', value: 'Perfumes' },
              { label: 'Pure Concentrated Attars (12ml)', value: 'Attars' },
              { label: 'Rare Aged Oud', value: 'Oud' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value as any)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-sans transition-all border ${
                  activeFilter === tab.value
                    ? 'bg-gold text-obsidian border-gold font-bold shadow-md shadow-gold/20'
                    : 'bg-obsidian-400/60 text-champagne/70 border-gold/20 hover:border-gold/40 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isSoldOut = product.stock_quantity <= 0;
            const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
            const thumbnail = product.images?.find((img) => img.is_thumbnail)?.image_url ||
              product.images?.[0]?.image_url ||
              'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={product.id}
                className="group relative rounded-2xl bg-obsidian-400/60 border border-gold/15 hover:border-gold/40 transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-xl"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-obsidian-500">
                  <Image
                    src={thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-500 via-transparent to-transparent opacity-80" />

                  {/* Real-time Stock Indicator Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    {isSoldOut ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-serif uppercase tracking-widest bg-red-950/80 border border-red-500/40 text-red-300 backdrop-blur-md">
                        Sold Out
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-serif uppercase tracking-widest bg-amber-950/80 border border-amber-500/50 text-amber-300 backdrop-blur-md animate-pulse">
                        <Flame className="w-2.5 h-2.5 text-amber-400" />
                        Only {product.stock_quantity} left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-serif uppercase tracking-widest bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        In Stock
                      </span>
                    )}
                  </div>

                  {/* 3D View Ready Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-sans bg-obsidian-900/80 border border-gold/30 text-champagne backdrop-blur-md">
                      <Waves className="w-2.5 h-2.5 text-gold" />
                      <span>3D</span>
                    </span>
                  </div>

                  {/* Hover Quick Action Buttons */}
                  <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-obsidian-300/90 hover:bg-obsidian-200 text-champagne text-[11px] uppercase tracking-wider border border-gold/30 hover:border-gold transition-all flex items-center justify-center gap-1 backdrop-blur-md"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold" />
                      <span>3D View</span>
                    </button>
                    <button
                      disabled={isSoldOut}
                      onClick={() => buyNow(product)}
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
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-[10px] text-gold uppercase tracking-widest font-sans font-medium">
                      {product.volume || (product.category_type === 'attar' ? '12ml Pure Attar Oil' : '100ml Extrait Spray')}
                    </div>

                    <h3 className="font-serif text-lg text-white group-hover:text-gold transition-colors truncate">
                      {product.title}
                    </h3>

                    <p className="text-[11px] text-champagne/70 line-clamp-2 font-sans leading-relaxed">
                      {product.short_description || product.long_description}
                    </p>

                    {/* Scent Accord Tag Pills */}
                    {product.top_notes && product.top_notes.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1.5">
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
                  <div className="pt-3 border-t border-gold/15 flex items-center justify-between">
                    <div>
                      <div className="font-serif text-base text-gold font-bold">
                        Rs. {(product.discount_price || product.price).toLocaleString()}
                      </div>
                      {product.discount_price && (
                        <div className="text-[10px] text-champagne/40 line-through">
                          Rs. {product.price.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <button
                      disabled={isSoldOut}
                      onClick={() => addToCart(product)}
                      className={`p-2 rounded-full border transition-all ${
                        isSoldOut
                          ? 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                          : 'border-gold/30 hover:border-gold text-champagne hover:text-gold bg-obsidian-300/50 hover:bg-gold/10'
                      }`}
                      title={isSoldOut ? 'Sold out' : 'Add to Shopping Bag'}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
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
