import React from "react";
import { Metadata } from "next";
import { BlogPost } from "@/types/blog";
import { getDatabase } from "@/lib/mongodb";
import { generateCompletePageMetadata, generateStructuredData } from "@/lib/seo";
import BlogPostClient from "./BlogPostClient";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for the blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const db = await getDatabase();
    const collection = db.collection<BlogPost>('blogposts');
    
    const post = await collection.findOne({ 
      slug, 
      status: 'published' 
    });

    if (!post) {
      return generateCompletePageMetadata({
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
        noindex: true,
      });
    }

    return generateCompletePageMetadata({
      title: post.title,
      description: post.excerpt,
      keywords: post.tags && post.tags.length > 0 ? post.tags : [], // Use tags as keywords for SEO
      image: post.featuredImage || `/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt)}&type=article`,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: [post.author],
      tags: post.tags,
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return generateCompletePageMetadata({
      title: "Blog Post",
      description: "A blog post from Umar Siddiqui's portfolio.",
    });
  }
}

// Server Component
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Fetch the blog post data server-side
  try {
    const db = await getDatabase();
    const collection = db.collection<BlogPost>('blogposts');
    
    const post = await collection.findOne({ 
      slug, 
      status: 'published' 
    });

    if (!post) {
      notFound();
    }

    // Convert ObjectId to string for serialization
    const serializedPost = JSON.parse(JSON.stringify(post));

    // Generate structured data for the blog post
    const articleStructuredData = generateStructuredData("article", {
      article: {
        ...serializedPost,
        _id: serializedPost._id?.toString() || '',
        createdAt: serializedPost.createdAt.toString(),
        updatedAt: serializedPost.updatedAt.toString(),
      },
      title: post.title,
      description: post.excerpt,
      image: post.featuredImage || `/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt)}&type=article`,
      publishedTime: new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      author: post.author,
      url: `/blog/${slug}`,
      tags: post.tags,
    });

    return (
      <>
        {/* JSON-LD Structured Data for the specific blog post */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData)
          }}
        />
        <BlogPostClient post={serializedPost} slug={slug} />
      </>
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}

