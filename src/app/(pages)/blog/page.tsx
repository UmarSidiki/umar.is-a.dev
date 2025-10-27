import { Metadata } from "next";
import BlogClient from "./BlogClient";
import { generateCompletePageMetadata, generateStructuredData } from "@/lib/seo";
import { getDatabase } from "@/lib/mongodb";
import { BlogPost } from "@/types/blog";
import { ViewTransition as VT } from "react";

export const metadata: Metadata = generateCompletePageMetadata({
  pageKey: 'blog',
  url: '/blog'
});

// Server Component with metadata
export default async function BlogPage() {
  // Generate structured data for Blog listing page
  const blogStructuredData = generateStructuredData("blog");
  
  // Fetch posts on the server side
  let initialPosts: BlogPost[] = [];
  try {
    const db = await getDatabase();
    const collection = db.collection<BlogPost>('blogposts');
    
    // Fetch published posts for initial load
    initialPosts = await collection
      .find({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
      
    // Convert ObjectId to string for serialization
    initialPosts = JSON.parse(JSON.stringify(initialPosts));
  } catch (error) {
    console.error("Error fetching initial posts:", error);
  }

  return (
    <>
      {/* JSON-LD Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData),
        }}
      />
      <VT enter={"fade-in"} exit={"fade-out"}>
        <BlogClient initialPosts={initialPosts} />
      </VT>
    </>
  );
}
