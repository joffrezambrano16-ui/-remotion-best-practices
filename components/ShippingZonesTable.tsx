'use client'

import { formatPrice, localized, settings } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

export function ShippingZonesTable() {
  const { lang, t } = useLang()
  return (
    <div className="overflow-x-auto rounded-3xl bg-white shadow-soft">
      <table className="w-full min-w-[520px] text-left">
        <caption className="sr-only">{t('Tarifas de envío por zona', 'Shipping rates by zone')}</caption>
        <thead className="bg-leaf-50 text-sm">
          <tr>
            <th scope="col" className="p-4">{t('Zona', 'Zone')}</th>
            <th scope="col" className="p-4">{t('Costo', 'Cost')}</th>
            <th scope="col" className="p-4">{t('Gratis desde', 'Free over')}</th>
            <th scope="col" className="p-4">{t('Tiempo de entrega', 'Delivery time')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sand-200">
          {settings.shippingZones.map((z) => (
            <tr key={z.id}>
              <th scope="row" className="p-4 font-bold">{localized(z, 'name', lang)}</th>
              <td className="p-4">{z.price === 0 ? t('Gratis', 'Free') : formatPrice(z.price)}</td>
              <td className="p-4">{z.freeFrom > 0 ? formatPrice(z.freeFrom) : '—'}</td>
              <td className="p-4 text-ink/70">{localized(z, 'eta', lang)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
