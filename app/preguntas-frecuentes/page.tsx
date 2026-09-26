import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { faqs } from '@/lib/faq'
import { T } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description: 'Resolvemos tus dudas sobre envíos, frescura, regalos, el Club FruitsIsland y métodos de pago.',
  alternates: { canonical: '/preguntas-frecuentes' },
}

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader eyebrow={{ es: 'Ayuda', en: 'Help' }} title={{ es: 'Preguntas frecuentes', en: 'Frequently asked questions' }} />
      <section className="container-page max-w-3xl py-12">
        <ul className="space-y-3">
          {faqs.map((f) => (
            <li key={f.q}>
              <details className="group rounded-3xl bg-white p-5 shadow-soft open:ring-2 open:ring-leaf-100">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                  <T es={f.q} en={f.q_en} />
                  <span aria-hidden className="text-2xl text-leaf-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink/75">
                  <T es={f.a} en={f.a_en} />
                </p>
              </details>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-ink/70">
          <T es="¿No encontraste tu respuesta?" en="Didn't find your answer?" />{' '}
          <Link href="/contacto" className="font-bold text-leaf-700 underline">
            <T es="Escríbenos" en="Contact us" />
          </Link>
        </p>
      </section>
    </>
  )
}
