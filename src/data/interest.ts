// O*NET Interest Profiler-grounded interest assessment.
//
// Adapted from O*NET Interest Profiler / RIASEC activity concepts, reworded
// as simple everyday situations in Uzbek. NOT the official O*NET assessment —
// an adapted, O*NET-grounded interest inventory.
//
// Six dimensions (RIASEC order): R, I, A, S, E, C.
// Every item is answered on the same six-point interest scale.

export interface InterestItem {
  id: number
  q: string
  dim: number
}

// Interest scale shown on every question (strongest first). Weight = 5 - index
// on the screen, so "Juda qiziqaman" contributes 5 and "Umuman" contributes 0.
export const INTEREST_LEVELS = [
  'Juda qiziqaman',
  'Qiziqaman',
  'Qisman qiziqaman',
  'Befarqman',
  'Unchalik qiziqmayman',
  'Umuman qiziqmayman',
]

// Four everyday-situation items per dimension (R, I, A, S, E, C).
const ITEMS: InterestItem[] = [
  // R — Realistic
  { id: 1, q: 'Wi-Fi yoki sim buzilib qolsa, muammoni o\u2018zingiz topib tuzatishga harakat qilasizmi?', dim: 0 },
  { id: 2, q: 'Mebel yoki tokchani qo\u2018lda yig\u2018ish, o\u2018rnatish sizga yoqadimi?', dim: 0 },
  { id: 3, q: 'Hovlida o\u2018simlik ekish yoki boshqa jismoniy ish qilishni xohlaysizmi?', dim: 0 },
  { id: 4, q: 'Velosiped, mashina yoki biron qurilmani ta\u2019mirlashdan zavq olasizmi?', dim: 0 },

  // I — Investigative
  { id: 5, q: 'Telefon yoki kompyuter nima uchun sekinlashganini o\u2018zingiz o\u2018rganib chiqasizmi?', dim: 1 },
  { id: 6, q: 'Nimadir noto\u2018g\u2018ri ishlayotganda uning sababini izlab topish sizni qiziqtiradimi?', dim: 1 },
  { id: 7, q: 'Yangi texnologiya va kashfiyotlar haqida o\u2018qishni yoqtirasizmi?', dim: 1 },
  { id: 8, q: 'Biror masalani chuqur tahlil qilib, yechim topishni xohlaysizmi?', dim: 1 },

  // A — Artistic
  { id: 9, q: 'Uyni bezash va rang, dizayn tanlashda o\u2018z g\u2018oyangizni ishga solasizmi?', dim: 2 },
  { id: 10, q: 'Rasm chizish yoki biron-bir narsa yaratish sizga zavq beradimi?', dim: 2 },
  { id: 11, q: 'Suratga olish, video montaj yoki ijodiy kontent tayyorlashni xohlaysizmi?', dim: 2 },
  { id: 12, q: 'Yangi g\u2018oya yoki ijodiy loyiha o\u2018ylab topishni yoqtirasizmi?', dim: 2 },

  // S — Social
  { id: 13, q: 'Do\u2018stingizga uy vazifasi yoki biror ishni o\u2018rganishda yordam berasizmi?', dim: 3 },
  { id: 14, q: 'Yordamga muhtoj odamlarga ko\u2018maklashishni xohlaysizmi?', dim: 3 },
  { id: 15, q: 'Boshqalarga yangi biror ishni o\u2018rgatishni yoqtirasizmi?', dim: 3 },
  { id: 16, q: 'Jamoada ishlash va odamlar bilan doim muloqotda bo\u2018lish sizni quvvatlantiradimi?', dim: 3 },

  // E — Enterprising
  { id: 17, q: 'Do\u2018konda xaridorga tovar tanlashda yordam berib, uni ko\u2018ndirishni xohlaysizmi?', dim: 4 },
  { id: 18, q: 'Guruh ichida rahbarlikni o\u2018z qo\u2018lingizga olishni yoqtirasizmi?', dim: 4 },
  { id: 19, q: 'Biror fikr yoki mahsulotni boshqalarga ishonarli tushuntirib berasizmi?', dim: 4 },
  { id: 20, q: 'Kichkina biznes yoki loyiha boshlash g\u2018oyasi sizni qiziqtiradimi?', dim: 4 },

  // C — Conventional
  { id: 21, q: 'Hisob-kitob, ro\u2018yxat yoki jadvalni tartibga solishni yoqtirasizmi?', dim: 5 },
  { id: 22, q: 'Hujjatlar va yozuvlarni aniq, qoida bo\u2018yicha to\u2018ldirishni xohlaysizmi?', dim: 5 },
  { id: 23, q: 'Rejalar tuzib, tartib bilan ishlash sizni qoniqtiradimi?', dim: 5 },
  { id: 24, q: 'Ma\u2019lumotlarni tekshirish, xato topish va to\u2018g\u2018rilashni yoqtirasizmi?', dim: 5 },
]

export const INTEREST_ITEMS: InterestItem[] = ITEMS
export const INTEREST_COUNT = ITEMS.length
export const ITEMS_PER_DIM = 4

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