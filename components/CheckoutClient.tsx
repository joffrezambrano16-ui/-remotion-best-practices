'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CouponForm, TotalsSummary } from '@/components/CartExtras'
import { CheckIcon, GiftIcon, ShieldIcon } from '@/components/Icons'
import { getAddresses, saveAddresses, setPendingOrder, type Address } from '@/lib/account'
import { useCart } from '@/lib/cart'
import { formatPrice, getZone, localized, settings, zoneForPostalCode } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

export type PaymentOptions = { stripe: boolean; paypalClientId: string | null }

type Customer = { email: string; name: string; phone: string; street: string; city: string; postal: string; notes: string }
type Gift = { isGift: boolean; message: string; from: string; deliveryDate: string }

declare global {
  interface Window {
    // SDK de PayPal cargado dinámicamente
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paypal?: any
  }
}

const emptyCustomer: Customer = { email: '', name: '', phone: '', street: '', city: '', postal: '', notes: '' }

export function CheckoutClient({ payments }: { payments: PaymentOptions }) {
  const { lang, t } = useLang()
  const router = useRouter()
  const cart = useCart()
  const { totals, items, coupon, zoneId, setZoneId, ready } = cart
  const [step, setStep] = useState(1)
  const [customer, setCustomer] = useState<Customer>(emptyCustomer)
  const [gift, setGift] = useState<Gift>({ isGift: false, message: '', from: '', deliveryDate: '' })
  const [saveAddress, setSaveAddress] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [method, setMethod] = useState<'stripe' | 'paypal' | 'demo'>(payments.stripe ? 'stripe' : payments.paypalClientId ? 'paypal' : 'demo')
  const [error, setError] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const demoMode = !payments.stripe && !payments.paypalClientId

  useEffect(() => {
    const saved = getAddresses()
    setAddresses(saved)
    if (saved[0]) fillFromAddress(saved[0])
    try {
      const last = JSON.parse(localStorage.getItem('fi-last-email') ?? '""')
      if (last) setCustomer((c) => ({ ...c, email: last }))
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  function fillFromAddress(a: Address) {
    setCustomer((c) => ({ ...c, name: a.name, phone: a.phone, street: a.street, city: a.city, postal: a.postal, notes: a.notes ?? '' }))
    const zone = zoneForPostalCode(a.postal)
    if (zone) setZoneId(zone.id)
  }

  const set = (field: keyof Customer) => (e: { target: { value: string } }) => setCustomer((c) => ({ ...c, [field]: e.target.value }))

  function onPostalBlur() {
    if (zoneId === 'recoger') return
    const zone = zoneForPostalCode(customer.postal)
    if (zone) setZoneId(zone.id)
  }

  function submitDetails(e: FormEvent) {
    e.preventDefault()
    try {
      localStorage.setItem('fi-last-email', JSON.stringify(customer.email))
    } catch {}
    if (saveAddress && customer.street) {
      const exists = addresses.some((a) => a.street === customer.street && a.postal === customer.postal)
      if (!exists) {
        const next = [{ id: crypto.randomUUID(), name: customer.name, phone: customer.phone, street: customer.street, city: customer.city, postal: customer.postal, notes: customer.notes }, ...addresses]
        saveAddresses(next)
        setAddresses(next)
      }
    }
    setStep(2)
  }

  function payload() {
    return { items, couponCode: coupon?.code ?? null, zoneId, customer, gift: gift.isGift ? gift : null, lang }
  }

  function rememberOrder() {
    setPendingOrder({
      total: totals.total,
      lines: totals.lines.filter((l) => !l.recurring).map((l) => ({ name: l.name, detail: l.detail, qty: l.qty, total: l.total })),
      subscription: totals.lines.find((l) => l.recurring)
        ? (() => {
            const s = totals.lines.find((l) => l.recurring)!
            return { name: s.name, detail: s.detail, price: s.unitPrice }
          })()
        : null,
    })
  }

  async function payWithStripe() {
    setPaying(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout/stripe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload()) })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error)
      rememberOrder()
      window.location.href = data.url
    } catch (err) {
      setError((err as Error).message || t('No pudimos iniciar el pago. Intenta de nuevo.', 'We could not start the payment. Please try again.'))
      setPaying(false)
    }
  }

  function payDemo() {
    rememberOrder()
    router.push('/checkout/exito?demo=1')
  }

  if (!ready) return <div className="container-page py-24 text-center text-ink/60">{t('Cargando…', 'Loading…')}</div>

  if (totals.lines.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl font-bold">{t('Tu carrito está vacío', 'Your cart is empty')}</h1>
        <Link href="/tienda" className="btn-primary mt-6">
          {t('Ir a la tienda', 'Go to shop')}
        </Link>
      </div>
    )
  }

  const steps = [t('Datos y entrega', 'Details & delivery'), t('Regalo', 'Gift'), t('Pago', 'Payment')]
  const zone = getZone(zoneId)
  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10)

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_400px]">
      <div>
        <ol className="mb-8 flex items-center gap-2 text-sm font-bold" aria-label={t('Pasos del pago', 'Checkout steps')}>
          {steps.map((label, i) => {
            const n = i + 1
            const done = step > n
            return (
              <li key={label} className="flex flex-1 items-center gap-2" aria-current={step === n ? 'step' : undefined}>
                <button
                  type="button"
                  disabled={n > step}
                  onClick={() => setStep(n)}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${done ? 'bg-leaf-600 text-white' : step === n ? 'bg-mango-400 text-ink' : 'bg-sand-200 text-ink/50'}`}
                  aria-label={`${t('Paso', 'Step')} ${n}: ${label}`}
                >
                  {done ? <CheckIcon width={16} height={16} /> : n}
                </button>
                <span className={`hidden sm:inline ${step === n ? 'text-ink' : 'text-ink/50'}`}>{label}</span>
                {n < 3 && <span className="h-0.5 flex-1 bg-sand-200" aria-hidden />}
              </li>
            )
          })}
        </ol>

        {step === 1 && (
          <form onSubmit={submitDetails} className="space-y-5">
            <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold focus:outline-none">
              {t('¿A dónde enviamos tu fruta?', 'Where should we send your fruit?')}
            </h1>
            {addresses.length > 0 && (
              <div>
                <label htmlFor="saved-address" className="label">
                  {t('Direcciones guardadas', 'Saved addresses')}
                </label>
                <select id="saved-address" className="input" onChange={(e) => { const a = addresses.find((x) => x.id === e.target.value); if (a) fillFromAddress(a) }}>
                  {addresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} — {a.street}, {a.city}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="email" label={t('Correo electrónico', 'Email')} type="email" autoComplete="email" value={customer.email} onChange={set('email')} required className="sm:col-span-2" />
              <Field id="name" label={t('Nombre completo', 'Full name')} autoComplete="name" value={customer.name} onChange={set('name')} required />
              <Field id="phone" label={t('Teléfono / WhatsApp', 'Phone / WhatsApp')} type="tel" autoComplete="tel" value={customer.phone} onChange={set('phone')} required />
            </div>

            <fieldset>
              <legend className="label">{t('Método de entrega', 'Delivery method')}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {settings.shippingZones.map((z) => (
                  <label key={z.id} className={`flex cursor-pointer flex-col rounded-2xl border-2 bg-white px-4 py-3 ${zoneId === z.id ? 'border-leaf-600' : 'border-sand-200'}`}>
                    <input type="radio" name="zone" className="sr-only" checked={zoneId === z.id} onChange={() => setZoneId(z.id)} />
                    <span className="flex justify-between font-bold">
                      {localized(z, 'name', lang)}
                      <span>{z.price === 0 ? t('Gratis', 'Free') : formatPrice(z.price)}</span>
                    </span>
                    <span className="text-sm text-ink/60">{localized(z, 'eta', lang)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {zoneId !== 'recoger' ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="street" label={t('Calle, número y colonia', 'Street address')} autoComplete="street-address" value={customer.street} onChange={set('street')} required className="sm:col-span-2" />
                <Field id="city" label={t('Ciudad', 'City')} autoComplete="address-level2" value={customer.city} onChange={set('city')} required />
                <Field id="postal" label={t('Código postal', 'Postal code')} autoComplete="postal-code" inputMode="numeric" value={customer.postal} onChange={set('postal')} onBlur={onPostalBlur} required />
                <Field id="notes" label={t('Indicaciones para el repartidor (opcional)', 'Delivery notes (optional)')} value={customer.notes} onChange={set('notes')} className="sm:col-span-2" />
                <label className="flex items-center gap-2 text-sm sm:col-span-2">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="h-5 w-5 accent-leaf-600" />
                  {t('Guardar esta dirección en mi cuenta', 'Save this address to my account')}
                </label>
              </div>
            ) : (
              <p className="rounded-2xl bg-leaf-50 p-4 text-leaf-900">
                {t('Recoge en', 'Pick up at')}: <strong>{settings.address}</strong> · {localized(settings, 'hours', lang)}
              </p>
            )}
            {zone && totals.freeShippingFrom && totals.shipping > 0 && (
              <p className="text-sm text-ink/70">
                {t('Envío gratis en esta zona desde', 'Free shipping in this zone over')} {formatPrice(totals.freeShippingFrom)}
              </p>
            )}
            <button type="submit" className="btn-primary w-full sm:w-auto">
              {t('Continuar', 'Continue')}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(3) }} className="space-y-5">
            <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold focus:outline-none">
              {t('¿Es un regalo?', 'Is it a gift?')}
            </h1>
            <label className="flex cursor-pointer items-center gap-4 rounded-3xl border-2 border-sand-200 bg-white p-5">
              <input type="checkbox" checked={gift.isGift} onChange={(e) => setGift((g) => ({ ...g, isGift: e.target.checked }))} className="h-6 w-6 accent-leaf-600" />
              <GiftIcon className="text-coral-400" />
              <span>
                <span className="block font-bold">{t('Sí, enviar como regalo', 'Yes, send as a gift')}</span>
                <span className="text-sm text-ink/60">{t('Incluimos una tarjeta con tu mensaje y no mostramos precios en el paquete.', "We include a card with your message and don't show prices in the package.")}</span>
              </span>
            </label>
            {gift.isGift && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="gift-message" className="label">
                    {t('Mensaje para la tarjeta', 'Card message')}
                  </label>
                  <textarea
                    id="gift-message"
                    rows={4}
                    maxLength={settings.giftMessageMaxLength}
                    value={gift.message}
                    onChange={(e) => setGift((g) => ({ ...g, message: e.target.value }))}
                    className="input"
                    placeholder={t('¡Feliz cumpleaños! Que este año sea tan dulce como un mango 🥭', 'Happy birthday! May this year be as sweet as a mango 🥭')}
                    aria-describedby="gift-count"
                    required
                  />
                  <p id="gift-count" className="mt-1 text-right text-xs text-ink/60">
                    {gift.message.length}/{settings.giftMessageMaxLength}
                  </p>
                </div>
                <Field id="gift-from" label={t('De parte de', 'From')} value={gift.from} onChange={(e) => setGift((g) => ({ ...g, from: e.target.value }))} />
              </div>
            )}
            {zoneId !== 'recoger' && (
              <div className="max-w-xs">
                <label htmlFor="delivery-date" className="label">
                  {t('Fecha de entrega preferida (opcional)', 'Preferred delivery date (optional)')}
                </label>
                <input id="delivery-date" type="date" min={minDate} value={gift.deliveryDate} onChange={(e) => setGift((g) => ({ ...g, deliveryDate: e.target.value }))} className="input" />
              </div>
            )}
            <div className="flex gap-3">
              <button type="button" className="btn-outline" onClick={() => setStep(1)}>
                {t('Atrás', 'Back')}
              </button>
              <button type="submit" className="btn-primary flex-1 sm:flex-none">
                {t('Continuar al pago', 'Continue to payment')}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold focus:outline-none">
              {t('Pago seguro', 'Secure payment')}
            </h1>
            <div className="rounded-3xl bg-white p-5 text-sm shadow-soft">
              <p className="font-bold">{customer.name} · {customer.email}</p>
              <p className="text-ink/70">
                {zoneId === 'recoger' ? t('Recoger en tienda', 'Store pickup') : `${customer.street}, ${customer.city} ${customer.postal}`}
              </p>
              {gift.isGift && <p className="mt-2 text-ink/70">🎁 “{gift.message}”{gift.from && ` — ${gift.from}`}</p>}
              <button type="button" className="mt-2 font-semibold text-leaf-700 underline" onClick={() => setStep(1)}>
                {t('Editar', 'Edit')}
              </button>
            </div>

            <fieldset>
              <legend className="label">{t('Método de pago', 'Payment method')}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {payments.stripe && (
                  <PayOption checked={method === 'stripe'} onSelect={() => setMethod('stripe')} title={t('Tarjeta de crédito o débito', 'Credit or debit card')} note="Stripe · Visa, Mastercard, Amex, Apple Pay, Google Pay" />
                )}
                {payments.paypalClientId && (
                  <PayOption
                    checked={method === 'paypal'}
                    onSelect={() => setMethod('paypal')}
                    title="PayPal"
                    note={totals.hasSubscription ? t('No disponible para suscripciones', 'Not available for subscriptions') : t('Paga con tu cuenta PayPal', 'Pay with your PayPal account')}
                    disabled={totals.hasSubscription}
                  />
                )}
                {demoMode && (
                  <PayOption checked onSelect={() => setMethod('demo')} title={t('Modo demostración', 'Demo mode')} note={t('Configura Stripe o PayPal para cobrar de verdad (ver README).', 'Set up Stripe or PayPal to take real payments (see README).')} />
                )}
              </div>
            </fieldset>

            {error && (
              <p role="alert" className="rounded-2xl bg-coral-100 p-4 font-semibold text-coral-700">
                {error}
              </p>
            )}

            {method === 'stripe' && payments.stripe && (
              <button type="button" className="btn-primary w-full" onClick={payWithStripe} disabled={paying}>
                <ShieldIcon width={18} height={18} />
                {paying ? t('Redirigiendo…', 'Redirecting…') : `${t('Pagar', 'Pay')} ${formatPrice(totals.total)}`}
              </button>
            )}
            {method === 'paypal' && payments.paypalClientId && !totals.hasSubscription && (
              <PayPalButtons clientId={payments.paypalClientId} getPayload={payload} onPaid={(id) => { rememberOrder(); router.push(`/checkout/exito?paypal=${encodeURIComponent(id)}`) }} onError={setError} />
            )}
            {method === 'demo' && demoMode && (
              <button type="button" className="btn-primary w-full" onClick={payDemo}>
                {t('Simular pago de', 'Simulate payment of')} {formatPrice(totals.total)}
              </button>
            )}
            <p className="flex items-center gap-2 text-sm text-ink/60">
              <ShieldIcon width={16} height={16} />
              {t('Tus datos de pago nunca pasan por nuestros servidores.', 'Your payment details never touch our servers.')}
            </p>
            <button type="button" className="btn-outline" onClick={() => setStep(2)}>
              {t('Atrás', 'Back')}
            </button>
          </div>
        )}
      </div>

      <aside aria-label={t('Resumen del pedido', 'Order summary')} className="lg:sticky lg:top-28 lg:self-start">
        <div className="card space-y-4 p-6">
          <h2 className="text-xl font-bold">{t('Tu pedido', 'Your order')}</h2>
          <ul className="space-y-3">
            {totals.lines.map((l) => (
              <li key={l.key} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand-100">
                  <Image src={l.image} alt="" fill sizes="56px" className="object-cover" />
                  <span className="absolute -right-0 -top-0 rounded-bl-lg bg-leaf-600 px-1.5 text-xs font-bold text-white">{l.qty}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-tight">{l.name}</p>
                  <p className="truncate text-xs text-ink/60">{l.detail}</p>
                </div>
                <p className="text-sm font-bold">{formatPrice(l.total)}</p>
              </li>
            ))}
          </ul>
          <CouponForm />
          <TotalsSummary />
        </div>
      </aside>
    </div>
  )
}

function Field({ id, label, className = '', ...props }: { id: string; label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
        {props.required && <span aria-hidden className="text-coral-700"> *</span>}
      </label>
      <input id={id} name={id} className="input" {...props} />
    </div>
  )
}

function PayOption({ checked, onSelect, title, note, disabled }: { checked: boolean; onSelect: () => void; title: string; note: string; disabled?: boolean }) {
  return (
    <label className={`flex cursor-pointer flex-col rounded-2xl border-2 bg-white px-4 py-3 ${checked ? 'border-leaf-600' : 'border-sand-200'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
      <input type="radio" name="payment" className="sr-only" checked={checked} onChange={onSelect} disabled={disabled} />
      <span className="font-bold">{title}</span>
      <span className="text-sm text-ink/60">{note}</span>
    </label>
  )
}

function PayPalButtons({ clientId, getPayload, onPaid, onError }: { clientId: string; getPayload: () => unknown; onPaid: (id: string) => void; onError: (msg: string) => void }) {
  const { t } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  // Guardamos las funciones en refs para no volver a dibujar los botones en cada render.
  const latest = useRef({ getPayload, onPaid, onError, t })
  latest.current = { getPayload, onPaid, onError, t }

  useEffect(() => {
    let cancelled = false
    const render = () => {
      if (cancelled || !ref.current || !window.paypal) return
      ref.current.innerHTML = ''
      window.paypal
        .Buttons({
          style: { shape: 'pill', color: 'gold', label: 'pay' },
          createOrder: async () => {
            const res = await fetch('/api/paypal/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(latest.current.getPayload()) })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            return data.id
          },
          onApprove: async (data: { orderID: string }) => {
            const res = await fetch('/api/paypal/capture-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderID: data.orderID }) })
            const result = await res.json()
            if (!res.ok || result.status !== 'COMPLETED') {
              latest.current.onError(latest.current.t('El pago no se completó. Intenta de nuevo.', 'The payment was not completed. Please try again.'))
              return
            }
            latest.current.onPaid(data.orderID)
          },
          onError: () => latest.current.onError(latest.current.t('Hubo un problema con PayPal. Intenta de nuevo.', 'There was a problem with PayPal. Please try again.')),
        })
        .render(ref.current)
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-paypal-sdk]')
    if (window.paypal) render()
    else if (existing) existing.addEventListener('load', render)
    else {
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${settings.currency}&intent=capture`
      script.async = true
      script.dataset.paypalSdk = 'true'
      script.addEventListener('load', render)
      document.body.appendChild(script)
    }
    return () => {
      cancelled = true
    }
  }, [clientId])

  return <div ref={ref} className="min-h-[50px]" />
}
