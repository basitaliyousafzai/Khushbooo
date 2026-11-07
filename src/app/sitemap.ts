import { MetadataRoute } from 'next';
import { FALLBACK_PRODUCTS } from '@/lib/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khushbooo.vercel.app';
  const now = new Date();

  // Core static storefront routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/track`,
      lastModified: now,
      changeFrequency: 'always',
      priority: 0.9,
    },
  ];

  // Add individual product anchors / catalogue targets
  FALLBACK_PRODUCTS.forEach((product) => {
    routes.push({
      url: `${baseUrl}#${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  return routes;
}
