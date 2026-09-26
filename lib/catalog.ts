import productsData from '@/data/products.json'
import settingsData from '@/data/settings.json'

export type Lang = 'es' | 'en'

export type Size = {
  id: string
  label: string
  label_en?: string
  detail?: string
  detail_en?: string
  price: number
}

export type Product = {
  slug: string
  name: string
  name_en?: string
  category: string
  description: string
  description_en?: string
  origin: string
  origin_en?: string
  season: string[]
  sizes: Size[]
  compareAtPrice?: number | null
  images: string[]
  popularity: number
  bestseller?: boolean
  available?: boolean
  boxPrice?: number | null
  giftContents?: string[]
  giftContents_en?: string[]
}

export type ShippingZone = {
  id: string
  name: string
  name_en?: string
  price: number
  freeFrom: number
  eta: string
  eta_en?: string
  postalPrefixes: string[]
}

export type ClubPlan = {
  id: string
  name: string
  name_en?: string
  description: string
  description_en?: string
  weeklyPrice: number
  monthlyPrice: number
  popular?: boolean
  features: string[]
  features_en?: string[]
}

export type BoxSize = { id: string; name: string; name_en?: string; slots: number; basePrice: number }

export type Category = { id: string; name: string; name_en?: string; image: string }

export const products = productsData as Product[]
export const settings = settingsData as typeof settingsData & {
  shippingZones: ShippingZone[]
  categories: Category[]
  club: { image: string; plans: ClubPlan[] }
  boxBuilder: { image: string; sizes: BoxSize[] }
}

/** Devuelve el campo traducido (ej. name_en) si existe y el idioma es inglés. */
export function localized<T extends object>(obj: T, field: string, lang: Lang): string {
  const record = obj as Record<string, unknown>
  if (lang === 'en' && typeof record[`${field}_en`] === 'string') return record[`${field}_en`] as string
  return (record[field] as string) ?? ''
}

export function localizedList<T extends object>(obj: T, field: string, lang: Lang): string[] {
  const record = obj as Record<string, unknown>
  if (lang === 'en' && Array.isArray(record[`${field}_en`])) return record[`${field}_en`] as string[]
  return (record[field] as string[]) ?? []
}

export const getProduct = (slug: string) => products.find((p) => p.slug === slug && p.available !== false)
export const visibleProducts = () => products.filter((p) => p.available !== false)
export const minPrice = (p: Product) => Math.min(...p.sizes.map((s) => s.price))
export const getCategory = (id: string) => settings.categories.find((c) => c.id === id)
export const getZone = (id: string | null | undefined) => settings.shippingZones.find((z) => z.id === id)
export const getPlan = (id: string) => settings.club.plans.find((p) => p.id === id)
export const getBoxSize = (id: string) => settings.boxBuilder.sizes.find((s) => s.id === id)
export const boxFruits = () => visibleProducts().filter((p) => typeof p.boxPrice === 'number')

export function bestsellers(limit = 8) {
  return visibleProducts()
    .filter((p) => p.bestseller)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
}

export function relatedProducts(product: Product, limit = 4) {
  const same = visibleProducts().filter((p) => p.slug !== product.slug && p.category === product.category)
  const others = visibleProducts().filter((p) => p.slug !== product.slug && p.category !== product.category)
  return [...same, ...others.sort((a, b) => b.popularity - a.popularity)].slice(0, limit)
}

/** Busca la zona de envío que corresponde a un código postal. */
export function zoneForPostalCode(postal: string): ShippingZone | undefined {
  const clean = postal.replace(/\s/g, '')
  if (!clean) return undefined
  const match = settings.shippingZones.find((z) => z.postalPrefixes.some((prefix) => clean.startsWith(prefix)))
  return match ?? getZone('nacional') ?? settings.shippingZones[0]
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat(settings.priceLocale, { style: 'currency', currency: settings.currency }).format(amount)
}
