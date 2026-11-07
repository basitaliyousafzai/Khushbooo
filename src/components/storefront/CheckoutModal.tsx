'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, CheckCircle2, ShieldCheck, Truck, Sparkles, Printer, ArrowRight, Loader2, Package, Copy, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { placeOrder, formatOrderTrackingId } from '@/lib/data/orders';
import confetti from 'canvas-confetti';

export function CheckoutModal() {
  const { cart, subtotal, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCart();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedTrackId, setCopiedTrackId] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{
    order_id: string;
    order_number: number;
    total: number;
    customer_name: string;
    items: any[];
  } | null>(null);

  if (!isCheckoutOpen) return null;

  const freeShippingThreshold = 4999;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 250;
  const finalTotal = subtotal + shippingFee;

  const popularCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Faisalabad', 'Multan', 'Sialkot', 'Quetta'];

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setError('Please provide all mandatory delivery fields.');
      return;
    }

    if (cart.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customer_name: fullName.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim() || undefined,
        shipping_address: address.trim(),
        city: city.trim(),
        order_notes: orderNotes.trim() || undefined,
        total_amount: finalTotal,
        items: cart.map((item) => ({
          product_id: item.product.id,
          product_title: item.product.title,
          quantity: item.quantity,
          unit_price: item.product.discount_price || item.product.price,
        })),
      };

      const result = await placeOrder(orderPayload);

      if (!result.success) {
        throw new Error(result.error || 'Could not complete order.');
      }

      // Success! Fire celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F5ECCB', '#BF9927', '#FFFFFF'],
      });

      setPlacedOrder({
        order_id: result.order_id || 'ord-confirmed',
        order_number: result.order_number || Math.floor(1000 + Math.random() * 9000),
        total: finalTotal,
        customer_name: fullName.trim(),
        items: [...cart],
      });

      clearCart();
    } catch (err: any) {
      setError(err?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-obsidian-400 border border-gold/30 rounded-3xl shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsCheckoutOpen(false);
            setPlacedOrder(null);
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-obsidian-200/80 text-champagne hover:text-gold border border-gold/20 hover:border-gold transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= ORDER SUCCESS STATE ================= */}
        {placedOrder ? (() => {
          const trackingId = formatOrderTrackingId(placedOrder.order_number);
          const copyTrackingId = () => {
            navigator.clipboard.writeText(trackingId).catch(() => {});
            setCopiedTrackId(true);
            setTimeout(() => setCopiedTrackId(false), 2000);
          };

          return (
          <div className="text-center space-y-6 py-6 print:p-0">
            <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold flex items-center justify-center text-gold mx-auto shadow-lg shadow-gold/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-sans">
                Order Confirmed • Cash on Delivery
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white">
                Thank You, {placedOrder.customer_name}
              </h2>
              <p className="text-sm text-champagne/70 max-w-md mx-auto pt-1 font-sans">
                Your bespoke flacon is being hand-packaged. Your parcel will be dispatched via insured express courier.
              </p>
            </div>

            {/* Prominent Tracking ID Card */}
            <div className="p-5 rounded-2xl bg-obsidian-500/90 border-2 border-gold/40 max-w-sm mx-auto space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-champagne/50 font-sans">
                Your Tracking Number
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="font-serif text-2xl sm:text-3xl text-gold font-bold tracking-[0.1em]">
                  {trackingId}
                </span>
                <button
                  type="button"
                  onClick={copyTrackingId}
                  className="p-2 rounded-full bg-obsidian-400 border border-gold/30 hover:border-gold text-champagne hover:text-gold transition-all"
                  title="Copy tracking number"
                >
                  {copiedTrackId ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-champagne/50 font-sans">
                Save this number — use it anytime to check your delivery status
              </p>
              <Link
                href={`/track`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold/15 border border-gold/40 hover:bg-gold hover:text-obsidian text-gold font-serif text-xs uppercase tracking-[0.15em] transition-all"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Track My Order</span>
              </Link>
            </div>

            {/* Order Slip Card */}
            <div className="p-6 rounded-2xl bg-obsidian-500/80 border border-gold/25 text-left space-y-4 max-w-lg mx-auto">
              <div className="flex justify-between items-center pb-3 border-b border-gold/15">
                <span className="text-xs text-champagne/60 uppercase tracking-widest">Order Reference</span>
                <span className="font-serif text-lg text-gold font-bold">
                  {trackingId}
                </span>
              </div>

              <div className="space-y-2 text-xs font-sans">
                {placedOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-champagne/80">
                    <span>{item.quantity}x {item.product.title}</span>
                    <span className="text-white">
                      Rs. {((item.product.discount_price || item.product.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gold/15 flex justify-between font-serif text-base text-white">
                <span>Total Due on Delivery</span>
                <span className="text-gold font-bold">
                  Rs. {placedOrder.total.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-obsidian-400 text-[11px] text-champagne/70 flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold shrink-0" />
                <span>Our courier dispatch concierge will contact you via WhatsApp/SMS with your tracking link.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                onClick={handlePrintReceipt}
                className="px-6 py-3 rounded-full border border-gold/40 hover:border-gold text-champagne text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-gold" />
                <span>Print Order Slip</span>
              </button>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setPlacedOrder(null);
                }}
                className="px-6 py-3 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-widest"
              >
                Continue Exploring
              </button>
            </div>
          </div>
          );
        })() : (
          /* ================= CASH ON DELIVERY CHECKOUT FORM ================= */
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-gold font-sans">
                <Truck className="w-3.5 h-3.5" />
                <span>Cash on Delivery Concierge</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-white">
                Discreet Nationwide Delivery
              </h2>
              <p className="text-xs text-champagne/60 font-sans">
                Zero prepayment required. Inspect parcel seal upon arrival and pay cash to the courier.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-sans">
                {error}
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-champagne/80 font-sans">
                  Full Name <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zainab Al-Mansoor"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-champagne/80 font-sans">
                  Phone Number (For Courier Call) <span className="text-gold">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
                />
              </div>

              {/* Email (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-champagne/80 font-sans">
                  Email Address (For Dispatch Receipt)
                </label>
                <input
                  type="email"
                  placeholder="zainab@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
                />
              </div>

              {/* City */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-champagne/80 font-sans">
                  City <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karachi, Lahore, Islamabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
                />
                {/* Quick City suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {popularCities.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCity(c)}
                      className={`px-2 py-0.5 rounded text-[10px] tracking-wider transition-colors ${
                        city === c
                          ? 'bg-gold text-obsidian font-bold'
                          : 'bg-obsidian-300 text-champagne/60 hover:text-champagne'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complete Delivery Address */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-champagne/80 font-sans">
                  Complete Street Address <span className="text-gold">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House / Apartment number, Street name, Sector / Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm resize-none"
                />
              </div>

              {/* Order Notes */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-champagne/80 font-sans">
                  Special Instructions / Order Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gift wrapping requested, call before arriving, deliver after 2 PM"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
                />
              </div>

            </div>

            {/* Pricing Summary */}
            <div className="p-4 rounded-xl bg-obsidian-500/70 border border-gold/15 space-y-2 text-xs font-sans">
              <div className="flex justify-between text-champagne/70">
                <span>Bag Subtotal ({cart.length} items)</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-champagne/70">
                <span>Nationwide Courier Fee</span>
                <span>{shippingFee === 0 ? 'COMPLIMENTARY' : `Rs. ${shippingFee}`}</span>
              </div>
              <div className="flex justify-between font-serif text-base text-white pt-2 border-t border-gold/15">
                <span>Total Due Upon Delivery</span>
                <span className="text-gold font-bold">
                  Rs. {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/25 hover:scale-[1.01] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-obsidian" />
                  <span>Securing Your Flacon...</span>
                </>
              ) : (
                <>
                  <span>Confirm Cash on Delivery Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-champagne/60 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>100% Authentic Hand-Numbered Flacons • Sealed with Wax Insignia</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
