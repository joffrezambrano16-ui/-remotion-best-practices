'use client'

import Image from 'next/image'
import { useState } from 'react'
import { QtyStepper } from '@/components/CartExtras'
import { GiftIcon, LeafIcon, PinIcon, ShieldIcon, TruckIcon } from '@/components/Icons'
import { useCart } from '@/lib/cart'
import { formatPrice, getCategory, localized, localizedList, settings, type Product } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

export function ProductGallery({ product }: { product: Product }) {
  const { lang, t } = useLang()
  const [active, setActive] = useState(0)
  const name = localized(product, 'name', lang)

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-4xl bg-sand-100">
        <Image src={product.images[active]} alt={`${name} — ${t('foto', 'photo')} ${active + 1}`} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
      {product.images.length > 1 && (
        <ul className="mt-4 flex gap-3" aria-label={t('Fotos del producto', 'Product photos')}>
          {product.images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${t('Ver foto', 'View photo')} ${i + 1}`}
                aria-current={i === active}
                className={`relative block h-20 w-20 overflow-hidden rounded-2xl border-2 transition sm:h-24 sm:w-24 ${i === active ? 'border-leaf-600' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function ProductInfo({ product }: { product: Product }) {
  const { lang, t } = useLang()
  const { add } = useCart()
  const [sizeId, setSizeId] = useState(product.sizes[0].id)
  const [qty, setQty] = useState(1)
  const size = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[0]
  const category = getCategory(product.category)
  const contents = localizedList(product, 'giftContents', lang)
  const seasons = product.season.map((id) => settings.seasons.find((s) => s.id === id)).filter(Boolean)

  return (
    <div>
      {category && <p className="eyebrow">{localized(category, 'name', lang)}</p>}
      <h1 className="mt-2 text-3xl font-bold leading-tight text-leaf-900 sm:text-4xl">{localized(product, 'name', lang)}</h1>
      <p className="mt-4 flex items-baseline gap-3">
        <span className="font-display text-3xl font-bold text-leaf-700">{formatPrice(size.price)}</span>
        {product.compareAtPrice && product.compareAtPrice > size.price && (
          <span className="text-lg text-ink/50 line-through">
            <span className="sr-only">{t('Antes', 'Was')} </span>
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
      </p>

      <p className="mt-5 text-lg leading-relaxed text-ink/80">{localized(product, 'description', lang)}</p>

      <dl className="mt-6 grid gap-3 rounded-3xl bg-white p-5 shadow-soft sm:grid-cols-2">
        <div className="flex gap-3">
          <PinIcon className="mt-0.5 shrink-0 text-coral-400" />
          <div>
            <dt className="text-sm font-bold">{t('Origen', 'Origin')}</dt>
            <dd className="text-ink/70">{localized(product, 'origin', lang)}</dd>
          </div>
        </div>
        <div className="flex gap-3">
          <LeafIcon className="mt-0.5 shrink-0 text-leaf-500" />
          <div>
            <dt className="text-sm font-bold">{t('Temporada', 'Season')}</dt>
            <dd className="text-ink/70">{seasons.map((s) => localized(s!, 'name', lang)).join(', ')}</dd>
          </div>
        </div>
        <div className="flex gap-3 sm:col-span-2">
          <ShieldIcon className="mt-0.5 shrink-0 text-mango-500" />
          <div>
            <dt className="text-sm font-bold">{t('Peso / cantidad', 'Weight / quantity')}</dt>
            <dd className="text-ink/70">
              {localized(size, 'label', lang)}
              {size.detail && ` · ${localized(size, 'detail', lang)}`}
            </dd>
          </div>
        </div>
      </dl>

      {contents.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold">{t('¿Qué incluye?', "What's inside?")}</h2>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {contents.map((c) => (
              <li key={c} className="flex items-center gap-2 text-ink/80">
                <span aria-hidden className="text-leaf-500">●</span> {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className="mt-8">
        <legend className="mb-3 font-bold">{t('Elige el tamaño', 'Choose a size')}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {product.sizes.map((s) => (
            <label
              key={s.id}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 bg-white px-4 py-3 transition ${s.id === sizeId ? 'border-leaf-600 ring-2 ring-leaf-100' : 'border-sand-200 hover:border-leaf-400'}`}
            >
              <input type="radio" name="size" value={s.id} checked={s.id === sizeId} onChange={() => setSizeId(s.id)} className="sr-only" />
              <span>
                <span className="block font-bold">{localized(s, 'label', lang)}</span>
                {s.detail && <span className="block text-sm text-ink/60">{localized(s, 'detail', lang)}</span>}
              </span>
              <span className="font-bold text-leaf-700">{formatPrice(s.price)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <QtyStepper value={qty} onChange={(v) => setQty(Math.max(1, Math.min(20, v)))} label={t('Cantidad', 'Quantity')} />
        <button type="button" className="btn-primary flex-1 sm:flex-none sm:px-10" onClick={() => add({ kind: 'product', slug: product.slug, sizeId, qty })}>
          {t('Agregar al carrito', 'Add to cart')} · {formatPrice(size.price * qty)}
        </button>
      </div>

      <ul className="mt-8 space-y-3 text-sm text-ink/80">
        <li className="flex items-center gap-3">
          <TruckIcon width={20} height={20} className="text-leaf-600" />
          {t('Envío refrigerado · mismo día en zona local', 'Refrigerated shipping · same day in local zone')}
        </li>
        <li className="flex items-center gap-3">
          <GiftIcon width={20} height={20} className="text-coral-400" />
          {t('Puedes agregar un mensaje de regalo al finalizar la compra', 'You can add a gift message at checkout')}
        </li>
        <li className="flex items-center gap-3">
          <ShieldIcon width={20} height={20} className="text-mango-500" />
          {t('Garantía de frescura: si algo llega mal, lo reponemos', 'Freshness guarantee: if anything arrives damaged, we replace it')}
        </li>
      </ul>
    </div>
  )
}
