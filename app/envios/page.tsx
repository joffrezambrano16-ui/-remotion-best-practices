import type { Metadata } from 'next'
import { ShippingCalculator } from '@/components/CartExtras'
import { PageHeader } from '@/components/PageHeader'
import { ShippingZonesTable } from '@/components/ShippingZonesTable'
import { T } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Política de envíos',
  description: 'Zonas, costos y tiempos de entrega de FruitsIsland. Envío refrigerado y gratis a partir de cierto monto.',
  alternates: { canonical: '/envios' },
}

export default function ShippingPage() {
  return (
    <>
      <PageHeader eyebrow={{ es: 'Políticas', en: 'Policies' }} title={{ es: 'Envíos', en: 'Shipping' }} intro={{ es: 'Así llevamos la isla hasta tu puerta.', en: 'This is how we bring the island to your door.' }} />
      <section className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <div className="prose-fi">
          <ShippingZonesTable />
          <h2><T es="¿Cómo empacamos?" en="How do we pack?" /></h2>
          <p><T es="Usamos cajas recicladas con separadores y geles refrigerantes para mantener la cadena de frío. Las frutas delicadas viajan en protectores individuales." en="We use recycled boxes with dividers and cooling gels to keep the cold chain. Delicate fruit travels in individual protectors." /></p>
          <h2><T es="Horarios y días de entrega" en="Delivery days and times" /></h2>
          <ul>
            <li><T es="Entregamos de lunes a sábado." en="We deliver Monday through Saturday." /></li>
            <li><T es="Pedidos en la Zona 1 antes de las 12:00 se entregan el mismo día." en="Zone 1 orders placed before noon are delivered the same day." /></li>
            <li><T es="Puedes elegir una fecha de entrega preferida al finalizar la compra." en="You can pick a preferred delivery date at checkout." /></li>
          </ul>
          <h2><T es="Si no hay nadie en casa" en="If nobody is home" /></h2>
          <p><T es="Te contactaremos por WhatsApp. Si no es posible entregar, reprogramamos una vez sin costo. La fruta es perecedera: te pedimos que alguien pueda recibirla." en="We will contact you on WhatsApp. If delivery isn't possible, we reschedule once free of charge. Fruit is perishable, so please make sure someone can receive it." /></p>
          <h2><T es="Suscripciones del Club" en="Club subscriptions" /></h2>
          <p><T es="El envío de las cajas del Club FruitsIsland siempre está incluido en el precio." en="Shipping for FruitsIsland Club boxes is always included in the price." /></p>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <ShippingCalculator />
        </aside>
      </section>
    </>
  )
}
