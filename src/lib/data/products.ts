import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { createSupabaseServerClient, isSupabaseConfiguredServer } from '@/lib/supabase/server';
import { Product, ProductImage } from '@/types';

// Curated 8 Luxury Artisanal Fragrances: Perfumes (Spray) & Attars (Pure Oil Tolas)
export const FALLBACK_PRODUCTS: Product[] = [
  // 1. Perfume
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000001',
    title: 'Oud Royal Extrait',
    slug: 'oud-royal-extrait',
    category_type: 'perfume',
    volume: '100ml Extrait Spray',
    short_description: 'A majestic elixir of aged wild Cambodian oud, smoky leather, and imperial saffron.',
    long_description: 'Formulated at an exquisite 35% extrait de parfum concentration. Oud Royal is an intoxicating tapestry of precious spices and 25-year aged oud. The opening delivers a burst of golden saffron and bergamot, melting into an intoxicating core of rose de mai before resting on dark bourbon vetiver and imperial Cambodian agarwood.',
    price: 14500,
    discount_price: 12900,
    stock_quantity: 14,
    top_notes: ['Golden Saffron', 'Italian Bergamot', 'Pink Peppercorn'],
    middle_notes: ['Rose De Mai', 'Smoked Leather', 'Nutmeg'],
    base_notes: ['Aged Cambodian Oud', 'Bourbon Vetiver', 'Ambergris'],
    model_3d_url: null,
    is_featured: true,
    images: [
      {
        image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
        is_thumbnail: true,
      },
    ],
  },
  // 2. Pure Attar (Ittar)
  {
    id: 'a1b2c3d4-0002-4000-8000-000000000002',
    title: 'Dehn Al Oud Qadeem',
    slug: 'dehn-al-oud-qadeem',
    category_type: 'attar',
    volume: '12ml Pure Oil Tola',
    short_description: 'Pure 30-year aged wild Assam & Cambodian agarwood oil in hand-cut crystal tola flacon.',
    long_description: 'A masterpiece pure concentrated oil distilled by hand in vintage copper stills. 100% uncut and alcohol-free. Opens with raw woody balsamic nuances, developing an intensely warm, animalic sweetness with phenomenal 24-hour skin longevity.',
    price: 16500,
    discount_price: 14900,
    stock_quantity: 7,
    top_notes: ['Wild Agarwood Smoke', 'Aged Resins'],
    middle_notes: ['Sweet Balsamic Oud', 'Smoked Earth'],
    base_notes: ['Deep Cambodian Agarwood', 'Animalic Honey'],
    model_3d_url: null,
    is_featured: true,
    images: [
      {
        image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
        is_thumbnail: true,
      },
    ],
  },
  // 3. Perfume
  {
    id: 'a1b2c3d4-0003-4000-8000-000000000003',
    title: 'Soleil Doré Flacon',
    slug: 'soleil-dore-flacon',
    category_type: 'perfume',
    volume: '100ml Extrait Spray',
    short_description: 'Radiant golden tuberose, sun-warmed amber, and creamy Tahitian vanilla.',
    long_description: 'Capturing the incandescent warmth of midsummer twilight along the Mediterranean. Soleil Doré wraps the wearer in velvety tuberose petals drenched in honeyed neroli, anchored by Mysore sandalwood and golden amber resins.',
    price: 11500,
    discount_price: 9900,
    stock_quantity: 6,
    top_notes: ['Neroli Sunburst', 'Mandarin Zest', 'Cardamom'],
    middle_notes: ['Golden Tuberose', 'Jasmine Sambac', 'Ylang Ylang'],
    base_notes: ['Tahitian Vanilla', 'Mysore Sandalwood', 'White Amber'],
    model_3d_url: null,
    is_featured: true,
    images: [
      {
        image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
        is_thumbnail: true,
      },
    ],
  },
  // 4. Pure Attar (Ittar)
  {
    id: 'a1b2c3d4-0004-4000-8000-000000000004',
    title: 'Kasturi Musk Ghazal',
    slug: 'kasturi-musk-ghazal',
    category_type: 'attar',
    volume: '12ml Pure Oil Tola',
    short_description: 'Silken imperial black musk attar with amber crystal veins and warm sandalwood oil base.',
    long_description: 'Distilled using historic maceration techniques. Kasturi Musk Ghazal is pure velvet on the pulse points. Hypnotic, sensual, warm, and intimate, creating an intoxicating scent aura.',
    price: 8900,
    discount_price: 7800,
    stock_quantity: 9,
    top_notes: ['Spiced Saffron Stigma', 'Sweet Amber'],
    middle_notes: ['Imperial Black Musk', 'Nutmeg Flower'],
    base_notes: ['Mysore Santal', 'Fossilized Amber'],
    model_3d_url: null,
    is_featured: false,
    images: [
      {
        image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
        is_thumbnail: true,
      },
    ],
  },
  // 5. Perfume
  {
    id: 'a1b2c3d4-0005-4000-8000-000000000005',
    title: 'Nocturne Ébène',
    slug: 'nocturne-ebene',
    category_type: 'perfume',
    volume: '100ml Extrait Spray',
    short_description: 'Midnight black pepper, dark roasted coffee bean, and smoked incense.',
    long_description: 'An enigmatic, brooding composition conceived for moonlit evenings. Nocturne Ébène opens with sharp crushed black pepper and green cardamom, descending into rich roasted coffee absolute and frankincense, softened with smooth black cashmere woods.',
    price: 13200,
    discount_price: null,
    stock_quantity: 3,
    top_notes: ['Black Peppercorn', 'Bitter Orange', 'Incense'],
    middle_notes: ['Roasted Arabica', 'Cistus Labdanum', 'Cedar'],
    base_notes: ['Black Cashmere', 'Smoked Birch', 'Dark Patchouli'],
    model_3d_url: null,
    is_featured: true,
    images: [
      {
        image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
        is_thumbnail: true,
      },
    ],
  },
  // 6. Pure Attar (Ittar)
  {
    id: 'a1b2c3d4-0006-4000-8000-000000000006',
    title: 'Rooh Gulab Grasse Tola',
    slug: 'rooh-gulab-grasse',
    category_type: 'attar',
    volume: '12ml Pure Oil Tola',
    short_description: 'Pure hydro-distilled dawn rose otto blended with aged sandalwood oil. Zero alcohol.',
    long_description: 'It requires four tons of hand-plucked dawn roses to produce a single liter of this sublime elixir. Pure concentrated floral nectar with radiant freshness that blooms with your body heat.',
    price: 9500,
    discount_price: 8400,
    stock_quantity: 5,
    top_notes: ['Dewy Damask Rose', 'Green Stem'],
    middle_notes: ['Centifolia Rose Absolute', 'Rose Otto'],
    base_notes: ['Mysore Sandalwood Base', 'White Musk'],
    model_3d_url: null,
    is_featured: false,
    images: [
      {
        image_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
        is_thumbnail: true,
      },
    ],
  },
  // 7. Pure Attar (Ittar)
  {
    id: 'a1b2c3d4-0007-4000-8000-000000000007',
    title: 'Shamama Tul Amber',
    slug: 'shamama-tul-amber',
    category_type: 'attar',
    volume: '12ml Pure Oil Tola',
    short_description: 'Traditional 40-botanical heritage spicy amber oil macerated over pure sandalwood.',
    long_description: 'An ancient Kannauj formulation cooked over slow wood fires for 30 consecutive days. Deep, spicy, balsamic, and therapeutic with exceptional warmth and longevity.',
    price: 10500,
    discount_price: null,
    stock_quantity: 8,
    top_notes: ['Spiced Clove', 'Nagarmotha', 'Mace'],
    middle_notes: ['Jatamansi', 'Sugandh Mantri', 'Henna Leaf'],
    base_notes: ['Aged Sandalwood', 'Fossilized Amber'],
    model_3d_url: null,
    is_featured: false,
    images: [
      {
        image_url: 'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?auto=format&fit=crop&w=800&q=80',
        is_thumbnail: true,
      },
    ],
  },
  // 8. Perfume
  {
    id: 'a1b2c3d4-0008-4000-8000-000000000008',
    title: 'Rose Impériale Extrait',
    slug: 'rose-imperiale',
    category_type: 'perfume',
    volume: '100ml Extrait Spray',
    short_description: 'Velvety Bulgarian damask rose kissed with dewy litchi and white musk.',
    long_description: 'A modern renaissance of classical floral mastery. Thousands of hand-harvested dawn roses yield this luminous elixir, sparkling with crisp champagne and litchi before drying into a sensual silk veil of powdery white musk and cedarwood.',
    price: 10800,
    discount_price: null,
    stock_quantity: 0,
    top_notes: ['Champagne Spark', 'Crisp Litchi', 'Pink Freesia'],
    middle_notes: ['Bulgarian Rose', 'Peony Petals', 'Violet Leaf'],
    base_notes: ['White Musk', 'Cedarwood', 'Cashmeran'],
    model_3d_url: null,
    is_featured: false,
    images: [
      {
        image_url: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
        is_thumbnail: true,
      },
    ],
  },
];

/**
 * Fetch products for storefront (Server Component)
 */
export async function getProductsServer(): Promise<Product[]> {
  if (!isSupabaseConfiguredServer()) {
    return FALLBACK_PRODUCTS;
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data: products, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error || !products || products.length === 0) {
      return FALLBACK_PRODUCTS;
    }

    return products.map((p: any) => ({
      ...p,
      price: Number(p.price),
      discount_price: p.discount_price ? Number(p.discount_price) : null,
      images: p.product_images || [],
    }));
  } catch (err) {
    console.error('Error in getProductsServer:', err);
    return FALLBACK_PRODUCTS;
  }
}

/**
 * Fetch products for client components
 */
export async function getProductsClient(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_PRODUCTS;
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data: products, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error || !products || products.length === 0) {
      return FALLBACK_PRODUCTS;
    }

    return products.map((p: any) => ({
      ...p,
      price: Number(p.price),
      discount_price: p.discount_price ? Number(p.discount_price) : null,
      images: p.product_images || [],
    }));
  } catch (err) {
    console.error('Error in getProductsClient:', err);
    return FALLBACK_PRODUCTS;
  }
}

/**
 * Fetch single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getProductsClient();
  return all.find((p) => p.slug === slug) || null;
}

/**
 * Admin Product CRUD: Save Product
 */
export async function saveProduct(
  productData: Partial<Product>,
  images: { image_url: string; is_thumbnail: boolean }[] = []
): Promise<{ success: boolean; data?: Product; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: {
        ...(productData as Product),
        id: productData.id || `prod-${Date.now()}`,
        slug: productData.slug || (productData.title || 'fragrance').toLowerCase().replace(/\s+/g, '-'),
        stock_quantity: productData.stock_quantity ?? 10,
        price: Number(productData.price) || 9999,
        top_notes: productData.top_notes || [],
        middle_notes: productData.middle_notes || [],
        base_notes: productData.base_notes || [],
        is_featured: productData.is_featured ?? false,
        images: images.map((img) => ({
          image_url: img.image_url,
          is_thumbnail: img.is_thumbnail,
        })),
      },
    };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const slug = productData.slug || (productData.title || 'perfume').toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const payload: any = {
      title: productData.title,
      slug,
      short_description: productData.short_description || '',
      long_description: productData.long_description || '',
      price: productData.price,
      discount_price: productData.discount_price || null,
      stock_quantity: productData.stock_quantity ?? 0,
      category_type: productData.category_type || 'perfume',
      volume: productData.volume || (productData.category_type === 'attar' ? '12ml Pure Oil Tola' : '100ml Extrait Spray'),
      top_notes: productData.top_notes || [],
      middle_notes: productData.middle_notes || [],
      base_notes: productData.base_notes || [],
      model_3d_url: productData.model_3d_url || null,
      is_featured: productData.is_featured ?? false,
    };

    let productId = productData.id;

    if (productId) {
      const { error: updateError } = await supabase.from('products').update(payload).eq('id', productId);
      if (updateError) throw updateError;
    } else {
      const { data: newProd, error: insertError } = await supabase.from('products').insert(payload).select().single();
      if (insertError) throw insertError;
      productId = newProd.id;
    }

    if (images.length > 0 && productId) {
      await supabase.from('product_images').delete().eq('product_id', productId);
      const imagesToInsert = images.map((img) => ({
        product_id: productId,
        image_url: img.image_url,
        is_thumbnail: img.is_thumbnail,
      }));
      await supabase.from('product_images').insert(imagesToInsert);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save product' };
  }
}

/**
 * Admin Product CRUD: Delete Product
 */
export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete product' };
  }
}

/**
 * Upload file to Supabase Storage bucket 'perfume-assets'
 */
export async function uploadAssetToStorage(
  file: File,
  folder: 'images' | 'models' = 'images'
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    const mockUrl = URL.createObjectURL(file);
    return { success: true, publicUrl: mockUrl };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { data, error } = await supabase.storage.from('perfume-assets').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage.from('perfume-assets').getPublicUrl(data.path);

    return {
      success: true,
      publicUrl: urlData.publicUrl,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Upload failed' };
  }
}
