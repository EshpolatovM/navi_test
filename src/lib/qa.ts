// Localization bridge between the data layer (single UZ source, untouched)
// and the three-language dictionaries in src/locales/qa.ts.
//
// Returns a NEW QuizQuestion whose visible text is swapped for the requested
// language. Structure, option order, weights (scoring) and ids stay identical —
// the same object can be re-localized at any moment without losing test state.
import type { QuizQuestion } from '../data'
import { CAREER_META, CAREER_QA, INTEREST_QA } from '../locales/qa'
import type { Lang } from './i18n'

function primaryDim(w: readonly number[]): number {
  let best = 0
  for (let i = 1; i < w.length; i++) if (w[i] > w[best]) best = i
  return best
}

export function localizeCareer(question: QuizQuestion, lang: Lang): QuizQuestion {
  const map = CAREER_QA[question.id]
  if (!map) return question
  return {
    ...question,
    q: map.q[lang] ?? question.q,
    opts: question.opts.map((opt) => {
      const text = map.opts[primaryDim(opt.w)]?.[lang]
      return text ? { ...opt, text } : opt
    }),
  }
}

export function localizeInterest(question: QuizQuestion, lang: Lang): QuizQuestion {
  const map = INTEREST_QA[question.id]
  if (!map) return question
  return {
    ...question,
    q: map.q[lang] ?? question.q,
    opts: question.opts.map((opt, i) => {
      const text = map.opts[i]?.[lang]
      return text ? { ...opt, text } : opt
    }),
  }
}

export function careerName(id: string, lang: Lang): string | undefined {
  return CAREER_META[id]?.name[lang]
}

export function careerDescription(id: string, lang: Lang): string | undefined {
  return CAREER_META[id]?.description[lang]
}