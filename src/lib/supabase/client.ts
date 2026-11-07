import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let browserClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-ref')
  );
}

export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) {
    return browserClient;
  }

  // Provide a safe fallback dummy url if not yet configured, to avoid build-time crashes
  const url = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co';
  const key = isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key';

  browserClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          return await fetch(input, {
            ...init,
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));
        } catch (e) {
          // Return an empty 503 response instead of throwing uncaught promise rejection in browser
          return new Response(JSON.stringify([]), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  });

  return browserClient;
}

export const supabase = getSupabaseBrowserClient();
