'use client'

import type { ReactNode } from 'react'
import { CartDrawer } from '@/components/CartDrawer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { CartProvider } from '@/lib/cart'
import { LangProvider } from '@/lib/i18n'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <WhatsAppButton />
      </CartProvider>
    </LangProvider>
  )
}
