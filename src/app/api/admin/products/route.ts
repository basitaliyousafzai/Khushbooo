import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient, isSupabaseConfiguredServer } from '@/lib/supabase/server';
import { FALLBACK_PRODUCTS } from '@/lib/data/products';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/admin/products
 * Fetch all products from Supabase using admin service role
 */
export async function GET() {
  if (!isSupabaseConfiguredServer()) {
    return NextResponse.json({ products: FALLBACK_PRODUCTS });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data: products, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error || !products || products.length === 0) {
      if (error) console.error('[API /admin/products GET] Supabase error:', error);
      return NextResponse.json({ products: FALLBACK_PRODUCTS });
    }

    const formatted = products.map((p: any) => ({
      ...p,
      price: Number(p.price),
      discount_price: p.discount_price ? Number(p.discount_price) : null,
      images: p.product_images || [],
    }));

    return NextResponse.json({ products: formatted });
  } catch (err: any) {
    console.error('[API /admin/products GET] Exception:', err);
    return NextResponse.json({ products: FALLBACK_PRODUCTS, error: err?.message || 'Server error' });
  }
}

/**
 * POST /api/admin/products
 * Create or update product using admin service role (bypassing RLS)
 */
export async function POST(request: NextRequest) {
  if (!isSupabaseConfiguredServer()) {
    return NextResponse.json({ success: true });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const body = await request.json();
    const { product: productData, images = [] } = body;

    if (!productData) {
      return NextResponse.json({ success: false, error: 'Product payload is required' }, { status: 400 });
    }

    const slug = productData.slug || (productData.title || 'perfume').toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const payload: any = {
      title: productData.title,
      slug,
      short_description: productData.short_description || '',
      long_description: productData.long_description || '',
      price: Number(productData.price) || 0,
      discount_price: productData.discount_price ? Number(productData.discount_price) : null,
      stock_quantity: parseInt(String(productData.stock_quantity ?? 0), 10),
      category_type: productData.category_type || 'perfume',
      volume: productData.volume || (productData.category_type === 'attar' ? '12ml Pure Oil Tola' : '100ml Extrait Spray'),
      top_notes: productData.top_notes || [],
      middle_notes: productData.middle_notes || [],
      base_notes: productData.base_notes || [],
      model_3d_url: productData.model_3d_url || null,
      is_featured: Boolean(productData.is_featured),
    };

    let productId = productData.id;

    if (productId) {
      const { data: updated, error: updateError } = await supabase
        .from('products')
        .update(payload)
        .eq('id', productId)
        .select()
        .single();

      if (updateError) {
        console.error('[API /admin/products POST] Update error:', updateError);
        return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
      }
      productId = updated.id;
    } else {
      const { data: newProd, error: insertError } = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single();

      if (insertError) {
        console.error('[API /admin/products POST] Insert error:', insertError);
        return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
      }
      productId = newProd.id;
    }

    // Sync product images
    if (productId && Array.isArray(images) && images.length > 0) {
      await supabase.from('product_images').delete().eq('product_id', productId);
      const imagesToInsert = images.map((img: any) => ({
        product_id: productId,
        image_url: img.image_url,
        is_thumbnail: Boolean(img.is_thumbnail),
      }));
      await supabase.from('product_images').insert(imagesToInsert);
    }

    // Bust Next.js cache so the public storefront updates immediately
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/products');
    } catch (revalErr) {
      // Revalidation warning non-fatal
    }

    return NextResponse.json({ success: true, productId });
  } catch (err: any) {
    console.error('[API /admin/products POST] Exception:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/products
 * Delete product from Supabase using admin service role
 */
export async function DELETE(request: NextRequest) {
  if (!isSupabaseConfiguredServer()) {
    return NextResponse.json({ success: true });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const searchParams = request.nextUrl.searchParams;
    let productId = searchParams.get('id');

    if (!productId) {
      try {
        const body = await request.json();
        productId = body?.id;
      } catch (e) {}
    }

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    await supabase.from('product_images').delete().eq('product_id', productId);
    const { error } = await supabase.from('products').delete().eq('id', productId);

    if (error) {
      console.error('[API /admin/products DELETE] Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/products');
    } catch (revalErr) {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API /admin/products DELETE] Exception:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
