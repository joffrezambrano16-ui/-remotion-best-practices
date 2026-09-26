'use client'

import { useState } from 'react'
import { CheckIcon } from '@/components/Icons'
import { useCart } from '@/lib/cart'
import { formatPrice, localized, localizedList, settings } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

export function ClubPlans() {
  const { lang, t } = useLang()
  const { add } = useCart()
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly')

  return (
    <div>
      <div className="mb-10 flex justify-center">
        <div role="radiogroup" aria-label={t('Frecuencia de entrega', 'Delivery frequency')} className="inline-flex rounded-full border border-sand-300 bg-white p-1">
          {(['weekly', 'monthly'] as const).map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={frequency === f}
              onClick={() => setFrequency(f)}
              className={`min-h-[44px] rounded-full px-6 font-bold transition ${frequency === f ? 'bg-leaf-600 text-white' : 'text-ink/70'}`}
            >
              {f === 'weekly' ? t('Semanal', 'Weekly') : t('Mensual', 'Monthly')}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid gap-6 md:grid-cols-3">
        {settings.club.plans.map((plan) => {
          const price = frequency === 'weekly' ? plan.weeklyPrice : plan.monthlyPrice
          return (
            <li key={plan.id} className={`card relative flex flex-col p-8 ${plan.popular ? 'ring-4 ring-mango-400' : ''}`}>
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-mango-400 px-4 py-1 text-sm font-bold text-ink">
                  {t('El favorito', 'Most loved')}
                </span>
              )}
              <h3 className="text-2xl font-bold text-leaf-900">{localized(plan, 'name', lang)}</h3>
              <p className="mt-2 text-ink/70">{localized(plan, 'description', lang)}</p>
              <p className="mt-6">
                <span className="font-display text-4xl font-bold text-leaf-700">{formatPrice(price)}</span>
                <span className="text-ink/60"> / {frequency === 'weekly' ? t('semana', 'week') : t('mes', 'month')}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2">
                {localizedList(plan, 'features', lang).map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckIcon width={20} height={20} className="mt-0.5 shrink-0 text-leaf-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <button type="button" className={`${plan.popular ? 'btn-primary' : 'btn-outline'} mt-8 w-full`} onClick={() => add({ kind: 'club', planId: plan.id, frequency })}>
                {t('Suscribirme', 'Subscribe')}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
