import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/ProductCard'
import { ProductGallery, ProductInfo } from '@/components/ProductDetail'
import { getCategory, getProduct, minPrice, relatedProducts, settings, visibleProducts } from '@/lib/catalog'
import { T } from '@/lib/i18n'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return visibleProducts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: { title: `${product.name} · FruitsIsland`, description: product.description },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const category = getCategory(product.category)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || settings.siteUrl
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((i) => `${siteUrl}${i}`),
    brand: { '@type': 'Brand', name: 'FruitsIsland' },
    countryOfOrigin: product.origin,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: settings.currency,
      lowPrice: minPrice(product),
      highPrice: Math.max(...product.sizes.map((s) => s.price)),
      offerCount: product.sizes.length,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Migas de pan" className="container-page pt-6 text-sm text-ink/60">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:underline">
              <T es="Inicio" en="Home" />
            </Link>{' '}
            /
          </li>
          <li>
            <Link href="/tienda" className="hover:underline">
              <T es="Tienda" en="Shop" />
            </Link>{' '}
            /
          </li>
          {category && (
            <li>
              <Link href={`/tienda?categoria=${category.id}`} className="hover:underline">
                <T es={category.name} en={category.name_en ?? category.name} />
              </Link>
            </li>
          )}
        </ol>
      </nav>
      <div className="container-page grid gap-10 py-8 lg:grid-cols-2 lg:gap-16">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>
      <section aria-labelledby="relacionados" className="container-page py-16">
        <h2 id="relacionados" className="mb-8 text-3xl font-bold text-leaf-900">
          <T es="También te puede gustar" en="You may also like" />
        </h2>
        <ProductGrid products={relatedProducts(product)} />
      </section>
    </>
  )
}
