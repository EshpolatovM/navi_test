import { Check, Compass, Flag } from 'lucide-react'
import { STAGES, PER_STAGE } from '../data'

type Status = 'done' | 'active' | 'upcoming'

interface Step {
  key: string
  range?: string
}

function Roadmap({ index, total, accent }: { index: number; total: number; accent: string }) {
  const stageIndex = Math.min(Math.floor(index / PER_STAGE), STAGES.length - 1)
  const local = (index % PER_STAGE) + 1

  const steps: Array<Step & { status: Status; meta?: string }> = [
    {
      key: 'BOSHLASH',
      status: index === 0 ? 'active' : 'done',
      meta: `${total} savol`,
    },
    ...STAGES.map((s, si) => {
      const range = `${String(s.from).padStart(2, '0')}\u2013${s.to} / ${total}`
      const status: Status = si < stageIndex ? 'done' : si === stageIndex ? 'active' : 'upcoming'
      return {
        key: s.key,
        range,
        status,
        meta: status === 'active' ? `${range} \u00b7 savol ${local}/${PER_STAGE}` : range,
      }
    }),
    {
      key: 'NATIJA',
      status: 'upcoming' as Status,
      meta: 'Karyera signalingiz',
    },
  ]

  const dotColor = (st: Status) =>
    st === 'done'
      ? { background: accent, boxShadow: `0 0 8px ${accent}77` }
      : st === 'active'
        ? {
            background: accent,
            boxShadow: `0 0 0 3.5px ${accent}29, 0 0 10px ${accent}88`,
          }
        : { background: '#cbd5e1' }

  return (
    <aside className="hidden w-[176px] shrink-0 xl:block" aria-label="Bosqichlar">
      <div className="rounded-2xl border border-white/80 bg-white/55 p-3.5 shadow-[0_18px_40px_-26px_rgba(28,25,23,0.28)] backdrop-blur-md">
        <p className="mb-2 px-1.5 font-display text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
          Sayohat
        </p>

        <ol>
          {steps.map((s, i) => {
            const isLast = i === steps.length - 1
            return (
              <li key={s.key} className="relative flex items-start gap-2.5 px-0.5 py-[5px]">
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute left-[7px] top-6 h-[calc(100%-9px)] w-px"
                    style={{
                      background: s.status === 'done' ? `${accent}55` : '#e2e8f0',
                    }}
                  />
                )}

                <span
                  className={`relative z-10 mt-0.5 flex size-[14px] shrink-0 items-center justify-center rounded-full ${
                    s.status === 'done' ? 'text-white' : ''
                  }`}
                  style={s.status === 'done' ? dotColor('done') : {}}
                >
                  {s.status === 'done' ? (
                    <Check style={{ width: 11, height: 11 }} strokeWidth={3.5} />
                  ) : (
                    <span className="block size-[14px] rounded-full" style={dotColor(s.status)} />
                  )}
                </span>

                <span className="min-w-0">
                  <span
                    className={`flex items-center gap-1 font-display text-[11px] font-bold uppercase tracking-[0.13em] ${
                      s.status === 'active'
                        ? 'text-slate-800'
                        : s.status === 'done'
                          ? 'text-slate-500'
                          : 'text-slate-400'
                    }`}
                  >
                    {s.key}
                    {s.key === 'NATIJA' && <Flag style={{ width: 11, height: 11 }} className="shrink-0" />}
                    {s.key === 'BOSHLASH' && (
                      <Compass style={{ width: 11, height: 11 }} className="shrink-0" />
                    )}
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