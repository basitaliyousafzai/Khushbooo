import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient, isSupabaseConfiguredServer } from '@/lib/supabase/server';
import { FALLBACK_PRODUCTS } from '@/lib/data/products';
import { StockLedgerEntry, StockMovementType } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Helper to fetch stock ledger entries
 */
async function fetchLedgerEntries(supabase: any): Promise<StockLedgerEntry[]> {
  try {
    // 1. Try dedicated stock_ledger table
    const { data, error } = await supabase
      .from('stock_ledger')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (!error && data && Array.isArray(data)) {
      return data;
    }
  } catch (e) {}

  // 2. Fallback to site_content ledger records
  try {
    const { data: contentList } = await supabase
      .from('site_content')
      .select('value, updated_at')
      .eq('category', 'stock_ledger')
      .order('updated_at', { ascending: false })
      .limit(200);

    if (contentList && Array.isArray(contentList)) {
      return contentList
        .map((row: any) => {
          try {
            return JSON.parse(row.value);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    }
  } catch (e) {}

  return [];
}

/**
 * Helper to save a stock ledger entry
 */
async function saveLedgerEntry(supabase: any, entry: StockLedgerEntry): Promise<void> {
  // 1. Try dedicated table first
  try {
    const { error } = await supabase.from('stock_ledger').insert({
      id: entry.id,
      product_id: entry.product_id,
      product_title: entry.product_title,
      movement_type: entry.movement_type,
      quantity_change: entry.quantity_change,
      previous_stock: entry.previous_stock,
      new_stock: entry.new_stock,
      reference_note: entry.reference_note,
      created_at: entry.created_at,
    });
    if (!error) return;
  } catch (e) {}

  // 2. Persist in site_content table
  try {
    await supabase.from('site_content').upsert(
      {
        key: `ledger_${entry.id}`,
        value: JSON.stringify(entry),
        label: `Stock Ledger: ${entry.product_title} (${entry.movement_type})`,
        category: 'stock_ledger',
        updated_at: entry.created_at,
      },
      { onConflict: 'key' }
    );
  } catch (e) {
    console.error('[API /admin/inventory] Failed to write ledger entry to site_content:', e);
  }
}

/**
 * GET /api/admin/inventory
 * Live inventory stats, product stock counts, and stock movement ledger
 */
export async function GET() {
  if (!isSupabaseConfiguredServer()) {
    const totalStock = FALLBACK_PRODUCTS.reduce((acc, p) => acc + (p.stock_quantity || 0), 0);
    const totalValuation = FALLBACK_PRODUCTS.reduce((acc, p) => acc + (p.stock_quantity || 0) * p.price, 0);
    return NextResponse.json({
      products: FALLBACK_PRODUCTS,
      metrics: {
        totalStock,
        totalValuation,
        lowStockCount: FALLBACK_PRODUCTS.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 5).length,
        outOfStockCount: FALLBACK_PRODUCTS.filter((p) => p.stock_quantity === 0).length,
      },
      ledger: [],
    });
  }

  try {
    const supabase = createSupabaseAdminClient();

    // 1. Fetch live products with images
    const { data: rawProducts, error: prodError } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .order('stock_quantity', { ascending: true })
      .order('is_featured', { ascending: false });

    if (prodError || !rawProducts) {
      console.error('[API /admin/inventory GET] Product fetch error:', prodError);
      return NextResponse.json({ error: prodError?.message || 'Failed to fetch products' }, { status: 500 });
    }

    const products = rawProducts.map((p: any) => ({
      ...p,
      price: Number(p.price),
      discount_price: p.discount_price ? Number(p.discount_price) : null,
      stock_quantity: Number(p.stock_quantity ?? 0),
      images: p.product_images || [],
    }));

    // 2. Compute live inventory metrics
    const totalStock = products.reduce((acc, p) => acc + (p.stock_quantity || 0), 0);
    const totalValuation = products.reduce((acc, p) => acc + (p.stock_quantity || 0) * (p.discount_price || p.price), 0);
    const lowStockCount = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 5).length;
    const outOfStockCount = products.filter((p) => p.stock_quantity === 0).length;

    // 3. Fetch stock ledger movements
    const ledger = await fetchLedgerEntries(supabase);

    return NextResponse.json({
      products,
      metrics: {
        totalStock,
        totalValuation,
        lowStockCount,
        outOfStockCount,
      },
      ledger,
    });
  } catch (err: any) {
    console.error('[API /admin/inventory GET] Exception:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/inventory
 * Adjust stock of a product and log movement in the Stock Ledger
 */
export async function POST(request: NextRequest) {
  if (!isSupabaseConfiguredServer()) {
    return NextResponse.json({ success: true });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const body = await request.json();
    const { productId, movementType, quantityChange, referenceNote } = body;

    if (!productId || typeof quantityChange !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Valid productId and numerical quantityChange are required' },
        { status: 400 }
      );
    }

    // 1. Fetch current product
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id, title, stock_quantity')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const previousStock = Number(product.stock_quantity ?? 0);
    const newStock = Math.max(0, previousStock + quantityChange);

    // 2. Update stock in database
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock_quantity: newStock })
      .eq('id', productId);

    if (updateError) {
      console.error('[API /admin/inventory POST] Stock update error:', updateError);
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    // 3. Record entry into Stock Ledger
    const ledgerEntry: StockLedgerEntry = {
      id: `led-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      product_id: product.id,
      product_title: product.title,
      movement_type: (movementType as StockMovementType) || 'adjustment',
      quantity_change: quantityChange,
      previous_stock: previousStock,
      new_stock: newStock,
      reference_note: referenceNote?.trim() || 'Manual stock adjustment',
      created_at: new Date().toISOString(),
    };

    await saveLedgerEntry(supabase, ledgerEntry);

    // Invalidate caches
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/products');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      previousStock,
      newStock,
      ledgerEntry,
    });
  } catch (err: any) {
    console.error('[API /admin/inventory POST] Exception:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
