import { NextResponse } from 'next/server'
import { paypalConfigured, paypalRequest } from '@/lib/paypal'

export async function POST(request: Request) {
  if (!paypalConfigured()) return NextResponse.json({ error: 'PayPal no está configurado.' }, { status: 501 })
  const body = await request.json().catch(() => ({}))
  const orderID = typeof body.orderID === 'string' && /^[A-Z0-9]{5,40}$/.test(body.orderID) ? body.orderID : null
  if (!orderID) return NextResponse.json({ error: 'Pedido no válido' }, { status: 400 })

  const { ok, data } = await paypalRequest(`/v2/checkout/orders/${orderID}/capture`)
  if (!ok) {
    console.error('PayPal capture error', data)
    return NextResponse.json({ error: 'No se pudo completar el pago.' }, { status: 502 })
  }
  return NextResponse.json({ status: data.status, id: data.id })
}
