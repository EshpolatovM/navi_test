import { translate, type Lang } from './i18n'
import type { ResultData } from '../components/result/useResultData'

export interface RoadmapStep {
  title: string
  text: string
}

export interface RoadmapBlock {
  heading: string
  lines: string[]
}

export interface RoadmapData {
  blocks: RoadmapBlock[]
  steps: RoadmapStep[]
  createdAt: number
  signature: string
  lang: Lang
}

export const ROADMAP_STORAGE_KEY = 'quizlab.roadmap.v1'

const ROADMAP_API = '/api/roadmap'

export async function requestRoadmap(payload: {
  result: unknown
  lang: Lang
  signature: string
}): Promise<{ blocks: RoadmapBlock[]; steps: RoadmapStep[]; createdAt: number }> {
  const res = await fetch(ROADMAP_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('roadmap_failed')
  const json = (await res.json()) as { ok?: boolean; data?: { blocks: RoadmapBlock[]; steps: RoadmapStep[]; createdAt: number } }
  if (!json.ok || !json.data) throw new Error('roadmap_failed')
  return json.data
}

const RIASEC_ORDER = ['R', 'I', 'A', 'S', 'E', 'C'] as const

/**
 * Builds a fully localized snapshot of every result section that the AI reads.
 * No scores are invented or changed — everything comes from the shared store.
 */
export function sanitizeResult(data: ResultData, lang: Lang): Record<string, unknown> {
  const t = (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars)
  const riasec = RIASEC_ORDER.map((letter, i) => ({
    letter,
    short: t(`dim.${letter}.short`),
    full: t(`dim.${letter}.name`),
    score: Math.round(data.riasecScores[i] ?? 0),
  }))

  return {
    sources: data.sources,
    merged: data.merged,
    topDirection: data.directionScores[0]
      ? {
          id: data.directionScores[0].id,
          name: t(data.directionScores[0].nameKey),
          score: Math.round(data.directionScores[0].score),
          explanation: data.directionScores[0].explanation,
        }
      : null,
    directions: data.directionScores.map((d) => ({
      id: d.id,
      name: t(d.nameKey),
      score: Math.round(d.score),
      explanation: d.explanation,
    })),
    riasec,
    dominantDimIndex: data.archetype.dominant,
    archetype: {
      title: t(data.archetype.titleKey),
      subtitle: t(data.archetype.subtitleKey),
    },
    characterTraits: data.characterTraits.map((tr) => ({
      name: t(tr.nameKey),
      score: Math.round(tr.score),
      description: tr.description,
    })),
    values: data.values.map((v) => ({
      name: t(v.nameKey),
      score: Math.round(v.score),
      description: v.description,
    })),
    strengths: data.strengths.map((s) => ({
      name: t(s.nameKey),
      score: Math.round(s.score),
      description: s.description,
    })),
    growthAreas: data.growthAreas.map((g) => ({
      name: t(g.nameKey),
      current: Math.round(g.current),
      target: Math.round(g.target),
      description: g.description,
      action: t(g.actionKey),
    })),
    advice: data.advice.map((a) => ({
      title: t(a.titleKey),
      body: t(a.bodyKey, a.vars),
    })),
    topCareers: data.topCareers.map((c) => ({
      name: c.name,
      score: Math.round(c.score),
      description: c.description,
      reasons: c.reasons,
      skills: c.skillKeys.map((k) => t(k)),
    })),
    allCareers: data.allCareers.map((c) => ({
      name: c.name,
      score: Math.round(c.score),
      description: c.description,
      reasons: c.reasons,
    })),
    nextStep: {
      title: t(data.nextStep.titleKey),
      subtitle: t(data.nextStep.subtitleKey, { name: data.nextStep.name }),
      name: data.nextStep.name,
      target: data.nextStep.target,
    },
    summaries: {
      interests: data.summaryInterest,
      character: data.summaryCharacter,
      values: data.summaryValues,
    },
  }
}

/**
 * Stable fingerprint of the result the roadmap was built from. When the user
 * re-takes a test, a NEW roadmap is generated instead of showing a stale one.
 */
export function computeSignature(data: ResultData): string {
  const compact = {
    sources: data.sources,
    dirs: data.directionScores.map((d) => `${d.id}:${Math.round(d.score)}`),
    riasec: data.riasecScores.map((s) => Math.round(s)),
    top: data.topCareers.map((c) => `${c.name}:${Math.round(c.score)}`),
    all: data.allCareers.map((c) => `${c.name}:${Math.round(c.score)}`),
    traits: data.characterTraits.map((tr) => `${tr.nameKey}:${Math.round(tr.score)}`),
    vals: data.values.map((v) => `${v.id}:${Math.round(v.score)}`),
  }
  return JSON.stringify(compact)
}