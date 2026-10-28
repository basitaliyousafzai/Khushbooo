'use client';

import React from 'react';
import { X, Printer, Package, ShieldCheck } from 'lucide-react';
import { Order } from '@/types';

interface PrintPackingSlipProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrintPackingSlip({ order, isOpen, onClose }: PrintPackingSlipProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white text-neutral-900 rounded-2xl shadow-2xl p-8 print:p-0 print:m-0 print:max-h-none print:w-full print:shadow-none print:rounded-none">
        
        {/* Screen Action Bar (Hidden in Print) */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-200 print:hidden">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 font-sans font-medium">
            <Package className="w-4 h-4 text-amber-600" />
            <span>Parcel Packaging & Dispatch Slip</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-sans flex items-center gap-2 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= PRINTABLE PACKING SLIP BODY ================= */}
        <div className="space-y-6 font-sans">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-5">
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-widest uppercase text-neutral-900">
                Khushbooo
              </h1>
              <p className="text-[11px] tracking-widest uppercase text-neutral-500">
                Haute Parfumerie & Pure Attars • Dispatch Manifest
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                concierge@khushbooo.com • +92 300 8472948
              </p>
            </div>

            <div className="text-right">
              <div className="font-mono text-xl font-bold text-neutral-900">
                ORDER #{order.order_number}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Date: {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <div className="inline-block mt-2 px-3 py-1 rounded bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider">
                CASH ON DELIVERY (COD)
              </div>
            </div>
          </div>

          {/* Consignee & Courier Routing Grid */}
          <div className="grid grid-cols-2 gap-6 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            {/* Consignee */}
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                DELIVER TO (RECIPIENT):
              </div>
              <div className="text-base font-bold text-neutral-900 font-serif">
                {order.customer_name}
              </div>
              <div className="text-xs text-neutral-700 mt-0.5 font-medium">
                Phone: {order.customer_phone}
              </div>
              {order.customer_email && (
                <div className="text-xs text-neutral-500">Email: {order.customer_email}</div>
              )}
              <div className="text-xs text-neutral-800 mt-2 font-medium">
                {order.shipping_address}
              </div>
              <div className="text-xs font-bold text-neutral-900 uppercase mt-0.5">
                {order.city}, Pakistan
              </div>
            </div>

            {/* Courier Routing Details */}
            <div className="border-l border-neutral-200 pl-6">
              <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                COURIER DISPATCH INFORMATION:
              </div>
              <div className="text-sm font-bold text-neutral-900">
                Courier Carrier: {order.courier_name || 'Designated Express Courier'}
              </div>
              <div className="text-xs font-mono text-neutral-700 mt-1">
                Tracking Airway Bill: {order.courier_tracking_id || 'PENDING DISPATCH SCAN'}
              </div>
              <div className="text-xs text-neutral-600 mt-2">
                Order Status: <span className="font-semibold text-neutral-900">{order.status}</span>
              </div>
              {order.order_notes && (
                <div className="mt-2 p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                  <strong>Notes:</strong> {order.order_notes}
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-900 text-neutral-900 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-2.5">Item Description</th>
                <th className="py-2.5 text-center">Concentration</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-neutral-900">
                      {item.product_title}
                    </td>
                    <td className="py-3 text-center text-neutral-500">
                      Extrait 100ml
                    </td>
                    <td className="py-3 text-center font-bold text-neutral-900">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right text-neutral-600">
                      Rs. {Number(item.unit_price).toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-bold text-neutral-900">
                      Rs. {(Number(item.unit_price) * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-3 text-neutral-500">Standard Flacon Package</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-neutral-900">
                <td colSpan={3} className="pt-3 text-[11px] text-neutral-500 italic">
                  Handle with Care • Fragile Glass Flacon Sealed with Artisanal Wax
                </td>
                <td className="pt-3 text-right font-medium text-neutral-600">Total COD Due:</td>
                <td className="pt-3 text-right font-serif text-lg font-bold text-neutral-900">
                  Rs. {order.total_amount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Barcode & Verification Footer */}
          <div className="pt-6 border-t border-neutral-200 flex justify-between items-center text-xs text-neutral-500">
            {/* Simulated Barcode */}
            <div>
              <div className="font-mono text-2xl tracking-[0.25em] font-bold text-neutral-800 select-none">
                ||||| | |||| ||| |||||| | |||||
              </div>
              <div className="font-mono text-[10px] tracking-widest text-neutral-400 mt-0.5">
                *{order.order_number}-{order.courier_tracking_id || 'DISPATCH'}*
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                Quality Verification & Packing Seal
              </div>
              <div className="font-serif italic text-neutral-700">
                Inspected by Maison De Parfum Atelier
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
