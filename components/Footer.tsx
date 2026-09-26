import Link from 'next/link'
import { FacebookIcon, InstagramIcon, TikTokIcon } from '@/components/Icons'
import { Logo } from '@/components/Logo'
import { Newsletter } from '@/components/Newsletter'
import { settings } from '@/lib/catalog'
import { T } from '@/lib/i18n'

const columns = [
  {
    title: { es: 'Comprar', en: 'Shop' },
    links: [
      { href: '/tienda', es: 'Toda la fruta', en: 'All fruit' },
      { href: '/tienda?categoria=exoticas', es: 'Frutas exóticas', en: 'Exotic fruit' },
      { href: '/cajas-regalo', es: 'Cajas de regalo', en: 'Gift boxes' },
      { href: '/club', es: 'Club FruitsIsland', en: 'FruitsIsland Club' },
    ],
  },
  {
    title: { es: 'Ayuda', en: 'Help' },
    links: [
      { href: '/preguntas-frecuentes', es: 'Preguntas frecuentes', en: 'FAQ' },
      { href: '/envios', es: 'Envíos', en: 'Shipping' },
      { href: '/devoluciones', es: 'Devoluciones', en: 'Returns' },
      { href: '/contacto', es: 'Contacto', en: 'Contact' },
    ],
  },
  {
    title: { es: 'FruitsIsland', en: 'FruitsIsland' },
    links: [
      { href: '/nosotros', es: 'Nuestra historia', en: 'Our story' },
      { href: '/cuenta', es: 'Mi cuenta', en: 'My account' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-24 bg-leaf-900 text-sand-100">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <div className="inline-block rounded-2xl bg-sand-50 px-4 py-2">
            <Logo />
          </div>
          <p className="mt-4 max-w-sm text-sand-100/80">
            <T
              es="Fruta tropical premium, seleccionada a mano y entregada fresca a tu puerta."
              en="Premium tropical fruit, hand-picked and delivered fresh to your door."
            />
          </p>
          <div className="mt-6 max-w-md">
            <Newsletter compact />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title.es}>
              <h2 className="font-display text-lg font-bold text-mango-300">
                <T {...col.title} />
              </h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sand-100/80 hover:text-white">
                      <T es={l.es} en={l.en} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-sm text-sand-100/70 sm:flex-row">
          <p>
            © {new Date().getFullYear()} FruitsIsland. <T es="Todos los derechos reservados." en="All rights reserved." />
          </p>
          <div className="flex gap-2">
            {[
              { href: settings.social.instagram, label: 'Instagram', Icon: InstagramIcon },
              { href: settings.social.facebook, label: 'Facebook', Icon: FacebookIcon },
              { href: settings.social.tiktok, label: 'TikTok', Icon: TikTokIcon },
            ].map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="rounded-full p-2 hover:bg-white/10">
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
