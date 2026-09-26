'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CheckIcon } from '@/components/Icons'
import { saveOrder, takePendingOrder } from '@/lib/account'
import { useCart } from '@/lib/cart'
import { useLang } from '@/lib/i18n'

type Props = { status: 'paid' | 'pending' | 'demo' | 'unknown'; reference: string; email: string; method: 'stripe' | 'paypal' | 'demo' }

export function OrderConfirmation({ status, reference, email, method }: Props) {
  const { t } = useLang()
  const { clear, ready } = useCart()
  const [orderId, setOrderId] = useState(reference)

  useEffect(() => {
    if (!ready || (status !== 'paid' && status !== 'demo')) return
    const pending = takePendingOrder()
    const id = reference || `DEMO-${Date.now().toString(36).toUpperCase()}`
    setOrderId(id)
    if (pending) {
      saveOrder({ ...pending, id, date: new Date().toISOString(), status: status === 'demo' ? 'demo' : 'pagado', method })
    }
    clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  const ok = status === 'paid' || status === 'demo'

  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <span className={`flex h-20 w-20 items-center justify-center rounded-full ${ok ? 'bg-leaf-600 text-white' : 'bg-mango-400 text-ink'}`}>
        <CheckIcon width={40} height={40} />
      </span>
      <h1 className="mt-6 text-4xl font-bold text-leaf-900">
        {ok ? t('¡Gracias por tu compra! 🌴', 'Thank you for your order! 🌴') : t('Estamos confirmando tu pago', 'We are confirming your payment')}
      </h1>
      {ok ? (
        <p className="mt-4 max-w-lg text-lg text-ink/70">
          {t('Ya estamos seleccionando tu fruta.', "We're already picking your fruit.")}{' '}
          {email && t(`Te enviamos la confirmación a ${email}.`, `We sent the confirmation to ${email}.`)}
        </p>
      ) : (
        <p className="mt-4 max-w-lg text-lg text-ink/70">
          {t('Si el cargo se realizó, recibirás un correo de confirmación en unos minutos. Si tienes dudas, escríbenos por WhatsApp.', "If the charge went through, you'll receive a confirmation email in a few minutes. Questions? Message us on WhatsApp.")}
        </p>
      )}
      {orderId && ok && (
        <p className="mt-4 rounded-full bg-sand-200 px-4 py-2 font-semibold">
          {t('Pedido', 'Order')} #{orderId}
        </p>
      )}
      {status === 'demo' && (
        <p className="mt-4 max-w-md rounded-2xl bg-mango-100 p-4 text-sm">
          {t('Este fue un pedido de demostración: no se hizo ningún cobro. Configura Stripe o PayPal para vender de verdad.', 'This was a demo order: no charge was made. Set up Stripe or PayPal to sell for real.')}
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/cuenta" className="btn-outline">
          {t('Ver mis pedidos', 'View my orders')}
        </Link>
        <Link href="/tienda" className="btn-primary">
          {t('Seguir comprando', 'Keep shopping')}
        </Link>
      </div>
    </div>
  )
}
