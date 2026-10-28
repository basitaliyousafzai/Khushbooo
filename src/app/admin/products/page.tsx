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
  Upload
} from 'lucide-react';
import { getProductsClient, deleteProduct } from '@/lib/data/products';
import { Product } from '@/types';
import { ProductFormModal } from '@/components/admin/ProductFormModal';

export default function ProductsManagerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProductsClient();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (productId: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}" from the atelier catalogue?`)) {
      await deleteProduct(productId);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return p.title.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold font-sans">
            Catalogue & Atelier Assets
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            Inventory & Media Manager
          </h1>
          <p className="text-xs text-champagne/60 font-sans mt-0.5">
            Manage fragrance flacons, real-time inventory counts, and `.glb` 3D models in Supabase Storage (`perfume-assets`).
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-5 py-2.5 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-gold/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Flacon</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by perfume title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-400 border border-gold/20 focus:border-gold focus:outline-none text-white text-xs font-sans"
          />
        </div>

        <div className="text-xs text-champagne/60 font-sans flex items-center gap-4">
          <span>Total Flacons: <strong className="text-white">{products.length}</strong></span>
          <span>Featured in Hero: <strong className="text-gold">{products.filter((p) => p.is_featured).length}</strong></span>
        </div>
      </div>

      {/* Product Inventory Cards / Table */}
      <div className="p-6 rounded-3xl bg-obsidian-400 border border-gold/20 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-gold/15 text-champagne/60 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Flacon</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Stock Quantity</th>
                <th className="py-3 px-3">3D Model (.glb)</th>
                <th className="py-3 px-3">Notes Profile</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-champagne/50">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const thumbnail = prod.images?.find((img) => img.is_thumbnail)?.image_url ||
                    prod.images?.[0]?.image_url ||
                    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80';
                  
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
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-serif text-sm text-white font-medium">
                              {prod.title}
                            </div>
                            <div className="text-[10px] text-champagne/50 font-mono">
                              /{prod.slug}
                            </div>
                            {prod.is_featured && (
                              <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[9px] uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
                                Featured
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
                            <span>Only {prod.stock_quantity} left</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-medium">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            <span>In Stock ({prod.stock_quantity})</span>
                          </span>
                        )}
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
                            Crystal Procedural 3D
                          </span>
                        )}
                      </td>

                      {/* Olfactory Accord Summary */}
                      <td className="py-4 px-3">
                        <div className="text-[11px] text-champagne/80 max-w-[180px] truncate">
                          {prod.top_notes?.join(', ') || 'Notes pending'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-3 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(prod)}
                          className="p-2 rounded-lg border border-gold/30 hover:border-gold text-champagne hover:text-gold transition-colors inline-block"
                          title="Edit Flacon"
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

      {/* Product Form Modal */}
      <ProductFormModal
        product={editingProduct}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={fetchProducts}
      />

    </div>
  );
}
