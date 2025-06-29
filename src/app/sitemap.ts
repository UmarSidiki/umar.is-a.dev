import { MetadataRoute } from 'next'
import { getDatabase } from '@/lib/mongodb'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://umarsiddiqui.dev' // Replace with your actual domain

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // Dynamic blog post routes
  try {
    const db = await getDatabase()
    const collection = db.collection('blogposts')
    
    const posts = await collection
      .find({ status: 'published' })
      .sort({ createdAt: -1 })
      .project({ slug: 1, updatedAt: 1, createdAt: 1 })
      .toArray()

    const blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...routes, ...blogRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes if database is unavailable
    return routes
  }
}
