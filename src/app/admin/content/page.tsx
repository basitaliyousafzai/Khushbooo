'use client';

import React, { useEffect, useState } from 'react';
import {
  FileText,
  Save,
  Plus,
  Sparkles,
  Check,
  AlertCircle,
  RefreshCw,
  Search,
  Layers,
  HelpCircle
} from 'lucide-react';
import { getAllSiteContentList, updateSiteContentItem } from '@/lib/data/site-content';
import { SiteContent } from '@/types';

export default function ContentManagerPage() {
  const [contentList, setContentList] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // New Key Modal / Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState('general');

  // Filter category
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const fetchContent = async () => {
    setLoading(true);
    try {
      const data = await getAllSiteContentList();
      setContentList(data);
    } catch (err) {
      console.error('Failed to load content list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleValueChange = (key: string, value: string) => {
    setContentList((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  const handleSaveItem = async (item: SiteContent) => {
    setSavingKey(item.key);
    setErrorToast(null);
    setSuccessToast(null);

    try {
      const res = await updateSiteContentItem({
        key: item.key,
        value: item.value,
        label: item.label,
        category: item.category,
      });

      if (!res.success) {
        throw new Error(res.error || 'Failed to update content key');
      }

      setSuccessToast(`Saved "${item.label || item.key}" successfully!`);
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: any) {
      setErrorToast(err?.message || 'Update failed.');
      setTimeout(() => setErrorToast(null), 4000);
    } finally {
      setSavingKey(null);
    }
  };

  const handleAddNewKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    try {
      const formattedKey = newKey.trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_');
      await updateSiteContentItem({
        key: formattedKey,
        value: newValue.trim(),
        label: newLabel.trim() || formattedKey,
        category: newCategory,
      });

      setShowAddModal(false);
      setNewKey('');
      setNewValue('');
      setNewLabel('');
      setSuccessToast(`Created new content key "${formattedKey}"`);
      setTimeout(() => setSuccessToast(null), 3000);
      fetchContent();
    } catch (err: any) {
      setErrorToast(err?.message || 'Failed to create key.');
    }
  };

  const categories = ['all', 'branding', 'social', 'header', 'hero', 'notes', 'catalogue', 'about', 'contact', 'store'];

  const filteredContent = contentList.filter((item) => {
    const matchesCat = selectedCategory === 'all' || (item.category || 'general') === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      item.key.toLowerCase().includes(search.toLowerCase()) ||
      (item.label && item.label.toLowerCase().includes(search.toLowerCase())) ||
      item.value.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Toast Alert Notifications */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-sans flex items-center gap-2 shadow-2xl backdrop-blur-md animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {errorToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-red-950/90 border border-red-500/50 text-red-300 text-xs font-sans flex items-center gap-2 shadow-2xl backdrop-blur-md animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold font-sans">
            Supabase Dynamic Data Layer
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white">
            Site Content Manager
          </h1>
          <p className="text-xs text-champagne/60 font-sans mt-0.5">
            Zero Hardcoded Content Rule: All client-facing headlines, stories, announcements, and contact lines are dynamically loaded from table <code className="text-gold font-mono">site_content</code>.
          </p>
        </div>

        <div className="flex gap-3 self-start sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-widest transition-all shadow-md shadow-gold/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Key</span>
          </button>

          <button
            onClick={fetchContent}
            className="p-2.5 rounded-full border border-gold/30 hover:border-gold text-champagne hover:text-gold transition-colors"
            title="Refresh Table"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider font-sans transition-all border ${
                selectedCategory === cat
                  ? 'bg-gold text-obsidian border-gold font-bold shadow-md shadow-gold/20'
                  : 'bg-obsidian-400 text-champagne/70 border-gold/15 hover:border-gold/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search content key or phrase..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-400 border border-gold/20 focus:border-gold focus:outline-none text-white text-xs font-sans"
          />
        </div>
      </div>

      {/* Content Editor List */}
      <div className="space-y-4">
        {filteredContent.map((item) => {
          const isSaving = savingKey === item.key;
          const isMultiline = item.value.length > 80 || item.key.includes('description') || item.key.includes('story');

          return (
            <div
              key={item.key}
              className="p-6 rounded-2xl bg-obsidian-400 border border-gold/20 hover:border-gold/40 transition-all space-y-3 shadow-lg"
            >
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm text-white font-medium">
                    {item.label || item.key}
                  </span>
                  <span className="font-mono text-[11px] text-gold/80 bg-obsidian-500 px-2 py-0.5 rounded border border-gold/15">
                    key: {item.key}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-champagne/50 px-2 py-0.5 rounded bg-obsidian-300">
                    {item.category || 'general'}
                  </span>
                </div>

                <button
                  onClick={() => handleSaveItem(item)}
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded-full bg-gold/15 hover:bg-gold text-gold hover:text-obsidian border border-gold/30 hover:border-gold text-xs uppercase tracking-wider font-serif font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Updating...' : 'Save Live'}</span>
                </button>
              </div>

              {/* Editable Field */}
              {isMultiline ? (
                <textarea
                  rows={3}
                  value={item.value}
                  onChange={(e) => handleValueChange(item.key, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm font-sans leading-relaxed"
                />
              ) : (
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => handleValueChange(item.key, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm font-sans"
                />
              )}

              {item.updated_at && (
                <div className="text-[10px] text-champagne/40 text-right">
                  Last updated: {new Date(item.updated_at).toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Key Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-obsidian-400 border border-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <h3 className="font-serif text-2xl text-white">Add New Dynamic Content Key</h3>

            <form onSubmit={handleAddNewKey} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-champagne/80 uppercase tracking-wider block">Database Key (e.g. holiday_discount_notice)</label>
                <input
                  type="text"
                  required
                  placeholder="holiday_discount_notice"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold text-white text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-champagne/80 uppercase tracking-wider block">Human-Friendly Label</label>
                <input
                  type="text"
                  placeholder="Holiday Discount Announcement"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold text-white text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-champagne/80 uppercase tracking-wider block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-500 border border-gold/20 text-white text-sm"
                >
                  <option value="general">General</option>
                  <option value="social">Social Media Channels</option>
                  <option value="branding">Brand & Identity</option>
                  <option value="header">Header & Announcement</option>
                  <option value="hero">Hero Section</option>
                  <option value="notes">Olfactory Notes</option>
                  <option value="catalogue">Product Catalogue</option>
                  <option value="about">About & Story</option>
                  <option value="contact">Contact & Concierge</option>
                  <option value="store">Store Policies & Fees</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-champagne/80 uppercase tracking-wider block">Initial Value</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter initial client-facing content..."
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold text-white text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-full border border-gold/30 hover:border-gold text-champagne text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-wider"
                >
                  Add Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
