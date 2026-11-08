'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';

export interface ShippingConfig {
  baseFee: number;
  perItemFee: number;
  calculationMode: 'flat' | 'per_item' | 'incremental';
  freeShippingThreshold: number;
  freeShippingMinItems: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  finalTotal: number;
  shippingConfig: ShippingConfig;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  buyNow: (product: Product) => void;
  refreshShippingConfig: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [shippingConfig, setShippingConfig] = useState<ShippingConfig>({
    baseFee: 250,
    perItemFee: 0,
    calculationMode: 'flat',
    freeShippingThreshold: 4999,
    freeShippingMinItems: 0,
  });

  // Fetch dynamic delivery charges and threshold set by admin
  const refreshShippingConfig = async () => {
    try {
      const res = await fetch('/api/admin/content', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          const contentMap: Record<string, string> = {};
          data.items.forEach((item: any) => {
            contentMap[item.key] = item.value;
          });

          setShippingConfig({
            baseFee: Number(contentMap.shipping_fee) || 250,
            perItemFee: Number(contentMap.shipping_fee_per_item) || 0,
            calculationMode: (contentMap.shipping_calculation_mode as any) || 'flat',
            freeShippingThreshold: Number(contentMap.free_shipping_threshold) || 4999,
            freeShippingMinItems: Number(contentMap.free_shipping_min_items) || 0,
          });
        }
      }
    } catch (e) {
      // Use fallback defaults
    }
  };

  useEffect(() => {
    refreshShippingConfig();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('maison_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('maison_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not write cart to localStorage', e);
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const buyNow = (product: Product) => {
    // Add product if not present and open frictionless COD checkout immediately
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) return prev;
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.discount_price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Dynamic delivery calculation according to Admin settings
  const isQualifiedByThreshold = shippingConfig.freeShippingThreshold > 0 && subtotal >= shippingConfig.freeShippingThreshold;
  const isQualifiedByItems = shippingConfig.freeShippingMinItems > 0 && totalItems >= shippingConfig.freeShippingMinItems;
  const isFreeShipping = totalItems > 0 && (isQualifiedByThreshold || isQualifiedByItems);

  let deliveryFee = 0;
  if (totalItems > 0 && !isFreeShipping) {
    if (shippingConfig.calculationMode === 'per_item') {
      deliveryFee = shippingConfig.baseFee * totalItems;
    } else if (shippingConfig.calculationMode === 'incremental') {
      deliveryFee = shippingConfig.baseFee + Math.max(0, totalItems - 1) * shippingConfig.perItemFee;
    } else {
      deliveryFee = shippingConfig.baseFee;
    }
  }

  const finalTotal = subtotal + deliveryFee;
  const amountNeededForFreeShipping = Math.max(0, shippingConfig.freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        isFreeShipping,
        freeShippingThreshold: shippingConfig.freeShippingThreshold,
        amountNeededForFreeShipping,
        finalTotal,
        shippingConfig,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        buyNow,
        refreshShippingConfig,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
