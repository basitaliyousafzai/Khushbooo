import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient, isSupabaseConfiguredServer } from '@/lib/supabase/server';
import { DEFAULT_SITE_CONTENT } from '@/lib/data/site-content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/admin/content
 * Returns all site content entries from Supabase using admin service role
 */
export async function GET() {
  if (!isSupabaseConfiguredServer()) {
    const list = Object.entries(DEFAULT_SITE_CONTENT).map(([key, data]) => ({
      key,
      value: data.value,
      label: data.label,
      category: data.category,
      updated_at: new Date().toISOString(),
    }));
    return NextResponse.json({ items: list });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.error('[API /admin/content GET] Supabase error:', error);
      const list = Object.entries(DEFAULT_SITE_CONTENT).map(([key, data]) => ({
        key,
        value: data.value,
        label: data.label,
        category: data.category,
        updated_at: new Date().toISOString(),
      }));
      return NextResponse.json({ items: list });
    }

    return NextResponse.json({ items: data });
  } catch (err: any) {
    console.error('[API /admin/content GET] Exception:', err);
    return NextResponse.json({ items: [], error: err?.message || 'Server error' });
  }
}

/**
 * POST /api/admin/content
 * Upsert content item using admin service role
 */
export async function POST(request: NextRequest) {
  if (!isSupabaseConfiguredServer()) {
    return NextResponse.json({ success: true });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const body = await request.json();
    const { key, value, label, category } = body;

    if (!key) {
      return NextResponse.json({ success: false, error: 'Key is required' }, { status: 400 });
    }

    const { error } = await supabase.from('site_content').upsert(
      {
        key,
        value: value ?? '',
        label: label || key,
        category: category || 'general',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    );

    if (error) {
      console.error('[API /admin/content POST] Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/content');
    } catch (revalErr) {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API /admin/content POST] Exception:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
