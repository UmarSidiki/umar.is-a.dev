import { MetadataRoute } from 'next'
import { getDatabase } from '@/lib/mongodb'
import { getSitemapConfig } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = getSitemapConfig()

  // Start with static routes
  let routes = config.staticRoutes

  // Add dynamic routes
  try {
    const db = await getDatabase()
    
    // Process each dynamic route type
    for (const [routeType, routeConfig] of Object.entries(config.dynamicRoutes)) {
      try {
        const collection = db.collection(routeConfig.collection)
        
        const items = await collection
          .find(routeConfig.filter)
          .sort(routeConfig.sort)
          .project(routeConfig.fields)
          .toArray()

        const dynamicRoutes = items.map((item) => ({
          url: `${config.baseUrl}${routeConfig.pathPrefix}${item.slug}`,
          lastModified: new Date(item.updatedAt || item.createdAt),
          changeFrequency: routeConfig.changeFrequency,
          priority: routeConfig.priority,
        }))

        routes = [...routes, ...dynamicRoutes]
      } catch (routeError) {
        console.error(`Error generating ${routeType} routes for sitemap:`, routeError)
      }
    }

    return routes
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes if database is unavailable
    return config.staticRoutes
  }
}
