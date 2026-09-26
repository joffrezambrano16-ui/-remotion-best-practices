'use client'

// "Mi cuenta" guarda pedidos, direcciones y suscripción en este navegador.
// Para cuentas con inicio de sesión en varios dispositivos, conecta un servicio
// de autenticación (ver README, sección "Siguientes pasos").

export type SavedOrder = {
  id: string
  date: string
  total: number
  status: 'pagado' | 'demo'
  method: 'stripe' | 'paypal' | 'demo'
  lines: { name: string; detail: string; qty: number; total: number }[]
  subscription?: { name: string; detail: string; price: number } | null
}

export type Address = {
  id: string
  name: string
  phone: string
  street: string
  city: string
  postal: string
  notes?: string
}

const ORDERS = 'fi-orders'
const ADDRESSES = 'fi-addresses'
const PENDING = 'fi-pending-order'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export const getOrders = () => read<SavedOrder[]>(ORDERS, [])
export const saveOrder = (order: SavedOrder) => {
  const orders = getOrders().filter((o) => o.id !== order.id)
  write(ORDERS, [order, ...orders].slice(0, 50))
}
export const cancelSubscriptionLocally = (orderId: string) =>
  write(
    ORDERS,
    getOrders().map((o) => (o.id === orderId ? { ...o, subscription: null } : o)),
  )

export const getAddresses = () => read<Address[]>(ADDRESSES, [])
export const saveAddresses = (list: Address[]) => write(ADDRESSES, list)

export const setPendingOrder = (order: Omit<SavedOrder, 'id' | 'date' | 'status' | 'method'>) => write(PENDING, order)
export const takePendingOrder = () => {
  const order = read<Omit<SavedOrder, 'id' | 'date' | 'status' | 'method'> | null>(PENDING, null)
  try {
    localStorage.removeItem(PENDING)
  } catch {}
  return order
}
