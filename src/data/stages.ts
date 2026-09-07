// The 60-item instrument is split into 4 career-discovery stages
// (O*NET-flavored: Interests, Activities, Work Styles, Work Context).
export interface StageDef {
  key: string
  label: string
  from: number
  to: number
}

export const PER_STAGE = 15

export const STAGES: StageDef[] = [
  { key: 'QIZIQISHLAR', label: 'Qiziqishlar', from: 1, to: 15 },
  { key: 'FAOLIYATLAR', label: 'Faoliyatlar', from: 16, to: 30 },
  { key: 'ISH USLUBI', label: 'Ish uslubi', from: 31, to: 45 },
  { key: 'ISH MUHITI', label: 'Ish muhiti', from: 46, to: 60 },
]

export const stageAt = (index: number): number =>
  Math.max(0, Math.min(3, Math.floor(index / PER_STAGE)))