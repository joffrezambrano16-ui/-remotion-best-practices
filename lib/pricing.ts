// Cálculo de precios compartido entre el navegador (para mostrar totales) y el
// servidor (para cobrar). El servidor SIEMPRE recalcula con estos datos, así que
// nadie puede cambiar precios desde el navegador.
import { getBoxSize, getPlan, getProduct, getZone, localized, type Lang, settings } from '@/lib/catalog'

export type CartItem =
  | { key: string; kind: 'product'; slug: string; sizeId: string; qty: number }
  | { key: string; kind: 'box'; boxSizeId: string; fruits: string[]; qty: number }
  | { key: string; kind: 'club'; planId: string; frequency: 'weekly' | 'monthly'; qty: number }

export type Coupon = {
  code: string
  type: 'percent' | 'fixed' | 'free_shipping'
  value: number
  minSubtotal: number
  description?: string
  description_en?: string
}

export type Line = {
  key: string
  name: string
  detail: string
  image: string
  href: string
  unitPrice: number
  qty: number
  total: number
  recurring?: 'week' | 'month'
}

export type Totals = {
  lines: Line[]
  oneTimeSubtotal: number
  recurringSubtotal: number
  subtotal: number
  discount: number
  shipping: number
  freeShippingFrom: number | null
  total: number
  couponApplied: boolean
  couponError: string | null
  hasSubscription: boolean
  onlySubscription: boolean
}

const round = (n: number) => Math.round(n * 100) / 100
const MAX_QTY = 20

export function resolveLine(item: CartItem, lang: Lang = 'es'): Line | null {
  const qty = Math.max(1, Math.min(MAX_QTY, Math.floor(Number(item.qty) || 1)))

  if (item.kind === 'product') {
    const product = getProduct(item.slug)
    const size = product?.sizes.find((s) => s.id === item.sizeId)
    if (!product || !size) return null
    return {
      key: item.key,
      name: localized(product, 'name', lang),
      detail: [localized(size, 'label', lang), localized(size, 'detail', lang)].filter(Boolean).join(' · '),
      image: product.images[0],
      href: `/producto/${product.slug}`,
      unitPrice: size.price,
      qty,
      total: round(size.price * qty),
    }
  }

  if (item.kind === 'box') {
    const size = getBoxSize(item.boxSizeId)
    if (!size || !Array.isArray(item.fruits) || item.fruits.length !== size.slots) return null
    let price = size.basePrice
    const names: string[] = []
    for (const slug of item.fruits) {
      const fruit = getProduct(slug)
      if (!fruit || typeof fruit.boxPrice !== 'number') return null
      price += fruit.boxPrice
      names.push(localized(fruit, 'name', lang).split(' (')[0])
    }
    const counts = names.reduce<Record<string, number>>((acc, n) => ((acc[n] = (acc[n] ?? 0) + 1), acc), {})
    return {
      key: item.key,
      name: `${lang === 'en' ? 'Build-your-own box' : 'Caja armada por ti'} · ${localized(size, 'name', lang)}`,
      detail: Object.entries(counts)
        .map(([n, c]) => `${c}× ${n}`)
        .join(', '),
      image: settings.boxBuilder.image,
      href: '/cajas-regalo#arma-tu-caja',
      unitPrice: round(price),
      qty,
      total: round(price * qty),
    }
  }

  if (item.kind === 'club') {
    const plan = getPlan(item.planId)
    if (!plan || (item.frequency !== 'weekly' && item.frequency !== 'monthly')) return null
    const price = item.frequency === 'weekly' ? plan.weeklyPrice : plan.monthlyPrice
    return {
      key: item.key,
      name: `Club FruitsIsland · ${localized(plan, 'name', lang)}`,
      detail:
        item.frequency === 'weekly'
          ? lang === 'en' ? 'Weekly delivery' : 'Entrega semanal'
          : lang === 'en' ? 'Monthly delivery' : 'Entrega mensual',
      image: settings.club.image,
      href: '/club',
      unitPrice: price,
      qty: 1,
      total: price,
      recurring: item.frequency === 'weekly' ? 'week' : 'month',
    }
  }

  return null
}

export function computeTotals(
  items: CartItem[],
  opts: { coupon?: Coupon | null; zoneId?: string | null; lang?: Lang } = {},
): Totals {
  const lang = opts.lang ?? 'es'
  const lines = items.map((i) => resolveLine(i, lang)).filter((l): l is Line => l !== null)

  const oneTimeSubtotal = round(lines.filter((l) => !l.recurring).reduce((s, l) => s + l.total, 0))
  const recurringSubtotal = round(lines.filter((l) => l.recurring).reduce((s, l) => s + l.total, 0))
  const hasSubscription = recurringSubtotal > 0
  const onlySubscription = hasSubscription && oneTimeSubtotal === 0

  // Cupones: aplican a los productos de compra única (no a la suscripción).
  let discount = 0
  let freeShippingByCoupon = false
  let couponError: string | null = null
  const coupon = opts.coupon ?? null
  if (coupon) {
    if (oneTimeSubtotal < coupon.minSubtotal) {
      couponError = lang === 'en' ? `Minimum purchase: $${coupon.minSubtotal}` : `Compra mínima: $${coupon.minSubtotal}`
    } else if (coupon.type === 'percent') {
      discount = round((oneTimeSubtotal * Math.min(100, coupon.value)) / 100)
    } else if (coupon.type === 'fixed') {
      discount = round(Math.min(coupon.value, oneTimeSubtotal))
    } else if (coupon.type === 'free_shipping') {
      freeShippingByCoupon = true
    }
  }

  // Envío: la suscripción del Club incluye envío; lo demás se calcula por zona.
  const zone = getZone(opts.zoneId) ?? getZone(settings.defaultZone)
  let shipping = 0
  let freeShippingFrom: number | null = null
  if (oneTimeSubtotal > 0 && zone) {
    freeShippingFrom = zone.freeFrom > 0 ? zone.freeFrom : null
    const qualifiesFree = zone.freeFrom > 0 && oneTimeSubtotal - discount >= zone.freeFrom
    shipping = freeShippingByCoupon || qualifiesFree ? 0 : zone.price
  }

  const subtotal = round(oneTimeSubtotal + recurringSubtotal)
  return {
    lines,
    oneTimeSubtotal,
    recurringSubtotal,
    subtotal,
    discount,
    shipping: round(shipping),
    freeShippingFrom,
    total: round(subtotal - discount + shipping),
    couponApplied: Boolean(coupon) && !couponError,
    couponError,
    hasSubscription,
    onlySubscription,
  }
}
