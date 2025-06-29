import { Metadata } from 'next'
import { seoConfig } from '@/lib/seo'

// Performance and Core Web Vitals optimization
export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#f59e0b' },
      { media: '(prefers-color-scheme: dark)', color: '#d97706' }
    ]
  }
}

// Enhanced metadata generator with additional SEO features
export function generateEnhancedMetadata(options: {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  noIndex?: boolean
  lastModified?: string
  publishedTime?: string
  authors?: string[]
  category?: string
  tags?: string[]
  images?: Array<{
    url: string
    alt: string
    width?: number
    height?: number
  }>
}): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonicalUrl,
    noIndex = false,
    lastModified,
    publishedTime,
    authors,
    category,
    tags,
    images
  } = options

  const fullTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.defaultTitle
  const fullDescription = description || seoConfig.defaultDescription
  const allKeywords = [...seoConfig.keywords, ...keywords]
  const canonicalPath = canonicalUrl ? `${seoConfig.siteUrl}${canonicalUrl}` : seoConfig.siteUrl

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    authors: authors ? authors.map(name => ({ name })) : [{ name: seoConfig.author.name }],
    creator: seoConfig.author.name,
    publisher: seoConfig.author.name,
    
    // Open Graph
    openGraph: {
      type: publishedTime ? 'article' : 'website',
      title: fullTitle,
      description: fullDescription,
      url: canonicalPath,
      siteName: seoConfig.siteName,
      locale: 'en_US',
      images: images || [
        {
          url: seoConfig.ogImage.url,
          width: seoConfig.ogImage.width,
          height: seoConfig.ogImage.height,
          alt: seoConfig.ogImage.alt,
        }
      ],
      ...(publishedTime && {
        publishedTime,
        modifiedTime: lastModified,
        authors: authors || [seoConfig.author.name],
        tags,
        section: category,
      })
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      creator: seoConfig.author.twitter,
      images: images ? images.map(img => img.url) : [seoConfig.ogImage.url],
    },

    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },

    // Alternate URLs
    alternates: {
      canonical: canonicalPath,
      types: {
        'application/rss+xml': `${seoConfig.siteUrl}/rss.xml`,
      }
    },

    // Additional metadata
    category: category || 'technology',
    classification: 'Portfolio Website',
    
    // For articles
    ...(publishedTime && {
      other: {
        'article:published_time': publishedTime,
        'article:modified_time': lastModified || publishedTime,
        'article:author': authors?.[0] || seoConfig.author.name,
        'article:section': category || '',
        'article:tag': tags?.join(', ') || '',
      }
    })
  }
}

// JSON-LD structured data generators
export const structuredDataTypes = {
  // Website schema
  website: () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    author: {
      '@type': 'Person',
      name: seoConfig.author.name,
      url: seoConfig.siteUrl,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${seoConfig.siteUrl}/blog?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }),

  // Organization schema
  organization: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoConfig.author.name,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/logo.png`,
    sameAs: Object.values(seoConfig.social),
    contactPoint: {
      '@type': 'ContactPoint',
      email: seoConfig.author.email,
      contactType: 'customer service',
    },
  }),

  // Professional service schema
  service: () => ({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${seoConfig.author.name} - Web Development Services`,
    image: seoConfig.ogImage.url,
    description: 'Professional web development services including full-stack development, React/Next.js applications, and technical consulting.',
    provider: {
      '@type': 'Person',
      name: seoConfig.author.name,
      jobTitle: 'Full-Stack Developer',
      url: seoConfig.siteUrl,
    },
    areaServed: 'Worldwide',
    serviceType: 'Web Development',
    offers: seoConfig.services.map(service => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service,
      },
    })),
  }),

  // Breadcrumb schema
  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${seoConfig.siteUrl}${item.url}`,
    })),
  }),

  // FAQ schema
  faq: (faqs: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }),
}

// Performance optimization metadata
export const performanceMetadata = {
  // Preconnect to external domains
  links: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
  ],
  
  // Resource hints
  resourceHints: {
    preload: [
      { href: '/fonts/geist-sans.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { href: '/fonts/geist-mono.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
    ],
  },
}

const seoEnhanced = {
  generateEnhancedMetadata,
  generateViewport,
  structuredDataTypes,
  performanceMetadata,
}

export default seoEnhanced
