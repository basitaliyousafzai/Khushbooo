'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Box,
  Flame,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  PackagePlus,
  Layers,
  History,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert
} from 'lucide-react';
import { deleteProduct } from '@/lib/data/products';
import { Product, StockLedgerEntry, StockMovementType } from '@/types';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { StockAdjustmentModal } from '@/components/admin/StockAdjustmentModal';

export default function ProductsManagerPage() {
  const [activeTab, setActiveTab] = useState<'catalogue' | 'ledger'>('catalogue');
  const [products, setProducts] = useState<Product[]>([]);
  const [ledger, setLedger] = useState<StockLedgerEntry[]>([]);
  const [metrics, setMetrics] = useState({
    totalStock: 0,
    totalValuation: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ledgerFilter, setLedgerFilter] = useState<string>('all');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        if (data.metrics) setMetrics(data.metrics);
        if (data.ledger) setLedger(data.ledger);
      }
    } catch (err) {
      console.error('Failed to load inventory data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleQuickAdjust = (product: Product) => {
    setAdjustingProduct(product);
    setIsAdjustOpen(true);
  };

  const handleDelete = async (productId: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}" from the atelier catalogue?`)) {
      await deleteProduct(productId);
      fetchInventoryData();
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return p.title.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term);
  });

  const filteredLedger = ledger.filter((entry) => {
    const matchesFilter = ledgerFilter === 'all' || entry.movement_type === ledgerFilter;
    if (!matchesFilter) return false;
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      entry.product_title?.toLowerCase().includes(term) ||
      entry.reference_note?.toLowerCase().includes(term) ||
      entry.movement_type?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold font-sans">
            Atelier Inventory Control & Asset Ledgers
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            Inventory & Stock Ledgers
          </h1>
          <p className="text-xs text-champagne/60 font-sans mt-0.5">
            Real-time flacon stock audit, valuation tracking, inward batch restocks, and complete stock movements ledger.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={fetchInventoryData}
            className="p-2.5 rounded-full border border-gold/30 hover:border-gold text-champagne hover:text-gold transition-colors"
            title="Refresh Inventory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-gold' : ''}`} />
          </button>

          <button
            onClick={handleCreate}
            className="px-5 py-2.5 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-gold/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Flacon</span>
          </button>
        </div>
      </div>

      {/* KPI Inventory Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-obsidian-500/80 border border-gold/20 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-champagne/60 font-sans block">
            Total In-Stock Units
          </span>
          <div className="font-serif text-2xl sm:text-3xl text-white font-bold">
            {metrics.totalStock} <span className="text-xs font-sans font-normal text-gold">flacons</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-sans flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>{products.length} Active SKUs</span>
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-500/80 border border-gold/20 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-champagne/60 font-sans block">
            Inventory Asset Valuation
          </span>
          <div className="font-serif text-2xl sm:text-3xl text-gold font-bold">
            Rs. {metrics.totalValuation?.toLocaleString()}
          </div>
          <span className="text-[11px] text-champagne/60 font-sans">
            Retail atelier value
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-500/80 border border-gold/20 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-champagne/60 font-sans block">
            Low Stock Alerts (≤ 5)
          </span>
          <div className="font-serif text-2xl sm:text-3xl text-amber-400 font-bold">
            {metrics.lowStockCount}
          </div>
          <span className="text-[11px] text-amber-300/80 font-sans">
            Immediate batch restock recommended
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-500/80 border border-gold/20 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-champagne/60 font-sans block">
            Out of Stock (0 units)
          </span>
          <div className={`font-serif text-2xl sm:text-3xl font-bold ${metrics.outOfStockCount > 0 ? 'text-red-400' : 'text-champagne/80'}`}>
            {metrics.outOfStockCount}
          </div>
          <span className="text-[11px] text-champagne/60 font-sans">
            Sold out on storefront
          </span>
        </div>
      </div>

      {/* Navigation Tabs: Catalogue vs Stock Ledger */}
      <div className="flex border-b border-gold/15 gap-4">
        <button
          onClick={() => setActiveTab('catalogue')}
          className={`pb-3 text-xs uppercase tracking-wider font-sans font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'catalogue'
              ? 'border-gold text-gold'
              : 'border-transparent text-champagne/60 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Atelier Catalogue & Stock ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-3 text-xs uppercase tracking-wider font-sans font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'ledger'
              ? 'border-gold text-gold'
              : 'border-transparent text-champagne/60 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Stock Movement Ledger ({ledger.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT CATALOGUE & STOCK MANAGER */}
      {activeTab === 'catalogue' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by flacon title or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-400 border border-gold/20 focus:border-gold focus:outline-none text-white text-xs font-sans"
              />
            </div>
            <div className="text-xs text-champagne/60 font-sans">
              Showing {filteredProducts.length} of {products.length} flacons
            </div>
          </div>

          {/* Product Table */}
          <div className="p-6 rounded-3xl bg-obsidian-400 border border-gold/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-gold/15 text-champagne/60 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Flacon</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Current Stock</th>
                    <th className="py-3 px-3">Quick Stock Action</th>
                    <th className="py-3 px-3">3D Asset</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-champagne/50">
                        No flacons match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => {
                      const thumbnail = prod.images?.find((img) => img.is_thumbnail)?.image_url ||
                        prod.images?.[0]?.image_url ||
                        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80';
                      
                      const isSoldOut = prod.stock_quantity <= 0;
                      const isLowStock = prod.stock_quantity > 0 && prod.stock_quantity <= 5;

                      return (
                        <tr key={prod.id} className="hover:bg-obsidian-300/40 transition-colors">
                          {/* Flacon Thumbnail & Title */}
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-obsidian-500 border border-gold/20 shrink-0">
                                <Image
                                  src={thumbnail}
                                  alt={prod.title}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-serif text-sm text-white font-medium">
                                  {prod.title}
                                </div>
                                <div className="text-[10px] text-champagne/50 font-mono">
                                  {prod.volume || '100ml Extrait'}
                                </div>
                                {prod.is_featured && (
                                  <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[9px] uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
                                    Hero Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Pricing */}
                          <td className="py-4 px-3">
                            <div className="font-serif text-gold font-bold text-sm">
                              Rs. {(prod.discount_price || prod.price).toLocaleString()}
                            </div>
                            {prod.discount_price && (
                              <div className="text-[11px] text-champagne/40 line-through">
                                Rs. {prod.price.toLocaleString()}
                              </div>
                            )}
                          </td>

                          {/* Stock Level Indicator */}
                          <td className="py-4 px-3">
                            {isSoldOut ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-red-950/70 border border-red-500/40 text-red-300 font-bold">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Sold Out (0)</span>
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-amber-950/70 border border-amber-500/40 text-amber-300 font-bold animate-pulse">
                                <Flame className="w-3 h-3 text-amber-400" />
                                <span>Low: {prod.stock_quantity} left</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-medium">
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                <span>In Stock ({prod.stock_quantity})</span>
                              </span>
                            )}
                          </td>

                          {/* Quick 1-Click Stock Adjustment Button */}
                          <td className="py-4 px-3">
                            <button
                              onClick={() => handleQuickAdjust(prod)}
                              className="px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold text-gold hover:text-obsidian border border-gold/40 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
                            >
                              <PackagePlus className="w-3.5 h-3.5" />
                              <span>Adjust Stock</span>
                            </button>
                          </td>

                          {/* 3D Asset Status */}
                          <td className="py-4 px-3">
                            {prod.model_3d_url ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-gold/15 border border-gold/30 text-gold font-medium">
                                <Box className="w-3 h-3" />
                                <span>Custom .glb</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-champagne/50">
                                Procedural 3D
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-3 text-right space-x-2">
                            <button
                              onClick={() => handleEdit(prod)}
                              className="p-2 rounded-lg border border-gold/30 hover:border-gold text-champagne hover:text-gold transition-colors inline-block"
                              title="Edit Flacon Details & Price"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDelete(prod.id, prod.title)}
                              className="p-2 rounded-lg border border-red-500/30 hover:border-red-500 text-champagne/60 hover:text-red-400 transition-colors inline-block"
                              title="Delete Flacon"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STOCK MOVEMENT LEDGER (AUDIT TRAIL) */}
      {activeTab === 'ledger' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Filter Pills & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'All Movements', value: 'all' },
                { label: '📥 Restocks', value: 'restock' },
                { label: '🛒 Customer Sales', value: 'sale' },
                { label: '⚖️ Audit Adjustments', value: 'adjustment' },
                { label: '⚠️ Damage / Samples', value: 'damage' },
                { label: '🔄 Returns', value: 'return' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLedgerFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-sans transition-all border ${
                    ledgerFilter === opt.value
                      ? 'bg-gold text-obsidian border-gold font-bold shadow-md shadow-gold/20'
                      : 'bg-obsidian-400 text-champagne/70 border-gold/15 hover:border-gold/40 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ledger by flacon, reason, or note..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-400 border border-gold/20 focus:border-gold focus:outline-none text-white text-xs font-sans"
              />
            </div>
          </div>

          {/* Ledger Table */}
          <div className="p-6 rounded-3xl bg-obsidian-400 border border-gold/20 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-gold/15 text-champagne/60 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Flacon</th>
                    <th className="py-3 px-3">Movement Type</th>
                    <th className="py-3 px-3">Quantity Delta</th>
                    <th className="py-3 px-3">Stock Balance</th>
                    <th className="py-3 px-3">Reason / Reference Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-champagne/50">
                        No stock movement ledger records found.
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((entry) => {
                      const isPositive = entry.quantity_change >= 0;

                      return (
                        <tr key={entry.id} className="hover:bg-obsidian-300/40 transition-colors">
                          {/* Date & Time */}
                          <td className="py-4 px-3 text-champagne/70 font-mono text-[11px]">
                            {new Date(entry.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </td>

                          {/* Product Title */}
                          <td className="py-4 px-3 font-serif text-white font-medium text-sm">
                            {entry.product_title}
                          </td>

                          {/* Movement Type Badge */}
                          <td className="py-4 px-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                              entry.movement_type === 'restock'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                                : entry.movement_type === 'sale'
                                ? 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
                                : entry.movement_type === 'damage'
                                ? 'bg-red-950/80 text-red-300 border border-red-500/30'
                                : entry.movement_type === 'return'
                                ? 'bg-blue-950/80 text-blue-300 border border-blue-500/30'
                                : 'bg-gold/15 text-gold border border-gold/30'
                            }`}>
                              {entry.movement_type}
                            </span>
                          </td>

                          {/* Quantity Delta */}
                          <td className="py-4 px-3">
                            <span className={`inline-flex items-center gap-1 font-mono font-bold text-sm ${
                              isPositive ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              {isPositive ? (
                                <>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                  +{entry.quantity_change}
                                </>
                              ) : (
                                <>
                                  <ArrowDownRight className="w-3.5 h-3.5" />
                                  {entry.quantity_change}
                                </>
                              )}
                            </span>
                          </td>

                          {/* Stock Balance Progression */}
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-1.5 text-xs font-mono">
                              <span className="text-champagne/40">{entry.previous_stock}</span>
                              <span className="text-gold">➔</span>
                              <span className="text-white font-bold">{entry.new_stock}</span>
                            </div>
                          </td>

                          {/* Note / Reference */}
                          <td className="py-4 px-3 text-champagne/80 font-sans text-xs">
                            {entry.reference_note || '—'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal (Add / Edit Flacon) */}
      <ProductFormModal
        product={editingProduct}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={fetchInventoryData}
      />

      {/* Stock Adjustment Modal (Inward Batch / Shrinkage / Audit) */}
      <StockAdjustmentModal
        product={adjustingProduct}
        isOpen={isAdjustOpen}
        onClose={() => setIsAdjustOpen(false)}
        onSaved={fetchInventoryData}
      />

    </div>
  );
}
