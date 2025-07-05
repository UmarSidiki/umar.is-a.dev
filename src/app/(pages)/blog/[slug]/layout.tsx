import { Metadata } from "next";
import { getDatabase } from "@/lib/mongodb";
import { generateCompletePageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const db = await getDatabase();
    const collection = db.collection('blogposts');
    
    const post = await collection.findOne({ 
      slug: slug,
      status: 'published' 
    });

    if (!post) {
      return generateCompletePageMetadata({
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
        noindex: true,
        url: `/blog/${slug}`,
      });
    }

    return generateCompletePageMetadata({
      title: post.title,
      description: post.excerpt || post.description || `Read ${post.title} on the blog`,
      keywords: post.tags || [],
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || "Umar Siddiqui"],
      tags: post.tags,
      image: post.featuredImage,
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return generateCompletePageMetadata({
      title: 'Blog Post',
      description: 'Read the latest blog post from Umar Siddiqui.',
      noindex: true,
      url: `/blog/${slug}`,
    });
  }
}

// Generate static params for static generation (optional but recommended for performance)
export async function generateStaticParams() {
  try {
    const db = await getDatabase();
    const collection = db.collection('blogposts');
    
    const posts = await collection
      .find({ status: 'published' })
      .project({ slug: 1 })
      .limit(50) // Limit for build performance
      .toArray();

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      {children}
    </>
  );
}
