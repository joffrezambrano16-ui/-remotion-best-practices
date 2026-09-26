import type { Metadata } from 'next'
import { AccountClient } from '@/components/AccountClient'
import { PageHeader } from '@/components/PageHeader'

export const metadata: Metadata = {
  title: 'Mi cuenta',
  robots: { index: false },
}

export default function AccountPage() {
  return (
    <>
      <PageHeader eyebrow={{ es: 'Mi cuenta', en: 'My account' }} title={{ es: 'Hola de nuevo 🌴', en: 'Welcome back 🌴' }} intro={{ es: 'Tus pedidos, direcciones y suscripción en un solo lugar.', en: 'Your orders, addresses and subscription in one place.' }} />
      <AccountClient />
    </>
  )
}
