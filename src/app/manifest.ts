import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Umar Siddiqui - Full-Stack Developer',
    short_name: 'Umar Siddiqui',
    description: 'Professional portfolio of Umar Siddiqui, an experienced full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f59e0b',
    theme_color: '#d97706',
    categories: ['business', 'productivity', 'portfolio'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    lang: 'en',
    orientation: 'portrait-primary',
  }
}
