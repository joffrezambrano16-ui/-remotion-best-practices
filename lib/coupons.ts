// Solo se usa en el servidor: la lista de cupones no se envía al navegador.
import 'server-only'
import couponsData from '@/data/coupons.json'
import type { Coupon } from '@/lib/pricing'

type StoredCoupon = Coupon & { active?: boolean; expires?: string }

export function findCoupon(code: string | null | undefined): Coupon | null {
  if (!code) return null
  const normalized = code.trim().toUpperCase()
  const found = (couponsData as StoredCoupon[]).find((c) => c.code.toUpperCase() === normalized)
  if (!found || found.active === false) return null
  if (found.expires && new Date(found.expires) < new Date()) return null
  const { code: c, type, value, minSubtotal, description, description_en } = found
  return { code: c, type, value, minSubtotal, description, description_en }
}
