'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  ExternalLink,
  LogOut,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export function AdminSidebar() {
  const pathname = usePathname();

  const navLinks = [
    {
      name: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Order Dispatch',
      href: '/admin/orders',
      icon: ShoppingBag,
      exact: false,
    },
    {
      name: 'Inventory & Media',
      href: '/admin/products',
      icon: Package,
      exact: false,
    },
    {
      name: '3D Background Studio',
      href: '/admin/background-studio',
      icon: Layers,
      exact: false,
    },
    {
      name: 'Content Manager',
      href: '/admin/content',
      icon: FileText,
      exact: false,
    },
  ];

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      localStorage.removeItem('admin_demo_auth');
      window.location.href = '/admin/login';
    } catch (e) {
      window.location.href = '/admin/login';
    }
  };

  return (
    <aside className="w-64 bg-obsidian-500 border-r border-gold/15 flex flex-col justify-between shrink-0 min-h-screen">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-gold/15">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-gold flex items-center justify-center bg-obsidian-400">
              <span className="font-serif text-gold font-bold text-sm">K</span>
            </div>
            <div>
              <div className="font-serif text-sm tracking-[0.2em] text-white uppercase font-bold">
                Khushbooo
              </div>
              <div className="text-[10px] tracking-widest text-gold/70 uppercase">
                Concierge Dashboard
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-sans transition-all ${
                  isActive
                    ? 'bg-gold text-obsidian font-bold shadow-md shadow-gold/20'
                    : 'text-champagne/70 hover:text-white hover:bg-obsidian-400'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-obsidian' : 'text-gold'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gold/15 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs text-champagne/70 hover:text-gold hover:bg-obsidian-400 transition-all font-sans"
        >
          <ExternalLink className="w-4 h-4 text-gold" />
          <span>View Live Storefront</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs text-champagne/50 hover:text-red-400 hover:bg-obsidian-400 transition-all font-sans"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Dashboard</span>
        </button>
      </div>
    </aside>
  );
}
