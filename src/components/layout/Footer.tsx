import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Shield, Truck, Award, Sparkles, MessageCircle } from 'lucide-react';
import { SiteContentMap } from '@/types';

interface FooterProps {
  content: SiteContentMap;
}

export function Footer({ content }: FooterProps) {
  const siteName = content.site_name || 'Khushbooo';
  const email = content.contact_email || 'concierge@khushbooo.com';
  const phone = content.contact_phone || '+92 300 8472948';
  const story = content.about_story || 'Hand-poured extraits and pure concentrated attars distilled from ethical botanicals across the world.';

  // Dynamic Social Media Links (Only shown if configured by admin)
  const socialInstagram = content.social_instagram?.trim();
  const socialWhatsapp = content.social_whatsapp?.trim();
  const socialFacebook = content.social_facebook?.trim();
  const socialTiktok = content.social_tiktok?.trim();
  const socialYoutube = content.social_youtube?.trim();

  const hasAnySocial = Boolean(
    socialInstagram || socialWhatsapp || socialFacebook || socialTiktok || socialYoutube
  );

  return (
    <footer id="contact" className="bg-obsidian-600 border-t border-gold/15 text-champagne/70 font-sans pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-14 border-b border-gold/10">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-obsidian-400/40 border border-gold/10">
            <div className="p-3 rounded-full bg-gold/10 text-gold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-serif text-white tracking-wider uppercase">Cash on Delivery</h4>
              <p className="text-xs text-champagne/60 mt-0.5">Pay conveniently upon delivery across Pakistan.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-obsidian-400/40 border border-gold/10">
            <div className="p-3 rounded-full bg-gold/10 text-gold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-serif text-white tracking-wider uppercase">Perfumes & Pure Attars</h4>
              <p className="text-xs text-champagne/60 mt-0.5">35% Extraits & 100% uncut pure alcohol-free attar oils.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-obsidian-400/40 border border-gold/10">
            <div className="p-3 rounded-full bg-gold/10 text-gold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-serif text-white tracking-wider uppercase">Wax-Sealed Flacons</h4>
              <p className="text-xs text-champagne/60 mt-0.5">100% authentic batches hand-numbered in our atelier.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-gold/50 flex items-center justify-center bg-obsidian-400 shadow-md">
                <span className="font-serif text-gold font-bold text-base">K</span>
              </div>
              <span className="font-serif text-2xl tracking-[0.25em] text-white uppercase font-bold">
                {siteName}
              </span>
            </div>

            <p className="text-xs text-champagne/70 leading-relaxed max-w-md">
              {story}
            </p>

            <div className="pt-2 text-[11px] text-gold/80 tracking-widest uppercase flex items-center gap-1.5 font-serif">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Haute Parfumerie & Pure Concentrated Attars</span>
            </div>

            {/* Dynamic Social Media Links (Only configured links are rendered) */}
            {hasAnySocial && (
              <div className="pt-3">
                <span className="text-[10px] uppercase tracking-widest text-champagne/50 block mb-2 font-sans">
                  Official Channels:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {socialInstagram && (
                    <a
                      href={socialInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-obsidian-400 border border-gold/20 hover:border-gold text-champagne hover:text-gold text-xs font-sans tracking-wider transition-all"
                    >
                      Instagram
                    </a>
                  )}

                  {socialWhatsapp && (
                    <a
                      href={socialWhatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-obsidian-400 border border-emerald-500/40 hover:border-emerald-500 text-emerald-300 text-xs font-sans tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {socialFacebook && (
                    <a
                      href={socialFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-obsidian-400 border border-gold/20 hover:border-gold text-champagne hover:text-gold text-xs font-sans tracking-wider transition-all"
                    >
                      Facebook
                    </a>
                  )}

                  {socialTiktok && (
                    <a
                      href={socialTiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-obsidian-400 border border-gold/20 hover:border-gold text-champagne hover:text-gold text-xs font-sans tracking-wider transition-all"
                    >
                      TikTok
                    </a>
                  )}

                  {socialYoutube && (
                    <a
                      href={socialYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-obsidian-400 border border-red-500/40 hover:border-red-500 text-red-300 text-xs font-sans tracking-wider transition-all"
                    >
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Concierge Info (Dynamic from Supabase) */}
          <div className="space-y-3">
            <h4 className="font-serif text-xs text-white uppercase tracking-[0.2em]">Concierge Service</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-gold transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-gold transition-colors">
                  {phone}
                </a>
              </li>
              <li className="text-[11px] text-champagne/50 pt-2">
                Mon - Sat: 10:00 AM - 8:00 PM PKT
              </li>
            </ul>
          </div>

          {/* Quick Links & Portal */}
          <div className="space-y-3">
            <h4 className="font-serif text-xs text-white uppercase tracking-[0.2em]">Khushbooo Collections</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#collection" className="hover:text-gold transition-colors">
                  Artisanal Perfumes (Spray)
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-gold transition-colors">
                  Pure Concentrated Attars (Ittars)
                </a>
              </li>
              <li>
                <a href="#notes-explorer" className="hover:text-gold transition-colors">
                  Olfactory Pyramid
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-gold/90 hover:text-gold hover:underline flex items-center gap-1">
                  <span>Admin Access Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-champagne/50 gap-4">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Dispatched via Insured Express Courier</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
