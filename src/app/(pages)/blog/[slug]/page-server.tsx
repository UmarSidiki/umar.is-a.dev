import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generatePageMetadata, generateStructuredData } from "@/lib/seo";
import { getDatabase } from "@/lib/mongodb";
import { BlogPost } from "@/types/blog";
import BlogPostClient from "./BlogPostClient";

interface Props {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const db = await getDatabase();
    const collection = db.collection("blogposts");
    const post = (await collection.findOne({
      slug: params.slug,
      status: "published",
    })) as BlogPost | null;

    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    return generatePageMetadata({
      title: post.title,
      description: post.excerpt,
      keywords: post.tags || [],
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.createdAt.toString(),
      modifiedTime: post.updatedAt?.toString() || post.createdAt.toString(),
      authors: [post.author],
      tags: post.tags,
      image:
        post.featuredImage ||
        `/api/og?title=${encodeURIComponent(
          post.title
        )}&subtitle=${encodeURIComponent(post.excerpt)}&type=blog`,
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post",
    };
  }
}

// Fetch blog post data
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection("blogposts");
    const post = (await collection.findOne({
      slug,
      status: "published",
    })) as BlogPost | null;

    return post;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  // Generate structured data for SEO
  const structuredData = generateStructuredData("article", {
    title: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    publishedTime: post.createdAt.toString(),
    modifiedTime: post.updatedAt?.toString() || post.createdAt.toString(),
    author: post.author,
    url: `/blog/${post.slug}`,
    keywords: post.tags,
    category: post.category,
  });

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Client Component for Interactivity */}
      <BlogPostClient post={post} />
    </>
  );
}
