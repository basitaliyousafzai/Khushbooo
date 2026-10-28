'use client';

import React, { useState } from 'react';
import { X, Truck, Loader2, ShieldCheck } from 'lucide-react';
import { Order } from '@/types';

interface DispatchModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (courierName: string, trackingId: string) => Promise<void>;
}

export function DispatchModal({ order, isOpen, onClose, onConfirm }: DispatchModalProps) {
  const [courierName, setCourierName] = useState('TCS Express');
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const popularCouriers = ['TCS Express', 'Leopards Courier', 'Trax Logistics', 'M&P Express', 'Call Courier', 'DHL Express', 'FedEx'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courierName.trim() || !trackingId.trim()) {
      setError('Both Courier Service Name and Tracking ID are mandatory.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onConfirm(courierName.trim(), trackingId.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to dispatch order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-obsidian-400 border border-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-obsidian-300 text-champagne/70 hover:text-gold transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold font-sans">
            <Truck className="w-4 h-4 text-gold" />
            <span>Order Dispatch Workflow</span>
          </div>
          <h3 className="font-serif text-2xl text-white">
            Dispatch Parcel #{order.order_number}
          </h3>
          <p className="text-xs text-champagne/60 font-sans">
            Recipient: <span className="text-white font-medium">{order.customer_name}</span> ({order.city})
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          
          {/* Courier Service Name */}
          <div className="space-y-1.5">
            <label className="text-champagne/80 uppercase tracking-wider block">
              Courier Service Name <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. TCS Express"
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
            />
            {/* Quick Courier Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {popularCouriers.map((carrier) => (
                <button
                  type="button"
                  key={carrier}
                  onClick={() => setCourierName(carrier)}
                  className={`px-2 py-0.5 rounded text-[10px] tracking-wider transition-colors ${
                    courierName === carrier
                      ? 'bg-gold text-obsidian font-bold'
                      : 'bg-obsidian-300 text-champagne/60 hover:text-champagne'
                  }`}
                >
                  {carrier}
                </button>
              ))}
            </div>
          </div>

          {/* Tracking ID */}
          <div className="space-y-1.5 pt-2">
            <label className="text-champagne/80 uppercase tracking-wider block">
              Courier Airway Bill / Tracking ID <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. TCS-772891942"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
            />
          </div>

          {/* Destination Preview */}
          <div className="p-3.5 rounded-xl bg-obsidian-500/60 border border-gold/10 space-y-1 text-champagne/70 text-[11px]">
            <div><strong>Shipping Address:</strong> {order.shipping_address}, {order.city}</div>
            <div><strong>COD Amount to Collect:</strong> Rs. {order.total_amount.toLocaleString()}</div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-gold/30 hover:border-gold text-champagne/80 text-xs uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-obsidian" />
                  <span>Marking Dispatched...</span>
                </>
              ) : (
                <span>Confirm Dispatch</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
