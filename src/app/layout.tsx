import type { Metadata } from 'next';
import { Cinzel, Montserrat } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { CheckoutModal } from '@/components/storefront/CheckoutModal';

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

export const metadata: Metadata = {
  title: 'Khushbooo | Haute Parfumerie & Pure Concentrated Attars',
  description: 'Experience bespoke French extraits de parfum and pure concentrated oud attars hand-distilled from ethical botanicals across Grasse, Kannauj, and Assam.',
  keywords: 'Khushbooo, luxury perfume, pure attar, ittar, oud royal, cash on delivery, 3d perfume store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable} dark`}>
      <body className="bg-obsidian text-champagne min-h-screen selection:bg-gold/30 selection:text-white antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
          <CheckoutModal />
        </CartProvider>
      </body>
    </html>
  );
}
