'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, getCategory, localized, minPrice, type Product } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { lang, t } = useLang()
  const category = getCategory(product.category)
  const from = minPrice(product)
  const multipleSizes = product.sizes.length > 1

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-4xl bg-sand-100">
        <Image
          src={product.images[0]}
          alt={localized(product, 'name', lang)}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.bestseller && <span className="rounded-full bg-mango-400 px-3 py-1 text-xs font-bold text-ink">{t('Más vendido', 'Bestseller')}</span>}
          {product.compareAtPrice && product.compareAtPrice > from && (
            <span className="rounded-full bg-coral-400 px-3 py-1 text-xs font-bold text-ink">{t('Oferta', 'Sale')}</span>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-1 flex-col px-1">
        {category && <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">{localized(category, 'name', lang)}</p>}
        <h3 className="mt-1 font-display text-base font-bold leading-snug sm:text-lg">
          <Link href={`/producto/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {localized(product, 'name', lang)}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-ink/60">{localized(product, 'origin', lang)}</p>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="font-bold text-leaf-700">
            {multipleSizes && <span className="text-sm font-semibold text-ink/60">{t('Desde ', 'From ')}</span>}
            {formatPrice(from)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > from && (
            <span className="text-sm text-ink/50 line-through">
              <span className="sr-only">{t('Antes', 'Was')} </span>
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </p>
      </div>
    </article>
  )
}

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((p, i) => (
        <li key={p.slug}>
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  )
}
