import type { Metadata } from 'next'
import { ClubPlans } from '@/components/ClubPlans'
import { PageHeader } from '@/components/PageHeader'
import { T } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Club FruitsIsland · Suscripción de fruta tropical',
  description: 'Suscripción semanal o mensual de fruta tropical de temporada con envío incluido. Pausa o cancela cuando quieras.',
  alternates: { canonical: '/club' },
}

const steps = [
  { es: 'Elige tu plan', en: 'Pick your plan', des: 'Mini, Familiar o Exótico, semanal o mensual.', den: 'Mini, Family or Exotic, weekly or monthly.' },
  { es: 'Nosotros seleccionamos', en: 'We hand-pick', des: 'La mejor fruta de temporada, en su punto.', den: 'The best seasonal fruit, perfectly ripe.' },
  { es: 'Recibe y disfruta', en: 'Receive & enjoy', des: 'Envío incluido. Pausa o cancela cuando quieras.', den: 'Shipping included. Pause or cancel anytime.' },
]

export default function ClubPage() {
  return (
    <>
      <PageHeader
        eyebrow={{ es: 'Club FruitsIsland', en: 'FruitsIsland Club' }}
        title={{ es: 'La isla en tu puerta, sin pensarlo', en: 'The island at your door, no thinking required' }}
        intro={{
          es: 'Una caja de fruta tropical de temporada cada semana o cada mes. Siempre fresca, siempre sorprendente.',
          en: 'A box of seasonal tropical fruit every week or every month. Always fresh, always surprising.',
        }}
      />
      <section aria-label="Cómo funciona" className="container-page py-12">
        <ol className="grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.es} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mango-400 font-display text-xl font-bold">{i + 1}</span>
              <span>
                <span className="block font-display text-lg font-bold">
                  <T es={s.es} en={s.en} />
                </span>
                <span className="text-ink/70">
                  <T es={s.des} en={s.den} />
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section aria-labelledby="planes" className="container-page py-8">
        <h2 id="planes" className="mb-8 text-center text-3xl font-bold text-leaf-900 sm:text-4xl">
          <T es="Elige tu plan" en="Choose your plan" />
        </h2>
        <ClubPlans />
        <p className="mt-10 text-center text-sm text-ink/60">
          <T
            es="El cobro se renueva automáticamente con tarjeta. Puedes pausar o cancelar desde el enlace de tu correo de confirmación o escribiéndonos."
            en="Billing renews automatically by card. You can pause or cancel from the link in your confirmation email or by contacting us."
          />
        </p>
      </section>
    </>
  )
}
