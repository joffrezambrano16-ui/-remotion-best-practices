import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { ShopClient } from '@/components/ShopClient'

export const metadata: Metadata = {
  title: 'Tienda de frutas tropicales y exóticas',
  description: 'Compra mango, piña, pitahaya, mangostán, fruta deshidratada, jugos y combos. Filtra por categoría, precio y temporada.',
  alternates: { canonical: '/tienda' },
}

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow={{ es: 'Tienda', en: 'Shop' }}
        title={{ es: 'Toda la fruta de la isla', en: 'All the island’s fruit' }}
        intro={{ es: 'Frutas tropicales, exóticas, deshidratadas, jugos y combos. Seleccionadas a mano, todos los días.', en: 'Tropical, exotic and dried fruit, juices and bundles. Hand-picked every day.' }}
      />
      <Suspense fallback={<div className="container-page py-20 text-center text-ink/60">…</div>}>
        <ShopClient />
      </Suspense>
    </>
  )
}
