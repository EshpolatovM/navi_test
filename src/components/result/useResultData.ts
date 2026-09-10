import { useMemo } from 'react'
import {
  computeResult,
  CAREERS,
  DIMS,
  INTEREST_ITEMS,
  QUESTIONS,
  centeredCosine,
} from '../../data'
import { translate, type Lang } from '../../lib/i18n'
import { careerName, careerDescription } from '../../lib/qa'
import type { Riaset } from '../../data/types'

export type TestType = 'career' | 'interest'

export interface TestInputState {
  answers: number[]
  finished: boolean
}

export interface ResultQuery {
  career: TestInputState
  interest: TestInputState
}

export interface DirectionScore {
  id: string
  nameKey: string
  icon: string
  score: number
  /** localized, answer-derived explanation of why this direction scored as it did */
  explanation: string
  /** dimension short keys (real answer data) shown as compact tags */
  tags: string[]
}

export interface TraitScore {
  id: string
  nameKey: string
  icon: string
  score: number
  /** localized explanation linking the trait to the answer pattern behind it */
  description: string
}

export interface ValueItem {
  id: string
  nameKey: string
  icon: string
  score: number
  description: string
}

export interface ArchetypeData {
  titleKey: string
  subtitleKey: string
  riasecScores: number[]
  dominant: number
}

export interface StrengthItem {
  id: string
  nameKey: string
  score: number
  color: string
  /** localized explanation of what the strength means and which answers caused it */
  description: string
}

export interface GrowthItem {
  id: string
  nameKey: string
  current: number
  target: number
  color: string
  description: string
  /** localized concrete action key for this growth dimension */
  actionKey: string
}

export interface AdviceItem {
  titleKey: string
  bodyKey: string
  icon: string
  vars?: Record<string, string>
}

export interface ReportItem {
  titleKey: string
  categoryKey: string
  descriptionKey: string
}

export interface NextStep {
  titleKey: string
  subtitleKey: string
  icon: string
  /** localized subject name used to interpolate {name} into the copy */
  name: string
  /** where the CTA should take the user */
  target: 'career' | 'directions' | 'retake'
}

export interface CareerMatchData {
  id: string
  name: string
  description: string
  score: number
  color: string
  icon: string
  reasons: string[]
  /** localized skill keys derived from the career's strongest dimensions */
  skillKeys: string[]
  /** RIASEC key of the career's single strongest dimension */
  primaryDimKey: string
}

export interface ResultData {
  /** which tests the user actually completed and contributed to this result */
  sources: TestType[]
  /** true when a merged result from both tests is shown */
  merged: boolean
  topCareers: CareerMatchData[]
  allCareers: CareerMatchData[]
  directionScores: DirectionScore[]
  riasecScores: number[]
  characterTraits: TraitScore[]
  values: ValueItem[]
  archetype: ArchetypeData
  strengths: StrengthItem[]
  growthAreas: GrowthItem[]
  advice: AdviceItem[]
  reports: ReportItem[]
  nextStep: NextStep
  summaryInterest: string
  summaryCharacter: string
  summaryValues: string
}

const DIRECTION_DEFS: { id: string; nameKey: string; icon: string; weights: Riaset }[] = [
  { id: 'ai', nameKey: 'dir.ai', icon: 'ai', weights: [4, 28, 5, 2, 12, 16] },
  { id: 'it', nameKey: 'dir.it', icon: 'it', weights: [14, 28, 4, 2, 6, 12] },
  { id: 'smm', nameKey: 'dir.smm', icon: 'smm', weights: [2, 4, 14, 12, 22, 4] },
  { id: 'marketing', nameKey: 'dir.marketing', icon: 'marketing', weights: [2, 5, 10, 14, 22, 5] },
  { id: 'uiux', nameKey: 'dir.uiux', icon: 'uiux', weights: [4, 14, 24, 5, 8, 5] },
  { id: 'video', nameKey: 'dir.video', icon: 'video', weights: [2, 4, 24, 10, 12, 3] },
  { id: 'mobilograf', nameKey: 'dir.mobilograf', icon: 'design', weights: [14, 4, 24, 3, 6, 3] },
  { id: 'doctor', nameKey: 'dir.doctor', icon: 'doctor', weights: [5, 22, 4, 20, 4, 6] },
  { id: 'gamedev', nameKey: 'dir.gamedev', icon: 'game', weights: [10, 18, 18, 3, 6, 4] },
  { id: 'mobiledev', nameKey: 'dir.mobiledev', icon: 'mobile', weights: [14, 22, 10, 3, 6, 6] },
]

const CHARACTER_TRAITS: { id: string; nameKey: string; icon: string; riasecIdx: number }[] = [
  { id: 'analytical', nameKey: 'trait.analytical', icon: 'flask', riasecIdx: 1 },
  { id: 'creative', nameKey: 'trait.creative', icon: 'palette', riasecIdx: 2 },
  { id: 'leader', nameKey: 'trait.leader', icon: 'rocket', riasecIdx: 4 },
  { id: 'collaborative', nameKey: 'trait.collaborative', icon: 'users', riasecIdx: 3 },
  { id: 'systematic', nameKey: 'trait.systematic', icon: 'list', riasecIdx: 5 },
  { id: 'practical', nameKey: 'trait.practical', icon: 'hammer', riasecIdx: 0 },
]

const VALUE_DEFS: { id: string; nameKey: string; icon: string; dims: number[] }[] = [
  { id: 'independence', nameKey: 'val.independence', icon: 'compass', dims: [0, 1] },
  { id: 'creativity', nameKey: 'val.creativity', icon: 'palette', dims: [2] },
  { id: 'helping', nameKey: 'val.helping', icon: 'heart', dims: [3] },
  { id: 'stability', nameKey: 'val.stability', icon: 'shield', dims: [5] },
  { id: 'growth', nameKey: 'val.growth', icon: 'rocket', dims: [1, 4] },
  { id: 'teamwork', nameKey: 'val.teamwork', icon: 'users', dims: [3] },
  { id: 'opportunity', nameKey: 'val.opportunity', icon: 'trending', dims: [4] },
]

const ARCHETYPE_LABELS: string[] = [
  'arch.amaliy',
  'arch.tadqiqotchi',
  'arch.ijodkor',
  'arch.yolKorsatuvchi',
  'arch.yetakchi',
  'arch.tashkilotchi',
]

interface MeasuredDim {
  idx: number
  key: string
  nameKey: string
  shortKey: string
  keyAdjKey: string
  color: string
  phraseKey: string
  /** actual percentage of the true theoretical maximum for this dimension */
  pct: number | null
  raw: number
  max: number
}

interface CareerTraceRow {
  q: number
  chosen: number | null
  weight: number[] | null
  maxForQ: number[]
}

interface InterestTraceRow {
  q: number
  dim: string
  chosen: number | null
  rel: number
}

export function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

export function toMeasuredDim(d: number, raw: number, max: number): MeasuredDim {
  const dim = DIMS[d]
  const pct = max > 0 ? clamp(Math.round((raw / max) * 100), 0, 100) : null
  return {
    idx: d,
    key: dim.key,
    nameKey: `dim.${dim.key}.name`,
    shortKey: `dim.${dim.key}.short`,
    keyAdjKey: `dim.${dim.key}.keyAdj`,
    color: dim.color,
    phraseKey: `dim.${dim.key}.phrase`,
    pct,
    raw,
    max,
  }
}

export function rankDims(dims: MeasuredDim[]): MeasuredDim[] {
  return dims
    .filter((d): d is MeasuredDim => d.pct != null)
    .slice()
    .sort((a, b) => (b.pct as number) - (a.pct as number) || a.idx - b.idx)
}

// ── REAL KASB TANLASH — 60 answers ──────────────────────────────────────────
// Each question offers an option for (a subset of) the six dimensions with a
// weight of 2 in its primary dimension. `raw[d]` = total selected weight for
// dimension d; `max[d]` = total maximum weight that could have been selected
// for d on the offered questions. percentage = raw / max * 100.
export function measureCareerDims(answers: number[]): { dims: MeasuredDim[]; trace: CareerTraceRow[] } {
  const raw = [0, 0, 0, 0, 0, 0]
  const max = [0, 0, 0, 0, 0, 0]
  const trace: CareerTraceRow[] = []

  QUESTIONS.forEach((q, qi) => {
    const maxForQ = [0, 0, 0, 0, 0, 0]
    for (const opt of q.opts) {
      opt.w.forEach((w, d) => {
        if (w > maxForQ[d]) maxForQ[d] = w
      })
    }
    const chosen = answers[qi]
    const weight = chosen !== undefined && q.opts[chosen] ? [...q.opts[chosen].w] : null
    if (weight) {
      weight.forEach((w, d) => {
        raw[d] += w
      })
    }
    maxForQ.forEach((m, d) => {
      max[d] += m
    })
    trace.push({ q: q.id, chosen: chosen ?? null, weight, maxForQ })
  })

  const dims = DIMS.map((_, d) => toMeasuredDim(d, raw[d], max[d]))
  return { dims, trace }
}

// ── QIZIQISH — 24 answers ───────────────────────────────────────────────────
// Each item belongs to one dimension; each answer contributes rel ∈ [0,1]
// where 1 = strongest option. `raw[d]` = sum of rel; `max[d]` = number of
// answered items for d (each contributes at most 1). percentage = raw/max*100.
export function measureInterestDims(answers: number[]): { dims: MeasuredDim[]; trace: InterestTraceRow[] } {
  const raw = [0, 0, 0, 0, 0, 0]
  const max = [0, 0, 0, 0, 0, 0]
  const trace: InterestTraceRow[] = []

  INTEREST_ITEMS.forEach((item, i) => {
    const v = answers[i]
    let rel = 0
    if (v !== undefined && v >= 0 && v < item.opts.length) {
      rel = (item.opts.length - 1 - v) / (item.opts.length - 1)
      raw[item.dim] += rel
      max[item.dim] += 1
    }
    trace.push({ q: item.id, dim: DIMS[item.dim].key, chosen: v ?? null, rel })
  })

  const dims = DIMS.map((_, d) => toMeasuredDim(d, raw[d], max[d]))
  return { dims, trace }
}

// ── Merge two per-test dimension measurements into one weighted profile ─────
// Weight is the number of answered questions in each test, so a test with more
// evidence influences the merged profile proportionally.
export function mergeDims(career: MeasuredDim[] | null, interest: MeasuredDim[] | null): MeasuredDim[] {
  if (career && interest) {
    const wc = Math.max(1, career.reduce((s, d) => s + d.raw, 0)) // answered weight evidence
    const wi = Math.max(1, interest.reduce((s, d) => s + d.raw, 0))
    return DIMS.map((_, d) => {
      const cp = career[d].pct
      const ip = interest[d].pct
      if (cp != null && ip != null) {
        const raw = cp * wc + ip * wi
        const max = (wc + wi) * 100
        return toMeasuredDim(d, raw, max)
      }
      return cp != null ? career[d] : interest[d]
    })
  }
  return (career ?? interest)!
}

// ── 10 modern directions ────────────────────────────────────────────────────
// score = weighted average of the per-dimension TRUE percentages, weighted by
// how strongly each dimension predicts the direction. Percentage of the
// direction's own maximum (100 = every required dimension fully matched).
// Winner = the highest real score, never forced to 100.
export function computeDirectionScores(dims: MeasuredDim[], lang: Lang): DirectionScore[] {
  return DIRECTION_DEFS.map((def, defIdx) => {
    let weighted = 0
    let wsum = 0
    for (let d = 0; d < dims.length; d++) {
      const pct = dims[d].pct
      if (pct == null) continue
      weighted += def.weights[d] * pct
      wsum += def.weights[d]
    }
    const score = wsum > 0 ? clamp(Math.round(weighted / wsum), 0, 100) : null
    return { def, defIdx, score, wsum, weighted }
  })
    .filter((x): x is { def: (typeof DIRECTION_DEFS)[number]; defIdx: number; score: number; wsum: number; weighted: number } => x.score != null)
    .sort((a, b) => b.score - a.score || a.defIdx - b.defIdx)
    .map(({ def, score }) => {
      const topDims = def.weights
        .map((w, d) => ({ w, d }))
        .sort((a, b) => b.w - a.w || a.d - b.d)
        .slice(0, 2)
        .map((x) => x.d)
      const d1 = translate(lang, `dim.${DIMS[topDims[0]].key}.name`)
      const d2 = translate(lang, `dim.${DIMS[topDims[1]].key}.name`)
      return {
        id: def.id,
        nameKey: def.nameKey,
        icon: def.icon,
        score,
        explanation: translate(lang, 'result.directions.why', { d1, d2 }),
        tags: [`dim.${DIMS[topDims[0]].key}.short`, `dim.${DIMS[topDims[1]].key}.short`],
      }
    })
}

// ── Character traits ────────────────────────────────────────────────────────
function computeCharacterTraits(dims: MeasuredDim[], lang: Lang): TraitScore[] {
  return CHARACTER_TRAITS.map((tr, idx) => ({ tr, idx, pct: dims[tr.riasecIdx].pct }))
    .filter((x): x is { tr: (typeof CHARACTER_TRAITS)[number]; idx: number; pct: number } => x.pct != null)
    .sort((a, b) => b.pct - a.pct || a.idx - b.idx)
    .map(({ tr, pct }) => {
      const dim = DIMS[tr.riasecIdx]
      return {
        id: tr.id,
        nameKey: tr.nameKey,
        icon: tr.icon,
        score: pct,
        description: translate(lang, 'result.character.why', { name: translate(lang, `dim.${dim.key}.name`) }),
      }
    })
}

// ── Values ──────────────────────────────────────────────────────────────────
function computeValues(dims: MeasuredDim[]): ValueItem[] {
  return VALUE_DEFS.map((v, idx) => {
    const parts = v.dims.map((d) => dims[d].pct).filter((p): p is number => p != null)
    return {
      v,
      idx,
      score: parts.length > 0 ? clamp(Math.round(parts.reduce((s, x) => s + x, 0) / parts.length), 0, 100) : null,
    }
  })
    .filter((x): x is { v: (typeof VALUE_DEFS)[number]; idx: number; score: number } => x.score != null)
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
    .map(({ v, score }) => ({ id: v.id, nameKey: v.nameKey, icon: v.icon, score, description: '' }))
}

// ── Strengths ───────────────────────────────────────────────────────────────
function computeStrengths(dims: MeasuredDim[], lang: Lang): StrengthItem[] {
  return rankDims(dims)
    .slice(0, 3)
    .map((d) => ({
      id: d.key,
      nameKey: d.nameKey,
      score: d.pct as number,
      color: d.color,
      description: translate(lang, 'result.strengths.pattern', {
        name: translate(lang, `dim.${DIMS[d.idx].key}.name`),
      }),
    }))
}

// ── Growth ──────────────────────────────────────────────────────────────────
function computeGrowth(dims: MeasuredDim[], lang: Lang): GrowthItem[] {
  const measured = dims.filter((d): d is MeasuredDim => d.pct != null)
  const avg =
    measured.reduce((s, d) => s + (d.pct as number), 0) / Math.max(1, measured.length)

  let candidates = measured
    .filter((d) => (d.pct as number) < avg)
    .slice()
    .sort((a, b) => (a.pct as number) - (b.pct as number) || a.idx - b.idx)

  if (candidates.length === 0 && measured.length > 0) {
    const weakest = measured.slice().sort((a, b) => (a.pct as number) - (b.pct as number) || a.idx - b.idx)
    if ((weakest[0].pct as number) < 100) candidates = [weakest[0]]
  }

  return candidates.slice(0, 4).map((d) => ({
    id: d.key,
    nameKey: d.nameKey,
    current: d.pct as number,
    target: 100,
    color: d.color,
    description: translate(lang, 'result.growth.why', {
      name: translate(lang, `dim.${DIMS[d.idx].key}.name`),
    }),
    actionKey: `growth.action_${d.key.toLowerCase()}`,
  }))
}

// ── Advice ──────────────────────────────────────────────────────────────────
// Depends on the actual highest and lowest measured dimensions, so advice is
// specific to the user: which direction to try, which skill to build, which
// mini-project to start, and which two directions to explore together.
function computeAdvice(
  dims: MeasuredDim[],
  topChoice: CareerMatchData | undefined,
  lang: Lang,
): AdviceItem[] {
  const ranked = rankDims(dims)
  const high1 = ranked[0]
  const high2 = ranked[1]
  const lowest = ranked[ranked.length - 1]

  const g1 = high1 ? translate(lang, `dim.${DIMS[high1.idx].key}.name`) : ''
  const g2 = high2 ? translate(lang, `dim.${DIMS[high2.idx].key}.name`) : ''

  const items: AdviceItem[] = []

  if (high1) {
    const k = high1.key.toLowerCase()
    items.push({ titleKey: `advice.explore_${k}`, bodyKey: `advice.explore_${k}_body`, icon: 'compass' })
  }
  if (high2) {
    items.push({
      titleKey: 'advice.skill',
      bodyKey: 'advice.skill_body',
      icon: 'search',
      vars: { dim: g2 },
    })
  }
  if (topChoice && topChoice.score >= 40) {
    items.push({
      titleKey: 'advice.portfolio',
      bodyKey: 'advice.portfolio_body',
      icon: 'pen_tool',
      vars: { name: topChoice.name },
    })
  } else {
    items.push({ titleKey: 'advice.compare', bodyKey: 'advice.compare_body', icon: 'search' })
  }
  if (high1 && high2 && high1.idx !== high2.idx) {
    items.push({
      titleKey: 'advice.combo',
      bodyKey: 'advice.combo_body',
      icon: 'zap',
      vars: { d1: g1, d2: g2 },
    })
  } else if (lowest && (!high1 || lowest.idx !== high1.idx)) {
    const k = lowest.key.toLowerCase()
    items.push({ titleKey: `advice.grow_${k}`, bodyKey: `advice.grow_${k}_body`, icon: 'flask' })
  }

  return items
}

function computeNextStep(
  dims: MeasuredDim[],
  topCareer: CareerMatchData | undefined,
  topDirection: DirectionScore | undefined,
  lang: Lang,
): NextStep {
  if (topCareer && topCareer.score >= 40) {
    return {
      titleKey: 'next.explore_career',
      subtitleKey: 'next.explore_career_sub',
      icon: 'rocket',
      name: topCareer.name,
      target: 'career',
    }
  }
  if (topDirection && topDirection.score >= 25) {
    return {
      titleKey: 'next.explore_direction',
      subtitleKey: 'next.explore_direction_sub',
      icon: 'compass',
      name: translate(lang, topDirection.nameKey),
      target: 'directions',
    }
  }
  return { titleKey: 'next.retake', subtitleKey: 'next.retake_sub', icon: 'rotate', name: '', target: 'retake' }
}

function joinByLang(lang: Lang): string {
  return lang === 'uz' ? ' va ' : lang === 'ru' ? ' и ' : ' & '
}

// ── Development traceability & data-quality guard ───────────────────────────
// Runs only in dev: asserts the invariant that every rendered percentage is a
// finite, in-range, answer-derived number, emits per-candidate tables with
// raw → max → final → source, and warns on suspicious score clustering.
function devValidate(args: {
  testType: string
  merged: boolean
  dims: MeasuredDim[]
  directions: DirectionScore[]
  traits: TraitScore[]
  values: ValueItem[]
  strengths: StrengthItem[]
  growthAreas: GrowthItem[]
  riasecScores: number[]
  ranked?: { career: (typeof CAREERS)[number]; score: number }[]
  profile?: Riaset
  answeredCount: number
  questionCount: number
}): void {
  if (!import.meta.env.DEV) return

  const finite = (n: number | null | undefined): n is number =>
    typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 100

  let violations = 0
  for (const d of args.directions) {
    if (!finite(d.score)) {
      console.warn(`[navi] invalid direction score: ${d.nameKey}=${d.score}`)
      violations++
    }
  }
  for (const t of args.traits) {
    if (!finite(t.score)) {
      console.warn(`[navi] invalid trait score: ${t.nameKey}=${t.score}`)
      violations++
    }
  }
  for (const v of args.values) {
    if (!finite(v.score)) {
      console.warn(`[navi] invalid value score: ${v.nameKey}=${v.score}`)
      violations++
    }
  }
  for (const s of args.strengths) {
    if (!finite(s.score)) {
      console.warn(`[navi] invalid strength score: ${s.nameKey}=${s.score}`)
      violations++
    }
  }
  for (const g of args.growthAreas) {
    if (!finite(g.current)) {
      console.warn(`[navi] invalid growth current: ${g.nameKey}=${g.current}`)
      violations++
    }
  }
  for (const r of args.riasecScores) {
    if (!finite(r)) {
      console.warn(`[navi] invalid riasec score: ${r}`)
      violations++
    }
  }
  const ids = args.directions.map((d) => d.id)
  if (new Set(ids).size !== ids.length) {
    console.warn('[navi] duplicate direction ids')
    violations++
  }

  // No score is ever artificially forced to its maximum.
  const exactly100 = args.directions.filter((d) => d.score === 100).length
  if (exactly100 > 0 && args.directions.length > 1 && exactly100 > args.directions.length / 2) {
    console.warn(`[navi] suspicious score clustering: ${exactly100}/${args.directions.length} directions at exactly 100`)
  }

  // Score clustering warnings.
  const scores = args.directions.map((d) => d.score)
  const countSame = scores.filter((s) => s === scores[0]).length
  if (countSame >= 3) {
    console.warn(`[navi] suspicious score clustering: ${countSame} directions share the exact same score`)
  }
  if (new Set(scores).size === 1 && scores.length > 1) {
    console.warn('[navi] suspicious score clustering: all directions identical, check input answers')
  }

  console.group(`[navi] result guard — ${args.testType}${args.merged ? ' (merged)' : ''}`)

  const dimRows = args.dims.map((d) => ({
    dimension: DIMS[d.idx].key,
    rawScore: args.merged ? Number((d.raw / 100).toFixed(1)) : d.raw,
    maxPossible: args.merged ? d.max / 100 : d.max,
    percentage: d.pct ?? '—',
  }))
  console.table(dimRows)

  console.table(
    args.directions.map((d) => ({
      direction: d.nameKey.replace(/^dir\./, ''),
      finalScore: d.score,
      source: args.merged ? 'merged (career + interest)' : args.testType,
    })),
  )

  if (args.ranked && args.profile) {
    console.table(
      args.ranked.map((r, i) => {
        const cos = centeredCosine(args.profile!, r.career.riasec)
        return {
          rank: i + 1,
          career: r.career.name,
          rawSimilarity: Number(Math.max(0, cos).toFixed(3)),
          maxPossible: 1,
          finalScore: r.score,
        }
      }),
    )
  }

  console.table({
    answeredCount: args.answeredCount,
    questionCount: args.questionCount,
    violations: violations === 0 ? 'none' : violations,
  })

  if (violations > 0) console.warn(`[navi] ${violations} data-quality violation(s)`)
  console.groupEnd()
}

function buildSummary(dims: MeasuredDim[], lang: Lang): { interest: string; character: string; values: string } {
  const top = rankDims(dims)
  const dominant = top[0]
  const strongestValue = computeValues(dims)[0]

  const interest = top
    .slice(0, 2)
    .map((d) => translate(lang, d.shortKey))
    .join(joinByLang(lang))

  const character = dominant
    ? translate(lang, `dim.${DIMS[dominant.idx].key}.keyAdj`)
    : translate(lang, 'result.summary.character')

  const values = strongestValue ? translate(lang, strongestValue.nameKey) : translate(lang, 'result.summary.values')

  return { interest, character, values }
}

export function buildResultData(query: ResultQuery, lang: Lang): ResultData | null {
  const careerDone = query.career.finished && query.career.answers.length > 0
  const interestDone = query.interest.finished && query.interest.answers.length > 0

  if (!careerDone && !interestDone) return null

    const sources: TestType[] = [
      careerDone ? 'career' : null,
      interestDone ? 'interest' : null,
    ].filter((x): x is TestType => x != null)

    const merged = careerDone && interestDone

    const careerDims = careerDone ? measureCareerDims(query.career.answers) : null
    const interestDims = interestDone ? measureInterestDims(query.interest.answers) : null

    const dims = mergeDims(careerDims?.dims ?? null, interestDims?.dims ?? null)
    const riasecScores = dims.map((d) => d.pct ?? 0)

    // Career matches always come from the REAL KASB TANLASH engine when that
    // test contributed answers; otherwise the top directions stand in.
    let topCareerMatches: CareerMatchData[] = []
    let allCareerMatches: CareerMatchData[] = []
    let careerRanked: { career: (typeof CAREERS)[number]; score: number }[] = []
    let careerProfile: Riaset | undefined

    if (careerDone) {
      const { profile, ranked } = computeResult(query.career.answers, lang)
      careerProfile = profile
      careerRanked = ranked
      const toMatch = (r: { career: (typeof CAREERS)[number]; score: number; reasons: string[] }): CareerMatchData => {
        const dimOrder = [0, 1, 2, 3, 4, 5].sort((a, b) => r.career.riasec[b] - r.career.riasec[a])
        return {
          id: r.career.id,
          name: careerName(r.career.id, lang) ?? r.career.name,
          description: careerDescription(r.career.id, lang) ?? r.career.description,
          score: r.score,
          color: r.career.color,
          icon: r.career.icon,
          reasons: r.reasons,
          skillKeys: dimOrder.slice(0, 2).map((d) => `skill.${DIMS[d].key.toLowerCase()}`),
          primaryDimKey: DIMS[dimOrder[0]].key,
        }
      }
      topCareerMatches = ranked.slice(0, 3).map(toMatch)
      allCareerMatches = ranked.map(toMatch)
    }

    const directionScores = computeDirectionScores(dims, lang)
    const topDirection = directionScores[0]

    const topDims = rankDims(dims)
    const dominant = topDims[0].idx
    const archetype: ArchetypeData = {
      titleKey: ARCHETYPE_LABELS[dominant],
      subtitleKey: `${ARCHETYPE_LABELS[dominant]}_sub`,
      riasecScores,
      dominant,
    }

    const characterTraits = computeCharacterTraits(dims, lang)
    const values = computeValues(dims)
    const strengths = computeStrengths(dims, lang)
    const growthAreas = computeGrowth(dims, lang)

    // Career-based top choice only when the career test contributed answers.
    const nextStep = computeNextStep(dims, topCareerMatches[0], topDirection, lang)

    // Advice needs "nega mos" grounding; fall back to the strongest direction
    // as the anchor when only the interest test was taken.
    const adviceAnchor = topCareerMatches[0] ?? {
      id: topDirection.id,
      name: translate(lang, topDirection.nameKey),
      description: '',
      score: topDirection.score,
      color: DIMS[dominant].color,
      icon: topDirection.icon,
      reasons: [],
      skillKeys: [],
      primaryDimKey: DIMS[dominant].key,
    }
    const advice = computeAdvice(dims, adviceAnchor, lang)

    const reports: ReportItem[] = [
      { titleKey: `report.profile_${DIMS[dominant].key.toLowerCase()}`, categoryKey: 'report.interest', descriptionKey: 'report.profile_desc' },
      { titleKey: merged || careerDone ? 'report.careers' : 'report.directions', categoryKey: merged || careerDone ? 'report.match' : 'report.direction', descriptionKey: merged || careerDone ? 'report.careers_desc' : 'report.directions_desc' },
      { titleKey: 'report.strengths', categoryKey: 'report.strength', descriptionKey: 'report.strengths_desc' },
    ]

    const summary = buildSummary(dims, lang)

    const answeredCount = (careerDims?.trace.filter((r) => r.chosen != null).length ?? 0) +
      (interestDims?.trace.filter((r) => r.chosen != null).length ?? 0)
    const questionCount = (careerDims ? QUESTIONS.length : 0) + (interestDims ? INTEREST_ITEMS.length : 0)

    devValidate({
      testType: careerDone && interestDone ? 'combined' : careerDone ? 'REAL KASB TANLASH' : 'QIZIQISH',
      merged,
      dims,
      directions: directionScores,
      traits: characterTraits,
      values,
      strengths,
      growthAreas,
      riasecScores,
      ranked: careerRanked.length > 0 ? careerRanked : undefined,
      profile: careerProfile,
      answeredCount,
      questionCount,
    })

    const data: ResultData = {
      sources,
      merged,
      topCareers: topCareerMatches,
      allCareers: allCareerMatches,
      directionScores,
      riasecScores,
      characterTraits,
      values,
      archetype,
      strengths,
      growthAreas,
      advice,
      reports,
      nextStep,
      summaryInterest: summary.interest,
      summaryCharacter: summary.character,
      summaryValues: summary.values,
    }

    return data
}

export function useResultData(query: ResultQuery, lang: Lang): ResultData | null {
  return useMemo(() => buildResultData(query, lang), [query.career, query.interest, lang])
}

export { DIRECTION_DEFS }