// SEO Configuration for the portfolio
export const seoConfig = {
  // Basic site information
  siteName: "Umar Siddiqui - Full-Stack Developer",
  siteUrl: "https://umarsiddiqui.dev", // Replace with your actual domain
  defaultTitle: "Umar Siddiqui - Full-Stack Developer | React, Next.js, Node.js Expert",
  defaultDescription: "Professional portfolio of Umar Siddiqui, an experienced full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies. Creating innovative digital solutions and scalable web applications.",
  
  // Author information
  author: {
    name: "Umar Siddiqui",
    email: "siddiquiumar0007@gmail.com",
    twitter: "@umarsiddiqui", // Replace with your Twitter handle
    linkedin: "https://linkedin.com/in/umarsiddiqui", // Replace with your LinkedIn
    github: "https://github.com/umarsiddiqui", // Replace with your GitHub
  },

  // Default keywords for the site
  keywords: [
    "Full-Stack Developer",
    "React Developer", 
    "Next.js Expert",
    "TypeScript Developer",
    "Node.js Developer",
    "Web Development",
    "Frontend Development",
    "Backend Development",
    "JavaScript Expert",
    "Modern Web Technologies",
    "Responsive Design",
    "API Development",
    "Database Design",
    "Cloud Computing",
    "Software Engineer",
    "Umar Siddiqui"
  ],

  // Social media profiles
  social: {
    twitter: "https://twitter.com/umarsiddiqui", // Replace with your Twitter
    linkedin: "https://linkedin.com/in/umarsiddiqui", // Replace with your LinkedIn
    github: "https://github.com/umarsiddiqui", // Replace with your GitHub
    // Add other social profiles as needed
  },

  // Open Graph default image
  ogImage: {
    url: "/api/og",
    width: 1200,
    height: 630,
    alt: "Umar Siddiqui - Full-Stack Developer Portfolio",
  },

  // Technical skills for structured data
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Python",
    "Web Development",
    "Frontend Development",
    "Backend Development",
    "Full-Stack Development",
    "API Development",
    "Database Design",
    "UI/UX Design",
    "Responsive Design",
    "Progressive Web Apps",
    "Performance Optimization"
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
    "Full-Stack Web Development",
    "React/Next.js Development",
    "API Development",
    "Database Design",
    "Performance Optimization",
    "Technical Consulting",
    "Code Review",
    "Project Architecture"
  ]
};

// Helper function to generate page metadata
export function generatePageMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
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

// Generate JSON-LD structured data for different page types
export function generateStructuredData(type: "person" | "blog" | "article" | "contact", data?: {
  title?: string;
  description?: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  url?: string;
  keywords?: string[];
  category?: string;
}) {
  const baseData = {
    "@context": "https://schema.org",
  };

  switch (type) {
    case "person":
      return {
        ...baseData,
        "@type": "Person",
        name: seoConfig.author.name,
        jobTitle: "Full-Stack Developer",
        description: seoConfig.defaultDescription,
        url: seoConfig.siteUrl,
        email: seoConfig.author.email,
        sameAs: Object.values(seoConfig.social),
        knowsAbout: seoConfig.skills,
        worksFor: {
          "@type": "Organization",
          name: "Freelance"
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: seoConfig.location.city,
          addressRegion: seoConfig.location.region,
          addressCountry: seoConfig.location.country
        },
        offers: {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web Development Services",
            description: "Professional web development services including " + seoConfig.services.join(", ")
          }
        }
      };

    case "blog":
      return {
        ...baseData,
        "@type": "Blog",
        name: `${seoConfig.author.name} Blog`,
        description: "Web development articles, tutorials, and insights about modern programming technologies",
        url: `${seoConfig.siteUrl}/blog`,
        author: {
          "@type": "Person",
          name: seoConfig.author.name,
          url: seoConfig.siteUrl
        },
        publisher: {
          "@type": "Person",
          name: seoConfig.author.name,
          url: seoConfig.siteUrl
        },
        inLanguage: "en-US"
      };

    case "article":
      return {
        ...baseData,
        "@type": "BlogPosting",
        headline: data?.title || "",
        description: data?.description || "",
        image: data?.image || seoConfig.ogImage.url,
        datePublished: data?.publishedTime,
        dateModified: data?.modifiedTime,
        author: {
          "@type": "Person",
          name: data?.author || seoConfig.author.name,
          url: seoConfig.siteUrl
        },
        publisher: {
          "@type": "Person",
          name: seoConfig.author.name,
          url: seoConfig.siteUrl
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": data?.url || seoConfig.siteUrl
        },
        keywords: data?.keywords?.join(", ") || "",
        articleSection: data?.category || "",
        isAccessibleForFree: true
      };

    case "contact":
      return {
        ...baseData,
        "@type": "ContactPage",
        name: `Contact ${seoConfig.author.name}`,
        description: "Get in touch for web development services and technical consultation",
        url: `${seoConfig.siteUrl}/contact`,
        mainEntity: {
          "@type": "Person",
          name: seoConfig.author.name,
          jobTitle: "Full-Stack Developer",
          email: seoConfig.author.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: seoConfig.location.address.split(",")[0],
            addressLocality: seoConfig.location.city,
            addressRegion: seoConfig.location.region,
            addressCountry: seoConfig.location.country
          }
        }
      };

    default:
      return baseData;
  }
}
