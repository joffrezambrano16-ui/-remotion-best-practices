'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Lang } from '@/lib/catalog'

type LangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Elige el texto según el idioma activo: t('Hola', 'Hello') */
  t: (es: string, en: string) => string
}

const LangContext = createContext<LangContextValue>({ lang: 'es', setLang: () => {}, t: (es) => es })

const STORAGE_KEY = 'fi-lang'

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'es') setLangState(saved)
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }, [])

  const t = useCallback((es: string, en: string) => (lang === 'en' ? en : es), [lang])

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

/** Texto bilingüe para usar dentro de páginas: <T es="Tienda" en="Shop" /> */
export function T({ es, en }: { es: string; en: string }) {
  const { lang } = useLang()
  return <>{lang === 'en' ? en : es}</>
}
