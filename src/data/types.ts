// RIASEC order: [Realistic, Investigative, Artistic, Social, Enterprising, Conventional]
export type Riaset = number[]

// Semantic answer-sound key, resolved by the reusable sound system in lib/sound.ts.
export type AnswerSound = 'game' | 'design' | 'video' | 'technology' | 'social' | 'medicine'

export interface Option {
  text: string
  w: Riaset
  icon?: string
  sound?: AnswerSound
}

export interface QuizQuestion {
  id: number
  q: string
  accent: string
  stage: number
  // Smooth difficulty ramp 0 (easy/soft) → 1 (hard/deep). Drives the visual
  // intensity of the bubble, progress accent and roadmap consistently.
  difficulty: number
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
  icon: string
  description: string
}