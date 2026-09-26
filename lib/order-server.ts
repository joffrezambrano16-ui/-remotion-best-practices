import 'server-only'
import { findCoupon } from '@/lib/coupons'
import { getZone, settings, type Lang } from '@/lib/catalog'
import { computeTotals, type CartItem } from '@/lib/pricing'

export type OrderRequest = ReturnType<typeof parseOrderRequest>

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

/** Limpia y valida lo que llega del navegador y recalcula los precios con los datos del servidor. */
export function parseOrderRequest(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>
  const rawItems = Array.isArray(b.items) ? b.items.slice(0, 50) : []

  const items: CartItem[] = rawItems.flatMap((raw): CartItem[] => {
    const i = (raw ?? {}) as Record<string, unknown>
    const key = str(i.key, 300)
    const qty = Math.max(1, Math.min(20, Math.floor(Number(i.qty) || 1)))
    if (i.kind === 'product') return [{ key, kind: 'product', slug: str(i.slug), sizeId: str(i.sizeId), qty }]
    if (i.kind === 'box' && Array.isArray(i.fruits))
      return [{ key, kind: 'box', boxSizeId: str(i.boxSizeId), fruits: i.fruits.slice(0, 30).map((f) => str(f)), qty }]
    if (i.kind === 'club' && (i.frequency === 'weekly' || i.frequency === 'monthly'))
      return [{ key, kind: 'club', planId: str(i.planId), frequency: i.frequency, qty: 1 }]
    return []
  })

  const lang: Lang = b.lang === 'en' ? 'en' : 'es'
  const zoneId = getZone(str(b.zoneId)) ? str(b.zoneId) : settings.defaultZone
  const coupon = findCoupon(str(b.couponCode, 40))
  const totals = computeTotals(items, { coupon, zoneId, lang })

  const c = (b.customer ?? {}) as Record<string, unknown>
  const customer = {
    email: str(c.email, 200),
    name: str(c.name, 120),
    phone: str(c.phone, 40),
    street: str(c.street, 200),
    city: str(c.city, 100),
    postal: str(c.postal, 20),
    notes: str(c.notes, 300),
  }

  const g = b.gift as Record<string, unknown> | null
  const gift = g
    ? { message: str(g.message, settings.giftMessageMaxLength), from: str(g.from, 80), deliveryDate: str(g.deliveryDate, 10) }
    : null

  const errors: string[] = []
  if (totals.lines.length === 0) errors.push('El carrito está vacío o tiene productos no disponibles.')
  if (totals.lines.length !== items.length) errors.push('Algunos productos ya no están disponibles. Actualiza tu carrito.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) errors.push('Correo electrónico no válido.')
  if (!customer.name) errors.push('Falta el nombre.')
  if (zoneId !== 'recoger' && totals.oneTimeSubtotal > 0 && (!customer.street || !customer.city)) errors.push('Falta la dirección de entrega.')

  return { items, lang, zoneId, coupon, totals, customer, gift, errors }
}

/** Datos del pedido para guardar como "metadata" en Stripe / PayPal (límite de 500 caracteres por campo). */
export function orderMetadata(order: OrderRequest): Record<string, string> {
  const zone = getZone(order.zoneId)
  return {
    cliente: order.customer.name,
    telefono: order.customer.phone,
    direccion: order.zoneId === 'recoger' ? 'Recoger en tienda' : `${order.customer.street}, ${order.customer.city} ${order.customer.postal}`.slice(0, 500),
    indicaciones: order.customer.notes,
    zona: zone?.name ?? order.zoneId,
    cupon: order.coupon && !order.totals.couponError ? order.coupon.code : '',
    regalo: order.gift ? 'sí' : 'no',
    mensaje_regalo: order.gift?.message ?? '',
    regalo_de: order.gift?.from ?? '',
    fecha_entrega: order.gift?.deliveryDate ?? '',
    productos: order.totals.lines.map((l) => `${l.qty}× ${l.name} (${l.detail})`).join(' | ').slice(0, 500),
  }
}

export function siteOrigin(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || new URL(request.url).origin
}
