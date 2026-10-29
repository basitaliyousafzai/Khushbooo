import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { createSupabaseServerClient, isSupabaseConfiguredServer } from '@/lib/supabase/server';
import { BackgroundScene, BackgroundLayer } from '@/types';

// ============================================================================
// CURATED LUXURY STARTER SCENES
// ============================================================================

export const DEFAULT_BACKGROUND_SCENES: BackgroundScene[] = [
  {
    id: 'scene-001-saffron-amber',
    name: 'Imperial Saffron & Amber Sanctuary',
    target_page: 'home',
    target_section: 'hero',
    preset: 'cinematic-3d-parallax',
    is_active: true,
    is_published: true,
    order_index: 0,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    global_settings: {
      speed: 1.0,
      scroll_sensitivity: 1.2,
      depth_intensity: 1.3,
      rotation_intensity: 0.6,
      movement_intensity: 1.0,
      blur: 0,
      opacity: 0.85,
      blend_mode: 'normal',
      responsive_visibility: {
        desktop: true,
        tablet: true,
        mobile: true,
      },
      reduced_motion_fallback: 'subtle',
      particle_count: 50,
      particle_color: '#D4AF37',
      light_tint: '#F5ECCB',
    },
    layers: [
      {
        id: 'layer-01-deep-gradient',
        name: 'Deep Obsidian & Gold Aura',
        layer_type: 'background',
        image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80',
        depth: -0.9,
        parallax_factor: 0.2,
        position_x: 0,
        position_y: 0,
        scale: 1.15,
        rotation: 0,
        opacity: 0.35,
        scroll_start: 0,
        scroll_end: 1,
        movement_direction: 'down',
        speed: 0.4,
        blend_mode: 'screen',
        blur: 4,
        visible_desktop: true,
        visible_tablet: true,
        visible_mobile: true,
      },
      {
        id: 'layer-02-macro-botanical',
        name: 'Kashmiri Saffron Essence Glow',
        layer_type: 'subject',
        image_url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1000&q=80',
        depth: -0.2,
        parallax_factor: 0.7,
        position_x: 25,
        position_y: -10,
        scale: 0.85,
        rotation: 12,
        opacity: 0.4,
        scroll_start: 0,
        scroll_end: 1,
        movement_direction: 'depth_zoom',
        speed: 0.9,
        blend_mode: 'screen',
        blur: 1,
        visible_desktop: true,
        visible_tablet: true,
        visible_mobile: false,
      },
      {
        id: 'layer-03-gold-particles',
        name: 'Suspended 24K Gold Flake Atmosphere',
        layer_type: 'particles',
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
        depth: 0.5,
        parallax_factor: 1.6,
        position_x: -20,
        position_y: 15,
        scale: 0.7,
        rotation: -8,
        opacity: 0.3,
        scroll_start: 0,
        scroll_end: 1,
        movement_direction: 'float',
        speed: 1.4,
        blend_mode: 'soft-light',
        blur: 2,
        visible_desktop: true,
        visible_tablet: false,
        visible_mobile: false,
      },
    ],
  },
  {
    id: 'scene-002-smoked-oud',
    name: 'Smoked Oud & Velvet Obsidian',
    target_page: 'home',
    target_section: 'behind_content',
    preset: 'floating-product',
    is_active: true,
    is_published: true,
    order_index: 1,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    global_settings: {
      speed: 0.8,
      scroll_sensitivity: 1.0,
      depth_intensity: 1.0,
      rotation_intensity: 0.4,
      movement_intensity: 0.8,
      blur: 0,
      opacity: 0.7,
      blend_mode: 'normal',
      responsive_visibility: {
        desktop: true,
        tablet: true,
        mobile: true,
      },
      reduced_motion_fallback: 'fade',
      particle_count: 30,
      particle_color: '#C5A059',
      light_tint: '#D4AF37',
    },
    layers: [
      {
        id: 'layer-04-agarwood-grain',
        name: 'Aged Wild Agarwood Grain',
        layer_type: 'background',
        image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
        depth: -0.7,
        parallax_factor: 0.3,
        position_x: 0,
        position_y: 0,
        scale: 1.2,
        rotation: 0,
        opacity: 0.25,
        scroll_start: 0,
        scroll_end: 1,
        movement_direction: 'down',
        speed: 0.5,
        blend_mode: 'luminosity',
        blur: 3,
        visible_desktop: true,
        visible_tablet: true,
        visible_mobile: true,
      },
      {
        id: 'layer-05-spotlight-halo',
        name: 'Warm Concentrated Spotlight Halo',
        layer_type: 'lighting_glow',
        image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
        depth: 0.3,
        parallax_factor: 1.1,
        position_x: 0,
        position_y: 0,
        scale: 1.3,
        rotation: 0,
        opacity: 0.55,
        scroll_start: 0,
        scroll_end: 1,
        movement_direction: 'orbit',
        speed: 0.7,
        blend_mode: 'screen',
        blur: 16,
        visible_desktop: true,
        visible_tablet: true,
        visible_mobile: true,
      },
    ],
  },
];

// LocalStorage persistence key for offline fallback
const LOCAL_STORAGE_KEY = 'khushbooo_background_scenes_v1';

/**
 * Client-side fetch of all scenes (Admin Studio)
 */
export async function getBackgroundScenes(): Promise<BackgroundScene[]> {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // Fall through to database
    }
  }

  if (!isSupabaseConfigured()) {
    return DEFAULT_BACKGROUND_SCENES;
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('background_scenes')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_BACKGROUND_SCENES;
    }

    return data as BackgroundScene[];
  } catch (err) {
    return DEFAULT_BACKGROUND_SCENES;
  }
}

/**
 * Server Component fetch of published active scenes
 */
export async function getPublishedBackgroundScenesServer(
  targetSection?: string
): Promise<BackgroundScene[]> {
  if (!isSupabaseConfiguredServer()) {
    if (targetSection) {
      return DEFAULT_BACKGROUND_SCENES.filter(
        (s) => s.is_published && s.is_active && (s.target_section === targetSection || s.target_section === 'page_background')
      );
    }
    return DEFAULT_BACKGROUND_SCENES.filter((s) => s.is_published && s.is_active);
  }

  try {
    const supabase = createSupabaseServerClient();
    let query = supabase
      .from('background_scenes')
      .select('*')
      .eq('is_published', true)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (targetSection) {
      query = query.or(`target_section.eq.${targetSection},target_section.eq.page_background`);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return DEFAULT_BACKGROUND_SCENES.filter((s) => s.is_published && s.is_active);
    }

    return data as BackgroundScene[];
  } catch (err) {
    return DEFAULT_BACKGROUND_SCENES.filter((s) => s.is_published && s.is_active);
  }
}

/**
 * Client Component fetch of published active scenes
 */
export async function getPublishedBackgroundScenesClient(
  targetSection?: string
): Promise<BackgroundScene[]> {
  const all = await getBackgroundScenes();
  return all.filter((s) => {
    if (!s.is_published || !s.is_active) return false;
    if (targetSection) {
      return s.target_section === targetSection || s.target_section === 'page_background';
    }
    return true;
  });
}

/**
 * Save or Update a scene (Admin)
 */
export async function saveBackgroundScene(
  scene: BackgroundScene
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Update in-memory / local storage immediately
    if (typeof window !== 'undefined') {
      try {
        const current = await getBackgroundScenes();
        const existingIdx = current.findIndex((s) => s.id === scene.id);
        const updated = [...current];

        const sceneWithVersion: BackgroundScene = {
          ...scene,
          version: (scene.version || 1) + 1,
          updated_at: new Date().toISOString(),
        };

        if (existingIdx >= 0) {
          // Save history snapshot of previous state for "Restore Previous Version"
          sceneWithVersion.history_snapshot = current[existingIdx];
          updated[existingIdx] = sceneWithVersion;
        } else {
          updated.push(sceneWithVersion);
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (storageErr) {
        // Continue to Supabase
      }
    }

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      const payload: any = {
        name: scene.name,
        target_page: scene.target_page,
        target_section: scene.target_section,
        preset: scene.preset,
        is_active: scene.is_active,
        is_published: scene.is_published,
        order_index: scene.order_index,
        global_settings: scene.global_settings,
        layers: scene.layers,
        version: (scene.version || 1) + 1,
        updated_at: new Date().toISOString(),
      };

      if (scene.history_snapshot) {
        payload.history_snapshot = scene.history_snapshot;
      }

      const { error } = await supabase.from('background_scenes').upsert({
        id: scene.id,
        ...payload,
      });

      if (error) {
        // Fallback: update site_content key so public site has it
        await supabase.from('site_content').upsert({
          key: `background_scene_${scene.id}`,
          value: JSON.stringify(scene),
          label: `3D Scene: ${scene.name}`,
          category: 'background_studio',
        });
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save background scene' };
  }
}

/**
 * Publish a scene directly to the public website
 */
export async function publishBackgroundScene(
  sceneId: string
): Promise<{ success: boolean; error?: string }> {
  const scenes = await getBackgroundScenes();
  const target = scenes.find((s) => s.id === sceneId);
  if (!target) {
    return { success: false, error: 'Scene not found' };
  }

  target.is_published = true;
  target.is_active = true;
  return saveBackgroundScene(target);
}

/**
 * Duplicate a scene
 */
export async function duplicateBackgroundScene(
  sceneId: string
): Promise<{ success: boolean; duplicatedScene?: BackgroundScene; error?: string }> {
  const scenes = await getBackgroundScenes();
  const source = scenes.find((s) => s.id === sceneId);
  if (!source) {
    return { success: false, error: 'Scene not found' };
  }

  const newId = `scene-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const duplicate: BackgroundScene = {
    ...JSON.parse(JSON.stringify(source)),
    id: newId,
    name: `${source.name} (Copy)`,
    is_published: false,
    order_index: scenes.length,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1,
  };

  const res = await saveBackgroundScene(duplicate);
  if (res.success) {
    return { success: true, duplicatedScene: duplicate };
  }
  return { success: false, error: res.error };
}

/**
 * Delete a scene
 */
export async function deleteBackgroundScene(
  sceneId: string
): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== 'undefined') {
    try {
      const current = await getBackgroundScenes();
      const filtered = current.filter((s) => s.id !== sceneId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {}
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.from('background_scenes').delete().eq('id', sceneId);
    } catch (err) {}
  }

  return { success: true };
}

/**
 * Restore previous version from history snapshot
 */
export async function restorePreviousVersion(
  sceneId: string
): Promise<{ success: boolean; restoredScene?: BackgroundScene; error?: string }> {
  const scenes = await getBackgroundScenes();
  const current = scenes.find((s) => s.id === sceneId);
  if (!current || !current.history_snapshot) {
    return { success: false, error: 'No previous revision snapshot found' };
  }

  const restored: BackgroundScene = {
    ...current.history_snapshot,
    id: current.id,
    version: (current.version || 1) + 1,
    updated_at: new Date().toISOString(),
  };

  const res = await saveBackgroundScene(restored);
  if (res.success) {
    return { success: true, restoredScene: restored };
  }
  return { success: false, error: res.error };
}
