import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Latest Articles & Tutorials",
  description: "Discover insights, tutorials, and thoughts about web development, technology, and the digital world. Learn React, Next.js, TypeScript, and modern web technologies through detailed articles and practical examples.",
  keywords: [
    "Web Development Blog",
    "React Tutorials",
    "Next.js Articles",
    "TypeScript Guide",
    "JavaScript Tips",
    "Frontend Development",
    "Backend Development",
    "Programming Tutorials",
    "Web Development Tips",
    "Modern Web Technologies",
    "Developer Blog",
    "Coding Tutorials"
  ],
  openGraph: {
    title: "Blog - Web Development Articles & Tutorials | Umar Siddiqui",
    description: "Discover insights, tutorials, and thoughts about web development, technology, and modern programming practices.",
    type: "website",
    images: [
      {
        url: "/api/og?title=Blog&subtitle=Web Development Articles & Tutorials&type=blog",
        width: 1200,
        height: 630,
        alt: "Umar Siddiqui Blog",
      },
    ],
  },
  twitter: {
    title: "Blog - Web Development Articles & Tutorials",
    description: "Discover insights, tutorials, and thoughts about web development and modern programming practices.",
  },
  alternates: {
    canonical: "https://umarsiddiqui.dev/blog",
    types: {
      "application/rss+xml": [
        {
          url: "https://umarsiddiqui.dev/blog/rss.xml",
          title: "Umar Siddiqui Blog RSS Feed",
        },
      ],
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Umar Siddiqui Blog",
            description: "Web development articles, tutorials, and insights about modern programming technologies",
            url: "https://umarsiddiqui.dev/blog",
            author: {
              "@type": "Person",
              name: "Umar Siddiqui",
              url: "https://umarsiddiqui.dev"
            },
            publisher: {
              "@type": "Person",
              name: "Umar Siddiqui",
              url: "https://umarsiddiqui.dev"
            },
            inLanguage: "en-US",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://umarsiddiqui.dev/blog?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      {children}
    </>
  );
}
