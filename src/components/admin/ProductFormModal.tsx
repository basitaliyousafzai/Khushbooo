'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Plus, Trash2, Check, Box, Loader2 } from 'lucide-react';
import { Product } from '@/types';
import { saveProduct, uploadAssetToStorage } from '@/lib/data/products';

interface ProductFormModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function ProductFormModal({ product, isOpen, onClose, onSaved }: ProductFormModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('10');
  const [categoryType, setCategoryType] = useState<'perfume' | 'attar'>('perfume');
  const [volume, setVolume] = useState('100ml Extrait Spray');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [model3dUrl, setModel3dUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Tag inputs
  const [topNotes, setTopNotes] = useState<string[]>([]);
  const [topNoteInput, setTopNoteInput] = useState('');

  const [middleNotes, setMiddleNotes] = useState<string[]>([]);
  const [middleNoteInput, setMiddleNoteInput] = useState('');

  const [baseNotes, setBaseNotes] = useState<string[]>([]);
  const [baseNoteInput, setBaseNoteInput] = useState('');

  // Image Gallery
  const [images, setImages] = useState<{ image_url: string; is_thumbnail: boolean }[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingModel, setUploadingModel] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setSlug(product.slug || '');
      setPrice(product.price ? String(product.price) : '');
      setDiscountPrice(product.discount_price ? String(product.discount_price) : '');
      setStockQuantity(product.stock_quantity !== undefined ? String(product.stock_quantity) : '10');
      setCategoryType(product.category_type || 'perfume');
      setVolume(product.volume || (product.category_type === 'attar' ? '12ml Pure Oil Tola' : '100ml Extrait Spray'));
      setShortDesc(product.short_description || '');
      setLongDesc(product.long_description || '');
      setModel3dUrl(product.model_3d_url || '');
      setIsFeatured(product.is_featured || false);
      setTopNotes(product.top_notes || []);
      setMiddleNotes(product.middle_notes || []);
      setBaseNotes(product.base_notes || []);
      setImages(
        product.images?.map((img) => ({
          image_url: img.image_url,
          is_thumbnail: img.is_thumbnail,
        })) || []
      );
    } else {
      // Reset form
      setTitle('');
      setSlug('');
      setPrice('');
      setDiscountPrice('');
      setStockQuantity('15');
      setCategoryType('perfume');
      setVolume('100ml Extrait Spray');
      setShortDesc('');
      setLongDesc('');
      setModel3dUrl('');
      setIsFeatured(false);
      setTopNotes([]);
      setMiddleNotes([]);
      setBaseNotes([]);
      setImages([]);
    }
    setError(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleAddTopNote = () => {
    if (topNoteInput.trim() && !topNotes.includes(topNoteInput.trim())) {
      setTopNotes([...topNotes, topNoteInput.trim()]);
      setTopNoteInput('');
    }
  };

  const handleAddMiddleNote = () => {
    if (middleNoteInput.trim() && !middleNotes.includes(middleNoteInput.trim())) {
      setMiddleNotes([...middleNotes, middleNoteInput.trim()]);
      setMiddleNoteInput('');
    }
  };

  const handleAddBaseNote = () => {
    if (baseNoteInput.trim() && !baseNotes.includes(baseNoteInput.trim())) {
      setBaseNotes([...baseNotes, baseNoteInput.trim()]);
      setBaseNoteInput('');
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadAssetToStorage(file, 'images');
      if (res.success && res.publicUrl) {
        const isFirst = images.length === 0;
        setImages([...images, { image_url: res.publicUrl, is_thumbnail: isFirst }]);
      } else {
        setError(res.error || 'Failed to upload image to perfume-assets bucket.');
      }
    } catch (err: any) {
      setError(err?.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleModelFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingModel(true);
    try {
      const res = await uploadAssetToStorage(file, 'models');
      if (res.success && res.publicUrl) {
        setModel3dUrl(res.publicUrl);
      } else {
        setError(res.error || 'Failed to upload .glb file to perfume-assets bucket.');
      }
    } catch (err: any) {
      setError(err?.message || '3D model upload failed.');
    } finally {
      setUploadingModel(false);
    }
  };

  const setThumbnail = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        is_thumbnail: i === index,
      }))
    );
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.is_thumbnail)) {
      updated[0].is_thumbnail = true;
    }
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price.trim()) {
      setError('Title and Price are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const generatedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload: Partial<Product> = {
        id: product?.id,
        title: title.trim(),
        slug: generatedSlug,
        price: parseFloat(price),
        discount_price: discountPrice ? parseFloat(discountPrice) : null,
        stock_quantity: parseInt(stockQuantity, 10) || 0,
        category_type: categoryType,
        volume: volume.trim(),
        short_description: shortDesc.trim(),
        long_description: longDesc.trim(),
        model_3d_url: model3dUrl.trim() || null,
        is_featured: isFeatured,
        top_notes: topNotes,
        middle_notes: middleNotes,
        base_notes: baseNotes,
      };

      const result = await saveProduct(payload, images);
      if (!result.success) {
        throw new Error(result.error || 'Could not save product.');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-obsidian-400 border border-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-obsidian-300 text-champagne/70 hover:text-gold transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 mb-6">
          <span className="text-xs uppercase tracking-widest text-gold font-sans">
            Inventory & 3D Media Studio
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-white">
            {product ? `Edit: ${product.title}` : 'Add New Fragrance Flacon'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-sans">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-champagne/80 uppercase tracking-wider block">
                Perfume Title <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Oud Royal Extrait"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-champagne/80 uppercase tracking-wider block">
                Slug (URL identifier)
              </label>
              <input
                type="text"
                placeholder="oud-royal-extrait"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-champagne/80 uppercase tracking-wider block">
                Retail Price (Rs.) <span className="text-gold">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                placeholder="14500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-champagne/80 uppercase tracking-wider block">
                Discount Price (Rs. Optional)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="12900"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-champagne/80 uppercase tracking-wider block">
                Inventory Stock Quantity <span className="text-gold">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="14"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-champagne/80 uppercase tracking-wider block">
                Category Type <span className="text-gold">*</span>
              </label>
              <select
                value={categoryType}
                onChange={(e) => {
                  const val = e.target.value as 'perfume' | 'attar';
                  setCategoryType(val);
                  if (!product) {
                    setVolume(val === 'attar' ? '12ml Pure Oil Tola' : '100ml Extrait Spray');
                  }
                }}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
              >
                <option value="perfume">Artisanal Perfume (100ml Spray)</option>
                <option value="attar">Pure Concentrated Attar / Ittar (12ml Tola)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-champagne/80 uppercase tracking-wider block">
                Bottle Volume & Presentation <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 100ml Extrait Spray or 12ml Crystal Tola"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
              />
            </div>

            <div className="flex items-center gap-3 pt-6 sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer text-champagne/90">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-gold rounded"
                />
                <span className="uppercase tracking-wider">Highlight as Featured in Hero</span>
              </label>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-champagne/80 uppercase tracking-wider block">
                Short Scent Teaser
              </label>
              <input
                type="text"
                placeholder="A majestic elixir of aged wild Cambodian oud, smoky leather, and imperial saffron."
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-champagne/80 uppercase tracking-wider block">
                Complete Olfactory Story / Long Description
              </label>
              <textarea
                rows={3}
                placeholder="Detailed notes, maceration time, mood and application advice..."
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
              />
            </div>
          </div>

          {/* Olfactory Notes Tag Inputs */}
          <div className="p-4 rounded-2xl bg-obsidian-500/60 border border-gold/15 space-y-4">
            <h4 className="font-serif text-sm text-gold uppercase tracking-wider">
              Olfactory Pyramid Tag Input
            </h4>

            {/* Top Notes */}
            <div className="space-y-1.5">
              <label className="text-champagne/70 uppercase tracking-wider block">
                Top Notes (Opening)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Golden Saffron, Italian Bergamot"
                  value={topNoteInput}
                  onChange={(e) => setTopNoteInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTopNote();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-obsidian-400 border border-gold/20 text-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTopNote}
                  className="px-3 py-2 rounded-lg bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-obsidian transition-colors text-xs"
                >
                  Add Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {topNotes.map((note, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-obsidian-300 border border-gold/20 text-champagne text-[11px] flex items-center gap-1.5"
                  >
                    <span>{note}</span>
                    <button
                      type="button"
                      onClick={() => setTopNotes(topNotes.filter((_, idx) => idx !== i))}
                      className="hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Middle Notes */}
            <div className="space-y-1.5">
              <label className="text-champagne/70 uppercase tracking-wider block">
                Heart Notes (Middle)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Rose De Mai, Smoked Leather"
                  value={middleNoteInput}
                  onChange={(e) => setMiddleNoteInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMiddleNote();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-obsidian-400 border border-gold/20 text-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddMiddleNote}
                  className="px-3 py-2 rounded-lg bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-obsidian transition-colors text-xs"
                >
                  Add Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {middleNotes.map((note, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-obsidian-300 border border-gold/20 text-champagne text-[11px] flex items-center gap-1.5"
                  >
                    <span>{note}</span>
                    <button
                      type="button"
                      onClick={() => setMiddleNotes(middleNotes.filter((_, idx) => idx !== i))}
                      className="hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Base Notes */}
            <div className="space-y-1.5">
              <label className="text-champagne/70 uppercase tracking-wider block">
                Base Notes (Drydown)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Aged Cambodian Oud, Ambergris"
                  value={baseNoteInput}
                  onChange={(e) => setBaseNoteInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBaseNote();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-obsidian-400 border border-gold/20 text-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddBaseNote}
                  className="px-3 py-2 rounded-lg bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-obsidian transition-colors text-xs"
                >
                  Add Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {baseNotes.map((note, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-obsidian-300 border border-gold/20 text-champagne text-[11px] flex items-center gap-1.5"
                  >
                    <span>{note}</span>
                    <button
                      type="button"
                      onClick={() => setBaseNotes(baseNotes.filter((_, idx) => idx !== i))}
                      className="hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* 3D Model & Supabase Storage Bucket Upload */}
          <div className="p-4 rounded-2xl bg-obsidian-500/60 border border-gold/15 space-y-4">
            <h4 className="font-serif text-sm text-gold uppercase tracking-wider flex items-center gap-2">
              <Box className="w-4 h-4 text-gold" />
              <span>3D Model Asset (.glb / .gltf)</span>
            </h4>

            <div className="space-y-2">
              <label className="text-champagne/70 uppercase tracking-wider block">
                Upload .glb Model File to Supabase Storage Bucket ('perfume-assets')
              </label>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2.5 rounded-xl border border-dashed border-gold/40 hover:border-gold bg-obsidian-400 text-champagne/80 hover:text-gold cursor-pointer transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4 text-gold" />
                  <span>{uploadingModel ? 'Uploading to Supabase...' : 'Select .glb file'}</span>
                  <input
                    type="file"
                    accept=".glb,.gltf"
                    className="hidden"
                    onChange={handleModelFileUpload}
                    disabled={uploadingModel}
                  />
                </label>

                {model3dUrl && (
                  <span className="text-[11px] text-emerald-400 font-mono truncate max-w-xs">
                    Linked: {model3dUrl.substring(model3dUrl.lastIndexOf('/') + 1)}
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="Or paste public 3D .glb URL directly"
                value={model3dUrl}
                onChange={(e) => setModel3dUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-obsidian-400 border border-gold/20 text-white text-xs mt-1"
              />
            </div>
          </div>

          {/* Image Gallery Manager */}
          <div className="p-4 rounded-2xl bg-obsidian-500/60 border border-gold/15 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-serif text-sm text-gold uppercase tracking-wider">
                Image Gallery & Thumbnail Manager
              </h4>
              <label className="px-3 py-1.5 rounded-lg border border-gold/30 hover:border-gold text-gold text-xs cursor-pointer flex items-center gap-1.5 bg-gold/10">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileUpload}
                  disabled={uploadingImage}
                />
              </label>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden border group bg-obsidian-600 ${
                    img.is_thumbnail ? 'border-gold ring-2 ring-gold/40' : 'border-gold/20'
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt="Perfume photo"
                    fill
                    className="object-cover"
                  />
                  {img.is_thumbnail && (
                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gold text-obsidian">
                      Thumbnail
                    </span>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-obsidian/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 p-2">
                    {!img.is_thumbnail && (
                      <button
                        type="button"
                        onClick={() => setThumbnail(idx)}
                        className="px-2 py-1 rounded bg-gold/80 text-obsidian font-bold text-[10px] uppercase tracking-wider"
                      >
                        Set Thumbnail
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1.5 rounded-full bg-red-950/80 text-red-400 border border-red-500/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-gold/15">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-full border border-gold/30 hover:border-gold text-champagne/80 text-xs uppercase tracking-wider font-serif"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3.5 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-wider shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-obsidian" />
                  <span>Saving Flacon...</span>
                </>
              ) : (
                <span>Save Product</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
