// O*NET Interest Profiler-grounded interest assessment.
//
// Adapted from O*NET Interest Profiler / RIASEC activity concepts, reworded as
// simple everyday situations for 11–14 year olds. NOT the official O*NET
// assessment — an adapted, O*NET-grounded interest inventory.
//
// Every question reuses the exact same QuizLab QuizQuestion shape and the same
// six-point interest scale as its answer set, so the existing QuestionScene +
// AnswerNode rendering is reused 1:1 without any new answer layout.

import type { Option, QuizQuestion, Riaset } from './types'
import { DIMS } from './riasec'
import { stageAt } from './stages'

export interface InterestItem {
  id: number
  q: string
  dim: number
}

// The six-point interest scale shown on every question (strongest first).
// Scoring weight = 5 - index, so "Juda qiziqaman" contributes 5 and
// "Umuman qiziqmayman" contributes 0.
export const INTEREST_LEVELS = [
  'Juda qiziqaman',
  'Qiziqaman',
  'Qisman qiziqaman',
  'Befarqman',
  'Unchalik qiziqmayman',
  'Umuman qiziqmayman',
]

// Single-dimension weight vector used as the answer option weight, so the
// AnswerNode badge picks the icon of the dimension the question measures.
const DIM_WEIGHT: Riaset[] = [
  [2, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 0],
  [0, 0, 2, 0, 0, 0],
  [0, 0, 0, 2, 0, 0],
  [0, 0, 0, 0, 2, 0],
  [0, 0, 0, 0, 0, 2],
]

// Four everyday kid-friendly situations per dimension (R, I, A, S, E, C),
// staying faithful to the O*NET Interest Profiler content.
const ITEMS: InterestItem[] = [
  // R — Realistic (building, fixing, hands-on)
  { id: 1, q: 'Minecraft yoki Roblox\u2019da o\u2018zingiz server yaratib yoki uy qurab ko\u2018rganmisiz?', dim: 0 },
  { id: 2, q: 'Velosiped, skeyt yoki o\u2018yinchoq buzilsa, uni o\u2018zingiz tuzatishni xohlaysizmi?', dim: 0 },
  { id: 3, q: 'Uyda kartondan, qog\u2018ozdan yoki asboblar bilan biror narsa yasashni yoqtirasizmi?', dim: 0 },
  { id: 4, q: 'Robot, mashina yoki qurilmalarning qanday ishlashiga qiziqasizmi?', dim: 0 },

  // I — Investigative (researching, finding the cause)
  { id: 5, q: 'Telefon yoki kompyuterda biror narsa ishlamay qolsa, sababini o\u2018zingiz topishga harakat qilasizmi?', dim: 1 },
  { id: 6, q: 'Suv, o\u2018simlik yoki magnitlar bilan kichik ilmiy tajriba qilishni yoqtirasizmi?', dim: 1 },
  { id: 7, q: 'Yulduzlar, dinozavrlar yoki tabiat sirlari haqida o\u2018qib o\u2018rganishni xohlaysizmi?', dim: 1 },
  { id: 8, q: 'Biror masalani o\u2018ylab, o\u2018zingiz yechim topganingizda quvonasizmi?', dim: 1 },

  // A — Artistic (creating content, design, self-expression)
  { id: 9, q: 'Rasm chizish, suratga olish yoki video montaj qilib, o\u2018z kontentingizni yaratishni yoqtirasizmi?', dim: 2 },
  { id: 10, q: 'Telefonda yoki daftarda o\u2018z qahramoningiz, kiyim yoki bezak dizaynini o\u2018ylab topasizmi?', dim: 2 },
  { id: 11, q: 'Hikoya, qo\u2018shiq yoki she\u2019r yozib, fikrlaringizni ifoda etishni xohlaysizmi?', dim: 2 },
  { id: 12, q: 'Xonangiz yoki stolingizni o\u2018z didingiz bilan chiroyli bezashni yoqtirasizmi?', dim: 2 },

  // S — Social (helping, teaching, connecting)
  { id: 13, q: 'Do\u2018stingizga o\u2018yin qoidalarini yoki uy vazifasini tushuntirib berishni yoqtirasizmi?', dim: 3 },
  { id: 14, q: 'Sinfdoshlaringizga yoki kichiklarga yordam berishdan xursand bo\u2018lasizmi?', dim: 3 },
  { id: 15, q: 'Guruh o\u2018yinida hamma bilan muloqot qilib, birga o\u2018ynashni xohlaysizmi?', dim: 3 },
  { id: 16, q: 'Do\u2018stlaringiz muammosini tinglab, ularga dalda berishni yoqtirasizmi?', dim: 3 },

  // E — Enterprising (leading, selling, persuading)
  { id: 17, q: 'Sinf yoki to\u2018garak ishida rahbar bo\u2018lib, ishlarni taqsimlashni xohlaysizmi?', dim: 4 },
  { id: 18, q: 'Yarmarka yoki do\u2018konda biror narsani sotish va odamlarni ko\u2018ndirishni sinab ko\u2018rmoqchimisiz?', dim: 4 },
  { id: 19, q: 'Yangi o\u2018yin-g\u2018oyani taklif qilib, guruhni o\u2018z fikringizga ishontirmoqchisiz?', dim: 4 },
  { id: 20, q: 'Musobaqada jamoani g\u2018oliblikka undash va boshqarishni yoqtirasizmi?', dim: 4 },

  // C — Conventional (organizing, records, rules)
  { id: 21, q: 'Kitoblar, o\u2018yinchoqlar yoki qalamlaringizni tartibga solib, ro\u2018yxat tuzishni yoqtirasizmi?', dim: 5 },
  { id: 22, q: 'Dars va to\u2018garak rejasini tuzib, ishlarini o\u2018z vaqtida bajarishdan mamnun bo\u2018lasizmi?', dim: 5 },
  { id: 23, q: 'Ballar yoki pullar hisobini yuritib, xatoni topishni yoqtirasizmi?', dim: 5 },
  { id: 24, q: 'Stikerlar va jadvallar bilan reja yuritib, tartibda qolishni xohlaysizmi?', dim: 5 },
]

export const INTEREST_ITEMS: InterestItem[] = ITEMS
export const INTEREST_COUNT = ITEMS.length
export const ITEMS_PER_DIM = 4

// Questions fed straight into the existing QuestionScene: identical shape,
// identical 6 answer options (the interest scale), only the question text and
// the accent (per RIASEC dimension) differ.
export const INTEREST_QUESTIONS: QuizQuestion[] = ITEMS.map((it, i) => ({
  id: it.id,
  q: it.q,
  accent: DIMS[it.dim].color,
  stage: stageAt(i),
  difficulty: 0.55,
  opts: INTEREST_LEVELS.map((text): Option => ({ text, w: DIM_WEIGHT[it.dim] })),
}))

export interface InterestProfile {
  // counts[d] — how many items of dimension d were answered.
  counts: number[]
  // scores[d] — 0..100 on the interest scale (5 = "Juda qiziqaman").
  scores: number[]
  // appearances[d] — total items available for dimension d.
  appearances: number[]
  // top — dimensions ranked strongest first.
  top: number[]
}

export function computeInterestProfile(answers: number[]): InterestProfile {
  const sums = [0, 0, 0, 0, 0, 0]
  const counts = [0, 0, 0, 0, 0, 0]
  const appearances = [0, 0, 0, 0, 0, 0]

  ITEMS.forEach((item, i) => {
    appearances[item.dim]++
    const v = answers[i]
    if (v === undefined || v < 0 || v > 5) return
    // weight: "Juda qiziqaman" (index 0) = 5 … "Umuman" (index 5) = 0
    sums[item.dim] += 5 - v
    counts[item.dim]++
  })

  const scores = sums.map((s, d) => (counts[d] > 0 ? Math.round((s / (counts[d] * 5)) * 100) : 0))
  const top = [0, 1, 2, 3, 4, 5].sort((a, b) => scores[b] - scores[a] || a - b)
  return { counts, scores, appearances, top }
}