'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BagIcon, CloseIcon, MenuIcon, UserIcon } from '@/components/Icons'
import { Logo } from '@/components/Logo'
import { useCart } from '@/lib/cart'
import { localized, settings } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

const NAV = [
  { href: '/tienda', es: 'Tienda', en: 'Shop' },
  { href: '/cajas-regalo', es: 'Cajas de regalo', en: 'Gift boxes' },
  { href: '/club', es: 'Club FruitsIsland', en: 'FruitsIsland Club' },
  { href: '/nosotros', es: 'Nosotros', en: 'About us' },
]

export function LanguageToggle() {
  const { lang, setLang, t } = useLang()
  return (
    <div role="group" aria-label={t('Idioma', 'Language')} className="flex rounded-full border border-sand-300 bg-white p-0.5 text-xs font-bold">
      {(['es', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`min-h-[32px] min-w-[36px] rounded-full px-2 uppercase transition ${lang === l ? 'bg-leaf-600 text-white' : 'text-ink/70 hover:text-ink'}`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export function Header() {
  const { lang, t } = useLang()
  const { count, open, ready } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-40">
      <p className="bg-leaf-700 px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm">
        {localized(settings, 'announcement', lang)}
      </p>
      <div className="border-b border-sand-200 bg-sand-50/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-3 sm:h-20">
          <button
            type="button"
            className="-ml-2 rounded-full p-2 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label={t('Abrir menú', 'Open menu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <MenuIcon />
          </button>

          <Link href="/" aria-label="FruitsIsland — inicio" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label={t('Principal', 'Main')} className="hidden lg:block">
            <ul className="flex items-center gap-8 font-semibold">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`py-2 transition hover:text-leaf-600 ${pathname.startsWith(item.href) ? 'text-leaf-700 underline decoration-mango-400 decoration-4 underline-offset-8' : ''}`}
                  >
                    {lang === 'en' ? item.en : item.es}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            <Link href="/cuenta" className="rounded-full p-2 hover:bg-sand-200" aria-label={t('Mi cuenta', 'My account')}>
              <UserIcon />
            </Link>
            <button
              type="button"
              onClick={open}
              className="relative rounded-full p-2 hover:bg-sand-200"
              aria-label={t(`Abrir carrito, ${count} productos`, `Open cart, ${count} items`)}
            >
              <BagIcon />
              {ready && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-coral-400 px-1 text-xs font-bold text-ink">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" id="mobile-menu" role="dialog" aria-modal="true" aria-label={t('Menú', 'Menu')}>
          <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-sand-50 p-6 shadow-soft">
            <div className="mb-8 flex items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setMenuOpen(false)} className="rounded-full p-2" aria-label={t('Cerrar menú', 'Close menu')}>
                <CloseIcon />
              </button>
            </div>
            <nav aria-label={t('Menú móvil', 'Mobile menu')}>
              <ul className="space-y-1 text-lg font-bold">
                {[...NAV, { href: '/cuenta', es: 'Mi cuenta', en: 'My account' }, { href: '/preguntas-frecuentes', es: 'Preguntas frecuentes', en: 'FAQ' }, { href: '/contacto', es: 'Contacto', en: 'Contact' }].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block rounded-2xl px-3 py-3 hover:bg-sand-200">
                      {lang === 'en' ? item.en : item.es}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto pt-6">
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
