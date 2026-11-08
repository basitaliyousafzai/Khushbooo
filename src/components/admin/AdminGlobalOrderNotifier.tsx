'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Sparkles,
  X,
  ArrowRight,
  ShoppingBag,
  Check,
  CheckCheck,
  Clock,
  Eye,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Order } from '@/types';
import { formatOrderTrackingId } from '@/lib/data/orders';

export function AdminGlobalOrderNotifier() {
  const router = useRouter();
  const [activeAlert, setActiveAlert] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [readOrderIds, setReadOrderIds] = useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownTab, setDropdownTab] = useState<'all' | 'unread'>('all');
  const [isOnline, setIsOnline] = useState(true);

  const initialLoadDone = useRef(false);
  const maxOrderNumberRef = useRef<number>(0);

  // Initialize read order IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_read_order_ids');
      if (stored) {
        setReadOrderIds(new Set(JSON.parse(stored)));
      }
    } catch (e) {}

    // Listen to custom 'order-read' events triggered from order status changes
    const handleOrderReadEvent = (e: any) => {
      const orderId = e?.detail?.orderId;
      if (orderId) {
        setReadOrderIds((prev) => {
          const next = new Set(prev);
          next.add(orderId);
          try {
            localStorage.setItem('admin_read_order_ids', JSON.stringify(Array.from(next)));
          } catch (err) {}
          return next;
        });
      }
    };

    window.addEventListener('order-read', handleOrderReadEvent);
    return () => window.removeEventListener('order-read', handleOrderReadEvent);
  }, []);

  // Luxury audio chime when a new order arrives
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
    } catch (e) {}
  };

  // Poll orders
  const pollOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (!res.ok) {
        setIsOnline(false);
        return;
      }
      setIsOnline(true);
      const data = await res.json();
      const fetchedOrders: Order[] = data.orders || [];

      if (fetchedOrders.length > 0) {
        setOrders(fetchedOrders);

        const highestNum = Math.max(...fetchedOrders.map((o) => o.order_number || 0));

        if (!initialLoadDone.current) {
          initialLoadDone.current = true;
          maxOrderNumberRef.current = highestNum;
        } else if (highestNum > maxOrderNumberRef.current) {
          const newest = fetchedOrders.find((o) => o.order_number === highestNum) || fetchedOrders[0];
          maxOrderNumberRef.current = highestNum;
          setActiveAlert(newest);
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

  // Auto-dismiss alert toast after 10 seconds
  useEffect(() => {
    if (activeAlert) {
      const timer = setTimeout(() => {
        setActiveAlert(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [activeAlert]);

  // Check if an order is unread:
  // An order is unread ONLY IF:
  // 1. Its status is 'Pending' (if it has been Confirmed, Dispatched, Delivered, or Cancelled, it is no longer pending action)
  // 2. AND it hasn't been opened or marked as read
  const isOrderUnread = (order: Order) => {
    if (order.status !== 'Pending') return false;
    return !readOrderIds.has(order.id);
  };

  // Compute live unread orders count for the bell badge
  const unreadOrdersCount = useMemo(() => {
    return orders.filter(isOrderUnread).length;
  }, [orders, readOrderIds]);

  // Mark a single order as read
  const markAsRead = (orderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReadOrderIds((prev) => {
      const next = new Set(prev);
      next.add(orderId);
      try {
        localStorage.setItem('admin_read_order_ids', JSON.stringify(Array.from(next)));
      } catch (err) {}
      return next;
    });
  };

  // Mark all orders as read (Facebook-style)
  const markAllAsRead = () => {
    setReadOrderIds((prev) => {
      const next = new Set(prev);
      orders.forEach((o) => next.add(o.id));
      try {
        localStorage.setItem('admin_read_order_ids', JSON.stringify(Array.from(next)));
      } catch (err) {}
      return next;
    });
  };

  // Open order in dispatch desk
  const handleOpenOrder = (order: Order) => {
    markAsRead(order.id);
    setActiveAlert(null);
    setIsDropdownOpen(false);
    router.push(`/admin/orders`);
  };

  // Filtered list for the dropdown
  const displayedOrders = useMemo(() => {
    const slice = orders.slice(0, 10);
    if (dropdownTab === 'unread') {
      return slice.filter(isOrderUnread);
    }
    return slice;
  }, [orders, dropdownTab, readOrderIds]);

  // Format relative time (e.g. "2m ago", "1h ago")
  const formatTimeAgo = (dateStr: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Top Bar Status & Live Notification Bell */}
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

        {/* Facebook-style Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`relative p-2.5 rounded-xl border transition-all ${
              unreadOrdersCount > 0
                ? 'bg-gold/15 border-gold text-gold shadow-lg shadow-gold/20'
                : 'bg-obsidian-500 border-gold/20 hover:border-gold text-champagne hover:text-gold'
            }`}
            title="Order Notifications"
          >
            <Bell className={`w-4 h-4 ${unreadOrdersCount > 0 ? 'animate-wiggle' : ''}`} />
            
            {/* Live Facebook-style unread counter badge */}
            {unreadOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center animate-pulse shadow-lg shadow-red-600/50 border border-obsidian-900">
                {unreadOrdersCount > 9 ? '9+' : unreadOrdersCount}
              </span>
            )}
          </button>

          {/* Facebook-style Notification Dropdown Panel */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 z-50 w-84 sm:w-96 rounded-2xl bg-obsidian-500 border border-gold/30 shadow-2xl p-4 space-y-3 animate-fadeIn">
              
              {/* Dropdown Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gold/15">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm text-white font-bold tracking-wide">
                    Order Notifications
                  </span>
                  {unreadOrdersCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-gold text-obsidian">
                      {unreadOrdersCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadOrdersCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-gold hover:text-white flex items-center gap-1 transition-colors font-sans"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="p-1 rounded-full hover:bg-obsidian-400 text-champagne/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs: All vs Unread Only */}
              <div className="flex gap-2 text-[11px] font-sans">
                <button
                  onClick={() => setDropdownTab('all')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    dropdownTab === 'all'
                      ? 'bg-gold/20 text-gold font-bold border border-gold/30'
                      : 'text-champagne/60 hover:text-white'
                  }`}
                >
                  All ({orders.length})
                </button>
                <button
                  onClick={() => setDropdownTab('unread')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    dropdownTab === 'unread'
                      ? 'bg-gold/20 text-gold font-bold border border-gold/30'
                      : 'text-champagne/60 hover:text-white'
                  }`}
                >
                  Unread ({unreadOrdersCount})
                </button>
              </div>

              {/* Orders List */}
              {displayedOrders.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-champagne/30 mx-auto" />
                  <p className="text-xs text-champagne/60 font-sans">
                    {dropdownTab === 'unread' ? 'No unread notifications' : 'No recent orders found'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {displayedOrders.map((ord) => {
                    const unread = isOrderUnread(ord);

                    return (
                      <div
                        key={ord.id}
                        onClick={() => handleOpenOrder(ord)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                          unread
                            ? 'bg-obsidian-400 border-gold/40 shadow-sm shadow-gold/10 hover:border-gold'
                            : 'bg-obsidian-600/60 border-gold/10 hover:bg-obsidian-400/80 hover:border-gold/25'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          
                          <div className="flex items-center gap-2">
                            {/* Unread indicator dot */}
                            {unread ? (
                              <span className="w-2 h-2 rounded-full bg-gold shadow-md shadow-gold animate-pulse shrink-0" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-transparent shrink-0" />
                            )}
                            
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-serif text-xs text-gold font-bold">
                                  {formatOrderTrackingId(ord.order_number)}
                                </span>
                                <span className={`text-[9px] uppercase px-2 py-0.2 rounded-full font-sans font-medium ${
                                  ord.status === 'Pending'
                                    ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                                    : ord.status === 'Confirmed'
                                    ? 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                                    : ord.status === 'Dispatched'
                                    ? 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
                                    : ord.status === 'Delivered'
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-neutral-800 text-neutral-400'
                                }`}>
                                  {ord.status}
                                </span>
                              </div>
                              <h5 className="font-serif text-sm text-white font-medium mt-0.5 truncate">
                                {ord.customer_name}
                              </h5>
                            </div>
                          </div>

                          {/* Quick Mark Read Icon */}
                          {unread && (
                            <button
                              type="button"
                              onClick={(e) => markAsRead(ord.id, e)}
                              className="p-1 rounded hover:bg-obsidian-300 text-champagne/40 hover:text-gold transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Details line */}
                        <div className="flex items-center justify-between text-[11px] text-champagne/70 font-sans mt-2 pl-4">
                          <span>{ord.city} • Rs. {ord.total_amount?.toLocaleString()}</span>
                          <span className="text-[10px] text-champagne/40 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{formatTimeAgo(ord.created_at)}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* View All Orders Link */}
              <Link
                href="/admin/orders"
                onClick={() => setIsDropdownOpen(false)}
                className="block text-center py-2 text-xs uppercase tracking-wider text-gold hover:text-gold-300 font-sans font-bold border-t border-gold/15 pt-3"
              >
                Open Order Dispatch Desk →
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
                onClick={() => handleOpenOrder(activeAlert)}
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
