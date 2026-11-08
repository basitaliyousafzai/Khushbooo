import { getSiteContentServer } from '@/lib/data/site-content';
import { getProductsServer } from '@/lib/data/products';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/storefront/HeroSection';
import { TrustPropositionsBar } from '@/components/storefront/TrustPropositionsBar';
import { AlternatingProductMarquee } from '@/components/storefront/AlternatingProductMarquee';
import { PromoSplitShowcase } from '@/components/storefront/PromoSplitShowcase';
import { FragranceNotesScrollytelling } from '@/components/storefront/FragranceNotesScrollytelling';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { HeritageSection } from '@/components/storefront/HeritageSection';
import { Footer } from '@/components/layout/Footer';
import { MobileStickyDock } from '@/components/storefront/MobileStickyDock';
import { DynamicBackgroundRenderer } from '@/components/canvas/DynamicBackgroundRenderer';

// Ensure live storefront updates immediately whenever admin changes prices, products, or content
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch dynamic content and products from Supabase
  const [content, products] = await Promise.all([
    getSiteContentServer(),
    getProductsServer(),
  ]);

  const featuredProducts = products.filter((p) => p.is_featured);

  return (
    <div suppressHydrationWarning className="flex flex-col min-h-screen bg-obsidian relative pb-16 lg:pb-0 w-full max-w-full overflow-x-hidden">
      {/* Global 3D Animated Background Canvas (Admin Controlled) */}
      <div suppressHydrationWarning className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <DynamicBackgroundRenderer targetSection="page_background" className="w-full h-full" />
      </div>

      {/* 1. Haute Parfumerie Top Navigation */}
      <Navbar content={content} />

      <main suppressHydrationWarning className="flex-1 w-full min-w-0 max-w-full overflow-x-hidden">
        {/* 2. 3D Interactive Centerpiece Hero */}
        <HeroSection
          content={content}
          featuredProducts={featuredProducts.length > 0 ? featuredProducts : products}
        />

        {/* 3. Prestige Trust & Craftsmanship Bar */}
        <TrustPropositionsBar />

        {/* 4. Curated Runway Showcase: 3 Smooth Alternating Rows (RTL -> LTR -> RTL) */}
        <AlternatingProductMarquee products={products} />

        {/* 5. Editorial Heritage Split Cards */}
        <PromoSplitShowcase />

        {/* 6. Complete Masterpiece Catalogue & Type Filters */}
        <ProductGrid
          products={products}
          content={content}
        />

        {/* 7. Scrollytelling 3-Tier Olfactory Notes Explorer */}
        <FragranceNotesScrollytelling content={content} />

        {/* 8. Atelier Distillation & Heritage Story */}
        <HeritageSection content={content} />
      </main>

      {/* 9. Dynamic Concierge Footer */}
      <Footer content={content} />

      {/* 10. Mobile Sticky Bottom Navigation Dock */}
      <MobileStickyDock />
    </div>
  );
}
