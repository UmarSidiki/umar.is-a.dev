// Centralized SEO Configuration - Manage everything from here
export const seoConfig = {
  // Basic site information
  siteName: "Umar Siddiqui - Full-Stack Developer",
  siteUrl: "https://umar.is-a.dev", // Your actual domain
  defaultTitle: "Umar Siddiqui - Full-Stack Developer",
  defaultDescription: "Unlock your project's potential with Umar Siddiqui, a full-stack web and mobile app developer. Specializing in React, Next.js, and TypeScript, I deliver high-performance, innovative digital solutions.",

  // Domain and environment settings
  domain: "umar.is-a.dev",
  protocol: "https",
  environment: "production", // "development" | "staging" | "production"

  // Author information
  author: {
    name: "Umar Siddiqui",
    email: "siddiquiumar0007@gmail.com",
    twitter: "", // Your Twitter handle
    linkedin: "https://linkedin.com/in/umarsidiki",
    github: "https://github.com/UmarSidiki",
  },

  // Robots.txt configuration
  robots: {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin*',
          '/api/admin*',
          '/api/auth*',
          '/_next*',
          '/private*',
          '/api/test-db*',
          '/api/upload*',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
      {
        userAgent: 'Bard',
        disallow: '/',
      },
    ],
    host: true, // Use the main domain as host
    sitemap: true, // Include sitemap reference
  },

  // Sitemap configuration
  sitemap: {
    staticRoutes: [
      {
        path: '/',
        changeFrequency: 'weekly' as const,
        priority: 1.0,
      },
      {
        path: '/projects',
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        path: '/contact',
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        path: '/blog',
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
    ],
    dynamicRoutes: {
      blog: {
        collection: 'blogposts',
        pathPrefix: '/blog/',
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        filter: { status: 'published' },
        sort: { createdAt: -1 as const },
        fields: { slug: 1, updatedAt: 1, createdAt: 1 },
      },
      projects: {
        collection: 'projects',
        pathPrefix: '/projects/',
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        filter: { status: 'published' },
        sort: { createdAt: -1 as const },
        fields: { slug: 1, updatedAt: 1, createdAt: 1 },
      },
    },
  },

  // Page-specific metadata
  pages: {
    home: {
      title: "Umar Siddiqui - Full-Stack Developer | React, Next.js Expert",
      description: "Unlock your project's potential with Umar Siddiqui, a full-stack web and mobile app developer. Specializing in React, Next.js, and TypeScript, I deliver high-performance, innovative digital solutions.",
      keywords: ["Umar Siddiqui", "Full-Stack Web Developer", "Mobile App Developer", "React.js", "Next.js", "TypeScript", "Laravel", "Custom Web Development", "Mobile Solutions", "Digital Solutions", "Software Development Portfolio"],
      noindex: false,
    },
    contact: {
      title: "Contact Umar Siddiqui | Full-Stack Web & Mobile App Developer",
      description: "Ready to start your next project? Contact Umar Siddiqui for expert web development, mobile app solutions, technical consulting, or collaboration. Let's build innovative digital experiences together.",
      keywords: ["Contact Umar Siddiqui", "Hire Web Developer", "Mobile App Development Services", "Technical Consulting", "Custom Software Development", "Freelance Full-Stack Developer", "Web Development Projects", "Collaboration Opportunities"],
      noindex: false,
    },
    projects: {
      title: "Projects Portfolio | Umar Siddiqui - Full-Stack Development Showcase",
      description: "Explore my comprehensive portfolio of web and mobile applications. View real-world projects built with React, Next.js, TypeScript, Laravel, and Flutter showcasing modern development practices and innovative solutions.",
      keywords: ["Portfolio Projects", "Web Development Portfolio", "React Projects", "Next.js Applications", "Mobile App Development", "Full-Stack Projects", "TypeScript Projects", "Laravel Applications", "Flutter Apps", "Umar Siddiqui Work", "Development Showcase"],
      noindex: false,
    },
    blog: {
      title: "Umar Siddiqui's Blog | Web & Mobile App Development Insights",
      description: "Explore the latest articles and insights on modern web development, React, Next.js, TypeScript, and mobile app development from Umar Siddiqui. Stay updated with cutting-edge programming trends.",
      keywords: ["Web Development Blog", "Mobile App Development Blog", "React Tutorials", "Next.js Best Practices", "TypeScript Guides", "Programming Insights", "Software Development Articles", "Umar Siddiqui Blog"],
      noindex: false,
    },
    admin: {
      title: "Admin Dashboard | Umar Siddiqui Portfolio Management",
      description: "Secure administrative interface for managing content, projects, and user data for Umar Siddiqui's professional portfolio.",
      keywords: ["Admin Panel", "Dashboard Access", "Content Management System", "Portfolio Administration"],
      noindex: true, // Crucial: Do not index admin pages for security and SEO best practices
    },
  },

  // Default keywords for the site
  keywords: [
    "Umar Siddiqui",
    "Web Developer",
    "Mobile App Developer",
    "Full-Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "Custom Web Development",
    "Mobile Application Development",
    "Frontend Development Expert",
    "Backend Development Solutions",
    "JavaScript Specialist",
    "Modern Web Technologies",
    "Responsive Web Design",
    "API Integration",
    "Database Management",
    "Software Engineer Portfolio",
    "Hire Umar Siddiqui"
  ],

  // Social media profiles
  social: {
    twitter: "https://twitter.com/umarsidiki",
    linkedin: "https://linkedin.com/in/umarsidiki",
    github: "https://github.com/UmarSidiki",
    // Add other social profiles as needed
  },

  // Open Graph default image
  ogImage: {
    url: "/api/og",
    width: 1200,
    height: 630,
    alt: "Umar Siddiqui - Full-Stack Developer Portfolio",
  },

  // Language and locale settings
  language: "en-US",
  locale: "en_US",
  alternateLanguages: [], // Add if you support multiple languages

  // Technical skills for structured data
  skills: [
    // Core Technologies
    "React.js",
    "Next.js",
    "TypeScript",
    "JavaScript (ES6+)", // Specify version for modernity
    "Node.js",
    "Python",

    // Development Disciplines
    "Full-Stack Web Development",
    "Frontend Development",
    "Backend Development",
    "Mobile App Development (React Native / Cross-platform)", // Crucial addition
    "Progressive Web Apps (PWAs)",

    // Key Capabilities & Practices
    "API Design & Development (RESTful, GraphQL)", // Specify types
    "Database Design & Management (SQL/NoSQL)", // Specify types if applicable, e.g., PostgreSQL, MongoDB
    "UI/UX Principles & Implementation", // More professional than just "UI/UX Design" if you're not a dedicated designer
    "Responsive & Adaptive Design",
    "Web Performance Optimization",
    "Scalable Architecture Design", // Important for enterprise clients
    "Cloud Deployment & Management (AWS/Azure/GCP Basics)", // If you have experience
    "Version Control (Git/GitHub/GitLab)", // Essential for collaboration
    "Testing & Debugging" // Demonstrates quality focus
  ],

  // Location information
  location: {
    city: "Sukkur",
    region: "Sindh",
    country: "Pakistan",
    address: "H# A1408/191, Old Sukkur, Sukkur, Sindh, Pakistan"
  },

  // Services offered
  services: [
    "Full-Stack Web Development (React, Next.js, Node.js, Python)", // Specify core tech
    "Custom Mobile App Development (iOS/Android with React Native)", // Crucial addition with platform mention
    "Modern Frontend Development (React.js, Next.js, UI/UX Implementation)",
    "Robust Backend & API Development (RESTful, GraphQL, Microservices)", // Add Microservices for scale
    "Database Design & Optimization (SQL, NoSQL, Data Modeling)", // Mention types and purpose
    "Web Application Performance Optimization & Scalability", // Broader, more benefit-oriented
    "Technical Consulting & Strategy", // Elevates "Technical Consulting"
    "Code Audits & Review for Quality Assurance", // More formal than "Code Review"
    "Software Architecture & System Design", // More formal than "Project Architecture"
    "Cloud Integration & Deployment (AWS, Azure, GCP)", // If applicable
    "Progressive Web App (PWA) Development"
  ]
};

// Helper function to generate page metadata
export function generatePageMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website" as "website" | "article",
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}) {
  const pageTitle = title
    ? `${title} | ${seoConfig.siteName}`
    : seoConfig.defaultTitle;

  const pageDescription = description || seoConfig.defaultDescription;
  const pageKeywords = [...seoConfig.keywords, ...keywords];
  const pageUrl = url ? `${seoConfig.siteUrl}${url}` : seoConfig.siteUrl;
  const pageImage = image || seoConfig.ogImage.url;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    authors: authors ? authors.map(name => ({ name })) : [{ name: seoConfig.author.name }],
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type,
      url: pageUrl,
      siteName: seoConfig.siteName,
      images: [
        {
          url: pageImage,
          width: seoConfig.ogImage.width,
          height: seoConfig.ogImage.height,
          alt: title || seoConfig.ogImage.alt,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: authors || [seoConfig.author.name],
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      creator: seoConfig.author.twitter,
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

// Enhanced page metadata generator with full SEO support
export function generateCompletePageMetadata({
  pageKey,
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website" as "website" | "article",
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noindex,
}: {
  pageKey?: keyof typeof seoConfig.pages;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  noindex?: boolean;
}) {
  // Get page-specific config if pageKey is provided
  const pageConfig = pageKey ? seoConfig.pages[pageKey] : null;

  // Merge provided data with page config and defaults
  const finalTitle = title || pageConfig?.title || seoConfig.defaultTitle;
  const finalDescription = description || pageConfig?.description || seoConfig.defaultDescription;
  const finalKeywords = [
    ...seoConfig.keywords,
    ...(pageConfig?.keywords || []),
    ...keywords
  ];
  const shouldNoIndex = noindex ?? pageConfig?.noindex ?? false;

  const pageTitle = finalTitle.includes(seoConfig.siteName)
    ? finalTitle
    : `${finalTitle} | ${seoConfig.siteName}`;

  const pageUrl = url ? `${seoConfig.siteUrl}${url}` : seoConfig.siteUrl;
  const pageImage = image || seoConfig.ogImage.url;

  const metadata = {
    title: pageTitle,
    description: finalDescription,
    keywords: finalKeywords,
    authors: authors ? authors.map(name => ({ name })) : [{ name: seoConfig.author.name }],
    robots: shouldNoIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      title: pageTitle,
      description: finalDescription,
      type,
      url: pageUrl,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      images: [
        {
          url: pageImage,
          width: seoConfig.ogImage.width,
          height: seoConfig.ogImage.height,
          alt: title || seoConfig.ogImage.alt,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: authors || [seoConfig.author.name],
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      creator: seoConfig.author.twitter,
      title: pageTitle,
      description: finalDescription,
      images: [pageImage],
    },
    alternates: {
      canonical: pageUrl,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      bing: process.env.BING_VERIFICATION,
    },
    other: {
      'theme-color': '#f59e0b', // Amber-500 color
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no',
    },
  };

  return metadata;
}

// Generate manifest data
export function getManifestData() {
  return {
    name: seoConfig.siteName,
    short_name: seoConfig.author.name,
    description: seoConfig.defaultDescription,
    start_url: '/',
    display: 'standalone' as const,
    background_color: '#ffffff',
    theme_color: '#f59e0b',
    orientation: 'portrait-primary' as const,
    scope: '/',
    lang: seoConfig.language,
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any' as const,
        type: 'image/x-icon',
      },
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['portfolio', 'developer', 'technology'],
  };
}

// Export everything for easy access
const seoUtils = {
  config: seoConfig,
  robots: getRobotsConfig,
  sitemap: getSitemapConfig,
  pageMetadata: getPageMetadata,
  generateMetadata: generateCompletePageMetadata,
  manifest: getManifestData,
  structuredData: generateStructuredData,
};

export default seoUtils;

// Helper functions for robots.txt and sitemap generation
export function getRobotsConfig() {
  return {
    rules: seoConfig.robots.rules,
    sitemap: seoConfig.robots.sitemap ? `${seoConfig.siteUrl}/sitemap.xml` : undefined,
    host: seoConfig.robots.host ? seoConfig.siteUrl : undefined,
  };
}

export function getSitemapConfig() {
  return {
    baseUrl: seoConfig.siteUrl,
    staticRoutes: seoConfig.sitemap.staticRoutes.map(route => ({
      url: `${seoConfig.siteUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    dynamicRoutes: seoConfig.sitemap.dynamicRoutes,
  };
}

// Get page-specific metadata
export function getPageMetadata(pageKey: keyof typeof seoConfig.pages) {
  const pageConfig = seoConfig.pages[pageKey];
  return {
    title: pageConfig.title,
    description: pageConfig.description,
    keywords: pageConfig.keywords,
    noindex: pageConfig.noindex,
  };
}

// Types for structured data
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  author?: string;
  tags?: string[];
  category?: string;
  image?: string;
}

// Generate structured data for different page types
export function generateStructuredData(
  type: "person" | "website" | "contact" | "blog" | "article" | "breadcrumb",
  data?: {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
    breadcrumbs?: Array<{ name: string; url: string }>;
    article?: BlogPost;
    posts?: BlogPost[];
  }
) {
  const baseUrl = seoConfig.siteUrl;
  const author = seoConfig.author;

  switch (type) {
    case "person":
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: author.name,
        jobTitle: "Full-Stack Developer",
        description: seoConfig.defaultDescription,
        url: baseUrl,
        email: author.email,
        image: `${baseUrl}/logo.png`,
        sameAs: [
          author.linkedin,
          author.github,
          author.twitter ? `https://twitter.com/${author.twitter.replace('@', '')}` : null,
        ].filter(Boolean),
        address: {
          "@type": "PostalAddress",
          addressLocality: seoConfig.location.city,
          addressRegion: seoConfig.location.region,
          addressCountry: seoConfig.location.country,
          streetAddress: seoConfig.location.address,
        },
        worksFor: {
          "@type": "Organization",
          name: "Freelance",
        },
        knowsAbout: seoConfig.skills,
        hasOccupation: {
          "@type": "Occupation",
          name: "Full-Stack Developer",
          description: "Develops web applications using modern technologies",
          skills: seoConfig.skills.join(", "),
        },
      };

    case "website":
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: seoConfig.siteName,
        description: seoConfig.defaultDescription,
        url: baseUrl,
        author: {
          "@type": "Person",
          name: author.name,
          url: baseUrl,
        },
        inLanguage: seoConfig.language,
        copyrightYear: new Date().getFullYear(),
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      };

    case "contact":
      return {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: `Contact ${author.name}`,
        description: seoConfig.pages.contact.description,
        url: `${baseUrl}/contact`,
        mainEntity: {
          "@type": "Person",
          name: author.name,
          email: author.email,
          telephone: "+92 318 9009633",
          address: {
            "@type": "PostalAddress",
            addressLocality: seoConfig.location.city,
            addressRegion: seoConfig.location.region,
            addressCountry: seoConfig.location.country,
            streetAddress: seoConfig.location.address,
          },
          contactType: "Professional Services",
          availableService: seoConfig.services.map(service => ({
            "@type": "Service",
            name: service,
            provider: {
              "@type": "Person",
              name: author.name,
            },
          })),
        },
      };

    case "blog":
      return {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: `${author.name} - Blog`,
        description: seoConfig.pages.blog.description,
        url: `${baseUrl}/blog`,
        author: {
          "@type": "Person",
          name: author.name,
          url: baseUrl,
        },
        publisher: {
          "@type": "Person",
          name: author.name,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
          },
        },
        inLanguage: seoConfig.language,
        ...(data?.posts && {
          blogPost: data.posts.map((post: BlogPost) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt || post.description,
            url: `${baseUrl}/blog/${post.slug}`,
            datePublished: post.createdAt,
            dateModified: post.updatedAt,
            author: {
              "@type": "Person",
              name: author.name,
            },
          })),
        }),
      };

    case "article":
      if (!data?.article) return null;

      const article = data.article;
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt || article.description,
        image: article.image || `${baseUrl}/api/og?title=${encodeURIComponent(article.title)}`,
        datePublished: article.createdAt,
        dateModified: article.updatedAt,
        author: {
          "@type": "Person",
          name: article.author || author.name,
          url: baseUrl,
        },
        publisher: {
          "@type": "Person",
          name: author.name,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${baseUrl}/blog/${article.slug}`,
        },
        url: `${baseUrl}/blog/${article.slug}`,
        inLanguage: seoConfig.language,
        wordCount: article.content ? article.content.length : undefined,
        keywords: article.tags ? article.tags.join(", ") : data?.tags?.join(", "),
        articleSection: article.category,
        about: article.tags?.map((tag: string) => ({
          "@type": "Thing",
          name: tag,
        })),
      };

    case "breadcrumb":
      if (!data?.breadcrumbs) return null;

      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: data.breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${baseUrl}${crumb.url}`,
        })),
      };

    default:
      return null;
  }
}
