'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Crown,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  ArrowRight,
  Loader2,
  MapPin,
  Phone,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { trackOrder, formatOrderTrackingId } from '@/lib/data/orders';

// Status step configuration for the visual timeline
const ORDER_STATUSES = ['Pending', 'Confirmed', 'Dispatched', 'Delivered'] as const;

function getStatusIndex(status: string): number {
  const idx = ORDER_STATUSES.indexOf(status as any);
  return idx >= 0 ? idx : 0;
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'Pending':
      return Clock;
    case 'Confirmed':
      return ShieldCheck;
    case 'Dispatched':
      return Truck;
    case 'Delivered':
      return CheckCircle2;
    case 'Cancelled':
      return XCircle;
    default:
      return Package;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Pending':
      return 'text-amber-400 border-amber-500/40 bg-amber-950/60';
    case 'Confirmed':
      return 'text-blue-400 border-blue-500/40 bg-blue-950/60';
    case 'Dispatched':
      return 'text-purple-400 border-purple-500/40 bg-purple-950/60';
    case 'Delivered':
      return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60';
    case 'Cancelled':
      return 'text-red-400 border-red-500/40 bg-red-950/60';
    default:
      return 'text-champagne border-gold/30 bg-obsidian-400';
  }
}

export default function TrackOrderPage() {
  const [orderNumInput, setOrderNumInput] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTrackedOrder(null);

    // Parse order number (accept KHB-XXXX format or plain number)
    const cleanedNum = orderNumInput.replace(/[^0-9]/g, '');
    const orderNum = parseInt(cleanedNum, 10);

    if (!orderNum || isNaN(orderNum)) {
      setError('Please enter a valid order number (e.g. KHB-0042 or 42).');
      return;
    }

    if (phoneLast4.length < 4) {
      setError('Please enter the last 4 digits of your phone number.');
      return;
    }

    setLoading(true);

    try {
      const result = await trackOrder(orderNum, phoneLast4.slice(-4));

      if (result.found && result.order) {
        setTrackedOrder(result.order);
      } else {
        setError(result.error || 'Order not found. Please double-check your details.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStatusIdx = trackedOrder ? getStatusIndex(trackedOrder.status) : 0;
  const isCancelled = trackedOrder?.status === 'Cancelled';

  return (
    <div className="min-h-screen bg-obsidian flex flex-col">
      {/* Minimal Header */}
      <header className="w-full border-b border-gold/15 bg-obsidian-500/95 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-decoration-none group"
          >
            <Crown className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
            <span className="font-serif text-lg font-bold tracking-[0.15em] text-white uppercase group-hover:text-gold transition-colors">
              Khushbooo
            </span>
          </Link>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-champagne/60 font-sans">
            Order Tracking
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center pt-8 sm:pt-16 pb-16 px-4 sm:px-6">
        <div className="w-full max-w-xl space-y-8">

          {/* Page Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-300/80 border border-gold/30 text-champagne text-[10px] sm:text-xs tracking-[0.2em] uppercase font-sans">
              <Package className="w-3.5 h-3.5 text-gold" />
              <span>Live Order Tracking</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-white tracking-tight">
              Track Your Order
            </h1>
            <p className="text-xs sm:text-sm text-champagne/65 font-sans max-w-md mx-auto">
              Enter your order number and the last 4 digits of your phone number to check your delivery status.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs uppercase tracking-wider text-champagne/70 font-sans">
                  Order Number <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KHB-0042 or 42"
                  value={orderNumInput}
                  onChange={(e) => setOrderNumInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-400 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm font-serif tracking-wider placeholder:text-champagne/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs uppercase tracking-wider text-champagne/70 font-sans">
                  Last 4 Digits of Phone <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="e.g. 4567"
                  value={phoneLast4}
                  onChange={(e) => setPhoneLast4(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-400 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm font-mono tracking-[0.3em] placeholder:text-champagne/30 placeholder:tracking-normal placeholder:font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/25 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Looking Up Order...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track My Order</span>
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs sm:text-sm font-sans text-center">
              {error}
            </div>
          )}

          {/* ============= ORDER TRACKING RESULT ============= */}
          {trackedOrder && (
            <div className="space-y-6 animate-fadeIn">

              {/* Order Header Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-obsidian-400/80 border border-gold/25 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-champagne/50 font-sans block">
                      Order Reference
                    </span>
                    <span className="font-serif text-xl sm:text-2xl text-gold font-bold tracking-wider">
                      {trackedOrder.tracking_id}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs uppercase tracking-widest font-serif font-bold border ${getStatusColor(
                      trackedOrder.status
                    )}`}
                  >
                    {React.createElement(getStatusIcon(trackedOrder.status), {
                      className: 'w-3.5 h-3.5',
                    })}
                    <span>{trackedOrder.status}</span>
                  </span>
                </div>

                {/* Customer & Delivery Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gold/15 text-xs font-sans">
                  <div className="flex items-center gap-2 text-champagne/70">
                    <Package className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>
                      Ordered by <span className="text-white font-medium">{trackedOrder.customer_name}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-champagne/70">
                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>
                      Delivery to <span className="text-white font-medium">{trackedOrder.city}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-champagne/70">
                    <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>
                      Placed on{' '}
                      <span className="text-white font-medium">
                        {new Date(trackedOrder.created_at).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-champagne/70">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>
                      COD Amount:{' '}
                      <span className="text-gold font-serif font-bold">
                        Rs. {trackedOrder.total_amount.toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Courier Info (if dispatched) */}
                {trackedOrder.courier_name && (
                  <div className="p-3 rounded-xl bg-obsidian-500/80 border border-purple-500/20 flex items-center gap-3 text-xs font-sans">
                    <Truck className="w-5 h-5 text-purple-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-champagne/70">
                        Courier: <span className="text-white font-medium">{trackedOrder.courier_name}</span>
                      </div>
                      {trackedOrder.courier_tracking_id && (
                        <div className="text-champagne/70">
                          Tracking ID:{' '}
                          <span className="text-purple-300 font-mono font-medium">
                            {trackedOrder.courier_tracking_id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Status Timeline (Visual Progress) */}
              {!isCancelled && (
                <div className="p-5 sm:p-6 rounded-2xl bg-obsidian-400/50 border border-gold/15">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-champagne/60 font-sans mb-5">
                    Delivery Progress
                  </h3>
                  <div className="relative flex items-center justify-between">
                    {/* Progress bar track */}
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-obsidian-300 z-0" />
                    <div
                      className="absolute top-4 left-0 h-0.5 bg-gold z-10 transition-all duration-700"
                      style={{
                        width: `${(currentStatusIdx / (ORDER_STATUSES.length - 1)) * 100}%`,
                      }}
                    />

                    {ORDER_STATUSES.map((step, idx) => {
                      const isCompleted = idx <= currentStatusIdx;
                      const isCurrent = idx === currentStatusIdx;
                      const Icon = getStatusIcon(step);
                      return (
                        <div
                          key={step}
                          className="relative z-20 flex flex-col items-center gap-1.5"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                              isCurrent
                                ? 'border-gold bg-gold text-obsidian scale-110 shadow-lg shadow-gold/30'
                                : isCompleted
                                ? 'border-gold bg-gold/20 text-gold'
                                : 'border-obsidian-200 bg-obsidian-400 text-champagne/40'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span
                            className={`text-[9px] sm:text-[10px] uppercase tracking-wider font-sans text-center ${
                              isCurrent
                                ? 'text-gold font-bold'
                                : isCompleted
                                ? 'text-champagne/80'
                                : 'text-champagne/40'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cancelled Banner */}
              {isCancelled && (
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-center">
                  <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-red-300 font-sans">
                    This order has been cancelled. If you have questions, please contact our concierge.
                  </p>
                </div>
              )}

              {/* Order Items List */}
              {trackedOrder.items && trackedOrder.items.length > 0 && (
                <div className="p-5 sm:p-6 rounded-2xl bg-obsidian-400/50 border border-gold/15 space-y-3">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-champagne/60 font-sans">
                    Items in This Order
                  </h3>
                  <div className="space-y-2">
                    {trackedOrder.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm font-sans py-2 border-b border-gold/10 last:border-b-0"
                      >
                        <div className="text-champagne/80">
                          <span className="text-gold font-serif">{item.quantity}×</span>{' '}
                          {item.product_title}
                        </div>
                        <span className="text-white font-serif font-medium">
                          Rs. {(item.unit_price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to store */}
              <div className="text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-obsidian-300 border border-gold/30 hover:border-gold text-champagne hover:text-gold font-serif text-xs uppercase tracking-[0.2em] transition-all"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
