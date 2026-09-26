'use client'

import Image from 'next/image'
import Link from 'next/link'
import { localized, settings } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

const tileColors = ['bg-mango-100', 'bg-leaf-100', 'bg-coral-100', 'bg-sand-200', 'bg-mango-100', 'bg-leaf-100']

export function CategoryTiles() {
  const { lang } = useLang()
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {settings.categories.map((c, i) => (
        <li key={c.id}>
          <Link
            href={c.id === 'cajas-regalo' ? '/cajas-regalo' : `/tienda?categoria=${c.id}`}
            className={`group flex flex-col items-center rounded-4xl ${tileColors[i % tileColors.length]} p-4 text-center transition hover:-translate-y-1 hover:shadow-soft`}
          >
            <span className="relative aspect-square w-full overflow-hidden rounded-3xl">
              <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 16vw, 45vw" className="object-cover transition duration-500 group-hover:scale-105" />
            </span>
            <span className="mt-3 font-display font-bold leading-tight">{localized(c, 'name', lang)}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
