import type { MetadataRoute } from 'next'
import { settings } from '@/lib/catalog'

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || settings.siteUrl).replace(/\/$/, '')
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/checkout', '/cuenta', '/api/'] },
    sitemap: `${base}/sitemap.xml`,
  }
}
