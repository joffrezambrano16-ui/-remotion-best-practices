import Image from 'next/image'
import Link from 'next/link'
import { CategoryTiles } from '@/components/CategoryTiles'
import { ArrowRightIcon, GiftIcon, LeafIcon, RefreshIcon, ShieldIcon, TruckIcon } from '@/components/Icons'
import { Newsletter } from '@/components/Newsletter'
import { ProductGrid } from '@/components/ProductCard'
import { Testimonials } from '@/components/Testimonials'
import { bestsellers, formatPrice, settings } from '@/lib/catalog'
import { T } from '@/lib/i18n'

export default function HomePage() {
  const top = bestsellers(8)
  const clubFrom = Math.min(...settings.club.plans.map((p) => p.weeklyPrice))
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || settings.siteUrl

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'FruitsIsland',
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    email: settings.email,
    telephone: settings.phone,
    address: settings.address,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      {/* Banner principal */}
      <section className="relative overflow-hidden bg-gradient-to-br from-mango-100 via-coral-100 to-leaf-50">
        <div className="container-page grid items-center gap-8 pb-10 pt-10 lg:grid-cols-2 lg:gap-4 lg:py-20">
          <div className="relative z-10 text-center lg:text-left">
            <p className="eyebrow">
              <T es="Fruta tropical premium · Seleccionada a mano" en="Premium tropical fruit · Hand-picked" />
            </p>
            <h1 className="mt-4 text-5xl font-bold leading-[1.05] text-leaf-900 sm:text-6xl lg:text-7xl">
              <T es="La isla llega a tu mesa" en="The island comes to your table" />
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink/75 sm:text-xl lg:mx-0">
              <T
                es="Mangos, piñas, pitahayas y más, cosechados en su punto y entregados frescos a tu puerta. Sol, dulzura y cero complicaciones."
                en="Mangoes, pineapples, dragon fruit and more — harvested at their peak and delivered fresh to your door. Sunshine, sweetness, zero hassle."
              />
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/tienda" className="btn-primary px-8">
                <T es="Comprar fruta" en="Shop fruit" />
                <ArrowRightIcon width={18} height={18} />
              </Link>
              <Link href="/cajas-regalo" className="btn-secondary px-8">
                <GiftIcon width={18} height={18} />
                <T es="Regalar una caja" en="Send a gift box" />
              </Link>
            </div>
          </div>
          <div className="relative -mx-4 aspect-[14/9] sm:mx-0 lg:-mr-24">
            <Image src="/images/hero.svg" alt="Piña, mango, pitahaya, papaya y maracuyá frescos" fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-contain" />
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section aria-label="Beneficios" className="border-y border-sand-200 bg-white">
        <ul className="container-page grid grid-cols-2 gap-6 py-8 text-sm lg:grid-cols-4">
          {[
            { Icon: LeafIcon, es: 'Seleccionada a mano', en: 'Hand-picked', des: 'Solo la fruta en su punto', den: 'Only perfectly ripe fruit' },
            { Icon: TruckIcon, es: 'Envío refrigerado', en: 'Refrigerated delivery', des: 'Mismo día en zona local', den: 'Same day in local zone' },
            { Icon: ShieldIcon, es: 'Garantía de frescura', en: 'Freshness guarantee', des: 'Si algo llega mal, lo reponemos', den: 'Anything damaged, we replace it' },
            { Icon: RefreshIcon, es: 'Club flexible', en: 'Flexible club', des: 'Pausa o cancela cuando quieras', den: 'Pause or cancel anytime' },
          ].map(({ Icon, es, en, des, den }) => (
            <li key={es} className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
                <Icon />
              </span>
              <span>
                <span className="block font-bold">
                  <T es={es} en={en} />
                </span>
                <span className="text-ink/60">
                  <T es={des} en={den} />
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Categorías */}
      <section aria-labelledby="categorias" className="container-page py-16 sm:py-20">
        <h2 id="categorias" className="text-3xl font-bold text-leaf-900 sm:text-4xl">
          <T es="Explora la isla" en="Explore the island" />
        </h2>
        <p className="mt-2 text-ink/70">
          <T es="Encuentra tu fruta favorita o descubre una nueva." en="Find your favorite fruit or discover a new one." />
        </p>
        <div className="mt-8">
          <CategoryTiles />
        </div>
      </section>

      {/* Más vendidos */}
      <section aria-labelledby="mas-vendidos" className="container-page pb-16 sm:pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              <T es="Favoritos de la isla" en="Island favorites" />
            </p>
            <h2 id="mas-vendidos" className="mt-2 text-3xl font-bold text-leaf-900 sm:text-4xl">
              <T es="Los más vendidos" en="Bestsellers" />
            </h2>
          </div>
          <Link href="/tienda" className="hidden shrink-0 font-bold text-leaf-700 underline-offset-4 hover:underline sm:inline-flex">
            <T es="Ver toda la tienda →" en="View all →" />
          </Link>
        </div>
        <ProductGrid products={top} />
        <Link href="/tienda" className="btn-outline mt-10 w-full sm:hidden">
          <T es="Ver toda la tienda" en="View all" />
        </Link>
      </section>

      {/* Club */}
      <section aria-labelledby="club-home" className="container-page">
        <div className="grid items-center overflow-hidden rounded-4xl bg-leaf-700 text-white lg:grid-cols-2">
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="text-sm font-bold uppercase tracking-widest text-mango-300">Club FruitsIsland</p>
            <h2 id="club-home" className="mt-3 text-3xl font-bold sm:text-5xl">
              <T es="Tu dosis de paraíso, cada semana" en="Your dose of paradise, every week" />
            </h2>
            <p className="mt-4 max-w-md text-lg text-white/85">
              <T
                es="Recibe una caja de fruta de temporada en tu puerta, semanal o mensual. Envío incluido y cancelas cuando quieras."
                en="Get a box of seasonal fruit at your door, weekly or monthly. Shipping included, cancel anytime."
              />
            </p>
            <p className="mt-6 font-display text-2xl font-bold text-mango-300">
              <T es="Desde" en="From" /> {formatPrice(clubFrom)} <span className="text-base font-semibold text-white/80">/ <T es="semana" en="week" /></span>
            </p>
            <Link href="/club" className="btn-secondary mt-8">
              <T es="Conoce los planes" en="See the plans" />
              <ArrowRightIcon width={18} height={18} />
            </Link>
          </div>
          <div className="relative aspect-square lg:aspect-auto lg:h-full lg:min-h-[480px]">
            <Image src={settings.club.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Cajas de regalo */}
      <section aria-labelledby="regalos-home" className="container-page py-16 sm:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/cajas-regalo" className="group relative overflow-hidden rounded-4xl bg-coral-100 p-8 sm:p-10">
            <p className="eyebrow">
              <T es="Cajas de regalo" en="Gift boxes" />
            </p>
            <h2 id="regalos-home" className="mt-2 max-w-xs text-3xl font-bold text-leaf-900">
              <T es="Regala algo que de verdad se disfruta" en="Give a gift they’ll truly enjoy" />
            </h2>
            <p className="mt-3 max-w-xs text-ink/70">
              <T es="Con tarjeta y mensaje personalizado." en="With a card and personal message." />
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-leaf-700">
              <T es="Ver cajas" en="See boxes" /> <ArrowRightIcon width={18} height={18} />
            </span>
            <div className="relative mt-4 aspect-[4/3] sm:absolute sm:bottom-0 sm:right-0 sm:mt-0 sm:w-1/2">
              <Image src="/images/products/caja-paraiso-1.svg" alt="" fill sizes="(min-width: 640px) 25vw, 90vw" className="object-contain transition duration-500 group-hover:scale-105" />
            </div>
          </Link>
          <Link href="/cajas-regalo#arma-tu-caja" className="group relative overflow-hidden rounded-4xl bg-leaf-100 p-8 sm:p-10">
            <p className="eyebrow">
              <T es="A tu gusto" en="Your way" />
            </p>
            <h2 className="mt-2 max-w-xs text-3xl font-bold text-leaf-900">
              <T es="Arma tu propia caja" en="Build your own box" />
            </h2>
            <p className="mt-3 max-w-xs text-ink/70">
              <T es="Elige el tamaño y llénala con tus frutas favoritas." en="Pick a size and fill it with your favorite fruit." />
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-leaf-700">
              <T es="Empezar" en="Start" /> <ArrowRightIcon width={18} height={18} />
            </span>
            <div className="relative mt-4 aspect-[4/3] sm:absolute sm:bottom-0 sm:right-0 sm:mt-0 sm:w-1/2">
              <Image src={settings.boxBuilder.image} alt="" fill sizes="(min-width: 640px) 25vw, 90vw" className="object-contain transition duration-500 group-hover:scale-105" />
            </div>
          </Link>
        </div>
      </section>

      <Testimonials />

      {/* Newsletter */}
      <section aria-labelledby="newsletter" className="container-page">
        <div className="rounded-4xl bg-mango-100 px-6 py-12 text-center sm:px-12">
          <h2 id="newsletter" className="text-3xl font-bold text-leaf-900 sm:text-4xl">
            <T es="Únete a la isla" en="Join the island" />
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ink/70">
            <T
              es="Recibe primero las frutas de temporada, recetas y promociones exclusivas. Sin spam, prometido."
              en="Be the first to hear about seasonal fruit, recipes and exclusive deals. No spam, promise."
            />
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  )
}
