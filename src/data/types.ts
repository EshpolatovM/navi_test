import type { LucideIcon } from 'lucide-react'

// RIASEC order: [Realistic, Investigative, Artistic, Social, Enterprising, Conventional]
export type Riaset = number[]

export interface Option {
  text: string
  w: Riaset
}

export interface QuizQuestion {
  id: number
  q: string
  accent: string
  stage: number
  opts: Option[]
}

// A career "occupation profile" in RIASEC terms.
// This is the same shape the full O*NET occupation dataset uses (interest code per SOC),
// so real O*NET data can be plugged in later without touching the engine.
export interface CareerProfile {
  id: string
  name: string
  riasec: Riaset
  color: string
  icon: LucideIcon
  description: string
}