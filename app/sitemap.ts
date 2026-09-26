import type { MetadataRoute } from 'next'
import { settings, visibleProducts } from '@/lib/catalog'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || settings.siteUrl).replace(/\/$/, '')
  const pages = ['', '/tienda', '/cajas-regalo', '/club', '/nosotros', '/preguntas-frecuentes', '/contacto', '/envios', '/devoluciones']
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...visibleProducts().map((p) => ({ url: `${base}/producto/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
  ]
}
