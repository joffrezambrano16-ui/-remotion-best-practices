'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { QtyStepper } from '@/components/CartExtras'
import { CheckIcon } from '@/components/Icons'
import { useCart } from '@/lib/cart'
import { boxFruits, formatPrice, localized, settings } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

/** "Arma tu propia caja": el cliente elige el tamaño y llena cada espacio con la fruta que quiera. */
export function BoxBuilder() {
  const { lang, t } = useLang()
  const { add } = useCart()
  const sizes = settings.boxBuilder.sizes
  const fruits = boxFruits()
  const [sizeId, setSizeId] = useState(sizes[1]?.id ?? sizes[0].id)
  const [picks, setPicks] = useState<Record<string, number>>({})
  const size = sizes.find((s) => s.id === sizeId)!

  const used = Object.values(picks).reduce((a, b) => a + b, 0)
  const remaining = size.slots - used
  const price = useMemo(
    () => size.basePrice + fruits.reduce((sum, f) => sum + (picks[f.slug] ?? 0) * (f.boxPrice ?? 0), 0),
    [size, picks, fruits],
  )

  function changeSize(id: string) {
    const next = sizes.find((s) => s.id === id)!
    setSizeId(id)
    // Si la nueva caja es más pequeña, recorta la selección.
    let left = next.slots
    const trimmed: Record<string, number> = {}
    for (const [slug, n] of Object.entries(picks)) {
      const keep = Math.min(n, left)
      if (keep > 0) trimmed[slug] = keep
      left -= keep
    }
    setPicks(trimmed)
  }

  function setCount(slug: string, n: number) {
    setPicks((prev) => {
      const current = prev[slug] ?? 0
      const others = used - current
      const value = Math.max(0, Math.min(n, size.slots - others))
      const next = { ...prev, [slug]: value }
      if (value === 0) delete next[slug]
      return next
    })
  }

  function addToCart() {
    const list = Object.entries(picks).flatMap(([slug, n]) => Array(n).fill(slug) as string[])
    add({ kind: 'box', boxSizeId: sizeId, fruits: list })
    setPicks({})
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <fieldset>
          <legend className="mb-3 font-display text-lg font-bold">1. {t('Elige el tamaño de tu caja', 'Choose your box size')}</legend>
          <div className="grid grid-cols-3 gap-3">
            {sizes.map((s) => (
              <label key={s.id} className={`cursor-pointer rounded-3xl border-2 bg-white p-4 text-center transition ${s.id === sizeId ? 'border-leaf-600 ring-2 ring-leaf-100' : 'border-sand-200 hover:border-leaf-400'}`}>
                <input type="radio" name="box-size" className="sr-only" checked={s.id === sizeId} onChange={() => changeSize(s.id)} />
                <span className="block font-bold">{localized(s, 'name', lang)}</span>
                <span className="block text-sm text-ink/60">
                  {s.slots} {t('porciones', 'portions')}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="mb-3 font-display text-lg font-bold">
            2. {t('Llénala con tus frutas favoritas', 'Fill it with your favorite fruit')}
          </legend>
          <ul className="grid gap-3 sm:grid-cols-2">
            {fruits.map((f) => {
              const n = picks[f.slug] ?? 0
              return (
                <li key={f.slug} className={`flex items-center gap-3 rounded-3xl border-2 bg-white p-3 ${n > 0 ? 'border-leaf-400' : 'border-transparent'}`}>
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-sand-100">
                    <Image src={f.images[0]} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-tight">{localized(f, 'name', lang).split(' (')[0]}</p>
                    <p className="text-sm text-ink/60">
                      +{formatPrice(f.boxPrice ?? 0)} / {t('porción', 'portion')}
                    </p>
                  </div>
                  <QtyStepper value={n} min={0} onChange={(v) => setCount(f.slug, v)} label={t(`Porciones de ${f.name}`, `Portions of ${f.name}`)} />
                </li>
              )
            })}
          </ul>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start" aria-label={t('Resumen de tu caja', 'Your box summary')}>
        <div className="card overflow-hidden">
          <div className="relative aspect-[4/3] bg-sand-100">
            <Image src={settings.boxBuilder.image} alt={t('Caja para armar', 'Build-your-own box')} fill sizes="360px" className="object-cover" />
          </div>
          <div className="p-6">
            <p className="font-display text-xl font-bold">{localized(size, 'name', lang)}</p>
            <div className="mt-3 flex gap-1" aria-hidden>
              {Array.from({ length: size.slots }).map((_, i) => (
                <span key={i} className={`h-3 flex-1 rounded-full ${i < used ? 'bg-leaf-500' : 'bg-sand-200'}`} />
              ))}
            </div>
            <p className="mt-2 text-sm text-ink/70" aria-live="polite">
              {remaining > 0
                ? t(`Te quedan ${remaining} de ${size.slots} espacios`, `${remaining} of ${size.slots} slots left`)
                : t('¡Caja completa!', 'Box complete!')}
            </p>
            <p className="mt-4 text-sm text-ink/60">
              {t('Caja + tarjeta de regalo', 'Box + gift card')}: {formatPrice(size.basePrice)}
            </p>
            <p className="font-display text-3xl font-bold text-leaf-700">{formatPrice(price)}</p>
            <button type="button" className="btn-primary mt-4 w-full" disabled={remaining !== 0} onClick={addToCart}>
              {remaining === 0 ? (
                <>
                  <CheckIcon width={18} height={18} /> {t('Agregar caja al carrito', 'Add box to cart')}
                </>
              ) : (
                t('Completa tu caja para continuar', 'Fill your box to continue')
              )}
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
