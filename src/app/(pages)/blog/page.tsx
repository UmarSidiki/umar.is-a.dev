import { Metadata } from "next";
import BlogClient from "./BlogClient";
import { generateCompletePageMetadata, generateStructuredData } from "@/lib/seo";

export const metadata: Metadata = generateCompletePageMetadata({
  pageKey: 'blog',
  url: '/blog'
});

// Server Component with metadata
export default function BlogPage() {
  // Generate structured data for Blog listing page
  const blogStructuredData = generateStructuredData("blog");

  return (
    <>
      {/* JSON-LD Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData),
        }}
      />
      <BlogClient />
    </>
  );
}
