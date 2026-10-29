'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Layers,
  Upload,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Eye,
  Check,
  AlertCircle,
  Sliders,
  Compass,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Send,
  History,
  Move,
  Maximize2,
  Minimize2,
  HelpCircle,
  FileImage,
  RefreshCw,
  Wand2
} from 'lucide-react';
import {
  BackgroundScene,
  BackgroundLayer,
  AnimationPresetId,
  LayerType,
  MovementDirection,
  BlendMode,
  SceneTargetSection
} from '@/types';
import {
  getBackgroundScenes,
  saveBackgroundScene,
  publishBackgroundScene,
  duplicateBackgroundScene,
  deleteBackgroundScene,
  restorePreviousVersion,
  DEFAULT_BACKGROUND_SCENES
} from '@/lib/data/background-studio';
import { uploadAssetToStorage } from '@/lib/data/products';
import { analyzeImageFile, ImageAnalysisResult } from '@/lib/services/ai-provider';
import { DynamicBackgroundRenderer } from '@/components/canvas/DynamicBackgroundRenderer';

export default function BackgroundStudioPage() {
  const [scenes, setScenes] = useState<BackgroundScene[]>([]);
  const [activeSceneId, setActiveSceneId] = useState<string>('');
  const [selectedLayerId, setSelectedLayerId] = useState<string>('');

  // Studio Interactive Simulator State
  const [scrubberValue, setScrubberValue] = useState<number>(0.15);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showContentOverlay, setShowContentOverlay] = useState<boolean>(true);

  // Status & Notification State
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // File Upload & Analysis State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);

  // Load scenes on mount
  useEffect(() => {
    loadScenes();
  }, []);

  const loadScenes = async () => {
    setLoading(true);
    try {
      const data = await getBackgroundScenes();
      setScenes(data);
      if (data.length > 0 && !activeSceneId) {
        setActiveSceneId(data[0].id);
        if (data[0].layers?.length > 0) {
          setSelectedLayerId(data[0].layers[0].id);
        }
      }
    } catch (err: any) {
      notify('error', 'Failed to load background scenes.');
    } finally {
      setLoading(false);
    }
  };

  const activeScene = scenes.find((s) => s.id === activeSceneId) || scenes[0];
  const selectedLayer = activeScene?.layers?.find((l) => l.id === selectedLayerId) || activeScene?.layers?.[0];

  // Auto-play scrubber animation simulator
  useEffect(() => {
    let animId: number;
    let direction = 1;

    if (isPlaying) {
      const tick = () => {
        setScrubberValue((prev) => {
          let next = prev + 0.004 * direction;
          if (next >= 1) {
            next = 1;
            direction = -1;
          } else if (next <= 0) {
            next = 0;
            direction = 1;
          }
          return next;
        });
        animId = requestAnimationFrame(tick);
      };
      animId = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const notify = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4500);
  };

  // Preset Catalog
  const presets: { id: AnimationPresetId; name: string; desc: string; icon: string }[] = [
    { id: 'cinematic-3d-parallax', name: 'Cinematic 3D Parallax', desc: 'Layered visual depth moving at variable relative speeds on scroll', icon: '🌌' },
    { id: 'floating-product', name: 'Floating Product', desc: 'Isolated flacon or subject with gentle float & atmospheric glow', icon: '✨' },
    { id: 'perspective-zoom', name: 'Perspective Zoom', desc: 'Camera dollies inward, expanding layers into the foreground', icon: '🔭' },
    { id: 'rotating-3d', name: 'Rotating 3D Object', desc: 'Subject rotates along its 3D axis smoothly in sync with scroll', icon: '🔄' },
    { id: 'scroll-reveal', name: 'Scroll Reveal', desc: 'Gentle scale-up and opacity fade-in as user scrolls down', icon: '🎭' },
    { id: 'multi-layer-depth', name: 'Multi-Layer Depth', desc: 'Foreground, midground, and background move with high-contrast depth', icon: '🥞' },
    { id: 'particle-atmosphere', name: 'Particle Atmosphere', desc: 'Gold dust particles and ambient light drift across the background', icon: '✨' },
    { id: 'spotlight-glow', name: 'Spotlight & Glow', desc: 'Focused radial lighting that follows the user journey', icon: '💡' },
    { id: 'horizontal-motion', name: 'Horizontal Motion', desc: 'Layers glide horizontally across the screen while scrolling', icon: '↔️' },
    { id: 'image-sequence', name: 'Image Sequence', desc: 'Continuous scrubbing through visual asset keyframes', icon: '🎞️' },
    { id: 'smooth-reverse', name: 'Smooth Reverse Scroll', desc: 'Instant backward translation when scrolling back upward', icon: '⏪' },
    { id: 'minimal-premium', name: 'Minimal Premium', desc: 'Subtle, understated luxury motion for editorial focus', icon: '👑' },
  ];

  // Update current scene field
  const updateScene = (updates: Partial<BackgroundScene>) => {
    if (!activeScene) return;
    const updated = scenes.map((s) => (s.id === activeScene.id ? { ...s, ...updates } : s));
    setScenes(updated);
  };

  // Update global settings
  const updateGlobalSettings = (updates: Partial<BackgroundScene['global_settings']>) => {
    if (!activeScene) return;
    updateScene({
      global_settings: {
        ...activeScene.global_settings,
        ...updates,
      },
    });
  };

  // Update active layer
  const updateSelectedLayer = (updates: Partial<BackgroundLayer>) => {
    if (!activeScene || !selectedLayer) return;
    const updatedLayers = activeScene.layers.map((l) => (l.id === selectedLayer.id ? { ...l, ...updates } : l));
    updateScene({ layers: updatedLayers });
  };

  // Add new blank layer
  const handleAddLayer = () => {
    if (!activeScene) return;
    const newLayer: BackgroundLayer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${activeScene.layers.length + 1}`,
      layer_type: 'floating_element',
      image_url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
      depth: 0.1,
      parallax_factor: 1.0,
      position_x: 0,
      position_y: 0,
      scale: 1.0,
      rotation: 0,
      opacity: 0.85,
      scroll_start: 0,
      scroll_end: 1,
      movement_direction: 'float',
      speed: 1.0,
      blend_mode: 'normal',
      blur: 0,
      visible_desktop: true,
      visible_tablet: true,
      visible_mobile: true,
    };

    updateScene({ layers: [...activeScene.layers, newLayer] });
    setSelectedLayerId(newLayer.id);
    notify('info', 'New layer added to scene stack.');
  };

  // Delete layer
  const handleDeleteLayer = (layerId: string) => {
    if (!activeScene) return;
    if (activeScene.layers.length <= 1) {
      notify('error', 'A scene must have at least one layer.');
      return;
    }
    const filtered = activeScene.layers.filter((l) => l.id !== layerId);
    updateScene({ layers: filtered });
    if (selectedLayerId === layerId && filtered.length > 0) {
      setSelectedLayerId(filtered[0].id);
    }
    notify('info', 'Layer removed.');
  };

  // File Upload with Automatic Alpha & Aspect Analysis
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];

      // 1. Automatic Image Analysis Pipeline
      const analysis = await analyzeImageFile(file);
      setAnalysisResult(analysis);

      // 2. Upload to Supabase Storage
      const res = await uploadAssetToStorage(file, 'images');
      if (!res.success || !res.publicUrl) {
        throw new Error(res.error || 'Upload to storage bucket failed.');
      }

      // 3. Update or Add Layer with the uploaded asset
      if (selectedLayer) {
        updateSelectedLayer({
          image_url: res.publicUrl,
          name: file.name.replace(/\.[^/.]+$/, ''),
          layer_type: analysis.hasAlphaChannel ? 'subject' : 'background',
        });
      } else {
        handleAddLayer();
      }

      // Auto-suggest preset based on analysis if desired
      notify(
        'success',
        `Asset uploaded! Analyzed: ${analysis.classification.replace('_', ' ')} (${analysis.hasAlphaChannel ? 'Transparent PNG' : 'Solid Image'}). Recommended Preset: ${analysis.recommendedPreset}.`
      );
    } catch (err: any) {
      notify('error', err?.message || 'Failed to process and upload asset.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Save Scene (Draft)
  const handleSaveDraft = async () => {
    if (!activeScene) return;
    setSaving(true);
    try {
      const draftScene = { ...activeScene, is_published: false };
      const res = await saveBackgroundScene(draftScene);
      if (res.success) {
        notify('success', 'Scene configuration saved as draft.');
        loadScenes();
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      notify('error', err?.message || 'Failed to save draft.');
    } finally {
      setSaving(false);
    }
  };

  // Publish Scene to Website
  const handlePublish = async () => {
    if (!activeScene) return;
    setSaving(true);
    try {
      const publishedScene = { ...activeScene, is_published: true, is_active: true };
      const res = await saveBackgroundScene(publishedScene);
      if (res.success) {
        notify('success', `Published to live storefront! (${activeScene.target_section} section)`);
        loadScenes();
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      notify('error', err?.message || 'Failed to publish to public website.');
    } finally {
      setSaving(false);
    }
  };

  // Duplicate Scene
  const handleDuplicate = async () => {
    if (!activeScene) return;
    const res = await duplicateBackgroundScene(activeScene.id);
    if (res.success && res.duplicatedScene) {
      notify('success', `Created duplicate: ${res.duplicatedScene.name}`);
      await loadScenes();
      setActiveSceneId(res.duplicatedScene.id);
    }
  };

  // Restore Previous Revision Snapshot
  const handleRestore = async () => {
    if (!activeScene || !activeScene.history_snapshot) {
      notify('info', 'No previous revision history available for this scene.');
      return;
    }
    const res = await restorePreviousVersion(activeScene.id);
    if (res.success && res.restoredScene) {
      notify('success', 'Restored previous configuration successfully!');
      loadScenes();
    }
  };

  // Create brand new blank scene
  const handleCreateNewScene = () => {
    const newScene: BackgroundScene = {
      id: `scene-${Date.now()}`,
      name: 'New Bespoke 3D Atmosphere',
      target_page: 'home',
      target_section: 'hero',
      preset: 'cinematic-3d-parallax',
      is_active: true,
      is_published: false,
      order_index: scenes.length,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      global_settings: {
        speed: 1.0,
        scroll_sensitivity: 1.0,
        depth_intensity: 1.0,
        rotation_intensity: 0.5,
        movement_intensity: 1.0,
        blur: 0,
        opacity: 0.85,
        blend_mode: 'normal',
        responsive_visibility: { desktop: true, tablet: true, mobile: true },
        reduced_motion_fallback: 'fade',
      },
      layers: [
        {
          id: `layer-${Date.now()}-1`,
          name: 'Atmospheric Base',
          layer_type: 'background',
          image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
          depth: -0.8,
          parallax_factor: 0.3,
          position_x: 0,
          position_y: 0,
          scale: 1.1,
          rotation: 0,
          opacity: 0.5,
          scroll_start: 0,
          scroll_end: 1,
          movement_direction: 'down',
          speed: 0.5,
          blend_mode: 'screen',
          blur: 2,
          visible_desktop: true,
          visible_tablet: true,
          visible_mobile: true,
        },
      ],
    };

    setScenes([...scenes, newScene]);
    setActiveSceneId(newScene.id);
    setSelectedLayerId(newScene.layers[0].id);
    notify('info', 'Created new animation scene.');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Workflow Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gold/15">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative WebGL & 3D Layer Studio</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white tracking-wide mt-1">
            3D Background Studio
          </h1>
          <p className="text-xs text-champagne/60 font-sans mt-0.5">
            Create, configure, and publish dynamic scroll-synchronized 3D atmospheres and layered depth.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {activeScene?.history_snapshot && (
            <button
              onClick={handleRestore}
              className="px-3.5 py-2 rounded-xl border border-gold/30 hover:border-gold text-champagne hover:text-white text-xs font-sans flex items-center gap-1.5 bg-obsidian-400 hover:bg-obsidian-300 transition-all"
              title="Revert to last published revision"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gold" />
              <span>Restore Version</span>
            </button>
          )}

          <button
            onClick={handleDuplicate}
            className="px-3.5 py-2 rounded-xl border border-gold/30 hover:border-gold text-champagne hover:text-white text-xs font-sans flex items-center gap-1.5 bg-obsidian-400 hover:bg-obsidian-300 transition-all"
          >
            <Copy className="w-3.5 h-3.5 text-gold" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-gold/40 text-gold hover:bg-gold/10 text-xs font-sans font-bold flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-300 text-obsidian text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-gold/25 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish to Website</span>
          </button>
        </div>
      </div>

      {/* Notifications Toast */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-sans flex items-center justify-between transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-red-950/80 border-red-500/40 text-red-200'
              : 'bg-obsidian-300 border-gold/30 text-champagne'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-white/60 hover:text-white">
            ×
          </button>
        </div>
      )}

      {/* 2. Main Studio 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================== */}
        {/* COLUMN 1 (Left): Scene Navigator & Preset Deck (lg:col-span-3) */}
        {/* ============================================================== */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Scenes Deck */}
          <div className="p-4 rounded-2xl bg-obsidian-400 border border-gold/20 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-gold font-sans font-bold">
                Animation Scenes
              </span>
              <button
                onClick={handleCreateNewScene}
                className="p-1 rounded-lg bg-gold/15 text-gold hover:bg-gold hover:text-obsidian transition-colors text-xs flex items-center gap-1 px-2"
                title="Create New Scene"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {scenes.map((scene) => (
                <div
                  key={scene.id}
                  onClick={() => {
                    setActiveSceneId(scene.id);
                    if (scene.layers?.length > 0) setSelectedLayerId(scene.layers[0].id);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-sans ${
                    activeSceneId === scene.id
                      ? 'border-gold bg-gold/15 text-white shadow-md'
                      : 'border-gold/10 hover:border-gold/30 text-champagne/70 bg-obsidian-500/50'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-medium truncate">{scene.name}</div>
                    <div className="text-[9px] text-champagne/40 uppercase tracking-widest mt-0.5">
                      {scene.target_section} • {scene.layers.length} Layers
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {scene.is_published && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="Published on Live Site" />
                    )}
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-obsidian-300 text-gold border border-gold/20">
                      v{scene.version || 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Section Placement */}
          {activeScene && (
            <div className="p-4 rounded-2xl bg-obsidian-400 border border-gold/20 shadow-xl space-y-3 text-xs font-sans">
              <span className="text-[11px] uppercase tracking-wider text-gold font-bold block">
                Target Section Assignment
              </span>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-champagne/60 block">
                  Scene Name
                </label>
                <input
                  type="text"
                  value={activeScene.name}
                  onChange={(e) => updateScene({ name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-500 border border-gold/20 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-champagne/60 block">
                  Mount Placement
                </label>
                <select
                  value={activeScene.target_section}
                  onChange={(e) => updateScene({ target_section: e.target.value as SceneTargetSection })}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-500 border border-gold/20 text-white focus:outline-none focus:border-gold text-xs"
                >
                  <option value="hero">Hero Flacon Stage (Behind 3D Bottle)</option>
                  <option value="behind_content">Behind Storefront Content</option>
                  <option value="full_section">Full Screen Section</option>
                  <option value="page_background">Global Page Canvas Backdrop</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-champagne/80">Active in Storefront:</span>
                <input
                  type="checkbox"
                  checked={activeScene.is_active}
                  onChange={(e) => updateScene({ is_active: e.target.checked })}
                  className="w-4 h-4 accent-gold rounded"
                />
              </div>
            </div>
          )}

          {/* 12 Animation Presets Deck */}
          {activeScene && (
            <div className="p-4 rounded-2xl bg-obsidian-400 border border-gold/20 shadow-xl space-y-3">
              <span className="text-[11px] uppercase tracking-wider text-gold font-sans font-bold block">
                Animation Presets
              </span>

              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => updateScene({ preset: preset.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all font-sans ${
                      activeScene.preset === preset.id
                        ? 'border-gold bg-gold/20 text-gold font-bold shadow-md shadow-gold/20'
                        : 'border-gold/10 hover:border-gold/30 text-champagne/70 bg-obsidian-500/40 hover:text-white'
                    }`}
                  >
                    <div className="text-base">{preset.icon}</div>
                    <div className="text-[10px] font-medium tracking-tight mt-1 truncate">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ============================================================== */}
        {/* COLUMN 2 (Center): Interactive Stage & Scrubber (lg:col-span-6) */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Studio Viewport */}
          <div className="relative rounded-3xl overflow-hidden border border-gold/30 bg-obsidian-700 shadow-2xl h-[460px] sm:h-[520px] flex flex-col justify-between">
            
            {/* Stage Top Bar */}
            <div className="relative z-20 p-4 flex items-center justify-between bg-obsidian-600/80 backdrop-blur-md border-b border-gold/15">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs uppercase tracking-wider text-white font-serif">
                  {activeScene?.name || 'Studio Stage'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-mono">
                  {activeScene?.preset}
                </span>
              </div>

              {/* Content Overlay Mockup Toggle */}
              <button
                onClick={() => setShowContentOverlay(!showContentOverlay)}
                className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider transition-all border font-sans ${
                  showContentOverlay
                    ? 'border-gold bg-gold/20 text-gold'
                    : 'border-gold/20 text-champagne/60 hover:text-white'
                }`}
              >
                Mockup Overlay: {showContentOverlay ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Dynamic Background Preview Area */}
            <div className="relative flex-1 w-full overflow-hidden">
              {activeScene && (
                <DynamicBackgroundRenderer
                  targetSection={activeScene.target_section}
                  previewScene={activeScene}
                  manualProgress={scrubberValue}
                  className="h-full w-full"
                >
                  {/* Realistic Storefront Mockup Overlay (to test readability) */}
                  {showContentOverlay && (
                    <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center space-y-4 select-none pointer-events-none">
                      <div className="px-3.5 py-1 rounded-full bg-obsidian-900/80 border border-gold/30 text-[10px] tracking-[0.25em] text-gold uppercase font-sans">
                        Sample Storefront Overlay
                      </div>
                      <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold tracking-tight max-w-md drop-shadow-lg">
                        The Soul of Scent, Sculpted in Time
                      </h2>
                      <p className="text-xs text-champagne/80 font-sans max-w-sm drop-shadow">
                        Rare Cambodian oud and French extraits. Content remains 100% legible above the dynamic layers.
                      </p>
                      <div className="flex gap-3 pt-2">
                        <span className="px-5 py-2 rounded-full bg-gold text-obsidian text-xs font-serif font-bold uppercase tracking-wider">
                          Explore Collection
                        </span>
                        <span className="px-5 py-2 rounded-full border border-gold/40 text-champagne text-xs font-serif uppercase tracking-wider">
                          Pure Attars
                        </span>
                      </div>
                    </div>
                  )}
                </DynamicBackgroundRenderer>
              )}
            </div>

            {/* Stage Bottom: Interactive Scroll Simulator & Scrubber Bar */}
            <div className="relative z-20 p-4 bg-obsidian-600/90 backdrop-blur-md border-t border-gold/20 space-y-3">
              <div className="flex items-center justify-between text-xs font-sans text-champagne/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-gold/20 text-gold hover:bg-gold hover:text-obsidian transition-colors"
                    title={isPlaying ? 'Pause Simulator' : 'Auto-Play Scroll Simulation'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-[11px] uppercase tracking-wider text-gold font-bold">
                    Scroll Progress: {Math.round(scrubberValue * 100)}%
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-champagne/60 font-mono">
                  <span>0% (Top of Section)</span>
                  <span>→</span>
                  <span>100% (Bottom)</span>
                </div>
              </div>

              {/* Interactive Scrub Slider */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.005"
                value={scrubberValue}
                onChange={(e) => {
                  setIsPlaying(false);
                  setScrubberValue(parseFloat(e.target.value));
                }}
                className="w-full h-2 bg-obsidian-400 rounded-lg appearance-none cursor-pointer accent-gold"
              />
            </div>
          </div>

          {/* Quick Asset Uploader & Analyzer Box */}
          <div className="p-4 rounded-2xl bg-obsidian-400 border border-gold/20 shadow-xl space-y-3 text-xs font-sans">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                <span>Automatic Image Analysis & Upload</span>
              </span>

              <label className="px-3.5 py-1.5 rounded-xl bg-gold/20 hover:bg-gold hover:text-obsidian text-gold text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Analyzing...' : 'Upload Image Asset'}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            <p className="text-[11px] text-champagne/60 leading-relaxed">
              Upload any PNG, WebP, or JPG. The engine automatically inspects the alpha channel and aspect ratio to separate foreground subjects from backgrounds, assigning ideal parallax factors.
            </p>

            {analysisResult && (
              <div className="p-3 rounded-xl bg-obsidian-500 border border-gold/15 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                <div>
                  <span className="text-champagne/50 block">Detected Type</span>
                  <span className="text-gold font-bold">{analysisResult.classification.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-champagne/50 block">Transparency</span>
                  <span className="text-white font-bold">{analysisResult.hasAlphaChannel ? 'Alpha Cutout' : 'Solid Image'}</span>
                </div>
                <div>
                  <span className="text-champagne/50 block">Aspect Ratio</span>
                  <span className="text-white font-mono">{analysisResult.aspectRatio.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-champagne/50 block">Suggested Preset</span>
                  <span className="text-gold font-bold">{analysisResult.recommendedPreset}</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ============================================================== */}
        {/* COLUMN 3 (Right): Multi-Layer Inspector (lg:col-span-3)        */}
        {/* ============================================================== */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Layer Stack Header */}
          <div className="p-4 rounded-2xl bg-obsidian-400 border border-gold/20 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-gold font-sans font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Layer Stack ({activeScene?.layers?.length || 0})</span>
              </span>

              <button
                onClick={handleAddLayer}
                className="p-1 rounded-lg bg-gold/15 text-gold hover:bg-gold hover:text-obsidian transition-colors text-xs flex items-center gap-1 px-2 font-sans"
              >
                <Plus className="w-3 h-3" />
                <span>Add Layer</span>
              </button>
            </div>

            {/* Layer Stack Item List */}
            <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
              {activeScene?.layers?.map((layer, idx) => (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-sans ${
                    selectedLayerId === layer.id
                      ? 'border-gold bg-gold/20 text-white font-medium'
                      : 'border-gold/10 hover:border-gold/30 text-champagne/70 bg-obsidian-500/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <div className="w-6 h-6 rounded bg-obsidian-300 overflow-hidden relative shrink-0 border border-gold/20">
                      {layer.image_url ? (
                        <Image src={layer.image_url} alt={layer.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gold/20" />
                      )}
                    </div>
                    <span className="truncate">{layer.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-obsidian-300 text-champagne/60">
                      {layer.layer_type.replace('_', ' ')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLayer(layer.id);
                      }}
                      className="text-champagne/40 hover:text-red-400 p-0.5"
                      title="Delete layer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Layer Properties Deck */}
          {selectedLayer && (
            <div className="p-4 rounded-2xl bg-obsidian-400 border border-gold/20 shadow-xl space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                <span className="text-[11px] uppercase tracking-wider text-gold font-bold">
                  Edit: {selectedLayer.name}
                </span>
                <span className="text-[9px] text-champagne/40 font-mono">ID: {selectedLayer.id.substring(0, 8)}</span>
              </div>

              {/* Layer Name & Type */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-champagne/60 block mb-1">
                    Layer Name
                  </label>
                  <input
                    type="text"
                    value={selectedLayer.name}
                    onChange={(e) => updateSelectedLayer({ name: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-obsidian-500 border border-gold/20 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-champagne/60 block mb-1">
                    Type
                  </label>
                  <select
                    value={selectedLayer.layer_type}
                    onChange={(e) => updateSelectedLayer({ layer_type: e.target.value as LayerType })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-obsidian-500 border border-gold/20 text-white text-xs"
                  >
                    <option value="background">Background</option>
                    <option value="subject">Main Subject</option>
                    <option value="floating_element">Floating Element</option>
                    <option value="particles">Particles</option>
                    <option value="lighting_glow">Lighting Glow</option>
                  </select>
                </div>
              </div>

              {/* Depth & Parallax Sliders */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-[10px] text-champagne/70 mb-1">
                    <span>Depth (Z-Axis): {selectedLayer.depth.toFixed(2)}</span>
                    <span className="text-champagne/40">-1.0 (Deep) to 1.0 (Front)</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    value={selectedLayer.depth}
                    onChange={(e) => updateSelectedLayer({ depth: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-obsidian-500 rounded accent-gold"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-champagne/70 mb-1">
                    <span>Parallax Factor: {selectedLayer.parallax_factor.toFixed(1)}x</span>
                    <span className="text-champagne/40">Relative Speed</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={selectedLayer.parallax_factor}
                    onChange={(e) => updateSelectedLayer({ parallax_factor: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-obsidian-500 rounded accent-gold"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-champagne/70 mb-1">
                    <span>Scale: {selectedLayer.scale.toFixed(2)}x</span>
                    <span>Opacity: {Math.round(selectedLayer.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.05"
                    value={selectedLayer.scale}
                    onChange={(e) => updateSelectedLayer({ scale: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-obsidian-500 rounded accent-gold"
                  />
                </div>
              </div>

              {/* Movement & Blend Mode */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-champagne/60 block mb-1">
                    Motion Vector
                  </label>
                  <select
                    value={selectedLayer.movement_direction}
                    onChange={(e) => updateSelectedLayer({ movement_direction: e.target.value as MovementDirection })}
                    className="w-full px-2 py-1.5 rounded-lg bg-obsidian-500 border border-gold/20 text-white text-xs"
                  >
                    <option value="float">Gentle Float</option>
                    <option value="depth_zoom">Depth Dolly Zoom</option>
                    <option value="up">Scroll Up</option>
                    <option value="down">Scroll Down</option>
                    <option value="left">Drift Left</option>
                    <option value="right">Drift Right</option>
                    <option value="orbit">Radial Orbit</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-champagne/60 block mb-1">
                    Blend Mode
                  </label>
                  <select
                    value={selectedLayer.blend_mode}
                    onChange={(e) => updateSelectedLayer({ blend_mode: e.target.value as BlendMode })}
                    className="w-full px-2 py-1.5 rounded-lg bg-obsidian-500 border border-gold/20 text-white text-xs"
                  >
                    <option value="normal">Normal</option>
                    <option value="screen">Screen (Light)</option>
                    <option value="overlay">Overlay</option>
                    <option value="soft-light">Soft Light</option>
                    <option value="luminosity">Luminosity</option>
                  </select>
                </div>
              </div>

              {/* Device Visibility Toggles */}
              <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-[11px] text-champagne/80">
                <span>Display on:</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1 cursor-pointer" title="Desktop Visibility">
                    <Monitor className="w-3.5 h-3.5 text-gold" />
                    <input
                      type="checkbox"
                      checked={selectedLayer.visible_desktop}
                      onChange={(e) => updateSelectedLayer({ visible_desktop: e.target.checked })}
                      className="accent-gold rounded"
                    />
                  </label>

                  <label className="flex items-center gap-1 cursor-pointer" title="Tablet Visibility">
                    <Tablet className="w-3.5 h-3.5 text-gold" />
                    <input
                      type="checkbox"
                      checked={selectedLayer.visible_tablet}
                      onChange={(e) => updateSelectedLayer({ visible_tablet: e.target.checked })}
                      className="accent-gold rounded"
                    />
                  </label>

                  <label className="flex items-center gap-1 cursor-pointer" title="Mobile Visibility">
                    <Smartphone className="w-3.5 h-3.5 text-gold" />
                    <input
                      type="checkbox"
                      checked={selectedLayer.visible_mobile}
                      onChange={(e) => updateSelectedLayer({ visible_mobile: e.target.checked })}
                      className="accent-gold rounded"
                    />
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* Global Scene Controls Card */}
          {activeScene && (
            <div className="p-4 rounded-2xl bg-obsidian-400 border border-gold/20 shadow-xl space-y-3 text-xs font-sans">
              <span className="text-[11px] uppercase tracking-wider text-gold font-bold block">
                Global Scene Dynamics
              </span>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-champagne/70">
                  <span>Scroll Sensitivity</span>
                  <span>{activeScene.global_settings.scroll_sensitivity}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={activeScene.global_settings.scroll_sensitivity}
                  onChange={(e) => updateGlobalSettings({ scroll_sensitivity: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-obsidian-500 rounded accent-gold"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-champagne/70">
                  <span>Depth Intensity</span>
                  <span>{activeScene.global_settings.depth_intensity}x</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2.0"
                  step="0.1"
                  value={activeScene.global_settings.depth_intensity}
                  onChange={(e) => updateGlobalSettings({ depth_intensity: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-obsidian-500 rounded accent-gold"
                />
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
