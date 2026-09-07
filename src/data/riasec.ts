// RIASEC / O*NET Interest Profiler dimension metadata.
// Index order matches Riaset: [R, I, A, S, E, C]

export const DIM_COUNT = 6

export interface DimensionMeta {
  key: string
  name: string
  phrase: string
  keyAdj: string
}

export const DIMS: DimensionMeta[] = [
  {
    key: 'R',
    name: 'Amaliy (Realistik)',
    phrase: 'asbob-uskunalar, materiallar, mashinalar va real jismoniy narsalar bilan ishlashni',
    keyAdj: 'amaliy va mohir',
  },
  {
    key: 'I',
    name: 'Izlanuvchan (Analitik)',
    phrase: 'tahlil qilish, tadqiq qilish va narsalarning qanday ishlashini aniqlashni',
    keyAdj: 'tahliliy va izlanuvchan',
  },
  {
    key: 'A',
    name: 'Ijodiy (Artistik)',
    phrase: 'dizayn qilish, yaratish va original g\u2018oyalarni ifoda etishni',
    keyAdj: 'ijodiy va ifodali',
  },
  {
    key: 'S',
    name: 'Ijtimoiy',
    phrase: 'odamlarga yordam berish, ta\u2019lim berish va ular bilan muloqot qilishni',
    keyAdj: 'odamlarga yo\u2018naltirilgan',
  },
  {
    key: 'E',
    name: 'Tadbirkor',
    phrase: 'rahbarlik qilish, ishontirish va katta maqsadlarga erishishni',
    keyAdj: 'tadbirkor va natijaga intiluvchan',
  },
  {
    key: 'C',
    name: 'Tartibli (Konventsional)',
    phrase: 'tartibga solish, rejalashtirish va aniq izchillikni saqlashni',
    keyAdj: 'tartibli va sinchkov',
  },
]