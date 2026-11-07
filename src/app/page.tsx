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
import { LuxuryTicker } from '@/components/storefront/LuxuryTicker';
import { MobileStickyDock } from '@/components/storefront/MobileStickyDock';
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
    <div className="flex flex-col min-h-screen bg-obsidian relative pb-14 lg:pb-0">
      {/* Global 3D Animated Background Canvas (Admin Controlled) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <DynamicBackgroundRenderer targetSection="page_background" className="w-full h-full" />
      </div>

      {/* 1. Dynamic Top Navigation (Template 09 Layout with Categories Drawer) */}
      <Navbar content={content} />

      <main className="flex-1">
        {/* 2. 3D Interactive Sticky Hero */}
        <HeroSection
          content={content}
          featuredProducts={featuredProducts.length > 0 ? featuredProducts : products}
        />

        {/* 3. Trust / Value Propositions Bar (4-Grid Icon Bar) */}
        <TrustPropositionsBar />

        {/* 4. 3 Animated Alternating Scrolling Marquee Rows (RTL -> LTR -> RTL) */}
        <AlternatingProductMarquee products={products} />

        {/* 4.5 Luxury Haute Parfumerie Ticker */}
        <LuxuryTicker />

        {/* 5. Dual Promotional Split Showcase (Crafted for Excellence + Discovery Collection) */}
        <PromoSplitShowcase />

        {/* 6. Masterpiece Collection (Artisanal Perfumes & Pure Attars Catalog) */}
        <ProductGrid
          products={products}
          content={content}
        />

        {/* 7. Scrollytelling Fragrance Notes Explorer */}
        <FragranceNotesScrollytelling content={content} />

        {/* 8. Brand Heritage & Atelier Storytelling */}
        <HeritageSection content={content} />
      </main>

      {/* 9. Dynamic Concierge Footer */}
      <Footer content={content} />

      {/* 10. Mobile Sticky Bottom Navigation Dock */}
      <MobileStickyDock />
    </div>
  );
}
