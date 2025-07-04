import { Metadata } from "next";
import BlogClient from "./BlogClient";
import { generatePageMetadata, generateStructuredData } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog - Latest Articles & Tutorials",
  description:
    "Discover insights, tutorials, and thoughts about web development, technology, and the digital world. Learn React, Next.js, TypeScript, and modern web technologies through detailed articles and practical examples.",
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
    "Coding Tutorials",
  ],
  url: "/blog",
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
