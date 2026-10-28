import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { createSupabaseServerClient, isSupabaseConfiguredServer } from '@/lib/supabase/server';
import { SiteContent, SiteContentMap } from '@/types';

// Default fallback content (identical to Supabase seed)
export const DEFAULT_SITE_CONTENT: Record<string, { value: string; label: string; category: string }> = {
  site_name: {
    value: 'Khushbooo',
    label: 'Brand / Store Name',
    category: 'branding',
  },
  site_tagline: {
    value: 'Haute Parfumerie & Pure Concentrated Attars',
    label: 'Brand Subtitle',
    category: 'branding',
  },
  announcement_bar: {
    value: 'Complimentary nationwide delivery on artisanal perfumes & pure attars above Rs. 4,999',
    label: 'Announcement Banner Bar',
    category: 'header',
  },
  hero_tagline: {
    value: 'The Soul of Scent, Sculpted in Time',
    label: 'Hero Main Headline',
    category: 'hero',
  },
  hero_description: {
    value: 'Explore bespoke French extraits de parfum and pure aged Cambodian oud attars hand-distilled from ethical botanicals across Grasse, Kannauj, and Assam.',
    label: 'Hero Subheading / Description',
    category: 'hero',
  },
  hero_cta_text: {
    value: 'Explore Perfumes & Attars',
    label: 'Hero Primary CTA Button',
    category: 'hero',
  },
  hero_secondary_cta: {
    value: 'Discover The Notes',
    label: 'Hero Secondary Button',
    category: 'hero',
  },
  scrolly_title: {
    value: 'The Olfactory Architecture',
    label: 'Fragrance Notes Explorer Title',
    category: 'notes',
  },
  scrolly_subtitle: {
    value: 'Every Khushbooo creation unravels through a three-tier olfactory pyramid, lingering on pulse points over twelve hours.',
    label: 'Fragrance Notes Explorer Subtitle',
    category: 'notes',
  },
  catalogue_title: {
    value: 'Curated Perfumes & Pure Attars',
    label: 'Product Catalogue Title',
    category: 'catalogue',
  },
  catalogue_subtitle: {
    value: 'Each piece is hand-numbered and sealed with our signature wax insignia.',
    label: 'Product Catalogue Subtitle',
    category: 'catalogue',
  },
  about_title: {
    value: 'The Khushbooo Artisanal Legacy',
    label: 'Heritage Section Title',
    category: 'about',
  },
  about_story: {
    value: 'Hand-poured extracts and pure concentrated attar oils distilled from ethical botanicals across the world. Each flacon is an homage to timeless perfumery traditions, hand-finished with 24k gold leaf accents and matured over six months for peerless depth.',
    label: 'Heritage Brand Story',
    category: 'about',
  },
  contact_email: {
    value: 'concierge@khushbooo.com',
    label: 'Concierge Email Address',
    category: 'contact',
  },
  contact_phone: {
    value: '+92 300 8472948',
    label: 'Concierge Phone / WhatsApp',
    category: 'contact',
  },
  social_instagram: {
    value: 'https://instagram.com/khushbooo.official',
    label: 'Instagram Profile URL (Leave empty to hide)',
    category: 'social',
  },
  social_whatsapp: {
    value: 'https://wa.me/923008472948',
    label: 'WhatsApp Direct Chat URL (Leave empty to hide)',
    category: 'social',
  },
  social_facebook: {
    value: 'https://facebook.com/khushbooo.fragrances',
    label: 'Facebook Page URL (Leave empty to hide)',
    category: 'social',
  },
  social_tiktok: {
    value: 'https://tiktok.com/@khushbooo.official',
    label: 'TikTok Profile URL (Leave empty to hide)',
    category: 'social',
  },
  social_youtube: {
    value: '',
    label: 'YouTube Channel URL (Leave empty to hide)',
    category: 'social',
  },
  currency_symbol: {
    value: 'Rs.',
    label: 'Currency Symbol',
    category: 'store',
  },
  shipping_fee: {
    value: '250',
    label: 'Standard Shipping Fee',
    category: 'store',
  },
  free_shipping_threshold: {
    value: '4999',
    label: 'Free Shipping Threshold Amount',
    category: 'store',
  },
};

/**
 * Fetch all dynamic site content from Supabase (Server Component version)
 */
export async function getSiteContentServer(): Promise<SiteContentMap> {
  const contentMap: SiteContentMap = {};

  // Initialize with defaults
  Object.keys(DEFAULT_SITE_CONTENT).forEach((key) => {
    contentMap[key] = DEFAULT_SITE_CONTENT[key].value;
  });

  if (!isSupabaseConfiguredServer()) {
    return contentMap;
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from('site_content').select('key, value');

    if (!error && data && data.length > 0) {
      data.forEach((item: { key: string; value: string }) => {
        contentMap[item.key] = item.value;
      });
    }
  } catch (err) {
    console.warn('Error fetching site_content from server:', err);
  }

  return contentMap;
}

/**
 * Fetch all dynamic site content from Supabase (Client Component version)
 */
export async function getSiteContentClient(): Promise<SiteContentMap> {
  const contentMap: SiteContentMap = {};

  Object.keys(DEFAULT_SITE_CONTENT).forEach((key) => {
    contentMap[key] = DEFAULT_SITE_CONTENT[key].value;
  });

  if (!isSupabaseConfigured()) {
    return contentMap;
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.from('site_content').select('key, value');

    if (!error && data && data.length > 0) {
      data.forEach((item: { key: string; value: string }) => {
        contentMap[item.key] = item.value;
      });
    }
  } catch (err) {
    console.warn('Error fetching site_content from client:', err);
  }

  return contentMap;
}

/**
 * Fetch list of all content items for Admin Content Manager
 */
export async function getAllSiteContentList(): Promise<SiteContent[]> {
  if (!isSupabaseConfigured()) {
    // Return formatted defaults
    return Object.entries(DEFAULT_SITE_CONTENT).map(([key, data]) => ({
      key,
      value: data.value,
      label: data.label,
      category: data.category,
      updated_at: new Date().toISOString(),
    }));
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true });

    if (error || !data || data.length === 0) {
      // Fallback
      return Object.entries(DEFAULT_SITE_CONTENT).map(([key, item]) => ({
        key,
        value: item.value,
        label: item.label,
        category: item.category,
        updated_at: new Date().toISOString(),
      }));
    }

    return data;
  } catch (err) {
    console.error('Error fetching site_content list:', err);
    return Object.entries(DEFAULT_SITE_CONTENT).map(([key, item]) => ({
      key,
      value: item.value,
      label: item.label,
      category: item.category,
      updated_at: new Date().toISOString(),
    }));
  }
}

/**
 * Update or insert a content key in Supabase
 */
export async function updateSiteContentItem(item: {
  key: string;
  value: string;
  label?: string;
  category?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: true, // Allow optimistic preview in local demo
    };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from('site_content').upsert(
      {
        key: item.key,
        value: item.value,
        label: item.label || item.key,
        category: item.category || 'general',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update content' };
  }
}
