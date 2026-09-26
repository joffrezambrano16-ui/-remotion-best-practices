import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { settings } from '@/lib/catalog'
import { orderMetadata, parseOrderRequest, siteOrigin } from '@/lib/order-server'

const toCents = (n: number) => Math.round(n * 100)

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) return NextResponse.json({ error: 'Stripe no está configurado.' }, { status: 501 })

  const order = parseOrderRequest(await request.json().catch(() => null))
  if (order.errors.length) return NextResponse.json({ error: order.errors.join(' ') }, { status: 400 })

  const stripe = new Stripe(secret)
  const currency = settings.currency.toLowerCase()
  const { totals } = order
  const origin = siteOrigin(request)

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = totals.lines.map((line) => ({
    quantity: line.qty,
    price_data: {
      currency,
      unit_amount: toCents(line.unitPrice),
      product_data: {
        name: line.name,
        description: line.detail || undefined,
        images: line.image.startsWith('/') && !line.image.endsWith('.svg') ? [`${origin}${line.image}`] : undefined,
      },
      ...(line.recurring ? { recurring: { interval: line.recurring } } : {}),
    },
  }))

  if (totals.shipping > 0) {
    lineItems.push({
      quantity: 1,
      price_data: { currency, unit_amount: toCents(totals.shipping), product_data: { name: order.lang === 'en' ? 'Shipping' : 'Envío' } },
    })
  }

  // El descuento del cupón se crea como un cupón de Stripe de un solo uso.
  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined
  if (totals.discount > 0) {
    const coupon = await stripe.coupons.create({
      amount_off: toCents(totals.discount),
      currency,
      duration: 'once',
      max_redemptions: 1,
      name: order.coupon?.code ?? 'Descuento',
    })
    discounts = [{ coupon: coupon.id }]
  }

  const metadata = Object.fromEntries(Object.entries(orderMetadata(order)).filter(([, v]) => v))
  const session = await stripe.checkout.sessions.create({
    mode: totals.hasSubscription ? 'subscription' : 'payment',
    line_items: lineItems,
    discounts,
    customer_email: order.customer.email,
    locale: order.lang === 'en' ? 'en' : 'es',
    metadata,
    ...(totals.hasSubscription ? { subscription_data: { metadata } } : { payment_intent_data: { metadata } }),
    success_url: `${origin}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
  })

  return NextResponse.json({ url: session.url })
}
