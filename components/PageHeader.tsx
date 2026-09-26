import type { ReactNode } from 'react'
import { T } from '@/lib/i18n'

type Bilingual = { es: string; en: string }

export function PageHeader({ eyebrow, title, intro, children }: { eyebrow?: Bilingual; title: Bilingual; intro?: Bilingual; children?: ReactNode }) {
  return (
    <section className="bg-gradient-to-b from-mango-100 to-sand-50">
      <div className="container-page py-12 sm:py-16">
        {eyebrow && (
          <p className="eyebrow">
            <T {...eyebrow} />
          </p>
        )}
        <h1 className="mt-2 max-w-3xl text-4xl font-bold text-leaf-900 sm:text-5xl">
          <T {...title} />
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-lg text-ink/70">
            <T {...intro} />
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
