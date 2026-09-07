import { Building2, Layers, Lightbulb, SlidersHorizontal, Trophy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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
  icon: LucideIcon
}

export const PER_STAGE = 15

export const STAGES: StageDef[] = [
  {
    key: 'QIZIQISHLAR',
    label: 'Qiziqishlar',
    from: 1,
    to: 15,
    accent: '#4F46E5',
    icon: Lightbulb,
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
    icon: SlidersHorizontal,
  },
  {
    key: 'ISH MUHITI',
    label: 'Ish muhiti',
    from: 46,
    to: 60,
    accent: '#10B981',
    icon: Building2,
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