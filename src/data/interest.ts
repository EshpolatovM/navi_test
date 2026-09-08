// O*NET-grounded interest assessment (Interest Profiler style).
//
// Adapted belief statements are NOT the official O*NET instrument — they are
// activity-oriented items built around the six RIASEC interest dimensions
// (Realistic, Investigative, Artistic, Social, Enterprising, Conventional).
// Options are concrete work/activity phrases in natural Uzbek; dimension
// order follows RIASEC [R, I, A, S, E, C].

export interface InterestOption {
  text: string
  dim: number
}

export interface InterestItem {
  id: number
  q: string
  opts: InterestOption[]
}

// Activity pools per dimension — concrete work/leisure behaviors.
const POOLS: string[][] = [
  // R — Realistic
  [
    "Mexanik qurilma yoki asbobni tuzatish",
    "Yog'och yoki metall narsa yasash",
    "Mashina yoki motorni sozlash va boshqarish",
    "Elektr simlari yoki texnik uskunani o'rnatish",
    "Qo'l asboblari bilan aniq ish bajarish",
    "Tashqi makonda jismoniy mehnat qilish",
  ],
  // I — Investigative
  [
    "Muammoning sababini izlash va aniqlash",
    "Ilmiy tajriba o'tkazib, natijani kuzatish",
    "Ma'lumotlarni tahlil qilib, xulosa chiqarish",
    "Yangi bilimlarni tadqiq qilish",
    "Narsalar qanday ishlashini o'rganish",
    "Buzilish yoki xatoning manbasini topish",
  ],
  // A — Artistic
  [
    "Yangi narsa loyihalash va yaratish",
    "Rasm, dizayn yoki bezak yaratish",
    "Hikoya, matn yoki she'r yozish",
    "Vizual g'oya va ko'rinish o'ylab topish",
    "Biror narsaning ko'rinishini o'zgacha qilish",
    "Ijodiy sahna yoki ko'rgazma tayyorlash",
  ],
  // S — Social
  [
    "Odamlarga yordam berish yoki maslahat berish",
    "Bolalar yoki kattalarga o'rgatish",
    "Muhtojlar va bemorlarga g'amxo'rlik qilish",
    "Jamoada muloqot va hamkorlik qilish",
    "Odamlarning muammosini tinglash",
    "Uchrashuv va tadbirlarni o'tkazish",
  ],
  // E — Enterprising
  [
    "Odamlarni biror fikrga ishontirish",
    "Kichik guruh yoki jamoani boshqarish",
    "Mahsulot yoki xizmatni sotish",
    "Muzokara olib borish",
    "Yangi loyiha yoki biznes g'oyasini boshlash",
    "Qaror qabul qilish va mas'uliyat olish",
  ],
  // C — Conventional
  [
    "Ma'lumotlarni tartibga solish va saqlash",
    "Hisob-kitob va statistika yuritish",
    "Hujjatlar va yozuvlarni aniq rasmiylashtirish",
    "Jadval va rejalar tuzish",
    "Qoidalar va tartiblarga muvofiq ishlash",
    "Ma'lumotlarni tekshirish va xato topish",
  ],
]

const STEMS = [
  "Ushbu faoliyatlarning qaysi biri sizga ko'proq yoqadi?",
  "Qaysi mashg'ulotda vaqt o'tkazish sizga zavq beradi?",
  "Qaysi ish turiga ko'proq qiziqasiz?",
  "Qaysi faoliyat sizni ko'proq jalb qiladi?",
  "Qaysi mashg'ulot sizga yaqinroq?",
  "Qaysi ishni bajarishni ko'proq yoqtirasiz?",
  "Qaysi faoliyat sizga eng mos keladi?",
  "Qaysi mashg'ulotni tanlagan bo'lar edingiz?",
]

// Balanced triples: each RIASEC dimension appears exactly 9 times across the
// 18 three-option items.
const TRIADS: number[][] = [
  [0, 1, 2], [3, 4, 5], [0, 3, 4], [1, 2, 5], [1, 3, 5], [0, 2, 4],
  [2, 4, 5], [0, 1, 3], [0, 1, 4], [2, 3, 5], [0, 2, 3], [1, 4, 5],
  [0, 1, 5], [2, 3, 4], [1, 3, 4], [0, 2, 5], [0, 4, 5], [1, 2, 3],
]

// Option text rotation counters, so a given pool phrase is only reused after
// the pool cycles and never appears twice in the same question.
function buildItems(): InterestItem[] {
  const counters = [0, 0, 0, 0, 0, 0]
  const next = (dim: number) => POOLS[dim][counters[dim]++ % POOLS[dim].length]
  const items: InterestItem[] = TRIADS.map((t, i) => ({
    id: i + 1,
    q: STEMS[i % STEMS.length],
    opts: t.map((dim) => ({ text: next(dim), dim })),
  }))

  // A few items with a different amount of options, as the source often has
  // response sets that vary in size.
  let c = [0, 0, 0, 0, 0, 0]
  const take = (dim: number) => POOLS[dim][c[dim] += 1, c[dim] % POOLS[dim].length]
  items.push(
    { id: 19, q: "Quyidagi ikkitadan qaysi ish sizga yaqinroq?", opts: [{ text: take(0), dim: 0 }, { text: take(3), dim: 3 }] },
    { id: 20, q: "Shu ikkita faoliyatdan qaysi birini tanlardingiz?", opts: [{ text: take(1), dim: 1 }, { text: take(5), dim: 5 }] },
  )
  items.push(
    { id: 21, q: "Qaysi mashg'ulotlar sizni ko'proq ruhlantirdi?", opts: [{ text: take(0), dim: 0 }, { text: take(2), dim: 2 }, { text: take(4), dim: 4 }, { text: take(5), dim: 5 }] },
    { id: 22, q: "Qaysi ish turlarida o'zingizni ko'proq topgan bo'lar edingiz?", opts: [{ text: take(1), dim: 1 }, { text: take(3), dim: 3 }, { text: take(4), dim: 4 }, { text: take(5), dim: 5 }] },
  )
  return items
}

export const INTEREST_ITEMS: InterestItem[] = buildItems()
export const INTEREST_COUNT = INTEREST_ITEMS.length

export interface InterestProfile {
  // counts[d] — how many times the user picked dimension d.
  counts: number[]
  // scores[d] — 0..100 normalized per appearances of d across the items.
  scores: number[]
  // appearances[d] — total options offered for d.
  appearances: number[]
  // top — dimensions ranked strongest first.
  top: number[]
}

export function computeInterestProfile(answers: number[]): InterestProfile {
  const counts = [0, 0, 0, 0, 0, 0]
  const appearances = [0, 0, 0, 0, 0, 0]

  INTEREST_ITEMS.forEach((item, i) => {
    item.opts.forEach((o) => appearances[o.dim]++)
    const chosen = answers[i]
    if (chosen === undefined) return
    const opt = item.opts[chosen]
    if (opt) counts[opt.dim]++
  })

  const scores = appearances.map((a, d) => (a > 0 ? Math.round((counts[d] / a) * 100) : 0))
  const top = [0, 1, 2, 3, 4, 5].sort((a, b) => scores[b] - scores[a] || a - b)
  return { counts, scores, appearances, top }
}