'use client';

import React from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 4999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-obsidian-900/80 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Slide-over panel */}
      <div className="w-full max-w-md bg-obsidian-500 border-l border-gold/20 flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gold/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-gold" />
            <h3 className="font-serif text-lg text-white uppercase tracking-wider">
              Shopping Bag ({cart.length})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-obsidian-400 text-champagne/70 hover:text-gold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 bg-obsidian-400/50 border-b border-gold/10 text-xs text-champagne/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-gold" />
              <span>{isFreeShipping ? 'Complimentary delivery unlocked' : `Add Rs. ${amountNeededForFreeShipping.toLocaleString()} for Free Delivery`}</span>
            </span>
            <span className="text-gold font-serif">{isFreeShipping ? '100%' : `${Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%`}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-obsidian-300 overflow-hidden">
            <div
              className="h-full bg-gold transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-obsidian-400 border border-gold/20 flex items-center justify-center text-gold">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-lg text-white">Your bag is empty</p>
                <p className="text-xs text-champagne/60 max-w-xs">
                  Discover our artisanal flacons formulated at extrait concentration.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-full bg-gold/10 border border-gold/30 hover:border-gold text-gold text-xs uppercase tracking-widest transition-all"
              >
                Browse Fragrances
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const price = item.product.discount_price || item.product.price;
              const thumbnail = item.product.images?.find((img) => img.is_thumbnail)?.image_url ||
                item.product.images?.[0]?.image_url ||
                'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-xl bg-obsidian-400/40 border border-gold/15 flex gap-4 items-center"
                >
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-obsidian-600 shrink-0 border border-gold/10">
                    <Image
                      src={thumbnail}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm text-white truncate">
                      {item.product.title}
                    </h4>
                    <p className="text-[11px] text-champagne/60 mt-0.5">
                      100ml Extrait
                    </p>
                    <div className="font-serif text-sm text-gold mt-1">
                      Rs. {price.toLocaleString()}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gold/25 rounded-md bg-obsidian-300">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:text-gold text-champagne/70 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs text-white font-sans font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:text-gold text-champagne/70 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-champagne/40 hover:text-red-400 transition-colors ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout Actions */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gold/15 bg-obsidian-400/30 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-champagne/70">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-champagne/70">
                <span>Nationwide Courier</span>
                <span>{isFreeShipping ? 'FREE' : 'Rs. 250'}</span>
              </div>
              <div className="flex justify-between font-serif text-base text-white pt-2 border-t border-gold/10">
                <span>Estimated Total</span>
                <span className="text-gold font-bold">
                  Rs. {(subtotal + (isFreeShipping ? 0 : 250)).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-4 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20 hover:scale-[1.01]"
            >
              <span>Proceed to Cash on Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-champagne/50 tracking-wider uppercase">
              No Advance Payment Required • Pay at Doorstep
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
