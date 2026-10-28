# Luxury 3D Perfume E-Commerce & Dynamic Admin Panel
**Architecture:** Next.js (App Router) + Tailwind CSS + Three.js / React Three Fiber + Supabase (PostgreSQL & Storage) + Vercel Deployment

---

## 1. Supabase SQL Setup (Run in Supabase SQL Editor)

Copy and execute this SQL code in your Supabase project's **SQL Editor** to prepare all database tables, storage policies, and security rules:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site-wide Dynamic Content (Zero Hardcoded Text)
CREATE TABLE site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed default site content
INSERT INTO site_content (key, value) VALUES
('site_name', 'Maison De Parfum'),
('announcement_bar', 'Complimentary nationwide delivery on orders above Rs. 4,999'),
('hero_tagline', 'The Art of Scent, Sculpted in Time'),
('hero_description', 'Experience artisanal luxury fragrances crafted with rare oud, delicate florals, and precious woods.'),
('hero_cta_text', 'Explore Fragrances'),
('about_story', 'Hand-poured extracts distilled from ethical botanicals across the world.'),
('contact_email', 'orders@yourperfumestore.com'),
('contact_phone', '+92 300 0000000')
ON CONFLICT (key) DO NOTHING;

-- 2. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    long_description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    discount_price NUMERIC(10, 2),
    stock_quantity INT DEFAULT 0,
    top_notes TEXT[] DEFAULT '{}',
    middle_notes TEXT[] DEFAULT '{}',
    base_notes TEXT[] DEFAULT '{}',
    model_3d_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Product Images Table
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_thumbnail BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Customer Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number SERIAL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    order_notes TEXT,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled')),
    courier_name TEXT,
    courier_tracking_id TEXT,
    dispatched_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL
);

-- 6. Storage Bucket Configuration
-- Create a public bucket in Supabase UI named: perfume-assets
-- (Storage -> New Bucket -> Name: 'perfume-assets' -> Set to Public)

-- Row Level Security (RLS) Policies
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public Read for storefront
CREATE POLICY "Public can view site content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can view product images" ON product_images FOR SELECT USING (true);

-- Public can place orders
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- Authenticated Admin Full Access
CREATE POLICY "Admin full access site_content" ON site_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access product_images" ON product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access order_items" ON order_items FOR ALL USING (auth.role() = 'authenticated');
```

---

## 2. Antigravity Master Prompt

Feed the following prompt directly into Antigravity:

```text
Build a production-ready, ultra-luxury 3D perfume e-commerce store with a dynamic admin management dashboard using Next.js (App Router), Tailwind CSS, Three.js / React Three Fiber, Lucide-react icons, and Supabase for backend and cloud storage.

CRITICAL ARCHITECTURE RULES:
1. ZERO Hardcoded Content:
   - All client-facing texts (hero headline, subheadings, announcements, stories, contact information) must be dynamically loaded from the Supabase table `site_content`.
   - Admin panel must feature a dedicated "Content Manager" page allowing real-time edits to all keys in `site_content`.

2. 3D Interactive Client Storefront:
   - Dark, high-end fragrance aesthetic (deep obsidian `#0a0a0a`, subtle satin gold accents `#D4AF37`, clean typography).
   - Sticky Hero canvas with a rotating 3D perfume bottle model (supporting `.glb` / `.gltf` loads with glass reflection and shadow effects).
   - Scrollytelling fragrance notes explorer (revealing Top, Middle, and Base notes with smooth visual transitions).
   - Product catalogue with real-time stock indicators ("In Stock", "Only X bottles left", "Sold Out").
   - Frictionless Cash on Delivery (COD) checkout modal collecting: Full Name, Phone Number, Delivery Address, City, and Order Notes.

3. Complete Admin Management Panel (`/admin`):
   - Protected routes guarded by Supabase Auth (Email + Password).
   - Order Dispatch Manager:
     * Filterable table for orders (Pending, Confirmed, Dispatched, Delivered, Cancelled).
     * Modal to transition status from "Confirmed" to "Dispatched" by requiring "Courier Service Name" and "Tracking ID".
     * Printable packaging slips for parcel dispatch.
     * Order creation automatically reduces product stock quantity.
   - Inventory & Media Manager:
     * Full CRUD for perfume products.
     * Direct image upload and `.glb` 3D model upload to Supabase Storage bucket (`perfume-assets`).
     * Tag input for fragrance notes (Top, Heart, Base).
     * Image gallery manager with thumbnail selection.
   - Analytics Overview:
     * Summary cards showing: Total Orders, Pending Dispatches, Revenue this Month, and Low Stock Alerts.

4. Free Tier Serverless Compliance:
   - Use official `@supabase/supabase-js` client with environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
   - Use Next.js Server Components and Server Actions where appropriate to ensure optimal SEO and fast load times on Vercel free tier.
```

---

## 3. Deployment Checklist (100% Free)

1. **Supabase:**
   * Create free project at [supabase.com](https://supabase.com).
   * Run the SQL setup script above.
   * Go to **Storage**, create a public bucket named `perfume-assets`.
   * Go to **Project Settings -> API** and copy:
     * Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
     * Anon Public Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
2. **GitHub:**
   * Push the generated codebase to a private GitHub repository.
3. **Vercel:**
   * Import your GitHub repository to [vercel.com](https://vercel.com).
   * Add the two Supabase environment variables.
   * Click **Deploy**.
4. **Custom Domain:**
   * In Vercel Project Settings $\rightarrow$ **Domains**, add your purchased domain name.
   * Update DNS records at your domain registrar as shown on Vercel. Automatic SSL will be issued for free.