'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ArrowRight, Loader2, PackageCheck, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { Product, StockMovementType } from '@/types';

interface StockAdjustmentModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function StockAdjustmentModal({ product, isOpen, onClose, onSaved }: StockAdjustmentModalProps) {
  const [movementType, setMovementType] = useState<StockMovementType>('restock');
  const [quantity, setQuantity] = useState<number>(10);
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setMovementType('restock');
      setQuantity(10);
      setNote('Atelier inward batch delivery');
      setError(null);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const currentStock = Number(product.stock_quantity ?? 0);
  
  // Calculate quantity change based on movement type
  const isDeduction = movementType === 'damage';
  const effectiveChange = isDeduction ? -Math.abs(quantity) : Math.abs(quantity);
  const resultingStock = Math.max(0, currentStock + effectiveChange);

  const quickReasonChips = [
    'Atelier batch delivery',
    'Physical inventory audit count',
    'Customer return to stock',
    'Quality control test sample',
    'Damaged in warehouse storage',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      setError('Please specify a positive quantity of units.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          movementType,
          quantityChange: effectiveChange,
          referenceNote: note.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update stock');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error processing inventory adjustment');
    } finally {
      setLoading(false);
    }
  };

  const thumbnail = product.images?.find((img) => img.is_thumbnail)?.image_url ||
    product.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-obsidian-500 border border-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-obsidian-400 text-champagne/60 hover:text-gold transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Product Banner */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold font-sans font-semibold">
            <PackageCheck className="w-4 h-4" />
            <span>Stock Ledger Adjustment</span>
          </div>
          <h2 className="font-serif text-2xl text-white">
            Adjust Atelier Flacon Inventory
          </h2>
        </div>

        {/* Product Card Overview */}
        <div className="p-4 rounded-2xl bg-obsidian-600/80 border border-gold/15 flex items-center gap-4">
          <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-obsidian-700 shrink-0 border border-gold/20">
            <Image
              src={thumbnail}
              alt={product.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-base text-white truncate font-medium">
              {product.title}
            </h3>
            <p className="text-xs text-champagne/60 font-sans">
              {product.volume || '100ml Extrait'} • Rs. {(product.discount_price || product.price).toLocaleString()}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-champagne/70 font-sans">Current In-Stock:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                currentStock > 5
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                  : currentStock > 0
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                  : 'bg-red-950/80 text-red-300 border border-red-500/30'
              }`}>
                {currentStock} units
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Movement Type Radio / Buttons */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-champagne/80 font-sans block">
              Movement Reason
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'restock', label: '📥 Restock / Received', delta: '+' },
                { type: 'return', label: '🔄 Customer Return', delta: '+' },
                { type: 'adjustment', label: '⚖️ Physical Audit Count', delta: '±' },
                { type: 'damage', label: '⚠️ Damaged / Sample', delta: '-' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => setMovementType(opt.type as any)}
                  className={`p-3 rounded-xl border text-xs font-sans text-left transition-all ${
                    movementType === opt.type
                      ? 'border-gold bg-gold/15 text-white font-bold shadow-md shadow-gold/15'
                      : 'border-gold/15 bg-obsidian-600/50 text-champagne/70 hover:border-gold/40 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Controls & Dynamic Preview */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-champagne/80 font-sans block">
              Adjustment Quantity ({isDeduction ? 'Units to Deduct' : 'Units to Add'})
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gold/30 rounded-xl bg-obsidian-600 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-3 text-champagne/70 hover:text-gold hover:bg-obsidian-400 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-20 text-center bg-transparent text-white font-serif text-lg font-bold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-3 text-champagne/70 hover:text-gold hover:bg-obsidian-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick increment buttons */}
              <div className="flex gap-1.5">
                {[5, 10, 25, 50].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setQuantity(num)}
                    className="px-2.5 py-1.5 rounded-lg border border-gold/20 text-champagne/80 hover:text-gold hover:border-gold text-xs font-mono bg-obsidian-600/60 transition-colors"
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Result Preview Card */}
            <div className="p-3 rounded-xl bg-obsidian-600/90 border border-gold/20 flex items-center justify-between text-xs font-sans">
              <span className="text-champagne/70">Stock Balance After Adjustment:</span>
              <div className="flex items-center gap-2">
                <span className="text-champagne/50">{currentStock}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
                <span className={`font-serif font-bold text-sm ${resultingStock > 0 ? 'text-gold' : 'text-red-400'}`}>
                  {resultingStock} flacons
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  effectiveChange >= 0 ? 'text-emerald-400 bg-emerald-950/60' : 'text-red-400 bg-red-950/60'
                }`}>
                  {effectiveChange >= 0 ? `+${effectiveChange}` : `${effectiveChange}`}
                </span>
              </div>
            </div>
          </div>

          {/* Reference / Reason Note */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-champagne/80 font-sans block">
              Ledger Note / Reference Reason
            </label>
            <input
              type="text"
              placeholder="e.g. Batch received from atelier, QC inspection sample, etc."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-obsidian-600 border border-gold/20 focus:border-gold focus:outline-none text-white text-xs font-sans"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickReasonChips.map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => setNote(chip)}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-obsidian-600 text-champagne/60 hover:text-champagne hover:bg-obsidian-400 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20 hover:scale-[1.01]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-obsidian" />
            ) : (
              <>
                <span>Commit Stock Ledger Entry</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
