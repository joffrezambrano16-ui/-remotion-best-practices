'use client'

import { useState, type FormEvent } from 'react'
import { settings } from '@/lib/catalog'
import { useLang } from '@/lib/i18n'

// Si configuras "forms.contactAction" en data/settings.json (ej. una URL de Formspree),
// los mensajes llegan a tu correo. Si está vacío, se abre el programa de correo del cliente.
export function ContactForm() {
  const { t } = useLang()
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const action = settings.forms.contactAction
    if (!action) {
      const subject = encodeURIComponent(`Contacto FruitsIsland — ${data.get('name')}`)
      const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')} · ${data.get('email')}`)
      window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error()
      setStatus('done')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p role="status" className="rounded-3xl bg-leaf-50 p-6 text-lg font-semibold text-leaf-700">
        {t('¡Gracias! Te responderemos muy pronto 🌴', 'Thanks! We will get back to you very soon 🌴')}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 sm:p-8">
      <div>
        <label htmlFor="c-name" className="label">
          {t('Nombre', 'Name')}
        </label>
        <input id="c-name" name="name" required autoComplete="name" className="input" />
      </div>
      <div>
        <label htmlFor="c-email" className="label">
          {t('Correo electrónico', 'Email')}
        </label>
        <input id="c-email" name="email" type="email" required autoComplete="email" className="input" />
      </div>
      <div>
        <label htmlFor="c-message" className="label">
          {t('¿En qué te ayudamos?', 'How can we help?')}
        </label>
        <textarea id="c-message" name="message" rows={5} required className="input" />
      </div>
      {status === 'error' && (
        <p role="alert" className="text-coral-700">
          {t('No pudimos enviar tu mensaje. Intenta por WhatsApp.', 'We could not send your message. Try WhatsApp.')}
        </p>
      )}
      <button type="submit" className="btn-primary w-full" disabled={status === 'sending'}>
        {t('Enviar mensaje', 'Send message')}
      </button>
    </form>
  )
}
