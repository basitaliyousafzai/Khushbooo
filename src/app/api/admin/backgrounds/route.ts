import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient, isSupabaseConfiguredServer } from '@/lib/supabase/server';
import { DEFAULT_BACKGROUND_SCENES } from '@/lib/data/background-studio';
import { BackgroundScene } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/admin/backgrounds
 * Returns all background scenes using admin service role
 */
export async function GET() {
  if (!isSupabaseConfiguredServer()) {
    return NextResponse.json({ scenes: DEFAULT_BACKGROUND_SCENES });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('background_scenes')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) console.error('[API /admin/backgrounds GET] Supabase error:', error);
      return NextResponse.json({ scenes: DEFAULT_BACKGROUND_SCENES });
    }

    return NextResponse.json({ scenes: data });
  } catch (err: any) {
    console.error('[API /admin/backgrounds GET] Exception:', err);
    return NextResponse.json({ scenes: DEFAULT_BACKGROUND_SCENES, error: err?.message || 'Server error' });
  }
}

/**
 * POST /api/admin/backgrounds
 * Upsert background scene into Supabase using admin service role
 */
export async function POST(request: NextRequest) {
  if (!isSupabaseConfiguredServer()) {
    return NextResponse.json({ success: true });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const body = await request.json();
    const { scene } = body;

    if (!scene || !scene.id) {
      return NextResponse.json({ success: false, error: 'Scene payload with ID is required' }, { status: 400 });
    }

    const payload: any = {
      id: scene.id,
      name: scene.name,
      target_page: scene.target_page,
      target_section: scene.target_section,
      preset: scene.preset,
      is_active: scene.is_active,
      is_published: scene.is_published,
      order_index: scene.order_index ?? 0,
      global_settings: scene.global_settings,
      layers: scene.layers,
      version: (scene.version || 1) + 1,
      updated_at: new Date().toISOString(),
    };

    if (scene.history_snapshot) {
      payload.history_snapshot = scene.history_snapshot;
    }

    const { error } = await supabase.from('background_scenes').upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('[API /admin/backgrounds POST] Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/background-studio');
    } catch (revalErr) {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API /admin/backgrounds POST] Exception:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/backgrounds
 * Delete background scene from Supabase using admin service role
 */
export async function DELETE(request: NextRequest) {
  if (!isSupabaseConfiguredServer()) {
    return NextResponse.json({ success: true });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const searchParams = request.nextUrl.searchParams;
    let sceneId = searchParams.get('id');

    if (!sceneId) {
      try {
        const body = await request.json();
        sceneId = body?.id;
      } catch (e) {}
    }

    if (!sceneId) {
      return NextResponse.json({ success: false, error: 'Scene ID is required' }, { status: 400 });
    }

    const { error } = await supabase.from('background_scenes').delete().eq('id', sceneId);

    if (error) {
      console.error('[API /admin/backgrounds DELETE] Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/background-studio');
    } catch (revalErr) {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API /admin/backgrounds DELETE] Exception:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
