'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Truck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { getAdminAnalytics } from '@/lib/data/orders';
import { Order } from '@/types';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<{
    totalOrders: number;
    pendingDispatches: number;
    revenueThisMonth: number;
    lowStockCount: number;
    recentOrders: Order[];
  }>({
    totalOrders: 0,
    pendingDispatches: 0,
    revenueThisMonth: 0,
    lowStockCount: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAdminAnalytics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load admin analytics', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold font-sans">
            Khushbooo Concierge • Executive Summary
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            Atelier Analytics Overview
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif text-xs uppercase tracking-widest font-bold transition-all shadow-md shadow-gold/20 flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4" />
            <span>Process Dispatches</span>
          </Link>

          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-full border border-gold/30 hover:border-gold text-champagne text-xs uppercase tracking-widest transition-all bg-obsidian-400 flex items-center gap-1.5"
          >
            <Package className="w-4 h-4 text-gold" />
            <span>Manage Flacons</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards (Exact Rule 3 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Orders */}
        <div className="p-6 rounded-2xl bg-obsidian-400 border border-gold/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-champagne/60 font-sans">Total Orders</span>
            <div className="p-2.5 rounded-xl bg-gold/10 text-gold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-white">
            {metrics.totalOrders}
          </div>
          <p className="text-[11px] text-champagne/50">Cash on Delivery Orders received</p>
        </div>

        {/* Card 2: Pending Dispatches */}
        <div className="p-6 rounded-2xl bg-obsidian-400 border border-gold/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-champagne/60 font-sans">Pending Dispatches</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-amber-300">
            {metrics.pendingDispatches}
          </div>
          <p className="text-[11px] text-champagne/50">Awaiting courier booking & dispatch</p>
        </div>

        {/* Card 3: Revenue this Month */}
        <div className="p-6 rounded-2xl bg-obsidian-400 border border-gold/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-champagne/60 font-sans">Revenue This Month</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-gold">
            Rs. {metrics.revenueThisMonth.toLocaleString()}
          </div>
          <p className="text-[11px] text-champagne/50">Confirmed gross parcel value</p>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div className="p-6 rounded-2xl bg-obsidian-400 border border-gold/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-champagne/60 font-sans">Low Stock Alerts</span>
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-red-400">
            {metrics.lowStockCount}
          </div>
          <p className="text-[11px] text-champagne/50">Flacons with ≤ 5 bottles remaining</p>
        </div>

      </div>

      {/* Recent Orders Overview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-400 border border-gold/20 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-serif text-xl sm:text-2xl text-white">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-champagne/60 font-sans">
              Latest nationwide orders placed via Cash on Delivery
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs text-gold hover:text-gold-200 font-sans uppercase tracking-wider flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-gold/15 text-champagne/60 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Order</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">City</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {metrics.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-champagne/50">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                metrics.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-obsidian-300/40 transition-colors">
                    <td className="py-4 px-3 font-mono text-gold font-bold">
                      #{order.order_number}
                    </td>
                    <td className="py-4 px-3 font-medium text-white">
                      <div>{order.customer_name}</div>
                      <div className="text-[11px] text-champagne/50 font-mono">{order.customer_phone}</div>
                    </td>
                    <td className="py-4 px-3 text-champagne/80">
                      {order.city}
                    </td>
                    <td className="py-4 px-3 font-serif text-white font-bold">
                      Rs. {order.total_amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                          order.status === 'Dispatched'
                            ? 'bg-blue-950/70 border border-blue-500/40 text-blue-300'
                            : order.status === 'Delivered'
                            ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                            : order.status === 'Confirmed'
                            ? 'bg-amber-950/70 border border-amber-500/40 text-amber-300'
                            : 'bg-neutral-800 border border-neutral-700 text-neutral-300'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <Link
                        href="/admin/orders"
                        className="px-3 py-1.5 rounded-lg border border-gold/30 hover:border-gold text-gold text-[11px] uppercase tracking-wider transition-colors inline-block"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
