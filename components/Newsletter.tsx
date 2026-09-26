'use client'

import { useState, type FormEvent } from 'react'
import { settings } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

// Si configuras "forms.newsletterAction" en data/settings.json (por ejemplo una URL
// de Formspree o Mailchimp), los correos se envían ahí. Si está vacío, solo se
// muestra el mensaje de confirmación.
export function Newsletter({ compact = false }: { compact?: boolean }) {
  const { t } = useLang()
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const action = settings.forms.newsletterAction
    setStatus('sending')
    try {
      if (action) {
        const res = await fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        if (!res.ok) throw new Error()
      }
      setStatus('done')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p role="status" className={`rounded-2xl p-4 font-semibold ${compact ? 'bg-white/10 text-white' : 'bg-leaf-50 text-leaf-700'}`}>
        {t('¡Listo! Ya eres parte de la isla 🌴 Revisa tu correo.', "You're in! Welcome to the island 🌴 Check your inbox.")}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row" aria-label="Newsletter">
      <label htmlFor={compact ? 'nl-footer' : 'nl-main'} className="sr-only">
        {t('Correo electrónico', 'Email address')}
      </label>
      <input
        id={compact ? 'nl-footer' : 'nl-main'}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder={t('tu@correo.com', 'you@email.com')}
        className="input flex-1"
      />
      <button type="submit" className="btn-secondary shrink-0" disabled={status === 'sending'}>
        {t('Suscribirme', 'Subscribe')}
      </button>
      {status === 'error' && (
        <p role="alert" className="text-sm text-coral-300">
          {t('Algo salió mal, intenta de nuevo.', 'Something went wrong, please try again.')}
        </p>
      )}
    </form>
  )
}
