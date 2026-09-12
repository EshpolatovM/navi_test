import { buildShareText, shareConfig, type ShareSummaryInput } from '../../lib/share'
import type { ResultData } from './useResultData'

type Translate = (key: string, vars?: Record<string, string | number>) => string

function shareInput(data: ResultData, t: Translate, lead: string): ShareSummaryInput {
  const top = data.directionScores[0]
  return {
    lead,
    direction: top ? t('result.share.bestDirection', { name: t(top.nameKey) }) : null,
    careers: data.topCareers.slice(0, 3).map((c) => ({ name: c.name, score: c.score })),
    hashtag: shareConfig.hashtag,
  }
}

/** Result page share body: top direction + top 3 careers with scores. */
export function resultShareSummary(data: ResultData, t: Translate): string {
  return buildShareText(shareInput(data, t, t('result.share.nativeTitle')))
}

/** Roadmap share body: same summary led by the roadmap line. */
export function roadmapShareSummary(data: ResultData, t: Translate): string {
  return buildShareText(shareInput(data, t, t('roadmap.share.text')))
}