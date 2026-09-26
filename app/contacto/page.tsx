import type { Metadata } from 'next'
import { ContactDetails } from '@/components/ContactDetails'
import { ContactForm } from '@/components/ContactForm'
import { PageHeader } from '@/components/PageHeader'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Escríbenos por WhatsApp, correo o teléfono. Pedidos especiales, empresas y eventos.',
  alternates: { canonical: '/contacto' },
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow={{ es: 'Contacto', en: 'Contact' }}
        title={{ es: 'Hablemos de fruta', en: "Let's talk fruit" }}
        intro={{ es: 'Dudas, pedidos especiales, empresas o eventos: estamos para ayudarte.', en: 'Questions, special orders, companies or events: we are here to help.' }}
      />
      <section className="container-page grid gap-10 py-12 lg:grid-cols-2">
        <ContactDetails />
        <ContactForm />
      </section>
    </>
  )
}
