import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function isSupabaseConfiguredServer(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-ref')
  );
}

export function createSupabaseServerClient(): SupabaseClient {
  const url = isSupabaseConfiguredServer() ? supabaseUrl : 'https://placeholder.supabase.co';
  const key = isSupabaseConfiguredServer() ? supabaseAnonKey : 'placeholder-anon-key';

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
