import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, isSupabaseConfiguredServer } from '@/lib/supabase/server';
import { FALLBACK_ORDERS } from '@/lib/data/orders';

// Disable caching for live real-time admin orders
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/admin/orders
 * Returns all real orders from Supabase, bypassing RLS using service role client
 */
export async function GET(request: NextRequest) {
  if (!isSupabaseConfiguredServer()) {
    return NextResponse.json({ orders: FALLBACK_ORDERS });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const searchParams = request.nextUrl.searchParams;
    const filterStatus = searchParams.get('status');

    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (filterStatus && filterStatus !== 'All') {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[API /admin/orders] Supabase error:', error);
      return NextResponse.json({ orders: FALLBACK_ORDERS, error: error.message });
    }

    const formatted = (data || []).map((o: any) => ({
      ...o,
      total_amount: Number(o.total_amount),
      items: o.order_items || [],
    }));

    return NextResponse.json({ orders: formatted });
  } catch (err: any) {
    console.error('[API /admin/orders] Fetch exception:', err);
    return NextResponse.json({ orders: FALLBACK_ORDERS, error: err?.message || 'Server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/orders
 * Updates order status and courier details
 */
export async function PUT(request: NextRequest) {
  if (!isSupabaseConfiguredServer()) {
    return NextResponse.json({ success: true });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const body = await request.json();
    const { orderId, status, courierDetails } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: 'Missing orderId or status' }, { status: 400 });
    }

    const updatePayload: any = { status };

    if (status === 'Dispatched' && courierDetails) {
      updatePayload.courier_name = courierDetails.courier_name || null;
      updatePayload.courier_tracking_id = courierDetails.courier_tracking_id || null;
      updatePayload.dispatched_at = new Date().toISOString();
    }

    const { error } = await supabase.from('orders').update(updatePayload).eq('id', orderId);

    if (error) {
      console.error('[API /admin/orders PUT] Error updating order:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API /admin/orders PUT] Exception:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
