'use client';

import React from 'react';
import { X, Sparkles, Check, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { Product } from '@/types';
import { PerfumeCanvas } from '@/components/canvas/PerfumeCanvas';
import { useCart } from '@/context/CartContext';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const { addToCart, buyNow } = useCart();

  if (!product) return null;

  const isSoldOut = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const getLiquidColor = (slug: string) => {
    switch (slug) {
      case 'soleil-dore-flacon':
        return '#E8C15A';
      case 'nocturne-ebene':
        return '#7A4B1A';
      case 'rose-imperiale':
        return '#B84562';
      case 'santal-majestueux':
        return '#D4A257';
      case 'fleur-blanche-extrait':
        return '#E8E0CE';
      case 'cuir-imperial':
        return '#8A4526';
      case 'ambre-precieux':
        return '#B86A22';
      default:
        return '#D4AF37';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-obsidian-400 border border-gold/30 rounded-3xl shadow-2xl shadow-gold/10 p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-obsidian-200/80 text-champagne hover:text-gold border border-gold/20 hover:border-gold transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: 3D Flacon Preview */}
          <div className="lg:col-span-6 bg-obsidian-500/50 rounded-2xl border border-gold/15 p-2 flex items-center justify-center min-h-[380px]">
            <PerfumeCanvas
              modelUrl={product.model_3d_url}
              perfumeTitle={product.title}
              liquidColor={getLiquidColor(product.slug)}
              className="h-[380px] w-full"
            />
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="lg:col-span-6 space-y-5">
            {/* Real-time Stock Badge */}
            <div>
              {isSoldOut ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-serif uppercase tracking-widest bg-red-950/60 border border-red-500/30 text-red-400">
                  Sold Out
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif uppercase tracking-widest bg-amber-950/60 border border-amber-500/40 text-amber-300 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Only {product.stock_quantity} bottles left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif uppercase tracking-widest bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  In Stock • Ready to Dispatch
                </span>
              )}
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white">
                {product.title}
              </h3>
              <p className="text-xs text-gold uppercase tracking-[0.2em] font-sans mt-1">
                Extrait De Parfum • 100ml
              </p>
            </div>

            <p className="text-xs sm:text-sm text-champagne/75 leading-relaxed font-sans">
              {product.long_description || product.short_description}
            </p>

            {/* Olfactory Notes Breakdown */}
            <div className="space-y-2 pt-2 border-t border-gold/15 text-xs font-sans">
              {product.top_notes && product.top_notes.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-gold/70 uppercase tracking-wider min-w-[70px]">Top:</span>
                  <span className="text-champagne/90">{product.top_notes.join(', ')}</span>
                </div>
              )}
              {product.middle_notes && product.middle_notes.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-gold/70 uppercase tracking-wider min-w-[70px]">Heart:</span>
                  <span className="text-champagne/90">{product.middle_notes.join(', ')}</span>
                </div>
              )}
              {product.base_notes && product.base_notes.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-gold/70 uppercase tracking-wider min-w-[70px]">Base:</span>
                  <span className="text-champagne/90">{product.base_notes.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-serif text-2xl sm:text-3xl text-gold font-bold">
                Rs. {(product.discount_price || product.price).toLocaleString()}
              </span>
              {product.discount_price && (
                <span className="text-sm text-champagne/40 line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                disabled={isSoldOut}
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                className={`flex-1 py-3.5 px-6 rounded-full border text-xs uppercase tracking-widest font-serif transition-all flex items-center justify-center gap-2 ${
                  isSoldOut
                    ? 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                    : 'border-gold/40 hover:border-gold text-champagne hover:text-white bg-obsidian-300/60'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-gold" />
                <span>Add to Bag</span>
              </button>

              <button
                disabled={isSoldOut}
                onClick={() => {
                  buyNow(product);
                  onClose();
                }}
                className={`flex-1 py-3.5 px-6 rounded-full text-xs uppercase tracking-widest font-serif font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                  isSoldOut
                    ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed shadow-none'
                    : 'bg-gold hover:bg-gold-300 text-obsidian shadow-gold/20 hover:scale-[1.02]'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Instant COD Order</span>
              </button>
            </div>

            {/* Assurance footer */}
            <div className="pt-2 text-[11px] text-champagne/50 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Free returns if seal is intact • Cash on Delivery nationwide</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
