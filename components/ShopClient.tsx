'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { FilterIcon } from '@/components/Icons'
import { ProductGrid } from '@/components/ProductCard'
import { localized, minPrice, settings, visibleProducts } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

const PRICE_RANGES = [
  { id: 'hasta-15', es: 'Hasta $15', en: 'Up to $15', min: 0, max: 15 },
  { id: '15-30', es: '$15 – $30', en: '$15 – $30', min: 15, max: 30 },
  { id: '30-60', es: '$30 – $60', en: '$30 – $60', min: 30, max: 60 },
  { id: '60-mas', es: 'Más de $60', en: 'Over $60', min: 60, max: Infinity },
]

const SORTS = [
  { id: 'popular', es: 'Más populares', en: 'Most popular' },
  { id: 'precio-asc', es: 'Precio: menor a mayor', en: 'Price: low to high' },
  { id: 'precio-desc', es: 'Precio: mayor a menor', en: 'Price: high to low' },
]

export function ShopClient() {
  const { lang, t } = useLang()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = params.get('categoria') ?? ''
  const price = params.get('precio') ?? ''
  const season = params.get('temporada') ?? ''
  const sort = params.get('orden') ?? 'popular'

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const results = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.id === price)
    const list = visibleProducts().filter((p) => {
      if (category && p.category !== category) return false
      if (season && !p.season.includes(season) && !p.season.includes('todo-el-ano')) return false
      if (range) {
        const from = minPrice(p)
        if (from < range.min || from >= range.max) return false
      }
      return true
    })
    if (sort === 'precio-asc') return list.sort((a, b) => minPrice(a) - minPrice(b))
    if (sort === 'precio-desc') return list.sort((a, b) => minPrice(b) - minPrice(a))
    return list.sort((a, b) => b.popularity - a.popularity)
  }, [category, price, season, sort])

  const activeCount = [category, price, season].filter(Boolean).length

  const filterGroup = (title: string, key: string, current: string, options: { id: string; label: string }[]) => (
    <fieldset className="mb-6">
      <legend className="mb-3 font-display text-lg font-bold">{title}</legend>
      <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
        <button type="button" className={`chip ${current === '' ? 'chip-active' : ''}`} aria-pressed={current === ''} onClick={() => update(key, '')}>
          {t('Todas', 'All')}
        </button>
        {options.map((o) => (
          <button key={o.id} type="button" className={`chip ${current === o.id ? 'chip-active' : ''}`} aria-pressed={current === o.id} onClick={() => update(key, current === o.id ? '' : o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
      <div>
        <button type="button" className="btn-outline w-full lg:hidden" onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen} aria-controls="filters">
          <FilterIcon width={18} height={18} />
          {t('Filtros', 'Filters')} {activeCount > 0 && `(${activeCount})`}
        </button>
        <aside id="filters" aria-label={t('Filtros', 'Filters')} className={`${filtersOpen ? 'block' : 'hidden'} mt-4 lg:mt-0 lg:block`}>
          {filterGroup(
            t('Categoría', 'Category'),
            'categoria',
            category,
            settings.categories.map((c) => ({ id: c.id, label: localized(c, 'name', lang) })),
          )}
          {filterGroup(
            t('Precio', 'Price'),
            'precio',
            price,
            PRICE_RANGES.map((r) => ({ id: r.id, label: lang === 'en' ? r.en : r.es })),
          )}
          {filterGroup(
            t('Temporada', 'Season'),
            'temporada',
            season,
            settings.seasons.filter((s) => s.id !== 'todo-el-ano').map((s) => ({ id: s.id, label: localized(s, 'name', lang) })),
          )}
          {activeCount > 0 && (
            <button type="button" className="text-sm font-semibold text-coral-700 underline" onClick={() => router.replace(sort !== 'popular' ? `${pathname}?orden=${sort}` : pathname, { scroll: false })}>
              {t('Limpiar filtros', 'Clear filters')}
            </button>
          )}
        </aside>
      </div>

      <section aria-labelledby="results-title">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 id="results-title" className="text-ink/70" aria-live="polite">
            {results.length} {results.length === 1 ? t('producto', 'product') : t('productos', 'products')}
          </h2>
          <label className="flex items-center gap-2 text-sm font-semibold">
            {t('Ordenar por', 'Sort by')}
            <select value={sort} onChange={(e) => update('orden', e.target.value === 'popular' ? '' : e.target.value)} className="input w-auto py-2">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {lang === 'en' ? s.en : s.es}
                </option>
              ))}
            </select>
          </label>
        </div>
        {results.length > 0 ? (
          <ProductGrid products={results} priorityCount={4} />
        ) : (
          <div className="rounded-4xl bg-white p-10 text-center shadow-soft">
            <p className="text-lg font-bold">{t('No encontramos frutas con esos filtros', 'No fruit matches those filters')}</p>
            <p className="mt-2 text-ink/70">{t('Prueba quitando algún filtro.', 'Try removing a filter.')}</p>
          </div>
        )}
      </section>
    </div>
  )
}
