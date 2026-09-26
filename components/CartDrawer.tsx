'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { CouponForm, QtyStepper, ShippingCalculator, TotalsSummary } from '@/components/CartExtras'
import { BagIcon, CloseIcon, TrashIcon } from '@/components/Icons'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

export function CartDrawer() {
  const { t } = useLang()
  const { isOpen, close, totals, setQty, remove, items } = useCart()
  const panelRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return
    const previous = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      // Mantiene el foco dentro del carrito (accesibilidad con teclado).
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [isOpen, close])

  if (!isOpen) return null

  const kinds = Object.fromEntries(items.map((i) => [i.key, i.kind]))

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={close} />
      <div ref={panelRef} tabIndex={-1} className="absolute inset-y-0 right-0 flex w-full max-w-md animate-slide-in flex-col bg-sand-50 shadow-soft focus:outline-none">
        <div className="flex items-center justify-between border-b border-sand-200 px-5 py-4">
          <h2 id="cart-title" className="text-xl font-bold">
            {t('Tu carrito', 'Your cart')}
          </h2>
          <button type="button" onClick={close} className="rounded-full p-2 hover:bg-sand-200" aria-label={t('Cerrar carrito', 'Close cart')}>
            <CloseIcon />
          </button>
        </div>

        {totals.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-mango-100 text-leaf-600">
              <BagIcon width={36} height={36} />
            </span>
            <p className="text-lg font-bold">{t('Tu carrito está vacío', 'Your cart is empty')}</p>
            <p className="text-ink/70">{t('Llénalo de sol: la fruta más fresca te espera.', 'Fill it with sunshine: the freshest fruit awaits.')}</p>
            <Link href="/tienda" className="btn-primary" onClick={close}>
              {t('Ir a la tienda', 'Go to shop')}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <ul className="divide-y divide-sand-200">
                {totals.lines.map((line) => (
                  <li key={line.key} className="flex gap-4 py-4">
                    <Link href={line.href} onClick={close} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-sand-100">
                      <Image src={line.image} alt="" fill sizes="80px" className="object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <Link href={line.href} onClick={close} className="font-bold leading-tight hover:underline">
                          {line.name}
                        </Link>
                        <p className="shrink-0 font-bold">{formatPrice(line.total)}</p>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-sm text-ink/60">
                        {line.detail}
                        {line.recurring && ` · ${formatPrice(line.unitPrice)}/${line.recurring === 'week' ? t('semana', 'week') : t('mes', 'month')}`}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        {kinds[line.key] === 'club' ? (
                          <span className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-bold text-leaf-700">{t('Suscripción', 'Subscription')}</span>
                        ) : (
                          <QtyStepper value={line.qty} onChange={(v) => setQty(line.key, v)} label={t(`Cantidad de ${line.name}`, `Quantity of ${line.name}`)} min={0} />
                        )}
                        <button type="button" onClick={() => remove(line.key)} className="rounded-full p-2 text-ink/50 hover:bg-sand-200 hover:text-coral-700" aria-label={t(`Eliminar ${line.name}`, `Remove ${line.name}`)}>
                          <TrashIcon width={18} height={18} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="space-y-3 pb-4">
                {!totals.onlySubscription && <ShippingCalculator />}
                <CouponForm />
              </div>
            </div>
            <div className="space-y-3 border-t border-sand-200 bg-white px-5 py-4">
              <TotalsSummary />
              <Link href="/checkout" onClick={close} className="btn-primary w-full">
                {t('Finalizar compra', 'Checkout')}
              </Link>
              <button type="button" onClick={close} className="w-full py-1 text-sm font-semibold text-ink/70 underline">
                {t('Seguir comprando', 'Keep shopping')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
