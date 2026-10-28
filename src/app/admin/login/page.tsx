'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Key, Sparkles, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient();
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (authError) {
          throw authError;
        }
      }

      // Set session marker and proceed
      localStorage.setItem('admin_demo_auth', 'true');
      router.push('/admin');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    localStorage.setItem('admin_demo_auth', 'true');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-obsidian-400 border border-gold/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Brand Lock Emblem */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full border border-gold flex items-center justify-center bg-obsidian-500 mx-auto text-gold shadow-lg shadow-gold/20">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white tracking-wide">
            Concierge Portal
          </h1>
          <p className="text-xs text-champagne/60 font-sans uppercase tracking-[0.2em]">
            Khushbooo • Executive Management
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 font-sans text-xs">
          
          <div className="space-y-1.5">
            <label className="text-champagne/80 uppercase tracking-wider block">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@maisondeparfum.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-champagne/80 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-500 border border-gold/20 focus:border-gold focus:outline-none text-white text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gold hover:bg-gold-300 text-obsidian font-serif font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-obsidian" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Demo Fast-Track Bypass */}
        <div className="pt-4 border-t border-gold/15 text-center space-y-3">
          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full py-2.5 rounded-xl border border-gold/30 hover:border-gold text-champagne text-xs uppercase tracking-wider bg-obsidian-300/40 hover:bg-obsidian-300 flex items-center justify-center gap-2 transition-all font-sans"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Instant Demo Access (Development Mode)</span>
          </button>

          <Link
            href="/"
            className="inline-block text-[11px] text-champagne/50 hover:text-gold transition-colors font-sans"
          >
            ← Return to Storefront
          </Link>
        </div>

      </div>
    </div>
  );
}
