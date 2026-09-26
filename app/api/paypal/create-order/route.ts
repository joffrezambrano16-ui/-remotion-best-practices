import { NextResponse } from 'next/server'
import { settings } from '@/lib/catalog'
import { orderMetadata, parseOrderRequest } from '@/lib/order-server'
import { paypalConfigured, paypalRequest } from '@/lib/paypal'

const money = (n: number) => ({ currency_code: settings.currency, value: n.toFixed(2) })

export async function POST(request: Request) {
  if (!paypalConfigured()) return NextResponse.json({ error: 'PayPal no está configurado.' }, { status: 501 })

  const order = parseOrderRequest(await request.json().catch(() => null))
  if (order.errors.length) return NextResponse.json({ error: order.errors.join(' ') }, { status: 400 })
  if (order.totals.hasSubscription) return NextResponse.json({ error: 'Las suscripciones se pagan con tarjeta.' }, { status: 400 })

  const { totals } = order
  const meta = orderMetadata(order)
  const { ok, data } = await paypalRequest('/v2/checkout/orders', {
    intent: 'CAPTURE',
    purchase_units: [
      {
        description: `FruitsIsland · ${meta.productos}`.slice(0, 127),
        custom_id: `${order.customer.email}`.slice(0, 127),
        soft_descriptor: 'FRUITSISLAND',
        amount: {
          ...money(totals.total),
          breakdown: {
            item_total: money(totals.oneTimeSubtotal),
            shipping: money(totals.shipping),
            discount: money(totals.discount),
          },
        },
        items: totals.lines.map((l) => ({
          name: l.name.slice(0, 127),
          description: l.detail.slice(0, 127),
          quantity: String(l.qty),
          unit_amount: money(l.unitPrice),
          category: 'PHYSICAL_GOODS',
        })),
        shipping:
          order.zoneId === 'recoger'
            ? undefined
            : {
                name: { full_name: order.customer.name.slice(0, 300) },
                address: {
                  address_line_1: order.customer.street.slice(0, 300),
                  admin_area_2: order.customer.city.slice(0, 120),
                  postal_code: order.customer.postal.slice(0, 60),
                  country_code: process.env.PAYPAL_COUNTRY_CODE || 'US',
                },
              },
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: 'FruitsIsland',
          locale: order.lang === 'en' ? 'en-US' : 'es-ES',
          shipping_preference: order.zoneId === 'recoger' ? 'NO_SHIPPING' : 'SET_PROVIDED_ADDRESS',
          user_action: 'PAY_NOW',
        },
      },
    },
  })

  if (!ok) {
    console.error('PayPal create-order error', data)
    return NextResponse.json({ error: 'No se pudo crear el pedido en PayPal.' }, { status: 502 })
  }
  // Datos del regalo y la entrega, visibles en los registros del servidor (Vercel → Logs).
  console.log('Pedido PayPal creado', data.id, meta)
  return NextResponse.json({ id: data.id })
}
