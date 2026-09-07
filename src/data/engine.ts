import { CAREERS, type CareerProfile } from './careers'
import { QUESTIONS } from './questions'
import { DIMS } from './riasec'
import type { Riaset } from './types'

export interface CareerMatch {
  career: CareerProfile
  score: number
  reasons: string[]
}

function dot(a: Riaset, b: Riaset): number {
  return a.reduce((sum, v, i) => sum + v * (b[i] ?? 0), 0)
}

function norm(v: Riaset): number {
  return Math.sqrt(dot(v, v))
}

function mean(v: Riaset): number {
  return v.reduce((s, x) => s + x, 0) / Math.max(1, v.length)
}

// Centered cosine (Pearson-style): each vector is shifted by its own mean so a
// flat "no strong preference" profile scores near zero instead of matching
// everything. High score only when the profile's PEAKS match the career's PEAKS.
function centeredCosine(a: Riaset, b: Riaset): number {
  const ma = mean(a)
  const mb = mean(b)
  const p = a.map((x) => x - ma)
  const q = b.map((x) => x - mb)
  const num = p.reduce((s, x, i) => s + x * q[i], 0)
  const den = norm(p) * norm(q)
  if (den === 0) return 0
  return num / den
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function generateReasons(career: CareerProfile, profile: Riaset): string[] {
  const top2 = [0, 1, 2, 3, 4, 5]
    .sort((a, b) => profile[b] - profile[a])
    .slice(0, 2)

  const d1 = DIMS[top2[0]]
  const d2 = DIMS[top2[1]]

  const reasons: string[] = []

  // Reason 1: user's strongest interest
  reasons.push(
    `Sizning javoblaringiz ${d1.name} ishiga kuchli moyillikni ko\u2018rsatadi \u2014 ${d1.phrase}.`,
  )

  // Reason 2: career matches top dimension
  const careerTop = [0, 1, 2, 3, 4, 5]
    .sort((a, b) => career.riasec[b] - career.riasec[a])
    .slice(0, 2)

  const cd1 = DIMS[careerTop[0]]
  const cd2 = DIMS[careerTop[1]]

  reasons.push(
    `${career.name} — ${cd1.name} va ${cd2.name} kuchli tomonlariga qurilgan; sizning profilingiz buni aks ettiradi.`,
  )

  // Reason 3: second user dimension
  reasons.push(
    `Ikkinchi kuchli signalingiz ${d2.name}: ${d2.phrase}, bu yo\u2018nalish buni qadrlaydi.`,
  )

  // Reason 4: summary
  reasons.push(
    `Barcha ${QUESTIONS.length} javobda sizning tanlovlaringiz ${d1.keyAdj} va ${d2.keyAdj} ishga ishora qiladi.`,
  )

  return reasons
}

export function computeResult(answers: number[]): {
  profile: Riaset
  ranked: CareerMatch[]
  best: CareerMatch
} {
  // Build user RIASEC profile by summing selected option weights.
  const profile: Riaset = [0, 0, 0, 0, 0, 0]

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i]
    const chosen = answers[i]
    if (chosen === undefined || !q.opts[chosen]) continue
    const w = q.opts[chosen].w
    for (let d = 0; d < 6; d++) {
      profile[d] += w[d]
    }
  }

  // Score every career using centered cosine similarity, converted to a 0-100%.
  const ranked = CAREERS.map((career) => {
    const cos = centeredCosine(profile, career.riasec)
    const score = clamp(Math.round(100 * cos), 3, 99)
    const reasons = generateReasons(career, profile)
    return { career, score, reasons }
  })
    .sort((a, b) => b.score - a.score || a.career.name.localeCompare(b.career.name))

  return { profile, ranked, best: ranked[0] }
}