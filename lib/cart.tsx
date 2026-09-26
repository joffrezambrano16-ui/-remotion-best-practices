'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { settings } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'
import { computeTotals, type CartItem, type Coupon, type Totals } from '@/lib/pricing'

type NewItem =
  | { kind: 'product'; slug: string; sizeId: string; qty?: number }
  | { kind: 'box'; boxSizeId: string; fruits: string[]; qty?: number }
  | { kind: 'club'; planId: string; frequency: 'weekly' | 'monthly' }

type CartContextValue = {
  items: CartItem[]
  count: number
  totals: Totals
  isOpen: boolean
  open: () => void
  close: () => void
  add: (item: NewItem) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  coupon: Coupon | null
  applyCoupon: (code: string) => Promise<{ ok: boolean; message: string }>
  removeCoupon: () => void
  zoneId: string
  setZoneId: (id: string) => void
  ready: boolean
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'fi-cart-v1'

function keyFor(item: NewItem) {
  if (item.kind === 'product') return `p:${item.slug}:${item.sizeId}`
  if (item.kind === 'box') return `b:${item.boxSizeId}:${[...item.fruits].sort().join(',')}`
  return `c:${item.planId}:${item.frequency}`
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { lang, t } = useLang()
  const [items, setItems] = useState<CartItem[]>([])
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [zoneId, setZoneId] = useState<string>(settings.defaultZone)
  const [isOpen, setIsOpen] = useState(false)
  const [ready, setReady] = useState(false)

  // El carrito se guarda en el navegador: sigue ahí aunque el cliente cierre la página.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
      if (saved && Array.isArray(saved.items)) {
        setItems(saved.items)
        if (saved.coupon) setCoupon(saved.coupon)
        if (typeof saved.zoneId === 'string') setZoneId(saved.zoneId)
      }
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, coupon, zoneId }))
    } catch {}
  }, [items, coupon, zoneId, ready])

  // Sincroniza el carrito entre pestañas abiertas.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return
      try {
        const saved = JSON.parse(e.newValue)
        setItems(saved.items ?? [])
        setCoupon(saved.coupon ?? null)
        if (saved.zoneId) setZoneId(saved.zoneId)
      } catch {}
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback((item: NewItem) => {
    const key = keyFor(item)
    setItems((prev) => {
      // Solo se permite una suscripción al Club por pedido.
      const base = item.kind === 'club' ? prev.filter((i) => i.kind !== 'club') : prev
      const existing = base.find((i) => i.key === key)
      if (existing && item.kind !== 'club') {
        return base.map((i) => (i.key === key ? { ...i, qty: Math.min(20, i.qty + ('qty' in item && item.qty ? item.qty : 1)) } : i))
      }
      const qty = item.kind === 'club' ? 1 : item.qty ?? 1
      return [...base, { ...item, key, qty } as CartItem]
    })
    setIsOpen(true)
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key && i.kind !== 'club' ? { ...i, qty: Math.min(20, qty) } : i)),
    )
  }, [])

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), [])
  const clear = useCallback(() => {
    setItems([])
    setCoupon(null)
  }, [])

  const applyCoupon = useCallback(
    async (code: string) => {
      try {
        const res = await fetch('/api/coupon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })
        const data = await res.json()
        if (!res.ok || !data.coupon) return { ok: false, message: t('Cupón no válido', 'Invalid coupon') }
        setCoupon(data.coupon)
        return { ok: true, message: t('¡Cupón aplicado!', 'Coupon applied!') }
      } catch {
        return { ok: false, message: t('No pudimos validar el cupón', 'We could not validate the coupon') }
      }
    },
    [t],
  )

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const totals = useMemo(() => computeTotals(items, { coupon, zoneId, lang }), [items, coupon, zoneId, lang])
  const count = items.reduce((s, i) => s + i.qty, 0)

  const value: CartContextValue = {
    items,
    count,
    totals,
    isOpen,
    open,
    close,
    add,
    setQty,
    remove,
    clear,
    coupon,
    applyCoupon,
    removeCoupon: () => setCoupon(null),
    zoneId,
    setZoneId,
    ready,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
