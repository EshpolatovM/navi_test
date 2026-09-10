import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  computeSignature,
  requestRoadmap,
  ROADMAP_STORAGE_KEY,
  sanitizeResult,
  type RoadmapData,
} from '../../lib/roadmap'
import type { ResultData } from './useResultData'
import { useSettings } from '../SettingsContext'

interface RoadmapContextValue {
  roadmap: RoadmapData | null
  busy: boolean
  /** Creates (or regenerates) the roadmap for the given result. Returns local entity. */
  generate: (data: ResultData) => Promise<RoadmapData>
  clearRoadmap: () => void
  /** True when the stored roadmap still matches the current result data & language. */
  matches: (data: ResultData) => boolean
}

const RoadmapContext = createContext<RoadmapContextValue | null>(null)

function readStored(): RoadmapData | null {
  try {
    const raw = localStorage.getItem(ROADMAP_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as RoadmapData
    if (!parsed || !Array.isArray(parsed.blocks) || !Array.isArray(parsed.steps)) return null
    return parsed
  } catch {
    return null
  }
}

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const { lang } = useSettings()
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(() =>
    typeof window === 'undefined' ? null : readStored(),
  )
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (roadmap) {
      try {
        localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(roadmap))
      } catch { /* storage full or unavailable */ }
    } else {
      try {
        localStorage.removeItem(ROADMAP_STORAGE_KEY)
      } catch { /* noop */ }
    }
  }, [roadmap])

  const clearRoadmap = useCallback(() => setRoadmap(null), [])

  const matches = useCallback(
    (data: ResultData) => {
      if (!roadmap) return false
      if (roadmap.lang !== lang) return false
      return roadmap.signature === computeSignature(data)
    },
    [roadmap, lang],
  )

  const generate = useCallback(
    async (data: ResultData): Promise<RoadmapData> => {
      setBusy(true)
      try {
        const signature = computeSignature(data)
        const result = sanitizeResult(data, lang)
        const fresh = await requestRoadmap({ result, lang, signature })
        const entity: RoadmapData = {
          blocks: fresh.blocks,
          steps: fresh.steps,
          createdAt: fresh.createdAt,
          signature,
          lang,
        }
        setRoadmap(entity)
        return entity
      } finally {
        setBusy(false)
      }
    },
    [lang],
  )

  const value = useMemo(
    () => ({ roadmap, busy, generate, clearRoadmap, matches }),
    [roadmap, busy, generate, clearRoadmap, matches],
  )

  return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>
}

export function useRoadmap(): RoadmapContextValue {
  const ctx = useContext(RoadmapContext)
  if (!ctx) throw new Error('useRoadmap must be used within RoadmapProvider')
  return ctx
}