import { Adjustment, BuildingTwo, Layers, Lamp, Trophy } from '@icon-park/react'
import type { IconType } from '../lib/icon'

// The 60-item instrument is split into 4 career-discovery stages
// (O*NET-flavored: Interests, Activities, Work Styles, Work Context).
// Each stage carries its own accent color + icon so every phase of the
// journey has a distinct, cohesive visual identity.
export interface StageDef {
  key: string
  label: string
  from: number
  to: number
  accent: string
  icon: IconType
}

export const PER_STAGE = 15

export const STAGES: StageDef[] = [
  {
    key: 'QIZIQISHLAR',
    label: 'Qiziqishlar',
    from: 1,
    to: 15,
    accent: '#4F46E5',
    icon: Lamp,
  },
  {
    key: 'FAOLIYATLAR',
    label: 'Faoliyatlar',
    from: 16,
    to: 30,
    accent: '#0EA5E9',
    icon: Layers,
  },
  {
    key: 'ISH USLUBI',
    label: 'Ish uslubi',
    from: 31,
    to: 45,
    accent: '#F59E0B',
    icon: Adjustment,
  },
  {
    key: 'ISH MUHITI',
    label: 'Ish muhiti',
    from: 46,
    to: 60,
    accent: '#10B981',
    icon: BuildingTwo,
  },
]

// Terminal stage — shown on the roadmap as the 5th (final) destination.
export const RESULT_STAGE: StageDef = {
  key: 'NATIJA',
  label: 'Natija',
  from: 61,
  to: 60,
  accent: '#8B5CF6',
  icon: Trophy,
}

export const stageAt = (index: number): number =>
  Math.max(0, Math.min(3, Math.floor(index / PER_STAGE)))

// ── Dynamic stage model ──────────────────────────────────────────────────
// Roadmap / progress are derived from the actual question array instead of
// hardcoded "01–15 / 16–30 / ..." ranges. Each question's `stage` field says
// which stage it belongs to (REAL KASB splits into 4×15, QIZIQISH uses a
// single stage covering all its questions), so ranges and totals can never
// exceed the real question count.
export interface StageBoundary {
  stage: number
  from: number // 1-based inclusive
  to: number // 1-based inclusive
  def: StageDef
}

export interface StageModel {
  total: number
  boundaries: StageBoundary[]
}

export function buildStageModel(questions: { stage: number }[]): StageModel {
  const total = questions.length
  const groups = new Map<number, { from: number; to: number }>()
  questions.forEach((q, i) => {
    const g = groups.get(q.stage)
    if (g) g.to = i + 1
    else groups.set(q.stage, { from: i + 1, to: i + 1 })
  })
  const boundaries: StageBoundary[] = [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([stage, r]) => ({ stage, from: r.from, to: r.to, def: STAGES[stage] ?? STAGES[0] }))
  return { total, boundaries }
}