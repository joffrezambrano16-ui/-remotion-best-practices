'use client'

import { useState, type FormEvent } from 'react'
import { MinusIcon, PlusIcon, TruckIcon } from '@/components/Icons'
import { useCart } from '@/lib/cart'
import { formatPrice, getZone, localized, settings, zoneForPostalCode } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

export function QtyStepper({ value, onChange, label, min = 1 }: { value: number; onChange: (v: number) => void; label: string; min?: number }) {
  const { t } = useLang()
  return (
    <div className="inline-flex items-center rounded-full border border-sand-300 bg-white" role="group" aria-label={label}>
      <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-sand-100" onClick={() => onChange(value - 1)} disabled={value <= min && min > 0} aria-label={t('Quitar uno', 'Decrease')}>
        <MinusIcon width={16} height={16} />
      </button>
      <span className="w-8 text-center font-bold" aria-live="polite">
        {value}
      </span>
      <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-sand-100" onClick={() => onChange(value + 1)} disabled={value >= 20} aria-label={t('Agregar uno', 'Increase')}>
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  )
}

/** Calculadora de envío por zona: por código postal o eligiendo la zona. */
export function ShippingCalculator() {
  const { lang, t } = useLang()
  const { zoneId, setZoneId, totals } = useCart()
  const [postal, setPostal] = useState('')
  const zone = getZone(zoneId)

  function onPostal(e: FormEvent) {
    e.preventDefault()
    const found = zoneForPostalCode(postal)
    if (found) setZoneId(found.id)
  }

  return (
    <div className="rounded-3xl bg-sand-100 p-4">
      <p className="mb-3 flex items-center gap-2 font-bold">
        <TruckIcon width={20} height={20} className="text-leaf-600" />
        {t('Calcula tu envío', 'Estimate shipping')}
      </p>
      <form onSubmit={onPostal} className="mb-2 flex gap-2">
        <label htmlFor="postal-calc" className="sr-only">
          {t('Código postal', 'Postal code')}
        </label>
        <input id="postal-calc" value={postal} onChange={(e) => setPostal(e.target.value)} inputMode="numeric" placeholder={t('Código postal', 'Postal code')} className="input py-2" />
        <button type="submit" className="btn-outline shrink-0 px-4 py-2">
          {t('Calcular', 'Check')}
        </button>
      </form>
      <label htmlFor="zone-select" className="sr-only">
        {t('Zona de envío', 'Shipping zone')}
      </label>
      <select id="zone-select" value={zoneId} onChange={(e) => setZoneId(e.target.value)} className="input py-2">
        {settings.shippingZones.map((z) => (
          <option key={z.id} value={z.id}>
            {localized(z, 'name', lang)} — {z.price === 0 ? t('Gratis', 'Free') : formatPrice(z.price)}
          </option>
        ))}
      </select>
      {zone && (
        <p className="mt-2 text-sm text-ink/70">
          {localized(zone, 'eta', lang)}
          {zone.freeFrom > 0 && ` · ${t('Gratis desde', 'Free over')} ${formatPrice(zone.freeFrom)}`}
        </p>
      )}
      {totals.freeShippingFrom && totals.shipping > 0 && totals.oneTimeSubtotal > 0 && (
        <p className="mt-1 text-sm font-semibold text-leaf-700">
          {t(
            `Te faltan ${formatPrice(totals.freeShippingFrom - (totals.oneTimeSubtotal - totals.discount))} para envío gratis`,
            `${formatPrice(totals.freeShippingFrom - (totals.oneTimeSubtotal - totals.discount))} away from free shipping`,
          )}
        </p>
      )}
    </div>
  )
}

export function CouponForm() {
  const { lang, t } = useLang()
  const { coupon, applyCoupon, removeCoupon, totals } = useCart()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    const res = await applyCoupon(code)
    setMessage({ ok: res.ok, text: res.message })
    setLoading(false)
    if (res.ok) setCode('')
  }

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-dashed border-leaf-400 bg-leaf-50 px-4 py-3 text-sm">
        <div>
          <p className="font-bold text-leaf-700">🎟️ {coupon.code}</p>
          <p className="text-ink/70">{totals.couponError ?? localized(coupon, 'description', lang)}</p>
        </div>
        <button type="button" onClick={removeCoupon} className="font-semibold text-coral-700 underline">
          {t('Quitar', 'Remove')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex gap-2">
        <label htmlFor="coupon" className="sr-only">
          {t('Cupón de descuento', 'Discount code')}
        </label>
        <input id="coupon" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder={t('Cupón de descuento', 'Discount code')} className="input py-2 uppercase" autoComplete="off" />
        <button type="submit" className="btn-outline shrink-0 px-4 py-2" disabled={loading}>
          {t('Aplicar', 'Apply')}
        </button>
      </div>
      {message && (
        <p role={message.ok ? 'status' : 'alert'} className={`mt-1 text-sm ${message.ok ? 'text-leaf-700' : 'text-coral-700'}`}>
          {message.text}
        </p>
      )}
    </form>
  )
}

export function TotalsSummary() {
  const { t } = useLang()
  const { totals } = useCart()
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt>{t('Subtotal', 'Subtotal')}</dt>
        <dd className="font-semibold">{formatPrice(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-leaf-700">
          <dt>{t('Descuento', 'Discount')}</dt>
          <dd className="font-semibold">−{formatPrice(totals.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt>{t('Envío', 'Shipping')}</dt>
        <dd className="font-semibold">{totals.shipping === 0 ? t('Gratis', 'Free') : formatPrice(totals.shipping)}</dd>
      </div>
      <div className="flex justify-between border-t border-sand-200 pt-3 text-lg">
        <dt className="font-bold">{t('Total', 'Total')}</dt>
        <dd className="font-display font-bold">{formatPrice(totals.total)}</dd>
      </div>
      {totals.hasSubscription && (
        <p className="text-xs text-ink/60">
          {t(
            'La suscripción al Club se renueva automáticamente con envío incluido. Los cupones aplican a productos de compra única.',
            'Club subscription renews automatically with shipping included. Coupons apply to one-time products.',
          )}
        </p>
      )}
    </dl>
  )
}
