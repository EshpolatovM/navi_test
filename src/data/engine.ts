import { translate, type Lang } from '../lib/i18n'
import { careerName } from '../lib/qa'
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

function generateReasons(career: CareerProfile, profile: Riaset, lang: Lang): string[] {
  const top2 = [0, 1, 2, 3, 4, 5]
    .sort((a, b) => profile[b] - profile[a])
    .slice(0, 2)

  const d1 = DIMS[top2[0]]
  const d2 = DIMS[top2[1]]

  // Reason 2: career matches top dimensions
  const careerTop = [0, 1, 2, 3, 4, 5]
    .sort((a, b) => career.riasec[b] - career.riasec[a])
    .slice(0, 2)

  const cd1 = DIMS[careerTop[0]]
  const cd2 = DIMS[careerTop[1]]

  const name = translate(lang, 'rc.reason1', {
    d1: translate(lang, `dim.${d1.key}.name`),
    p1: translate(lang, `dim.${d1.key}.phrase`),
  })

  const matching = translate(lang, 'rc.reason2', {
    name: careerName(career.id, lang) ?? career.name,
    cd1: translate(lang, `dim.${cd1.key}.name`),
    cd2: translate(lang, `dim.${cd2.key}.name`),
  })

  const second = translate(lang, 'rc.reason3', {
    d2: translate(lang, `dim.${d2.key}.name`),
    p2: translate(lang, `dim.${d2.key}.phrase`),
  })

  const summary = translate(lang, 'rc.reason4', {
    n: QUESTIONS.length,
    kj1: translate(lang, `dim.${d1.key}.keyAdj`),
    kj2: translate(lang, `dim.${d2.key}.keyAdj`),
  })

  return [name, matching, second, summary]
}

export function computeResult(
  answers: number[],
  lang: Lang = 'uz',
): {
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
    const reasons = generateReasons(career, profile, lang)
    return { career, score, reasons }
  })
    .sort((a, b) => b.score - a.score || a.career.name.localeCompare(b.career.name))

  return { profile, ranked, best: ranked[0] }
}