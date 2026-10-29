export interface SiteContent {
  id?: string;
  key: string;
  value: string;
  label?: string;
  category?: string;
  updated_at?: string;
}

export type SiteContentMap = Record<string, string>;

export interface ProductImage {
  id?: string;
  product_id?: string;
  image_url: string;
  is_thumbnail: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  long_description?: string;
  price: number;
  discount_price?: number | null;
  stock_quantity: number;
  category_type?: 'perfume' | 'attar';
  volume?: string; // e.g. "100ml Extrait" or "12ml Pure Oil Tola"
  top_notes: string[];
  middle_notes: string[];
  base_notes: string[];
  model_3d_url?: string | null;
  is_featured: boolean;
  created_at?: string;
  images?: ProductImage[];
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string | null;
  product_title: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  shipping_address: string;
  city: string;
  order_notes?: string | null;
  total_amount: number;
  status: OrderStatus;
  courier_name?: string | null;
  courier_tracking_id?: string | null;
  dispatched_at?: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// ============================================================================
// 3D BACKGROUND STUDIO TYPES
// ============================================================================

export type AnimationPresetId =
  | 'cinematic-3d-parallax'
  | 'floating-product'
  | 'scroll-reveal'
  | 'perspective-zoom'
  | 'rotating-3d'
  | 'multi-layer-depth'
  | 'particle-atmosphere'
  | 'spotlight-glow'
  | 'horizontal-motion'
  | 'image-sequence'
  | 'smooth-reverse'
  | 'minimal-premium';

export type LayerType =
  | 'background'
  | 'subject'
  | 'floating_element'
  | 'particles'
  | 'lighting_glow';

export type MovementDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'orbit'
  | 'depth_zoom'
  | 'float';

export type BlendMode =
  | 'normal'
  | 'screen'
  | 'overlay'
  | 'soft-light'
  | 'luminosity'
  | 'color-dodge';

export interface BackgroundLayer {
  id: string;
  name: string;
  layer_type: LayerType;
  image_url?: string;
  depth: number; // -1.0 (far background) to 1.0 (foreground)
  parallax_factor: number; // 0.1 to 3.0
  position_x: number; // percentage offset -50 to 50
  position_y: number; // percentage offset -50 to 50
  scale: number; // 0.2 to 3.0
  rotation: number; // degrees -180 to 180
  opacity: number; // 0.0 to 1.0
  scroll_start?: number; // 0.0 to 1.0
  scroll_end?: number; // 0.0 to 1.0
  movement_direction: MovementDirection;
  speed: number; // relative layer speed
  blend_mode: BlendMode;
  blur: number; // blur in px
  visible_desktop: boolean;
  visible_tablet: boolean;
  visible_mobile: boolean;
}

export interface SceneGlobalSettings {
  speed: number;
  scroll_sensitivity: number;
  depth_intensity: number;
  rotation_intensity: number;
  movement_intensity: number;
  blur: number;
  opacity: number;
  blend_mode: BlendMode;
  responsive_visibility: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
  reduced_motion_fallback: 'static' | 'subtle' | 'fade';
  particle_count?: number;
  particle_color?: string;
  light_tint?: string;
}

export type SceneTargetPage = 'all' | 'home' | 'collection' | 'notes-explorer' | 'heritage' | string;
export type SceneTargetSection = 'hero' | 'behind_content' | 'full_section' | 'page_background';

export interface BackgroundScene {
  id: string;
  name: string;
  target_page: SceneTargetPage;
  target_section: SceneTargetSection;
  preset: AnimationPresetId;
  is_active: boolean;
  is_published: boolean;
  order_index: number;
  global_settings: SceneGlobalSettings;
  layers: BackgroundLayer[];
  history_snapshot?: BackgroundScene | null;
  version: number;
  created_at: string;
  updated_at: string;
}
