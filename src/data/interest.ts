// O*NET Interest Profiler-grounded interest assessment.
//
// Adapted from O*NET Interest Profiler / RIASEC activity concepts, reworded as
// simple everyday situations for 11–14 year olds. NOT the official O*NET
// assessment — an adapted, O*NET-grounded interest inventory.
//
// Every question carries its OWN answer set that matches the wording and
// meaning of the situation it asks about (past experience, how often, how much
// it appeals). Answers are never forced into one universal template. The
// options keep the QuizLab QuizQuestion shape so the existing QuestionScene +
// AnswerNode rendering is reused 1:1 without any new answer layout.

import type { Option, QuizQuestion, Riaset } from './types'
import { DIMS } from './riasec'

export interface InterestItem {
  id: number
  q: string
  dim: number
  opts: string[]
}

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
// staying faithful to the O*NET Interest Profiler content. Answer options are
// natural for the question (experience / how often / appeal) and ordered from
// strongest engagement (index 0) to none (last index).
const ITEMS: InterestItem[] = [
  // R — Realistic (building, fixing, hands-on)
  {
    id: 1,
    q: 'Minecraft yoki Roblox\u2019da o\u2018zingiz server yaratib yoki uy qurab ko\u2018rganmisiz?',
    dim: 0,
    opts: [
      'Ha, o\u2018zim qilib ko\u2018rganman',
      'Ha, bir necha marta qilganman',
      'Bir marta sinab ko\u2018rganman',
      'Yo\u2018q, lekin sinab ko\u2018rgim keladi',
      'Yo\u2018q, bunga qiziqmayman',
    ],
  },
  {
    id: 2,
    q: 'Velosiped, skeyt yoki o\u2018yinchoq buzilsa, uni o\u2018zingiz tuzatishni xohlaysizmi?',
    dim: 0,
    opts: [
      'Ha, o\u2018zim tuzatishga urinaman',
      'Ba\u2019zan o\u2018zim tuzataman',
      'Faqat oson narsalarni tuzataman',
      'Odatda kattalardan so\u2018rayman',
      'Yo\u2018q, bunga qiziqmayman',
    ],
  },
  {
    id: 3,
    q: 'Uyda kartondan, qog\u2018ozdan yoki asboblar bilan biror narsa yasashni yoqtirasizmi?',
    dim: 0,
    opts: [
      'Ha, juda yoqadi',
      'Ha, qilishni yaxshi ko\u2018raman',
      'Ba\u2019zan qilaman',
      'Yo\u2018q, unchalik qiziqtirmaydi',
    ],
  },
  {
    id: 4,
    q: 'Robot, mashina yoki qurilmalarning qanday ishlashiga qiziqasizmi?',
    dim: 0,
    opts: [
      'Ha, juda qiziqaman',
      'Ha, qarash va o\u2018rganishni yaxshi ko\u2018raman',
      'Ba\u2019zan qiziqaman',
      'Yo\u2018q, unchalik qiziqmayman',
    ],
  },

  // I — Investigative (researching, finding the cause)
  {
    id: 5,
    q: 'Telefon yoki kompyuterda biror narsa ishlamay qolsa, sababini o\u2018zingiz topishga harakat qilasizmi?',
    dim: 1,
    opts: [
      'Ha, o\u2018zim topib ko\u2018raman',
      'Ha, avval o\u2018zim urinib ko\u2018raman',
      'Ba\u2019zan o\u2018zim urinaman',
      'Odatda boshqalardan yordam so\u2018rayman',
      'Yo\u2018q, menga qiziq emas',
    ],
  },
  {
    id: 6,
    q: 'Suv, o\u2018simlik yoki magnitlar bilan kichik ilmiy tajriba qilishni yoqtirasizmi?',
    dim: 1,
    opts: [
      'Ha, tajriba qilishni yaxshi ko\u2018raman',
      'Ba\u2019zan sinab ko\u2018raman',
      'Bir marta qilib ko\u2018rganman',
      'Yo\u2018q, qiziqmayman',
    ],
  },
  {
    id: 7,
    q: 'Yulduzlar, dinozavrlar yoki tabiat sirlari haqida o\u2018qib o\u2018rganishni xohlaysizmi?',
    dim: 1,
    opts: [
      'Ha, juda yoqadi',
      'Ha, qiziqaman',
      'Ba\u2019zan o\u2018qiyman',
      'Yo\u2018q, unchalik qiziqmayman',
    ],
  },
  {
    id: 8,
    q: 'Biror masalani o\u2018ylab, o\u2018zingiz yechim topganingizda quvonasizmi?',
    dim: 1,
    opts: [
      'Ha, juda quvonaman',
      'Ha, quvonaman',
      'Ba\u2019zan quvonaman',
      'Yo\u2018q, unchalik emas',
    ],
  },

  // A — Artistic (creating content, design, self-expression)
  {
    id: 9,
    q: 'Rasm chizish, suratga olish yoki video montaj qilib, o\u2018z kontentingizni yaratishni yoqtirasizmi?',
    dim: 2,
    opts: [
      'Ha, juda yoqadi',
      'Ha, qilishni yaxshi ko\u2018raman',
      'Ba\u2019zan qilaman',
      'Yo\u2018q, unchalik qiziqtirmaydi',
    ],
  },
  {
    id: 10,
    q: 'Telefonda yoki daftarda o\u2018z qahramoningiz, kiyim yoki bezak dizaynini o\u2018ylab topasizmi?',
    dim: 2,
    opts: [
      'Ha, ko\u2018p o\u2018ylab topaman',
      'Ha, tez-tez',
      'Ba\u2019zan',
      'Yo\u2018q, qilmayman',
    ],
  },
  {
    id: 11,
    q: 'Hikoya, qo\u2018shiq yoki she\u2019r yozib, fikrlaringizni ifoda etishni xohlaysizmi?',
    dim: 2,
    opts: [
      'Ha, juda yoqadi',
      'Ha, yozishni yaxshi ko\u2018raman',
      'Ba\u2019zan yozaman',
      'Yo\u2018q, qiziqmayman',
    ],
  },
  {
    id: 12,
    q: 'Xonangiz yoki stolingizni o\u2018z didingiz bilan chiroyli bezashni yoqtirasizmi?',
    dim: 2,
    opts: [
      'Ha, juda yoqadi',
      'Ha, yaxshi ko\u2018raman',
      'Ba\u2019zan qilaman',
      'Yo\u2018q, qilmayman',
    ],
  },

  // S — Social (helping, teaching, connecting)
  {
    id: 13,
    q: 'Do\u2018stingizga o\u2018yin qoidalarini yoki uy vazifasini tushuntirib berishni yoqtirasizmi?',
    dim: 3,
    opts: [
      'Ha, tushuntirishni yoqtiraman',
      'Ha, tushuntirib beraman',
      'Ba\u2019zan beraman',
      'Yo\u2018q, unchalik yoqmaydi',
    ],
  },
  {
    id: 14,
    q: 'Sinfdoshlaringizga yoki kichiklarga yordam berishdan xursand bo\u2018lasizmi?',
    dim: 3,
    opts: [
      'Ha, har doim yordam beraman',
      'Ha, yordam berishni yaxshi ko\u2018raman',
      'Ba\u2019zan yordam beraman',
      'Yo\u2018q, unchalik emas',
    ],
  },
  {
    id: 15,
    q: 'Guruh o\u2018yinida hamma bilan muloqot qilib, birga o\u2018ynashni xohlaysizmi?',
    dim: 3,
    opts: [
      'Ha, muloqotni juda yoqtiraman',
      'Ha, yoqtiraman',
      'Ba\u2019zan',
      'Yo\u2018q, yakka o\u2018ynashni afzal ko\u2018raman',
    ],
  },
  {
    id: 16,
    q: 'Do\u2018stlaringiz muammosini tinglab, ularga dalda berishni yoqtirasizmi?',
    dim: 3,
    opts: [
      'Ha, do\u2018stlarimni tinglayman',
      'Ha, dalda berishni yaxshi ko\u2018raman',
      'Ba\u2019zan',
      'Yo\u2018q, unchalik emas',
    ],
  },

  // E — Enterprising (leading, selling, persuading)
  {
    id: 17,
    q: 'Sinf yoki to\u2018garak ishida rahbar bo\u2018lib, ishlarni taqsimlashni xohlaysizmi?',
    dim: 4,
    opts: [
      'Ha, rahbar bo\u2018lishni xohlayman',
      'Ha, yoqadi',
      'Ba\u2019zan',
      'Yo\u2018q, unchalik yoqmaydi',
    ],
  },
  {
    id: 18,
    q: 'Yarmarka yoki do\u2018konda biror narsani sotish va odamlarni ko\u2018ndirishni sinab ko\u2018rmoqchimisiz?',
    dim: 4,
    opts: [
      'Ha, sotib ko\u2018rganman va yoqdi',
      'Ha, sinab ko\u2018rmoqchiman',
      'Ba\u2019zan qiziqiyman',
      'Yo\u2018q, qiziqmayman',
    ],
  },
  {
    id: 19,
    q: 'Yangi o\u2018yin-g\u2018oyani taklif qilib, guruhni o\u2018z fikringizga ishontirmoqchisiz?',
    dim: 4,
    opts: [
      'Ha, g\u2018oyamni tushuntirib beraman',
      'Ha, urinaman',
      'Ba\u2019zan',
      'Yo\u2018q, qilmayman',
    ],
  },
  {
    id: 20,
    q: 'Musobaqada jamoani g\u2018oliblikka undash va boshqarishni yoqtirasizmi?',
    dim: 4,
    opts: [
      'Ha, jamoani boshqarishni yoqtiraman',
      'Ha, yoqadi',
      'Ba\u2019zan',
      'Yo\u2018q, unchalik emas',
    ],
  },

  // C — Conventional (organizing, records, rules)
  {
    id: 21,
    q: 'Kitoblar, o\u2018yinchoqlar yoki qalamlaringizni tartibga solib, ro\u2018yxat tuzishni yoqtirasizmi?',
    dim: 5,
    opts: [
      'Ha, tartibga solishni yoqtiraman',
      'Ha, yaxshi ko\u2018raman',
      'Ba\u2019zan qilaman',
      'Yo\u2018q, unchalik emas',
    ],
  },
  {
    id: 22,
    q: 'Dars va to\u2018garak rejasini tuzib, ishlarini o\u2018z vaqtida bajarishdan mamnun bo\u2018lasizmi?',
    dim: 5,
    opts: [
      'Ha, reja tuzib bajaraman',
      'Ha, o\u2018z vaqtida bajarishga harakat qilaman',
      'Ba\u2019zan',
      'Yo\u2018q, unchalik emas',
    ],
  },
  {
    id: 23,
    q: 'Ballar yoki pullar hisobini yuritib, xatoni topishni yoqtirasizmi?',
    dim: 5,
    opts: [
      'Ha, hisob yuritishni yoqtiraman',
      'Ha, yoqadi',
      'Ba\u2019zan',
      'Yo\u2018q, unchalik emas',
    ],
  },
  {
    id: 24,
    q: 'Stikerlar va jadvallar bilan reja yuritib, tartibda qolishni xohlaysizmi?',
    dim: 5,
    opts: [
      'Ha, reja yuritishni yaxshi ko\u2018raman',
      'Ha, yoqadi',
      'Ba\u2019zan qilaman',
      'Yo\u2018q, qiziqmayman',
    ],
  },
]

export const INTEREST_ITEMS: InterestItem[] = ITEMS
export const INTEREST_COUNT = ITEMS.length
export const ITEMS_PER_DIM = 4

// Questions fed straight into the existing QuestionScene: identical shape,
// question-specific answer options, only accent (per RIASEC dimension) differs.
// All 24 questions belong to a single QIZIQISHLAR stage (stage 0).
export const INTEREST_QUESTIONS: QuizQuestion[] = ITEMS.map((it) => ({
  id: it.id,
  q: it.q,
  accent: DIMS[it.dim].color,
  stage: 0,
  difficulty: 0.55,
  opts: it.opts.map((text): Option => ({ text, w: DIM_WEIGHT[it.dim] })),
}))

export interface InterestProfile {
  // counts[d] — how many items of dimension d were answered.
  counts: number[]
  // scores[d] — 0..100 on the interest scale (strongest option = 100).
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
    if (v === undefined || v < 0 || v >= item.opts.length) return
    counts[item.dim]++
    // Options are ordered strongest → none; normalize by set length so 4- and
    // 5-option questions score on the same 0..1 scale.
    const rel = (item.opts.length - 1 - v) / (item.opts.length - 1)
    sums[item.dim] += rel
  })

  const scores = sums.map((s, d) => (counts[d] > 0 ? Math.round((s / counts[d]) * 100) : 0))
  const top = [0, 1, 2, 3, 4, 5].sort((a, b) => scores[b] - scores[a] || a - b)
  return { counts, scores, appearances, top }
}