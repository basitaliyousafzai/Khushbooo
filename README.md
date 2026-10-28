# Maison De Parfum — Ultra-Luxury 3D Perfume E-Commerce & Dynamic Admin Dashboard

A production-ready, ultra-luxury 3D perfume e-commerce store with an executive admin management panel built with **Next.js (App Router)**, **Tailwind CSS**, **Three.js / React Three Fiber**, **Lucide-react**, and **Supabase (PostgreSQL, Auth & Cloud Storage)**.

---

## ✨ Features & Architecture Highlights

### 1. Zero Hardcoded Content (Rule 1)
- **100% Dynamic Content:** All client-facing headlines, descriptions, announcement banner, artisanal heritage stories, and concierge contact information are loaded dynamically from the Supabase table `site_content`.
- **Live Content Manager (`/admin/content`):** Dedicated page allowing real-time edits to all keys in `site_content` with instant live save and custom key creation.

### 2. 3D Interactive Client Storefront (Rule 2)
- **Dark Haute Parfumerie Aesthetic:** Deep obsidian (`#0a0a0a`), satin gold accents (`#D4AF37`), champagne text, and glassmorphic card styling.
- **Sticky 3D Hero Canvas:** Photorealistic 3D flacon rendered with physical transmission (`MeshPhysicalMaterial`), crystal index of refraction (IOR 1.54), satin gold knurled cap, amber liquid core, studio lighting, contact shadows, interactive rotation, and interactive spray mist particle animation. Also supports loading custom `.glb` / `.gltf` 3D models.
- **Scrollytelling Fragrance Notes Explorer:** Visual 3-tier olfactory pyramid revealing **Top Notes** (0–30 mins), **Heart Notes** (2–4 hours), and **Base Notes** (6–12+ hours) with ingredient origin, concentration gauges, and scent accords.
- **Product Catalogue with Real-Time Stock Indicators:** Badges for `"In Stock"`, `"Only X left"` (scarcity pulse), and `"Sold Out"`.
- **Frictionless Cash on Delivery (COD) Checkout:** Instant modal collecting Full Name, Phone Number, Delivery Address, City, and Order Notes. Triggers celebratory confetti upon confirmation and automatic inventory stock deduction.

### 3. Complete Admin Management Panel (`/admin`) (Rule 3)
- **Protected Routes:** Guarded by Supabase Auth (Email + Password) with development demo bypass.
- **Order Dispatch Manager (`/admin/orders`):**
  - Filterable order status tabs (`Pending`, `Confirmed`, `Dispatched`, `Delivered`, `Cancelled`).
  - Search by customer name, phone number, city, or order number.
  - Dispatch transition modal requiring **"Courier Service Name"** (TCS, Leopards, Trax, DHL, etc.) and **"Tracking Airway Bill ID"**.
  - **Printable Packaging Slips:** Formatted dispatch invoice with recipient details, item breakdown, and barcode styling.
  - Automatic inventory stock decrement upon order placement.
- **Inventory & Media Manager (`/admin/products`):**
  - Full CRUD for fragrance flacons.
  - Direct image and `.glb` 3D model upload to Supabase Storage bucket (`perfume-assets`).
  - Tag inputs for fragrance notes (Top, Heart, Base).
  - Thumbnail manager and stock monitoring.
- **Analytics Overview (`/admin`):**
  - Summary metrics: **Total Orders**, **Pending Dispatches**, **Revenue this Month**, and **Low Stock Alerts**.
  - Recent orders feed with quick status pills.

---

## 🚀 Free Tier Deployment Guide (100% Free)

### Step 1: Supabase Setup (Database & Storage)
1. Sign in or create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** tab in your Supabase dashboard.
3. Open the file [`supabase/schema.sql`](./supabase/schema.sql) in this repository, paste its contents into the SQL Editor, and click **Run**.
4. Go to **Storage** -> **New Bucket**:
   - Bucket Name: `perfume-assets`
   - Set to **Public**
5. Go to **Project Settings** -> **API** and copy:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **Anon Public Key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Step 2: Local Environment
In the root directory, configure `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: GitHub & Vercel Deployment
1. Initialize git and push the repository to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit of Maison De Parfum luxury 3D store"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **Import Project**.
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will build and assign free automatic SSL certificates.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **3D Graphics:** Three.js + React Three Fiber (`@react-three/fiber`) + React Three Drei (`@react-three/drei`)
- **Styling:** Tailwind CSS + Lucide React Icons
- **Backend & Database:** Supabase (PostgreSQL, Storage, RLS, Edge Auth)
- **Delight & Audio/FX:** Canvas Confetti
