import { getSiteContentServer } from '@/lib/data/site-content';
import { getProductsServer } from '@/lib/data/products';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/storefront/HeroSection';
import { FragranceNotesScrollytelling } from '@/components/storefront/FragranceNotesScrollytelling';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { HeritageSection } from '@/components/storefront/HeritageSection';
import { Footer } from '@/components/layout/Footer';
import { LuxuryTicker } from '@/components/storefront/LuxuryTicker';
import { DynamicBackgroundRenderer } from '@/components/canvas/DynamicBackgroundRenderer';

// Revalidate every 60 seconds (or on-demand)
export const revalidate = 60;

export default async function HomePage() {
  // Fetch dynamic content and products from Supabase
  const [content, products] = await Promise.all([
    getSiteContentServer(),
    getProductsServer(),
  ]);

  const featuredProducts = products.filter((p) => p.is_featured);

  return (
    <div className="flex flex-col min-h-screen bg-obsidian relative">
      {/* Global 3D Animated Background Canvas (Admin Controlled) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <DynamicBackgroundRenderer targetSection="page_background" className="w-full h-full" />
      </div>

      {/* 1. Dynamic Top Navigation */}
      <Navbar content={content} />

      <main className="flex-1">
        {/* 2. 3D Interactive Sticky Hero */}
        <HeroSection
          content={content}
          featuredProducts={featuredProducts.length > 0 ? featuredProducts : products}
        />

        {/* 2.5 Luxury Haute Parfumerie Ribbon */}
        <LuxuryTicker />

        {/* 3. Masterpiece Collection (Artisanal Perfumes & Pure Attars) */}
        <ProductGrid
          products={products}
          content={content}
        />

        {/* 4. Scrollytelling Fragrance Notes Explorer */}
        <FragranceNotesScrollytelling content={content} />

        {/* 5. Brand Heritage & Storytelling */}
        <HeritageSection content={content} />
      </main>

      {/* 6. Dynamic Concierge Footer */}
      <Footer content={content} />
    </div>
  );
}
