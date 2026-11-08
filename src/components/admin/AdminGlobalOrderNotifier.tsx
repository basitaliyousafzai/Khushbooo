'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Sparkles, X, ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Order } from '@/types';
import { formatOrderTrackingId } from '@/lib/data/orders';

export function AdminGlobalOrderNotifier() {
  const router = useRouter();
  const [activeAlert, setActiveAlert] = useState<Order | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const initialLoadDone = useRef(false);
  const maxOrderNumberRef = useRef<number>(0);

  // Play luxury audio chime when new order arrives
  const playLuxuryChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Note 1 (D5 - 587.33 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Note 2 (A5 - 880.00 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.14);
      gain2.gain.setValueAtTime(0.3, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.14);
      osc2.stop(now + 0.85);

      // Note 3 (D6 - 1174.66 Hz)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(1174.66, now + 0.28);
      gain3.gain.setValueAtTime(0.35, now + 0.28);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.28);
      osc3.stop(now + 1.2);
    } catch (e) {
      // AudioContext policy non-fatal
    }
  };

  const pollOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (!res.ok) {
        setIsOnline(false);
        return;
      }
      setIsOnline(true);
      const data = await res.json();
      const orders: Order[] = data.orders || [];

      if (orders.length > 0) {
        setRecentOrders(orders.slice(0, 5));

        const highestNum = Math.max(...orders.map((o) => o.order_number || 0));

        if (!initialLoadDone.current) {
          initialLoadDone.current = true;
          maxOrderNumberRef.current = highestNum;
        } else if (highestNum > maxOrderNumberRef.current) {
          // Find the newest order
          const newest = orders.find((o) => o.order_number === highestNum) || orders[0];
          maxOrderNumberRef.current = highestNum;
          setActiveAlert(newest);
          setUnreadCount((prev) => prev + 1);
          playLuxuryChime();
        }
      }
    } catch (e) {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    pollOrders();
    const interval = setInterval(pollOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-dismiss alert after 10 seconds
  useEffect(() => {
    if (activeAlert) {
      const timer = setTimeout(() => {
        setActiveAlert(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [activeAlert]);

  const handleOpenOrder = (orderId: string) => {
    setActiveAlert(null);
    setIsDropdownOpen(false);
    router.push(`/admin/orders`);
  };

  return (
    <>
      {/* Top Bar Status & Notification Bell */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-gold/15">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-obsidian-500 border border-gold/20 text-xs font-sans">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-champagne/80 font-medium text-[11px] uppercase tracking-wider">
              {isOnline ? 'Live Order Stream Active' : 'Connecting to Stream...'}
            </span>
          </div>
          <span className="text-[11px] text-champagne/50 hidden sm:inline font-sans">
            Auto-polling every 4s
          </span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              if (!isDropdownOpen) setUnreadCount(0);
            }}
            className="relative p-2.5 rounded-xl bg-obsidian-500 border border-gold/20 hover:border-gold text-champagne hover:text-gold transition-all"
            title="Recent Orders Stream"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center animate-bounce shadow-lg shadow-red-500/40">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Recent Orders Dropdown Panel */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl bg-obsidian-500 border border-gold/30 shadow-2xl p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-gold/15">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold font-sans font-bold">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Recent Live Orders</span>
                </div>
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-champagne/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <p className="text-xs text-champagne/60 text-center py-4">No recent orders yet</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {recentOrders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => handleOpenOrder(ord.id)}
                      className="p-3 rounded-xl bg-obsidian-600/70 hover:bg-obsidian-400 border border-gold/10 hover:border-gold/30 transition-all cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-serif text-gold font-bold">
                          {formatOrderTrackingId(ord.order_number)}
                        </span>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-gold/10 border border-gold/25 text-champagne">
                          {ord.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-champagne/80 font-sans">
                        <span>{ord.customer_name} ({ord.city})</span>
                        <span className="text-white font-medium">Rs. {ord.total_amount?.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link
                href="/admin/orders"
                onClick={() => setIsDropdownOpen(false)}
                className="block text-center py-2 text-xs uppercase tracking-wider text-gold hover:text-gold-300 font-sans font-bold border-t border-gold/15 pt-3"
              >
                Go to Order Dispatch Desk →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Floating Instant Order Alert Toast */}
      {activeAlert && (
        <div className="fixed top-6 right-6 z-50 w-full max-w-md animate-slideDown shadow-2xl">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-obsidian-500 via-obsidian-400 to-obsidian-500 border-2 border-gold shadow-2xl shadow-gold/25 backdrop-blur-xl text-white space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold">
                  <Sparkles className="w-4 h-4 animate-spin text-gold" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-sans font-bold block">
                    🎉 New Order Placed Just Now!
                  </span>
                  <h4 className="font-serif text-base text-white font-bold">
                    {formatOrderTrackingId(activeAlert.order_number)}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setActiveAlert(null)}
                className="p-1 rounded-full hover:bg-obsidian-300 text-champagne/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-sans p-2.5 rounded-xl bg-obsidian-600/70 border border-gold/15">
              <div>
                <span className="text-champagne/50 block text-[10px] uppercase">Customer:</span>
                <span className="text-white font-medium truncate block">{activeAlert.customer_name}</span>
              </div>
              <div>
                <span className="text-champagne/50 block text-[10px] uppercase">City:</span>
                <span className="text-white font-medium">{activeAlert.city}</span>
              </div>
              <div>
                <span className="text-champagne/50 block text-[10px] uppercase">Amount:</span>
                <span className="text-gold font-bold">Rs. {activeAlert.total_amount?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-champagne/50 block text-[10px] uppercase">Items:</span>
                <span className="text-champagne/90">{activeAlert.items?.length || 1} Flacon(s)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => handleOpenOrder(activeAlert.id)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-gold/20"
              >
                <span>Open in Dispatch Desk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
