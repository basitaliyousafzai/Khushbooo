'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, ShoppingBag, Star, Sparkles, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ProductQuickViewModal } from './ProductQuickViewModal';

interface AlternatingProductMarqueeProps {
  products: Product[];
}

export function AlternatingProductMarquee({ products }: AlternatingProductMarqueeProps) {
  const { buyNow, addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Divide products into three sets (Row 1: Pure Attars, Row 2: Haute Extraits, Row 3: Signature Bestsellers)
  const perfumes = products.filter((p) => p.category_type === 'perfume');
  const attars = products.filter((p) => p.category_type === 'attar');
  const allProds = products.length > 0 ? products : [];

  const row1Prods = attars.length > 0 ? attars : allProds;
  const row2Prods = perfumes.length > 0 ? perfumes : allProds;
  const row3Prods = allProds.length > 0 ? allProds : row1Prods;

  // Duplicate for a continuous, seamless infinite loop
  const duplicate = (arr: Product[]) => {
    if (arr.length === 0) return [];
    let out = [...arr];
    while (out.length < 6) {
      out = [...out, ...arr];
    }
    return [...out, ...out];
  };

  const row1Items = duplicate(row1Prods);
  const row2Items = duplicate(row2Prods);
  const row3Items = duplicate(row3Prods);

  const renderProductCard = (product: Product, index: number) => {
    const thumbnail =
      product.images?.find((img) => img.is_thumbnail)?.image_url ||
      product.images?.[0]?.image_url ||
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80';

    const isSoldOut = product.stock_quantity <= 0;
    const isWished = wishlist[product.id];
    const isAttar = product.category_type === 'attar';

    return (
      <div
        key={`${product.id}-${index}`}
        onClick={() => setSelectedProduct(product)}
        className="w-[155px] sm:w-[195px] md:w-[240px] lg:w-[270px] shrink-0 rounded-2xl bg-obsidian-300/90 border border-gold/20 hover:border-gold/60 transition-all duration-300 p-2.5 sm:p-3.5 md:p-4 flex flex-col justify-between group/card select-none shadow-xl hover:shadow-2xl hover:shadow-gold/10 hover:-translate-y-1.5 cursor-pointer"
      >
        {/* Top Badges & Wishlist */}
        <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-obsidian-500 mb-2 sm:mb-3">
          <Image
            src={thumbnail}
            alt={product.title}
            fill
            className="object-cover object-center group-hover/card:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 160px, (max-width: 1024px) 240px, 280px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-600 via-transparent to-transparent opacity-60" />

          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {product.is_featured && (
              <span className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-serif uppercase tracking-widest bg-gold text-obsidian font-bold shadow-md shadow-gold/20">
                Exclusive
              </span>
            )}
            <span
              className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-sans uppercase tracking-wider backdrop-blur-md border ${
                isAttar
                  ? 'bg-amber-950/80 border-amber-500/40 text-amber-200'
                  : 'bg-obsidian-900/80 border-gold/30 text-champagne'
              }`}
            >
              {isAttar ? 'Attar' : 'Extrait'}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => toggleWishlist(product.id, e)}
            className="absolute top-2 right-2 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-obsidian-600/80 backdrop-blur-md border border-gold/25 flex items-center justify-center text-champagne hover:text-gold transition-colors"
            title="Save to Wishlist"
          >
            <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isWished ? 'fill-gold text-gold' : ''}`} />
          </button>

          {/* Hover Quick Actions Overlay Bar (Same as reference site) */}
          <div className="hidden sm:flex absolute inset-x-2.5 bottom-2.5 z-10 gap-1.5 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-y-2 group-hover/card:translate-y-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProduct(product);
              }}
              className="flex-1 py-1.5 px-2 rounded-xl bg-obsidian-200/90 hover:bg-obsidian-100 text-champagne text-[10px] uppercase tracking-wider border border-gold/30 hover:border-gold transition-all flex items-center justify-center gap-1 backdrop-blur-md font-sans"
            >
              <Eye className="w-3 h-3 text-gold" />
              <span>Quick View</span>
            </button>

            <button
              type="button"
              disabled={isSoldOut}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1 backdrop-blur-md font-sans ${
                isSoldOut
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-gold hover:bg-gold-300 text-obsidian shadow-md shadow-gold/20'
              }`}
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1 sm:space-y-1.5">
          <div className="hidden sm:flex items-center gap-1 text-gold text-[10px]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-gold text-gold" />
            ))}
            <span className="text-champagne/40 text-[9px] font-sans ml-1">(5.0)</span>
          </div>

          <h3 className="font-serif text-xs sm:text-sm md:text-base text-white font-medium group-hover/card:text-gold transition-colors truncate">
            {product.title}
          </h3>

          <div className="flex items-center justify-between pt-1 border-t border-gold/10">
            <div className="min-w-0">
              <div className="font-serif text-gold font-bold text-xs sm:text-sm md:text-base truncate">
                Rs. {(product.discount_price || product.price).toLocaleString()}
              </div>
              <div className="text-[9px] sm:text-[10px] text-champagne/50 uppercase tracking-wider font-sans truncate">
                {product.volume || (isAttar ? '12ml Tola' : '100ml')}
              </div>
            </div>

            {/* Mobile-Friendly Instant Add Button */}
            <button
              type="button"
              disabled={isSoldOut}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className={`p-1.5 sm:p-2 rounded-full border transition-all ${
                isSoldOut
                  ? 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                  : 'border-gold/30 hover:border-gold text-champagne hover:text-gold bg-obsidian-400/80 hover:bg-gold/20'
              }`}
              title={isSoldOut ? 'Sold out' : 'Add to Bag'}
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-obsidian-600 border-b border-gold/15 relative overflow-hidden w-full max-w-full min-w-0">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10 text-center space-y-1.5 sm:space-y-2">
        <span className="text-gold text-[10px] sm:text-xs tracking-[0.25em] uppercase font-sans">
          &mdash; Curated Runway Showcase &mdash;
        </span>
        <h2 className="font-serif text-xl sm:text-3xl md:text-4xl text-white tracking-tight">
          Trending & Exclusive Collections
        </h2>
        <p className="text-[11px] sm:text-sm text-champagne/65 font-sans max-w-xl mx-auto">
          Explore artisanal extraits and uncut pure attars. Tap any piece to view in 3D or add instantly to your bag.
        </p>
      </div>

      {/* 3 Animated Alternating Scrolling Marquee Rows (RTL -> LTR -> RTL) */}
      <div className="space-y-3 sm:space-y-5 w-full max-w-full overflow-hidden">
        
        {/* ROW 1: Right to Left (Pure Concentrated Attars) */}
        <div className="marquee-container">
          <div className="animate-marquee-rtl flex gap-2.5 sm:gap-4 md:gap-6">
            {row1Items.map((prod, idx) => renderProductCard(prod, idx))}
          </div>
        </div>

        {/* ROW 2: Left to Right (Haute Parfumerie Extraits) */}
        <div className="marquee-container">
          <div className="animate-marquee-ltr flex gap-2.5 sm:gap-4 md:gap-6">
            {row2Items.map((prod, idx) => renderProductCard(prod, idx))}
          </div>
        </div>

        {/* ROW 3: Right to Left (Signature Highlights) */}
        <div className="marquee-container">
          <div className="animate-marquee-rtl flex gap-2.5 sm:gap-4 md:gap-6">
            {row3Items.map((prod, idx) => renderProductCard(prod, idx))}
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
