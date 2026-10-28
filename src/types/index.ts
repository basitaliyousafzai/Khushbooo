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
