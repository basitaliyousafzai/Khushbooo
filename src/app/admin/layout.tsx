'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If user is already on the login page, bypass layout check
    if (pathname === '/admin/login') {
      setChecking(false);
      setAuthorized(true);
      return;
    }

    const checkAuth = async () => {
      // Check local demo flag first
      const demoAuth = localStorage.getItem('admin_demo_auth');

      if (isSupabaseConfigured()) {
        try {
          const supabase = getSupabaseBrowserClient();
          const { data: { session } } = await supabase.auth.getSession();

          if (session || demoAuth === 'true') {
            setAuthorized(true);
          } else {
            router.push('/admin/login');
          }
        } catch {
          if (demoAuth === 'true') {
            setAuthorized(true);
          } else {
            router.push('/admin/login');
          }
        }
      } else {
        // In local development before Supabase keys are configured
        if (demoAuth === 'true') {
          setAuthorized(true);
        } else {
          router.push('/admin/login');
        }
      }

      setChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <span className="text-xs uppercase tracking-widest text-champagne/60 font-serif">
            Authenticating Concierge Access...
          </span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-obsidian flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen p-6 sm:p-10 bg-obsidian-600/30">
        {children}
      </main>
    </div>
  );
}
