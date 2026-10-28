'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Truck, Sparkles, Flame, CheckCircle, ShieldAlert, Waves } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ProductQuickViewModal } from './ProductQuickViewModal';

interface AlternatingProductMarqueeProps {
  products: Product[];
}

export function AlternatingProductMarquee({ products }: AlternatingProductMarqueeProps) {
  const { buyNow, addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Divide products into two rich sets for alternating scroll directions
  const mid = Math.ceil(products.length / 2);
  const row1Products = products.slice(0, mid);
  const row2Products = products.slice(mid);

  // Repeat for continuous infinite scrolling
  const row1Items = [...row1Products, ...row1Products, ...row1Products];
  const row2Items = [...row2Products, ...row2Products, ...row2Products];

  const renderProductCard = (product: Product, index: number) => {
    const thumbnail = product.images?.find((img) => img.is_thumbnail)?.image_url ||
      product.images?.[0]?.image_url ||
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80';

    const isSoldOut = product.stock_quantity <= 0;
    const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

    return (
      <div
        key={`${product.id}-${index}`}
        className="w-[300px] sm:w-[340px] shrink-0 rounded-2xl bg-obsidian-400/80 border border-gold/20 hover:border-gold/50 transition-all duration-300 overflow-hidden shadow-xl flex flex-col justify-between group/card select-none"
      >
        {/* Image & Badges */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-obsidian-500">
          <Image
            src={thumbnail}
            alt={product.title}
            fill
            className="object-cover object-center group-hover/card:scale-105 transition-transform duration-700"
            sizes="340px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-500 via-transparent to-transparent opacity-80" />

          {/* Stock Badge */}
          <div className="absolute top-3 left-3 z-10">
            {isSoldOut ? (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-serif uppercase tracking-widest bg-red-950/85 border border-red-500/40 text-red-300 backdrop-blur-md">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-serif uppercase tracking-widest bg-amber-950/85 border border-amber-500/50 text-amber-300 backdrop-blur-md animate-pulse">
                <Flame className="w-2.5 h-2.5 text-amber-400" />
                Only {product.stock_quantity} left
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-serif uppercase tracking-widest bg-emerald-950/85 border border-emerald-500/40 text-emerald-300 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                In Stock
              </span>
            )}
          </div>

          {/* 3D Flacon Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-sans bg-obsidian-900/85 border border-gold/40 text-gold backdrop-blur-md">
              <Waves className="w-2.5 h-2.5" />
              <span>3D View</span>
            </span>
          </div>

          {/* Hover Overlay Action Bar */}
          <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setSelectedProduct(product)}
              className="flex-1 py-2 px-3 rounded-xl bg-obsidian-200/90 hover:bg-obsidian-100 text-champagne text-[11px] uppercase tracking-wider border border-gold/30 hover:border-gold transition-all flex items-center justify-center gap-1.5 backdrop-blur-md"
            >
              <Eye className="w-3.5 h-3.5 text-gold" />
              <span>3D Inspect</span>
            </button>

            <button
              disabled={isSoldOut}
              onClick={() => buyNow(product)}
              className={`flex-1 py-2 px-3 rounded-xl text-[11px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 backdrop-blur-md ${
                isSoldOut
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-gold hover:bg-gold-300 text-obsidian shadow-md shadow-gold/25'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Instant COD</span>
            </button>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="text-[10px] text-gold uppercase tracking-widest font-sans">
              Extrait De Parfum • 100ml
            </div>
            <h4 className="font-serif text-lg text-white font-medium group-hover/card:text-gold transition-colors truncate">
              {product.title}
            </h4>
            <p className="text-[11px] text-champagne/70 line-clamp-1 font-sans mt-0.5">
              {product.short_description || product.top_notes?.join(' • ')}
            </p>
          </div>

          <div className="pt-2 border-t border-gold/15 flex items-center justify-between">
            <div>
              <span className="font-serif text-gold font-bold text-base">
                Rs. {(product.discount_price || product.price).toLocaleString()}
              </span>
              {product.discount_price && (
                <span className="ml-2 text-[10px] text-champagne/40 line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedProduct(product)}
              className="text-[11px] uppercase tracking-wider text-gold hover:underline flex items-center gap-1"
            >
              <span>Explore</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 bg-obsidian-600 relative border-b border-gold/15 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-400 border border-gold/30 text-champagne text-xs tracking-[0.2em] uppercase font-sans">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Interactive Flacon Stream</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight">
          The Haute Parfumerie Carousel
        </h2>

        <p className="text-xs sm:text-sm text-champagne/70 font-sans max-w-xl mx-auto">
          Hover over any flacon to pause rotation, inspect in real-time 3D, and place a seamless Cash on Delivery order.
        </p>
      </div>

      {/* Alternating Scrolling Showcase */}
      <div className="space-y-6">
        
        {/* ROW 1: Right to Left Scrolling */}
        <div className="relative w-full overflow-hidden group">
          <div className="flex w-max space-x-6 animate-marquee group-hover:[animation-play-state:paused]">
            {row1Items.map((prod, idx) => renderProductCard(prod, idx))}
          </div>
        </div>

        {/* ROW 2: Left to Right Scrolling (In Reverse) */}
        <div className="relative w-full overflow-hidden group">
          <div className="flex w-max space-x-6 animate-marquee-reverse group-hover:[animation-play-state:paused]">
            {row2Items.map((prod, idx) => renderProductCard(prod, idx))}
          </div>
        </div>

      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
