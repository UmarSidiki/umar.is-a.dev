import { MetadataRoute } from 'next'
import { getRobotsConfig } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  const config = getRobotsConfig()
  
  return {
    rules: config.rules,
    sitemap: config.sitemap,
    host: config.host,
  }
}
