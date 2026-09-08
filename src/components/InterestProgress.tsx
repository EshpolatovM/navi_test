import { DIMS } from '../data'
import { rgba, toneFor } from '../lib/tone'

function InterestProgress({
  current,
  total,
  accent,
  activeDims,
}: {
  current: number
  total: number
  accent: string
  activeDims: number[]
}) {
  const pct = Math.round((current / total) * 100)
  const pad = String(current).padStart(2, '0')
  const padTotal = String(total).padStart(2, '0')
  const t = toneFor(accent, 0.55)

  return (
    <div className="mx-auto mb-4 w-full max-w-[560px] px-1 lg:mb-5">
      <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_1px_1px_rgba(15,23,42,0.05),0_10px_24px_-18px_rgba(15,23,42,0.25)] ring-1 ring-black/[0.04]">
        <div className="flex items-center justify-between">
          <span
            className="flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: t.deep }}
          >
            Qiziqish testi
          </span>
          <span className="font-display text-[10px] font-bold tracking-[0.14em] text-slate-500">
            SAVOL <span className="text-slate-800">{pad}</span>
            <span className="mx-1 text-slate-300">/</span>
            <span className="text-slate-400">{padTotal}</span>
            <span className="ml-2 font-semibold tabular-nums text-slate-700">{pct}%</span>
          </span>
        </div>

        {/* RIASEC strip — the dimensions present in the current question glow */}
        <div className="mt-2.5 flex items-center justify-between">
          {DIMS.map((d, i) => {
            const on = activeDims.includes(i)
            return (
              <span
                key={d.key}
                title={d.name}
                className="grid size-5 place-items-center rounded-full font-display text-[8.5px] font-bold text-white transition-all duration-300"
                style={{
                  background: d.color,
                  opacity: on ? 1 : 0.22,
                  boxShadow: on ? `0 0 0 3px ${rgba(d.color, 0.22)}, 0 4px 10px -3px ${rgba(d.color, 0.5)}` : undefined,
                  transform: on ? 'scale(1.08)' : undefined,
                }}
              >
                {d.key}
              </span>
            )
          })}
        </div>

        <div className="relative mt-2.5 h-[5px] w-full rounded-full bg-slate-200/70">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${rgba(t.main, 0.4)}, ${t.main})`,
              boxShadow: `0 0 10px ${t.glow}`,
            }}
          />
          <div
            className="animate-progress-glow absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${pct}%`, background: t.main, boxShadow: `0 0 12px 3px ${t.glow}` }}
          />
        </div>
      </div>
    </div>
  )
}

export default InterestProgress