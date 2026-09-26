'use client'

import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'
import { TrashIcon } from '@/components/Icons'
import { whatsappLink } from '@/components/WhatsAppButton'
import { cancelSubscriptionLocally, getAddresses, getOrders, saveAddresses, type Address, type SavedOrder } from '@/lib/account'
import { formatPrice } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

type Tab = 'pedidos' | 'direcciones' | 'suscripcion'

export function AccountClient() {
  const { t, lang } = useLang()
  const [tab, setTab] = useState<Tab>('pedidos')
  const [orders, setOrders] = useState<SavedOrder[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setOrders(getOrders())
    setAddresses(getAddresses())
    setLoaded(true)
    const hash = window.location.hash.replace('#', '')
    if (hash === 'direcciones' || hash === 'suscripcion') setTab(hash)
  }, [])

  const subscriptions = orders.filter((o) => o.subscription)
  const tabs: { id: Tab; label: string }[] = [
    { id: 'pedidos', label: t('Mis pedidos', 'My orders') },
    { id: 'direcciones', label: t('Direcciones', 'Addresses') },
    { id: 'suscripcion', label: t('Suscripción', 'Subscription') },
  ]

  function updateAddresses(next: Address[]) {
    setAddresses(next)
    saveAddresses(next)
  }

  const dateFmt = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-ES', { dateStyle: 'medium' })

  return (
    <div className="container-page py-10">
      <p className="mb-6 rounded-2xl bg-mango-100 p-4 text-sm text-ink/80">
        {t(
          'Tus pedidos y direcciones se guardan de forma privada en este dispositivo. Los recibos oficiales te llegan por correo.',
          'Your orders and addresses are stored privately on this device. Official receipts are sent to your email.',
        )}
      </p>
      <div role="tablist" aria-label={t('Secciones de mi cuenta', 'Account sections')} className="mb-8 flex gap-2 overflow-x-auto">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            role="tab"
            id={`tab-${tb.id}`}
            aria-selected={tab === tb.id}
            aria-controls={`panel-${tb.id}`}
            type="button"
            onClick={() => setTab(tb.id)}
            className={`chip shrink-0 ${tab === tb.id ? 'chip-active' : ''}`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {!loaded ? null : tab === 'pedidos' ? (
        <section role="tabpanel" id="panel-pedidos" aria-labelledby="tab-pedidos">
          {orders.length === 0 ? (
            <Empty text={t('Todavía no tienes pedidos.', "You don't have any orders yet.")} />
          ) : (
            <ul className="space-y-4">
              {orders.map((o) => (
                <li key={o.id} className="card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-display text-lg font-bold">#{o.id}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${o.status === 'demo' ? 'bg-mango-100' : 'bg-leaf-50 text-leaf-700'}`}>
                      {o.status === 'demo' ? t('Demostración', 'Demo') : t('Pagado', 'Paid')}
                    </span>
                  </div>
                  <p className="text-sm text-ink/60">
                    {dateFmt.format(new Date(o.date))} · {o.method === 'paypal' ? 'PayPal' : o.method === 'stripe' ? t('Tarjeta', 'Card') : 'Demo'}
                  </p>
                  <ul className="mt-3 space-y-1 text-sm">
                    {o.lines.map((l, i) => (
                      <li key={i} className="flex justify-between gap-4">
                        <span>
                          {l.qty}× {l.name} <span className="text-ink/50">· {l.detail}</span>
                        </span>
                        <span className="font-semibold">{formatPrice(l.total)}</span>
                      </li>
                    ))}
                    {o.subscription && (
                      <li className="flex justify-between gap-4">
                        <span>{o.subscription.name} · {o.subscription.detail}</span>
                        <span className="font-semibold">{formatPrice(o.subscription.price)}</span>
                      </li>
                    )}
                  </ul>
                  <p className="mt-3 border-t border-sand-200 pt-3 text-right font-bold">
                    {t('Total', 'Total')}: {formatPrice(o.total)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : tab === 'direcciones' ? (
        <section role="tabpanel" id="panel-direcciones" aria-labelledby="tab-direcciones" className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            {addresses.length === 0 && <Empty text={t('No tienes direcciones guardadas.', 'You have no saved addresses.')} />}
            {addresses.map((a) => (
              <div key={a.id} className="card flex items-start justify-between gap-4 p-6">
                <div>
                  <p className="font-bold">{a.name}</p>
                  <p className="text-ink/70">{a.street}</p>
                  <p className="text-ink/70">
                    {a.city} {a.postal}
                  </p>
                  <p className="text-sm text-ink/60">{a.phone}</p>
                </div>
                <button type="button" onClick={() => updateAddresses(addresses.filter((x) => x.id !== a.id))} className="rounded-full p-2 text-ink/50 hover:bg-sand-200 hover:text-coral-700" aria-label={t('Eliminar dirección', 'Delete address')}>
                  <TrashIcon width={18} height={18} />
                </button>
              </div>
            ))}
          </div>
          <AddressForm onSave={(a) => updateAddresses([a, ...addresses])} />
        </section>
      ) : (
        <section role="tabpanel" id="panel-suscripcion" aria-labelledby="tab-suscripcion">
          {subscriptions.length === 0 ? (
            <Empty text={t('No tienes una suscripción activa.', "You don't have an active subscription.")}>
              <Link href="/club" className="btn-primary mt-4">
                {t('Conocer el Club', 'Discover the Club')}
              </Link>
            </Empty>
          ) : (
            <ul className="space-y-4">
              {subscriptions.map((o) => (
                <li key={o.id} className="card p-6">
                  <p className="font-display text-xl font-bold">{o.subscription!.name}</p>
                  <p className="text-ink/70">
                    {o.subscription!.detail} · {formatPrice(o.subscription!.price)}
                  </p>
                  <p className="mt-1 text-sm text-ink/60">
                    {t('Desde', 'Since')} {dateFmt.format(new Date(o.date))} · #{o.id}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      className="btn-outline"
                      href={whatsappLink(t(`Hola, quiero pausar o modificar mi suscripción (pedido #${o.id})`, `Hi, I'd like to pause or change my subscription (order #${o.id})`))}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('Pausar o cambiar', 'Pause or change')}
                    </a>
                    <a
                      className="btn text-coral-700 underline"
                      href={whatsappLink(t(`Hola, quiero cancelar mi suscripción (pedido #${o.id})`, `Hi, I'd like to cancel my subscription (order #${o.id})`))}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        cancelSubscriptionLocally(o.id)
                        setOrders(getOrders())
                      }}
                    >
                      {t('Solicitar cancelación', 'Request cancellation')}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}

function Empty({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center p-10 text-center">
      <p className="text-lg font-semibold text-ink/70">{text}</p>
      {children}
    </div>
  )
}

function AddressForm({ onSave }: { onSave: (a: Address) => void }) {
  const { t } = useLang()
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    onSave({
      id: crypto.randomUUID(),
      name: String(d.get('name')),
      phone: String(d.get('phone')),
      street: String(d.get('street')),
      city: String(d.get('city')),
      postal: String(d.get('postal')),
      notes: String(d.get('notes') ?? ''),
    })
    e.currentTarget.reset()
  }
  const fields = [
    { id: 'name', label: t('Nombre', 'Name'), auto: 'name' },
    { id: 'phone', label: t('Teléfono', 'Phone'), auto: 'tel' },
    { id: 'street', label: t('Calle y número', 'Street address'), auto: 'street-address' },
    { id: 'city', label: t('Ciudad', 'City'), auto: 'address-level2' },
    { id: 'postal', label: t('Código postal', 'Postal code'), auto: 'postal-code' },
  ]
  return (
    <form onSubmit={submit} className="card space-y-4 p-6" aria-label={t('Nueva dirección', 'New address')}>
      <h2 className="text-xl font-bold">{t('Agregar dirección', 'Add address')}</h2>
      {fields.map((f) => (
        <div key={f.id}>
          <label htmlFor={`addr-${f.id}`} className="label">
            {f.label}
          </label>
          <input id={`addr-${f.id}`} name={f.id} required autoComplete={f.auto} className="input" />
        </div>
      ))}
      <div>
        <label htmlFor="addr-notes" className="label">
          {t('Indicaciones (opcional)', 'Notes (optional)')}
        </label>
        <input id="addr-notes" name="notes" className="input" />
      </div>
      <button type="submit" className="btn-primary w-full">
        {t('Guardar dirección', 'Save address')}
      </button>
    </form>
  )
}
