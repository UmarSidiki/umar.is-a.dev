import { Metadata } from "next";
import { getDatabase } from "@/lib/mongodb";

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
      return {
        title: 'Post Not Found',
        description: 'The requested blog post was not found.',
      };
    }

    const baseUrl = 'https://umarsiddiqui.dev'; // Replace with your actual domain
    const postUrl = `${baseUrl}/blog/${slug}`;
    const ogImageUrl = `/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt)}&type=article`;

    return {
      title: post.title,
      description: post.excerpt,
      keywords: post.tags || [],
      authors: [{ name: post.author }],
      category: post.category,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        url: postUrl,
        images: [
          {
            url: post.featuredImage || ogImageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        publishedTime: new Date(post.createdAt).toISOString(),
        modifiedTime: new Date(post.updatedAt).toISOString(),
        authors: [post.author],
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: [post.featuredImage || ogImageUrl],
      },
      alternates: {
        canonical: postUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post',
      description: 'Read the latest blog post from Umar Siddiqui.',
    };
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
