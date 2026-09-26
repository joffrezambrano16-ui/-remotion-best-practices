import type { Metadata, Viewport } from 'next'
import { Fredoka, Nunito } from 'next/font/google'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Providers } from '@/components/Providers'
import { settings } from '@/lib/catalog'
import './globals.css'

const display = Fredoka({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700'], display: 'swap' })
const body = Nunito({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || settings.siteUrl

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FruitsIsland · Fruta tropical premium a domicilio',
    template: '%s · FruitsIsland',
  },
  description:
    'Frutas tropicales y exóticas seleccionadas a mano, cajas de regalo y suscripción de fruta fresca. Envío refrigerado a tu puerta.',
  keywords: ['frutas tropicales', 'frutas exóticas', 'cajas de regalo de fruta', 'suscripción de fruta', 'mango', 'pitahaya', 'FruitsIsland'],
  openGraph: {
    type: 'website',
    siteName: 'FruitsIsland',
    locale: 'es_ES',
    alternateLocale: ['en_US'],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  themeColor: '#2F8F4E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <a href="#contenido" className="sr-only z-50 rounded-full bg-leaf-600 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
            Saltar al contenido
          </a>
          <Header />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
