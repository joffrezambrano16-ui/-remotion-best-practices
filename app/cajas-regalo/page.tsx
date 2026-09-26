import type { Metadata } from 'next'
import { BoxBuilder } from '@/components/BoxBuilder'
import { GiftIcon } from '@/components/Icons'
import { PageHeader } from '@/components/PageHeader'
import { ProductGrid } from '@/components/ProductCard'
import { visibleProducts } from '@/lib/catalog'
import { T } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Cajas de regalo de fruta tropical',
  description: 'Cajas de regalo armadas con fruta tropical y exótica, o arma tu propia caja. Incluye tarjeta con mensaje personalizado.',
  alternates: { canonical: '/cajas-regalo' },
}

export default function GiftBoxesPage() {
  const boxes = visibleProducts()
    .filter((p) => p.category === 'cajas-regalo')
    .sort((a, b) => b.popularity - a.popularity)

  return (
    <>
      <PageHeader
        eyebrow={{ es: 'Cajas de regalo', en: 'Gift boxes' }}
        title={{ es: 'Regala un pedacito de paraíso', en: 'Give a little piece of paradise' }}
        intro={{
          es: 'Cajas listas para sorprender o arma la tuya fruta por fruta. Todas incluyen tarjeta con tu mensaje y empaque sin precios.',
          en: 'Ready-made boxes to surprise, or build your own fruit by fruit. All include a card with your message and price-free packaging.',
        }}
      >
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-soft">
          <GiftIcon width={18} height={18} className="text-coral-400" />
          <T es="Escribe tu mensaje de regalo al finalizar la compra" en="Write your gift message at checkout" />
        </p>
      </PageHeader>

      <section aria-labelledby="cajas-armadas" className="container-page py-12">
        <h2 id="cajas-armadas" className="mb-8 text-3xl font-bold text-leaf-900">
          <T es="Cajas armadas" en="Curated boxes" />
        </h2>
        <ProductGrid products={boxes} priorityCount={4} />
      </section>

      <section id="arma-tu-caja" aria-labelledby="arma-titulo" className="scroll-mt-28 bg-leaf-50 py-16">
        <div className="container-page">
          <p className="eyebrow">
            <T es="A tu gusto" en="Your way" />
          </p>
          <h2 id="arma-titulo" className="mt-2 text-3xl font-bold text-leaf-900 sm:text-4xl">
            <T es="Arma tu propia caja" en="Build your own box" />
          </h2>
          <p className="mb-10 mt-3 max-w-2xl text-ink/70">
            <T
              es="Elige el tamaño, llena cada espacio con la fruta que quieras y nosotros la empacamos con cariño (y con tu tarjeta)."
              en="Pick a size, fill each slot with the fruit you want, and we’ll pack it with care (and your card)."
            />
          </p>
          <BoxBuilder />
        </div>
      </section>
    </>
  )
}
