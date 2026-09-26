'use client'

import { WhatsAppIcon } from '@/components/Icons'
import { localized, settings } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

export function whatsappLink(message: string) {
  return `https://wa.me/${settings.whatsapp.number}?text=${encodeURIComponent(message)}`
}

export function WhatsAppButton() {
  const { lang, t } = useLang()
  return (
    <a
      href={whatsappLink(localized(settings.whatsapp, 'message', lang))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('Escríbenos por WhatsApp', 'Chat with us on WhatsApp')}
      className="fixed bottom-4 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1FA855] text-white shadow-soft transition hover:scale-105 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon />
    </a>
  )
}
