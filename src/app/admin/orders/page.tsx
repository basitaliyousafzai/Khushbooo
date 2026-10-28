'use client';

import React, { useEffect, useState } from 'react';
import {
  Truck,
  Printer,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Package
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '@/lib/data/orders';
import { Order, OrderStatus } from '@/types';
import { DispatchModal } from '@/components/admin/DispatchModal';
import { PrintPackingSlip } from '@/components/admin/PrintPackingSlip';

export default function OrderDispatchPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [dispatchOrder, setDispatchOrder] = useState<Order | null>(null);
  const [slipOrder, setSlipOrder] = useState<Order | null>(null);

  const fetchOrdersData = async () => {
    setLoading(true);
    try {
      const data = await getOrders(filter === 'All' ? undefined : filter);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [filter]);

  // Handle direct status change
  const handleQuickStatusChange = async (order: Order, newStatus: OrderStatus) => {
    if (newStatus === 'Dispatched') {
      // Must open mandatory Courier modal
      setDispatchOrder(order);
      return;
    }

    try {
      await updateOrderStatus(order.id, newStatus);
      fetchOrdersData();
    } catch (e) {
      console.error(e);
    }
  };

  // Confirm Dispatch from Modal
  const handleConfirmDispatch = async (courierName: string, trackingId: string) => {
    if (!dispatchOrder) return;
    await updateOrderStatus(dispatchOrder.id, 'Dispatched', {
      courier_name: courierName,
      courier_tracking_id: trackingId,
    });
    fetchOrdersData();
  };

  const filteredOrders = orders.filter((o) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      o.customer_name.toLowerCase().includes(term) ||
      o.customer_phone.includes(term) ||
      o.city.toLowerCase().includes(term) ||
      String(o.order_number).includes(term) ||
      (o.courier_tracking_id && o.courier_tracking_id.toLowerCase().includes(term))
    );
  });

  const statuses: (OrderStatus | 'All')[] = ['All', 'Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold font-sans">
            Logistics & Fulfillment
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            Order Dispatch Manager
          </h1>
          <p className="text-xs text-champagne/60 font-sans mt-0.5">
            Process Cash on Delivery shipments, assign courier tracking airway bills, and print parcel dispatch slips.
          </p>
        </div>

        <button
          onClick={fetchOrdersData}
          className="px-4 py-2 rounded-full border border-gold/30 hover:border-gold text-champagne text-xs uppercase tracking-wider font-sans self-start sm:self-auto"
        >
          Refresh Feed
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-sans transition-all border ${
                filter === s
                  ? 'bg-gold text-obsidian border-gold font-bold shadow-md shadow-gold/20'
                  : 'bg-obsidian-400 text-champagne/70 border-gold/15 hover:border-gold/40 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, phone, city, order #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-400 border border-gold/20 focus:border-gold focus:outline-none text-white text-xs font-sans"
          />
        </div>

      </div>

      {/* Orders Table Container */}
      <div className="p-6 rounded-3xl bg-obsidian-400 border border-gold/20 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-gold/15 text-champagne/60 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Order #</th>
                <th className="py-3 px-3">Customer & Phone</th>
                <th className="py-3 px-3">Destination City</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3">Total Due (COD)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Courier & Tracking</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-champagne/50">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-obsidian-300/40 transition-colors">
                    
                    {/* Order Reference */}
                    <td className="py-4 px-3 font-mono text-gold font-bold">
                      #{order.order_number}
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-3">
                      <div className="font-medium text-white">{order.customer_name}</div>
                      <div className="text-[11px] text-champagne/60 font-mono">{order.customer_phone}</div>
                    </td>

                    {/* Destination */}
                    <td className="py-4 px-3">
                      <div className="text-white font-medium">{order.city}</div>
                      <div className="text-[11px] text-champagne/50 truncate max-w-[180px]">
                        {order.shipping_address}
                      </div>
                    </td>

                    {/* Item Count / Details */}
                    <td className="py-4 px-3">
                      <div className="text-champagne/90">
                        {order.items && order.items.length > 0
                          ? `${order.items.reduce((sum, item) => sum + item.quantity, 0)} flacon(s)`
                          : '1 flacon'}
                      </div>
                      <div className="text-[10px] text-champagne/50 truncate max-w-[140px]">
                        {order.items?.[0]?.product_title || 'Fragrance'}
                      </div>
                    </td>

                    {/* Total Amount Due */}
                    <td className="py-4 px-3 font-serif text-gold font-bold text-sm">
                      Rs. {order.total_amount.toLocaleString()}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleQuickStatusChange(order, e.target.value as OrderStatus)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-semibold border bg-obsidian-500 focus:outline-none cursor-pointer ${
                          order.status === 'Dispatched'
                            ? 'border-blue-500/50 text-blue-300'
                            : order.status === 'Delivered'
                            ? 'border-emerald-500/50 text-emerald-300'
                            : order.status === 'Confirmed'
                            ? 'border-amber-500/50 text-amber-300'
                            : 'border-neutral-700 text-neutral-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Courier & Tracking Airway Bill */}
                    <td className="py-4 px-3">
                      {order.courier_tracking_id ? (
                        <div className="space-y-0.5">
                          <div className="text-xs text-white font-medium">
                            {order.courier_name || 'Express'}
                          </div>
                          <div className="font-mono text-[11px] text-gold">
                            {order.courier_tracking_id}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-champagne/40 italic">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Actions: Dispatch & Print Packing Slip */}
                    <td className="py-4 px-3 text-right space-x-2 whitespace-nowrap">
                      {/* Mark Dispatched Modal Trigger */}
                      {order.status !== 'Dispatched' && order.status !== 'Delivered' && (
                        <button
                          onClick={() => setDispatchOrder(order)}
                          className="px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold text-gold hover:text-obsidian border border-gold/30 text-[11px] uppercase tracking-wider transition-all inline-flex items-center gap-1 font-medium"
                          title="Assign Courier Tracking & Mark Dispatched"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch</span>
                        </button>
                      )}

                      {/* Print Packing Slip Trigger */}
                      <button
                        onClick={() => setSlipOrder(order)}
                        className="px-3 py-1.5 rounded-lg border border-gold/30 hover:border-gold text-champagne hover:text-gold text-[11px] uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                        title="Print Parcel Packaging Slip"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Slip</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transition Modal: Dispatch */}
      <DispatchModal
        order={dispatchOrder}
        isOpen={Boolean(dispatchOrder)}
        onClose={() => setDispatchOrder(null)}
        onConfirm={handleConfirmDispatch}
      />

      {/* Printable Packaging Slip Modal */}
      <PrintPackingSlip
        order={slipOrder}
        isOpen={Boolean(slipOrder)}
        onClose={() => setSlipOrder(null)}
      />

    </div>
  );
}
