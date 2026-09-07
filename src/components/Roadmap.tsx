import { Check, Compass } from 'lucide-react'
import { STAGES, RESULT_STAGE, PER_STAGE, type StageDef } from '../data'
import { mix, rgba, toneFor } from '../lib/tone'

type Status = 'done' | 'active' | 'upcoming'

interface Step extends StageDef {
  status: Status
  meta?: string
}

function Roadmap({ index, difficulty, total }: { index: number; difficulty: number; total: number }) {
  const stageIndex = Math.min(Math.floor(index / PER_STAGE), STAGES.length - 1)
  const local = (index % PER_STAGE) + 1

  const tone = toneFor(STAGES[stageIndex].accent, difficulty)

  const startStep: StageDef = {
    ...STAGES[0],
    key: 'BOSHLASH',
    label: 'Boshlash',
  }

  const steps: Step[] = [
    {
      ...startStep,
      status: index === 0 ? 'active' : 'done',
      meta: `${total} savol`,
    },
    ...STAGES.map((s, si) => {
      const range = `${String(s.from).padStart(2, '0')}\u2013${s.to} / ${total}`
      const status: Status = si < stageIndex ? 'done' : si === stageIndex ? 'active' : 'upcoming'
      return {
        ...s,
        status,
        meta: status === 'active' ? `${range} \u00b7 savol ${local}/${PER_STAGE}` : range,
      }
    }),
    {
      ...RESULT_STAGE,
      status: 'upcoming' as Status,
      meta: 'Karyera signalingiz',
    },
  ]

  const labelColor = (s: Step) => {
    if (s.status === 'active') return tone.deep
    if (s.status === 'done') return mix(s.accent, '#0f172a', 0.3)
    return '#94a3b8'
  }

  return (
    <aside className="hidden w-[176px] shrink-0 xl:block" aria-label="Bosqichlar">
      <div className="rounded-2xl border border-white/80 bg-white/55 p-3.5 shadow-[0_18px_40px_-26px_rgba(28,25,23,0.28)] backdrop-blur-md">
        <p className="mb-2 px-1.5 font-display text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
          Sayohat
        </p>

        <ol>
          {steps.map((s, i) => {
            const isLast = i === steps.length - 1
            const Icon = s.icon
            return (
              <li key={s.key} className="relative flex items-start gap-2.5 px-0.5 py-[5px]">
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute left-[7px] top-6 h-[calc(100%-9px)] w-px"
                    style={{
                      background: s.status === 'done' ? rgba(s.accent, 0.45) : '#e2e8f0',
                    }}
                  />
                )}

                <span
                  className="relative z-10 mt-0.5 grid size-[14px] shrink-0 place-items-center rounded-full text-white"
                  style={
                    s.status === 'done'
                      ? { background: s.accent, boxShadow: `0 2px 6px ${rgba(s.accent, 0.45)}` }
                      : s.status === 'active'
                        ? {
                            background: tone.main,
                            boxShadow: `0 0 0 3.5px ${rgba(s.accent, 0.18)}, 0 2px 8px ${rgba(s.accent, 0.4)}`,
                          }
                        : { background: rgba(s.accent, 0.14), color: rgba(s.accent, 0.85) }
                  }
                >
                  {s.status === 'done' ? (
                    <Check style={{ width: 11, height: 11 }} strokeWidth={3.5} />
                  ) : s.status === 'active' && s.key === 'BOSHLASH' ? (
                    <Compass style={{ width: 10, height: 10 }} strokeWidth={2.4} />
                  ) : s.status === 'active' ? (
                    <Icon style={{ width: 10, height: 10 }} strokeWidth={2.4} />
                  ) : (
                    <Icon style={{ width: 10, height: 10 }} strokeWidth={2.2} />
                  )}
                </span>

                <span className="min-w-0">
                  <span
                    className={`flex items-center gap-1 font-display text-[11px] font-bold uppercase tracking-[0.13em] ${
                      s.status === 'upcoming' ? 'text-slate-400' : ''
                    }`}
                    style={s.status === 'upcoming' ? undefined : { color: labelColor(s) }}
                  >
                    {s.key}
                  </span>
                  <span className="block text-[10px] font-medium tabular-nums text-slate-400">
                    {s.meta}
                  </span>
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </aside>
  )
}

export default Roadmap