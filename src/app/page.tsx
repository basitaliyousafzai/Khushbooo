import { getSiteContentServer } from '@/lib/data/site-content';
import { getProductsServer } from '@/lib/data/products';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/storefront/HeroSection';
import { ScrollStory3D } from '@/components/storefront/ScrollStory3D';
import { FragranceNotesScrollytelling } from '@/components/storefront/FragranceNotesScrollytelling';
import { AlternatingProductMarquee } from '@/components/storefront/AlternatingProductMarquee';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { HeritageSection } from '@/components/storefront/HeritageSection';
import { Footer } from '@/components/layout/Footer';
import { LuxuryTicker } from '@/components/storefront/LuxuryTicker';

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
    <div className="flex flex-col min-h-screen bg-obsidian">
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

        {/* 2.8 Interactive 3D Scroll Journey: Perfumes & Attars with dynamic liquid morphing */}
        <ScrollStory3D products={products} />

        {/* 3. Scrollytelling Fragrance Notes Explorer */}
        <FragranceNotesScrollytelling content={content} />

        {/* 3.5 Alternating Multi-Row Product Carousel (Right to Left & Left to Right) */}
        <AlternatingProductMarquee products={products} />

        {/* 4. Product Catalogue with Real-time Stock Badges */}
        <ProductGrid
          products={products}
          content={content}
        />

        {/* 5. Brand Heritage & Storytelling */}
        <HeritageSection content={content} />
      </main>

      {/* 6. Dynamic Concierge Footer */}
      <Footer content={content} />
    </div>
  );
}
