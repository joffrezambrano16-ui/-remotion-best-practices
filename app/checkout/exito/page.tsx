import type { Metadata } from 'next'
import Stripe from 'stripe'
import { OrderConfirmation } from '@/components/OrderConfirmation'
import { paypalConfigured, paypalRequest } from '@/lib/paypal'

export const metadata: Metadata = {
  title: '¡Gracias por tu compra!',
  robots: { index: false },
}

type Props = { searchParams: Promise<{ session_id?: string; paypal?: string; demo?: string }> }

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id, paypal, demo } = await searchParams
  let status: 'paid' | 'pending' | 'demo' | 'unknown' = 'unknown'
  let reference = ''
  let email = ''
  let method: 'stripe' | 'paypal' | 'demo' = 'demo'

  if (session_id && process.env.STRIPE_SECRET_KEY) {
    method = 'stripe'
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
      const session = await stripe.checkout.sessions.retrieve(session_id)
      status = session.payment_status === 'paid' || session.status === 'complete' ? 'paid' : 'pending'
      reference = session.id.slice(-10).toUpperCase()
      email = session.customer_details?.email ?? session.customer_email ?? ''
    } catch {
      status = 'unknown'
    }
  } else if (paypal && paypalConfigured() && /^[A-Z0-9]{5,40}$/.test(paypal)) {
    method = 'paypal'
    try {
      const { ok, data } = await paypalRequest(`/v2/checkout/orders/${paypal}`, undefined, 'GET')
      status = ok && data.status === 'COMPLETED' ? 'paid' : 'pending'
      reference = paypal.slice(-10)
      email = data?.payer?.email_address ?? ''
    } catch {
      status = 'unknown'
    }
  } else if (demo && !process.env.STRIPE_SECRET_KEY && !paypalConfigured()) {
    status = 'demo'
  }

  return <OrderConfirmation status={status} reference={reference} email={email} method={method} />
}
