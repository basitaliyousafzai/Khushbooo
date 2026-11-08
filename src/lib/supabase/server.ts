import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export function isSupabaseConfiguredServer(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-ref')
  );
}

export function createSupabaseAdminClient(): SupabaseClient {
  const url = isSupabaseConfiguredServer() ? supabaseUrl : 'https://placeholder.supabase.co';
  const key = isSupabaseConfiguredServer() ? supabaseServiceKey : 'placeholder-service-key';

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function createSupabaseServerClient(): SupabaseClient {
  const url = isSupabaseConfiguredServer() ? supabaseUrl : 'https://placeholder.supabase.co';
  const key = isSupabaseConfiguredServer() ? supabaseServiceKey : 'placeholder-anon-key';

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        // 3-second timeout so page renders instantly from curated data if remote project is paused
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        return fetch(input, {
          ...init,
          signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId));
      },
    },
  });
}
