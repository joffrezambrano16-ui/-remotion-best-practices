import type { Metadata } from 'next'
import { CheckoutClient } from '@/components/CheckoutClient'
import { paypalConfigured } from '@/lib/paypal'

export const metadata: Metadata = {
  title: 'Finalizar compra',
  robots: { index: false },
}

export default function CheckoutPage() {
  return (
    <CheckoutClient
      payments={{
        stripe: Boolean(process.env.STRIPE_SECRET_KEY),
        paypalClientId: paypalConfigured() ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? null : null,
      }}
    />
  )
}
