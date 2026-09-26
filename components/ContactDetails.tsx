'use client'

import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/Icons'
import { whatsappLink } from '@/components/WhatsAppButton'
import { localized, settings } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

export function ContactDetails() {
  const { lang, t } = useLang()
  const items = [
    { Icon: WhatsAppIcon, label: 'WhatsApp', value: t('Respuesta en minutos', 'Replies within minutes'), href: whatsappLink(localized(settings.whatsapp, 'message', lang)) },
    { Icon: MailIcon, label: t('Correo', 'Email'), value: settings.email, href: `mailto:${settings.email}` },
    { Icon: PhoneIcon, label: t('Teléfono', 'Phone'), value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, '')}` },
    { Icon: PinIcon, label: t('Tienda y recogidas', 'Store & pickup'), value: `${settings.address} · ${localized(settings, 'hours', lang)}` },
  ]
  return (
    <ul className="space-y-4">
      {items.map(({ Icon, label, value, href }) => (
        <li key={label} className="flex items-start gap-4 rounded-3xl bg-white p-5 shadow-soft">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
            <Icon width={24} height={24} />
          </span>
          <span>
            <span className="block font-bold">{label}</span>
            {href ? (
              <a href={href} className="text-leaf-700 underline" target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                {value}
              </a>
            ) : (
              <span className="text-ink/70">{value}</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}
