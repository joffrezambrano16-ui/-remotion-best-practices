import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon } from '@/components/PageIcons'
import { LeafIcon, TruckIcon } from '@/components/Icons'
import { PageHeader } from '@/components/PageHeader'
import { T } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce la historia de FruitsIsland: fruta tropical premium, seleccionada a mano y comprada directo a productores.',
  alternates: { canonical: '/nosotros' },
}

const values = [
  {
    Icon: LeafIcon,
    es: 'Directo del productor',
    en: 'Straight from the grower',
    des: 'Trabajamos con pequeños productores y pagamos precios justos. Menos intermediarios, fruta más fresca.',
    den: 'We work with small growers and pay fair prices. Fewer middlemen, fresher fruit.',
  },
  {
    Icon: HeartIcon,
    es: 'Seleccionada a mano',
    en: 'Hand-picked',
    des: 'Cada pieza pasa por nuestras manos antes de salir. Si no nos la comeríamos, no te la enviamos.',
    den: "Every piece passes through our hands before it ships. If we wouldn't eat it, we don't send it.",
  },
  {
    Icon: TruckIcon,
    es: 'Entrega cuidada',
    en: 'Careful delivery',
    des: 'Empaque reciclable y cadena de frío para que llegue como recién cortada.',
    den: 'Recyclable packaging and cold chain so it arrives as if freshly picked.',
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={{ es: 'Nosotros', en: 'About us' }}
        title={{ es: 'Nacimos con arena en los pies y mango en las manos', en: 'Born with sand on our feet and mango in our hands' }}
      />
      <section className="container-page grid items-center gap-10 py-12 lg:grid-cols-2">
        <div className="prose-fi text-lg">
          <p>
            <T
              es="FruitsIsland empezó con una idea sencilla: que la fruta tropical que se disfruta en la playa, recién cortada y en su punto, pudiera llegar a cualquier mesa."
              en="FruitsIsland started with a simple idea: that tropical fruit enjoyed on the beach, freshly cut and perfectly ripe, could reach any table."
            />
          </p>
          <p>
            <T
              es="Hoy recorremos fincas y mercados para elegir cada mango, cada piña y cada pitahaya. Compramos directo a productores que cuidan la tierra y cosechan en el momento justo."
              en="Today we visit farms and markets to choose every mango, pineapple and dragon fruit. We buy directly from growers who care for the land and harvest at the right moment."
            />
          </p>
          <p>
            <T
              es="Nuestra promesa es simple: fruta que sabe a vacaciones, entregada con cariño y sin complicaciones."
              en="Our promise is simple: fruit that tastes like vacation, delivered with care and without hassle."
            />
          </p>
          <Link href="/tienda" className="btn-primary mt-4">
            <T es="Probar la isla" en="Taste the island" />
          </Link>
        </div>
        <div className="relative aspect-[14/9] overflow-hidden rounded-4xl">
          <Image src="/images/hero.svg" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>
      <section aria-labelledby="valores" className="container-page py-12">
        <h2 id="valores" className="mb-8 text-3xl font-bold text-leaf-900">
          <T es="Lo que nos mueve" en="What drives us" />
        </h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {values.map(({ Icon, es, en, des, den }) => (
            <li key={es} className="card p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mango-100 text-leaf-600">
                <Icon />
              </span>
              <h3 className="mt-4 text-xl font-bold">
                <T es={es} en={en} />
              </h3>
              <p className="mt-2 text-ink/70">
                <T es={des} en={den} />
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
