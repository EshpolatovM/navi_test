import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { LANGS, translate, type Lang } from '../lib/i18n'
import { applyTheme, type ThemeMode } from '../lib/theme'

interface Settings {
  lang: Lang
  theme: ThemeMode
  accent: string
  onboarded: boolean
}

interface SettingsApi extends Settings {
  setLang: (l: Lang) => void
  setTheme: (t: ThemeMode) => void
  setAccent: (a: string) => void
  completeOnboarding: () => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const K = {
  lang: 'selectedLanguage',
  theme: 'selectedTheme',
  accent: 'selectedAccentColor',
  onboarded: 'onboardingCompleted',
}

const DEFAULT_ACCENT = '#3B7BEC'

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v === null || v === '' ? fallback : (v as T)
  } catch {
    return fallback
  }
}

const Ctx = createContext<SettingsApi | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const v = read<string>(K.lang, 'uz')
    return LANGS.some((l) => l.code === v) ? (v as Lang) : 'uz'
  })
  const [theme, setThemeState] = useState<ThemeMode>(() =>
    read<ThemeMode>(K.theme, 'light') === 'dark' ? 'dark' : 'light',
  )
  const [accent, setAccentState] = useState<string>(() => read(K.accent, DEFAULT_ACCENT))
  const [onboarded, setOnboarded] = useState<boolean>(() => read<string>(K.onboarded, '0') === '1')

  useEffect(() => {
    applyTheme(theme, accent)
  }, [theme, accent])

  const api = useMemo<SettingsApi>(
    () => ({
      lang,
      theme,
      accent,
      onboarded,
      setLang: (l) => {
        setLangState(l)
        try {
          localStorage.setItem(K.lang, l)
        } catch {
          /* private mode */
        }
      },
      setTheme: (t) => {
        setThemeState(t)
        try {
          localStorage.setItem(K.theme, t)
        } catch {
          /* private mode */
        }
      },
      setAccent: (a) => {
        setAccentState(a)
        try {
          localStorage.setItem(K.accent, a)
        } catch {
          /* private mode */
        }
      },
      completeOnboarding: () => {
        setOnboarded(true)
        try {
          localStorage.setItem(K.onboarded, '1')
        } catch {
          /* private mode */
        }
      },
      t: (key, vars) => translate(lang, key, vars),
    }),
    [lang, theme, accent, onboarded],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useSettings(): SettingsApi {
  const v = useContext(Ctx)
  if (!v) throw new Error('useSettings must be used within SettingsProvider')
  return v
}