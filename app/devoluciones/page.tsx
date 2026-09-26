import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { T } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Devoluciones y garantía de frescura',
  description: 'Si tu fruta llega en mal estado la reponemos o te devolvemos el dinero. Conoce nuestra política de devoluciones.',
  alternates: { canonical: '/devoluciones' },
}

export default function ReturnsPage() {
  return (
    <>
      <PageHeader eyebrow={{ es: 'Políticas', en: 'Policies' }} title={{ es: 'Devoluciones y garantía de frescura', en: 'Returns & freshness guarantee' }} />
      <section className="container-page max-w-3xl py-12 prose-fi">
        <p><T es="Queremos que cada caja te haga sonreír. Como la fruta es un producto perecedero, nuestra política funciona un poco distinto a la de otras tiendas:" en="We want every box to make you smile. Since fruit is perishable, our policy works a bit differently from other stores:" /></p>
        <h2><T es="Garantía de frescura (48 horas)" en="Freshness guarantee (48 hours)" /></h2>
        <ul>
          <li><T es="Si alguna fruta llega dañada, golpeada o en mal estado, envíanos una foto por WhatsApp o correo dentro de las 48 horas siguientes a la entrega." en="If any fruit arrives damaged, bruised or spoiled, send us a photo via WhatsApp or email within 48 hours of delivery." /></li>
          <li><T es="Te ofrecemos reponer el producto en tu siguiente entrega o devolverte el importe de esa fruta, como prefieras." en="We will replace the product in your next delivery or refund that fruit's amount, whichever you prefer." /></li>
          <li><T es="No necesitas devolver la fruta." en="You don't need to return the fruit." /></li>
        </ul>
        <h2><T es="Productos que no se pueden devolver" en="Non-returnable items" /></h2>
        <p><T es="Por higiene y seguridad, no aceptamos devoluciones de fruta en buen estado, jugos abiertos ni productos deshidratados abiertos." en="For hygiene and safety reasons, we don't accept returns of fruit in good condition, opened juices or opened dried products." /></p>
        <h2><T es="Cancelaciones" en="Cancellations" /></h2>
        <ul>
          <li><T es="Puedes cancelar un pedido sin costo antes de que sea preparado (normalmente hasta 2 horas después de comprar)." en="You can cancel an order free of charge before it's prepared (usually up to 2 hours after purchase)." /></li>
          <li><T es="Las suscripciones del Club se pueden pausar o cancelar en cualquier momento antes del siguiente cobro." en="Club subscriptions can be paused or cancelled anytime before the next charge." /></li>
        </ul>
        <h2><T es="Reembolsos" en="Refunds" /></h2>
        <p><T es="Los reembolsos se hacen al mismo método de pago (tarjeta o PayPal) y pueden tardar de 5 a 10 días hábiles en reflejarse, según tu banco." en="Refunds go back to the original payment method (card or PayPal) and may take 5–10 business days to appear, depending on your bank." /></p>
      </section>
    </>
  )
}
