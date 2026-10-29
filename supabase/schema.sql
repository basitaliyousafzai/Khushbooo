-- ==============================================================================
-- MAISON DE PARFUM - SUPABASE DATABASE SCHEMA & POLICIES
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Site-wide Dynamic Content (Zero Hardcoded Text Rule)
CREATE TABLE IF NOT EXISTS site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    label TEXT,
    category TEXT DEFAULT 'general',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category_type TEXT DEFAULT 'perfume',
    volume TEXT DEFAULT '100ml Extrait Spray',
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

-- Ensure columns exist if table was already created
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_type TEXT DEFAULT 'perfume';
ALTER TABLE products ADD COLUMN IF NOT EXISTS volume TEXT DEFAULT '100ml Extrait Spray';

-- 4. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_thumbnail BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Customer Orders Table
CREATE TABLE IF NOT EXISTS orders (
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

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public can view site content" ON site_content;
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Public can view product images" ON product_images;
DROP POLICY IF EXISTS "Public can insert orders" ON orders;
DROP POLICY IF EXISTS "Public can insert order items" ON order_items;
DROP POLICY IF EXISTS "Admin full access site_content" ON site_content;
DROP POLICY IF EXISTS "Admin full access products" ON products;
DROP POLICY IF EXISTS "Admin full access product_images" ON product_images;
DROP POLICY IF EXISTS "Admin full access orders" ON orders;
DROP POLICY IF EXISTS "Admin full access order_items" ON order_items;

-- Public storefront access
CREATE POLICY "Public can view site content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can view product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- Authenticated Admin Full Access
CREATE POLICY "Admin full access site_content" ON site_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access product_images" ON product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access order_items" ON order_items FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================================================
-- ATOMIC ORDER CREATION & STOCK DEDUCTION FUNCTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION place_order_with_stock_deduction(
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_email TEXT,
    p_shipping_address TEXT,
    p_city TEXT,
    p_order_notes TEXT,
    p_total_amount NUMERIC,
    p_items JSONB
) RETURNS JSONB AS $$
DECLARE
    v_order_id UUID;
    v_order_number INT;
    v_item RECORD;
BEGIN
    -- 1. Insert order
    INSERT INTO orders (
        customer_name,
        customer_phone,
        customer_email,
        shipping_address,
        city,
        order_notes,
        total_amount,
        status
    ) VALUES (
        p_customer_name,
        p_customer_phone,
        p_customer_email,
        p_shipping_address,
        p_city,
        p_order_notes,
        p_total_amount,
        'Pending'
    ) RETURNING id, order_number INTO v_order_id, v_order_number;

    -- 2. Insert order items & reduce stock
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
        product_id UUID,
        product_title TEXT,
        quantity INT,
        unit_price NUMERIC
    )
    LOOP
        INSERT INTO order_items (
            order_id,
            product_id,
            product_title,
            quantity,
            unit_price
        ) VALUES (
            v_order_id,
            v_item.product_id,
            v_item.product_title,
            v_item.quantity,
            v_item.unit_price
        );

        -- Atomically decrement product stock
        IF v_item.product_id IS NOT NULL THEN
            UPDATE products
            SET stock_quantity = GREATEST(0, stock_quantity - v_item.quantity)
            WHERE id = v_item.product_id;
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to public anon role
GRANT EXECUTE ON FUNCTION place_order_with_stock_deduction TO anon;
GRANT EXECUTE ON FUNCTION place_order_with_stock_deduction TO authenticated;

-- ==============================================================================
-- SEED INITIAL SITE CONTENT (Zero Hardcoded Text)
-- ==============================================================================

INSERT INTO site_content (key, value, label, category) VALUES
('site_name', 'Khushbooo', 'Store Name', 'branding'),
('site_tagline', 'Haute Parfumerie & Pure Concentrated Attars', 'Brand Subtitle', 'branding'),
('announcement_bar', 'Complimentary nationwide delivery on artisanal perfumes & pure attars above Rs. 4,999', 'Announcement Banner', 'header'),
('hero_tagline', 'The Soul of Scent, Sculpted in Time', 'Hero Headline', 'hero'),
('hero_description', 'Explore bespoke French extraits de parfum and pure aged Cambodian oud attars hand-distilled from ethical botanicals across Grasse, Kannauj, and Assam.', 'Hero Subheading', 'hero'),
('hero_cta_text', 'Explore Perfumes & Attars', 'Hero CTA Button', 'hero'),
('hero_secondary_cta', 'Discover The Notes', 'Hero Secondary Button', 'hero'),
('about_story', 'Hand-poured extracts and pure concentrated attar oils distilled from ethical botanicals across the world. Each flacon is an homage to timeless perfumery traditions, hand-finished with 24k gold leaf accents and matured over six months for peerless depth.', 'Heritage Story', 'about'),
('about_title', 'The Khushbooo Artisanal Legacy', 'Heritage Section Title', 'about'),
('contact_email', 'concierge@khushbooo.com', 'Support Email', 'contact'),
('contact_phone', '+92 300 8472948', 'Support Phone / WhatsApp', 'contact'),
('social_instagram', 'https://instagram.com/khushbooo.official', 'Instagram Profile URL (Leave empty to hide)', 'social'),
('social_whatsapp', 'https://wa.me/923008472948', 'WhatsApp Direct Chat URL (Leave empty to hide)', 'social'),
('social_facebook', 'https://facebook.com/khushbooo.fragrances', 'Facebook Page URL (Leave empty to hide)', 'social'),
('social_tiktok', 'https://tiktok.com/@khushbooo.official', 'TikTok Profile URL (Leave empty to hide)', 'social'),
('social_youtube', '', 'YouTube Channel URL (Leave empty to hide)', 'social'),
('currency_symbol', 'Rs.', 'Currency Symbol', 'store'),
('shipping_fee', '250', 'Standard Shipping Fee', 'store'),
('free_shipping_threshold', '4999', 'Free Shipping Threshold Amount', 'store')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    label = EXCLUDED.label,
    category = EXCLUDED.category;

-- ==============================================================================
-- SEED INITIAL LUXURY PRODUCTS (Perfumes & Attars)
-- ==============================================================================

-- 1. Oud Royal Extrait (Perfume)
INSERT INTO products (id, title, slug, category_type, volume, short_description, long_description, price, discount_price, stock_quantity, top_notes, middle_notes, base_notes, is_featured)
VALUES (
    'a1b2c3d4-0001-4000-8000-000000000001',
    'Oud Royal Extrait',
    'oud-royal-extrait',
    'perfume',
    '100ml Extrait Spray',
    'A majestic elixir of aged wild Cambodian oud, smoky leather, and imperial saffron.',
    'Formulated at an exquisite 35% extrait de parfum concentration. Oud Royal is an intoxicating tapestry of precious spices and 25-year aged oud. The opening delivers a burst of golden saffron and bergamot, melting into an intoxicating core of rose de mai before resting on dark bourbon vetiver and imperial Cambodian agarwood.',
    14500.00,
    12900.00,
    14,
    ARRAY['Golden Saffron', 'Italian Bergamot', 'Pink Peppercorn'],
    ARRAY['Rose De Mai', 'Smoked Leather', 'Nutmeg'],
    ARRAY['Aged Cambodian Oud', 'Bourbon Vetiver', 'Ambergris'],
    true
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    category_type = EXCLUDED.category_type,
    volume = EXCLUDED.volume,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    stock_quantity = EXCLUDED.stock_quantity;

-- 2. Dehn Al Oud Qadeem (Attar)
INSERT INTO products (id, title, slug, category_type, volume, short_description, long_description, price, discount_price, stock_quantity, top_notes, middle_notes, base_notes, is_featured)
VALUES (
    'a1b2c3d4-0002-4000-8000-000000000002',
    'Dehn Al Oud Qadeem',
    'dehn-al-oud-qadeem',
    'attar',
    '12ml Pure Oil Tola',
    'Pure 30-year aged wild Assam & Cambodian agarwood oil in hand-cut crystal tola flacon.',
    'A masterpiece pure concentrated oil distilled by hand in vintage copper stills. 100% uncut and alcohol-free. Opens with raw woody balsamic nuances, developing an intensely warm, animalic sweetness with phenomenal 24-hour skin longevity.',
    16500.00,
    14900.00,
    7,
    ARRAY['Wild Agarwood Smoke', 'Aged Resins'],
    ARRAY['Sweet Balsamic Oud', 'Smoked Earth'],
    ARRAY['Deep Cambodian Agarwood', 'Animalic Honey'],
    true
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    category_type = EXCLUDED.category_type,
    volume = EXCLUDED.volume,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    stock_quantity = EXCLUDED.stock_quantity;

-- 3. Soleil Dore Flacon (Perfume)
INSERT INTO products (id, title, slug, category_type, volume, short_description, long_description, price, discount_price, stock_quantity, top_notes, middle_notes, base_notes, is_featured)
VALUES (
    'a1b2c3d4-0003-4000-8000-000000000003',
    'Soleil Dore Flacon',
    'soleil-dore-flacon',
    'perfume',
    '100ml Extrait Spray',
    'Radiant golden tuberose, sun-warmed amber, and creamy Tahitian vanilla.',
    'Capturing the incandescent warmth of midsummer twilight along the Mediterranean. Soleil Dore wraps the wearer in velvety tuberose petals drenched in honeyed neroli, anchored by Mysore sandalwood and golden amber resins.',
    11500.00,
    9900.00,
    6,
    ARRAY['Neroli Sunburst', 'Mandarin Zest', 'Cardamom'],
    ARRAY['Golden Tuberose', 'Jasmine Sambac', 'Ylang Ylang'],
    ARRAY['Tahitian Vanilla', 'Mysore Sandalwood', 'White Amber'],
    true
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    category_type = EXCLUDED.category_type,
    volume = EXCLUDED.volume,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    stock_quantity = EXCLUDED.stock_quantity;

-- 4. Kasturi Musk Ghazal (Attar)
INSERT INTO products (id, title, slug, category_type, volume, short_description, long_description, price, discount_price, stock_quantity, top_notes, middle_notes, base_notes, is_featured)
VALUES (
    'a1b2c3d4-0004-4000-8000-000000000004',
    'Kasturi Musk Ghazal',
    'kasturi-musk-ghazal',
    'attar',
    '12ml Pure Oil Tola',
    'Silken imperial black musk attar with amber crystal veins and warm sandalwood oil base.',
    'Distilled using historic maceration techniques. Kasturi Musk Ghazal is pure velvet on the pulse points. Hypnotic, sensual, warm, and intimate, creating an intoxicating scent aura.',
    8900.00,
    7800.00,
    9,
    ARRAY['Spiced Saffron Stigma', 'Sweet Amber'],
    ARRAY['Imperial Black Musk', 'Nutmeg Flower'],
    ARRAY['Mysore Santal', 'Fossilized Amber'],
    false
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    category_type = EXCLUDED.category_type,
    volume = EXCLUDED.volume,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    stock_quantity = EXCLUDED.stock_quantity;

-- 5. Nocturne Ebene (Perfume)
INSERT INTO products (id, title, slug, category_type, volume, short_description, long_description, price, discount_price, stock_quantity, top_notes, middle_notes, base_notes, is_featured)
VALUES (
    'a1b2c3d4-0005-4000-8000-000000000005',
    'Nocturne Ebene',
    'nocturne-ebene',
    'perfume',
    '100ml Extrait Spray',
    'Midnight black pepper, dark roasted coffee bean, and smoked incense.',
    'An enigmatic, brooding composition conceived for moonlit evenings. Nocturne Ebene opens with sharp crushed black pepper and green cardamom, descending into rich roasted coffee absolute and frankincense, softened with smooth black cashmere woods.',
    13200.00,
    NULL,
    3,
    ARRAY['Black Peppercorn', 'Bitter Orange', 'Incense'],
    ARRAY['Roasted Arabica', 'Cistus Labdanum', 'Cedar'],
    ARRAY['Black Cashmere', 'Smoked Birch', 'Dark Patchouli'],
    true
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    category_type = EXCLUDED.category_type,
    volume = EXCLUDED.volume,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    stock_quantity = EXCLUDED.stock_quantity;

-- 6. Rooh Gulab Grasse Tola (Attar)
INSERT INTO products (id, title, slug, category_type, volume, short_description, long_description, price, discount_price, stock_quantity, top_notes, middle_notes, base_notes, is_featured)
VALUES (
    'a1b2c3d4-0006-4000-8000-000000000006',
    'Rooh Gulab Grasse Tola',
    'rooh-gulab-grasse',
    'attar',
    '12ml Pure Oil Tola',
    'Pure hydro-distilled dawn rose otto blended with aged sandalwood oil. Zero alcohol.',
    'It requires four tons of hand-plucked dawn roses to produce a single liter of this sublime elixir. Pure concentrated floral nectar with radiant freshness that blooms with your body heat.',
    9500.00,
    8400.00,
    5,
    ARRAY['Dewy Damask Rose', 'Green Stem'],
    ARRAY['Centifolia Rose Absolute', 'Rose Otto'],
    ARRAY['Mysore Sandalwood Base', 'White Musk'],
    false
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    category_type = EXCLUDED.category_type,
    volume = EXCLUDED.volume,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    stock_quantity = EXCLUDED.stock_quantity;

-- 7. Shamama Tul Amber (Attar)
INSERT INTO products (id, title, slug, category_type, volume, short_description, long_description, price, discount_price, stock_quantity, top_notes, middle_notes, base_notes, is_featured)
VALUES (
    'a1b2c3d4-0007-4000-8000-000000000007',
    'Shamama Tul Amber',
    'shamama-tul-amber',
    'attar',
    '12ml Pure Oil Tola',
    'Traditional 40-botanical heritage spicy amber oil macerated over pure sandalwood.',
    'An ancient Kannauj formulation cooked over slow wood fires for 30 consecutive days. Deep, spicy, balsamic, and therapeutic with exceptional warmth and longevity.',
    10500.00,
    NULL,
    8,
    ARRAY['Spiced Clove', 'Nagarmotha', 'Mace'],
    ARRAY['Jatamansi', 'Sugandh Mantri', 'Henna Leaf'],
    ARRAY['Aged Sandalwood', 'Fossilized Amber'],
    false
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    category_type = EXCLUDED.category_type,
    volume = EXCLUDED.volume,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    stock_quantity = EXCLUDED.stock_quantity;

-- 8. Rose Imperiale Extrait (Perfume)
INSERT INTO products (id, title, slug, category_type, volume, short_description, long_description, price, discount_price, stock_quantity, top_notes, middle_notes, base_notes, is_featured)
VALUES (
    'a1b2c3d4-0008-4000-8000-000000000008',
    'Rose Imperiale Extrait',
    'rose-imperiale',
    'perfume',
    '100ml Extrait Spray',
    'Velvety Bulgarian damask rose kissed with dewy litchi and white musk.',
    'A modern renaissance of classical floral mastery. Thousands of hand-harvested dawn roses yield this luminous elixir, sparkling with crisp champagne and litchi before drying into a sensual silk veil of powdery white musk and cedarwood.',
    10800.00,
    NULL,
    0,
    ARRAY['Champagne Spark', 'Crisp Litchi', 'Pink Freesia'],
    ARRAY['Bulgarian Rose', 'Peony Petals', 'Violet Leaf'],
    ARRAY['White Musk', 'Cedarwood', 'Cashmeran'],
    false
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    category_type = EXCLUDED.category_type,
    volume = EXCLUDED.volume,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    stock_quantity = EXCLUDED.stock_quantity;

-- ==============================================================================
-- SEED PRODUCT IMAGES (Idempotent)
-- ==============================================================================
DELETE FROM product_images WHERE product_id IN (
    'a1b2c3d4-0001-4000-8000-000000000001',
    'a1b2c3d4-0002-4000-8000-000000000002',
    'a1b2c3d4-0003-4000-8000-000000000003',
    'a1b2c3d4-0004-4000-8000-000000000004',
    'a1b2c3d4-0005-4000-8000-000000000005',
    'a1b2c3d4-0006-4000-8000-000000000006',
    'a1b2c3d4-0007-4000-8000-000000000007',
    'a1b2c3d4-0008-4000-8000-000000000008'
);

INSERT INTO product_images (product_id, image_url, is_thumbnail) VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80', true),
('a1b2c3d4-0002-4000-8000-000000000002', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80', true),
('a1b2c3d4-0003-4000-8000-000000000003', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80', true),
('a1b2c3d4-0004-4000-8000-000000000004', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80', true),
('a1b2c3d4-0005-4000-8000-000000000005', 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80', true),
('a1b2c3d4-0006-4000-8000-000000000006', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80', true),
('a1b2c3d4-0007-4000-8000-000000000007', 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?auto=format&fit=crop&w=800&q=80', true),
('a1b2c3d4-0008-4000-8000-000000000008', 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80', true);

-- ==============================================================================
-- 7. 3D BACKGROUND STUDIO SCENES TABLE & POLICIES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS background_scenes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    target_page TEXT DEFAULT 'home',
    target_section TEXT DEFAULT 'hero',
    preset TEXT DEFAULT 'cinematic-3d-parallax',
    is_active BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,
    order_index INT DEFAULT 0,
    version INT DEFAULT 1,
    global_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    layers JSONB NOT NULL DEFAULT '[]'::jsonb,
    history_snapshot JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE background_scenes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published background scenes" ON background_scenes;
DROP POLICY IF EXISTS "Admin full access background_scenes" ON background_scenes;

CREATE POLICY "Public can view published background scenes" ON background_scenes
    FOR SELECT USING (is_published = true AND is_active = true);

CREATE POLICY "Admin full access background_scenes" ON background_scenes
    FOR ALL USING (auth.role() = 'authenticated');
