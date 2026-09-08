// RIASEC / O*NET Interest Profiler dimension metadata.
// Index order matches Riaset: [R, I, A, S, E, C]

export const DIM_COUNT = 6

export interface DimensionMeta {
  key: string
  name: string
  short: string
  phrase: string
  keyAdj: string
  color: string
}

export const DIMS: DimensionMeta[] = [
  {
    key: 'R',
    name: 'Amaliy (Realistik)',
    short: 'Amaliy',
    phrase: 'asbob-uskunalar, materiallar, mashinalar va real jismoniy narsalar bilan ishlashni',
    keyAdj: 'amaliy va mohir',
    color: '#10B981',
  },
  {
    key: 'I',
    name: 'Izlanuvchan (Analitik)',
    short: 'Izlanuvchan',
    phrase: 'tahlil qilish, tadqiq qilish va narsalarning qanday ishlashini aniqlashni',
    keyAdj: 'tahliliy va izlanuvchan',
    color: '#2563EB',
  },
  {
    key: 'A',
    name: 'Ijodiy (Artistik)',
    short: 'Ijodiy',
    phrase: 'dizayn qilish, yaratish va original g\u2018oyalarni ifoda etishni',
    keyAdj: 'ijodiy va ifodali',
    color: '#DB2777',
  },
  {
    key: 'S',
    name: 'Ijtimoiy',
    short: 'Ijtimoiy',
    phrase: 'odamlarga yordam berish, ta\u2019lim berish va ular bilan muloqot qilishni',
    keyAdj: 'odamlarga yo\u2018naltirilgan',
    color: '#F59E0B',
  },
  {
    key: 'E',
    name: 'Tadbirkor',
    short: 'Tadbirkor',
    phrase: 'rahbarlik qilish, ishontirish va katta maqsadlarga erishishni',
    keyAdj: 'tadbirkor va natijaga intiluvchan',
    color: '#EA580C',
  },
  {
    key: 'C',
    name: 'Tartibli (Konventsional)',
    short: 'Tartibli',
    phrase: 'tartibga solish, rejalashtirish va aniq izchillikni saqlashni',
    keyAdj: 'tartibli va sinchkov',
    color: '#64748B',
  },
]