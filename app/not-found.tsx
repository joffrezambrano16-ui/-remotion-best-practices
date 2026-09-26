import Link from 'next/link'
import { T } from '@/lib/i18n'

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="font-display text-7xl font-bold text-coral-400">404</p>
      <h1 className="mt-4 text-3xl font-bold text-leaf-900">
        <T es="Esta fruta se fue de vacaciones" en="This fruit went on vacation" />
      </h1>
      <p className="mt-3 text-ink/70">
        <T es="No encontramos la página que buscas." en="We couldn't find the page you're looking for." />
      </p>
      <Link href="/tienda" className="btn-primary mt-8">
        <T es="Ir a la tienda" en="Go to shop" />
      </Link>
    </div>
  )
}
