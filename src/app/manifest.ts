import { MetadataRoute } from 'next'
import { getManifestData } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return getManifestData()
}
