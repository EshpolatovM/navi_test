import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useSettings } from '../SettingsContext'
import { useResultData, type ResultData, type ResultQuery } from './useResultData'

interface ResultContextValue {
  /** Shared session query — all result routes read the same data from it. */
  query: ResultQuery
  /** Deterministic result derived from the shared query + current language. */
  data: ResultData | null
  /** Starts the REAL KASB TANLASH test from the post-QIZIQISH invite. */
  tryCareerTest?: () => void
}

const ResultContext = createContext<ResultContextValue | null>(null)

export function ResultProvider({
  query,
  tryCareerTest,
  children,
}: {
  query: ResultQuery
  tryCareerTest?: () => void
  children: ReactNode
}) {
  const { lang } = useSettings()
  const data = useResultData(query, lang)

  const value = useMemo<ResultContextValue>(
    () => ({ query, data, tryCareerTest }),
    [query, data, tryCareerTest],
  )

  return <ResultContext.Provider value={value}>{children}</ResultContext.Provider>
}

export function useResultStore(): ResultContextValue {
  const ctx = useContext(ResultContext)
  if (!ctx) throw new Error('useResultStore must be used inside <ResultProvider>')
  return ctx
}