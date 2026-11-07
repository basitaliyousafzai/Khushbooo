import React from 'react';
import { FALLBACK_PRODUCTS } from '@/lib/data/products';

export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khushbooo.vercel.app';

  // 1. Store / Organization / LocalBusiness Schema
  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Khushbooo',
    alternateName: 'Khushbooo Haute Parfumerie & Pure Concentrated Attars',
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    description:
      'Premier Pakistani Haute Parfumerie and pure uncut attar atelier. Hand-poured 35% extraits de parfum, 25-year aged wild Cambodian oud, and authentic rose attars delivered nationwide with cash on delivery.',
    priceRange: 'PKR 9,900 - PKR 18,500',
    currenciesAccepted: 'PKR',
    paymentAccepted: 'Cash on Delivery, Bank Transfer',
    telephone: '+92-300-8472948',
    email: 'concierge@khushbooo.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PK',
      addressLocality: 'Karachi / Lahore / Islamabad',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '20:00',
      },
    ],
    sameAs: [
      'https://instagram.com/khushbooo',
      'https://facebook.com/khushbooo',
    ],
  };

  // 2. WebSite Schema with SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Khushbooo',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // 3. Product Catalog (ItemList Schema) for Google Product Carousels & AI Overviews
  const productItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Khushbooo Haute Parfumerie & Pure Attar Masterpiece Collection',
    itemListElement: FALLBACK_PRODUCTS.map((prod, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: prod.title,
        description: prod.short_description || prod.long_description,
        image: prod.images?.[0]?.image_url,
        sku: prod.id,
        category: prod.category_type === 'attar' ? 'Pure Attar Oil' : 'Extrait de Parfum',
        brand: {
          '@type': 'Brand',
          name: 'Khushbooo',
        },
        offers: {
          '@type': 'Offer',
          url: `${baseUrl}#collection`,
          priceCurrency: 'PKR',
          price: prod.discount_price || prod.price,
          itemCondition: 'https://schema.org/NewCondition',
          availability:
            prod.stock_quantity > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'Khushbooo',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          reviewCount: '128',
          bestRating: '5',
          worstRating: '1',
        },
      },
    })),
  };

  // 4. FAQPage Schema for AI Search Engines (Perplexity, ChatGPT, Google AI Overviews)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the concentration of Khushbooo perfumes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Khushbooo artisanal sprays are compounded at 35% Extrait de Parfum oil concentration, guaranteeing superior 12-16 hour projection. Our attars (ittars) are 100% uncut, alcohol-free pure perfume oils with multi-day longevity on clothing and skin.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Khushbooo offer Cash on Delivery across Pakistan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Khushbooo provides seamless Cash on Delivery (COD) services to all cities and towns across Pakistan via insured courier partners (TCS, Leopards Courier, Trax). Delivery is complimentary on orders above Rs. 4,999.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I track my Khushbooo order?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can track your parcel live anytime by visiting khushbooo.vercel.app/track and entering your unique order reference (e.g. KHB-1042) along with the last 4 digits of your phone number.',
        },
      },
      {
        '@type': 'Question',
        name: 'What rare notes are used in Khushbooo fragrances?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our creations feature 25-year aged wild Cambodian and Assam agarwood (Oud), Kashmir saffron stigma, Grasse rose de mai, cured ambergris, Madagascar pink pepper, and Mysore sandalwood.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productItemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
