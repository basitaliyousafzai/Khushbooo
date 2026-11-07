import type { Metadata, Viewport } from 'next';
import { Cinzel, Montserrat } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { CheckoutModal } from '@/components/storefront/CheckoutModal';
import { StructuredData } from '@/components/seo/StructuredData';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khushbooo.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Khushbooo | Haute Parfumerie & Pure Concentrated Attars',
    template: '%s | Khushbooo',
  },
  description:
    'Experience bespoke French extraits de parfum (35% concentration) and pure concentrated wild oud attars hand-distilled from ethical botanicals across Grasse, Kannauj, and Assam. Complimentary nationwide delivery & Cash on Delivery across Pakistan.',
  keywords: [
    'Khushbooo',
    'luxury perfume Pakistan',
    'pure attar',
    'ittar online',
    'oud royal extrait',
    'dehn al oud',
    'cash on delivery perfume',
    'haute parfumerie',
    'French perfume Karachi',
    'fragrances Lahore',
    'best attar in Pakistan',
  ],
  authors: [{ name: 'Khushbooo Atelier' }],
  creator: 'Khushbooo Haute Parfumerie',
  publisher: 'Khushbooo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Khushbooo | Haute Parfumerie & Pure Concentrated Attars',
    description:
      'Hand-poured 35% extraits de parfum and pure uncut Cambodian oud attar oils. Wax-sealed flacons delivered nationwide with Cash on Delivery.',
    url: siteUrl,
    siteName: 'Khushbooo',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'Khushbooo Haute Parfumerie Flacons & Pure Attars',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khushbooo | Haute Parfumerie & Pure Concentrated Attars',
    description:
      '35% Extraits de Parfum & 100% uncut pure oud attar oils. Delivered across Pakistan with Cash on Delivery.',
    images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'Fragrances & Luxury Perfumery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable} dark`} suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body
        className="bg-obsidian text-champagne min-h-screen selection:bg-gold/30 selection:text-white antialiased"
        suppressHydrationWarning
      >
        <CartProvider>
          {children}
          <CartDrawer />
          <CheckoutModal />
        </CartProvider>
      </body>
    </html>
  );
}
