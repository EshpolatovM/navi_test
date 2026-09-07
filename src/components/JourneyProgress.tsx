import { Check } from 'lucide-react'
import { STAGES } from '../data'

function JourneyProgress({
  current,
  total,
  accent,
  stageKey,
  stageCurrent,
  stageTotal,
}: {
  current: number
  total: number
  accent: string
  stageKey: string
  stageCurrent: number
  stageTotal: number
}) {
  const pct = Math.round((current / total) * 100)
  const pad = String(current).padStart(2, '0')
  const padTotal = String(total).padStart(2, '0')
  const activeIdx = Math.max(0, STAGES.findIndex((s) => s.key === stageKey))
  const steps = [...STAGES.map((s) => s.key), 'NATIJA']
  const trackPct = Math.min(100, ((activeIdx + stageCurrent / stageTotal) / (steps.length - 1)) * 100)

  return (
    <div className="mx-auto mb-4 w-full max-w-2xl px-1 lg:mb-5">
      {/* Desktop header — stage label + question counter */}
      <div className="hidden items-end justify-between lg:flex">
        <div className="flex flex-col gap-1">
          <span
            className="font-display text-[10px] font-bold uppercase tracking-[0.24em]"
            style={{ color: accent }}
          >
            {stageKey}
          </span>
          <span className="font-display text-[13px] font-semibold tracking-[0.16em] text-slate-500">
            SAVOL <span className="text-slate-800">{pad}</span>
            <span className="mx-1.5 text-slate-300">·</span>
            <span className="text-slate-400">{padTotal}</span>
            <span className="mx-1.5 text-slate-200">·</span>
            <span className="text-slate-400">{stageCurrent}/{stageTotal}</span>
          </span>
        </div>
        <span
          className="font-display text-[15px] font-semibold tabular-nums transition-colors duration-500"
          style={{ color: accent }}
        >
          {pct}%
        </span>
      </div>

      {/* Mobile & tablet: compact horizontal stage roadmap */}
      <div className="lg:hidden">
        <div className="relative">
          <div className="absolute top-[5px] right-[7%] left-[7%] h-[2px] rounded-full bg-slate-200/90" />
          <div
            className="absolute top-[5px] left-[7%] h-[2px] rounded-full transition-[width] duration-500 ease-out"
            style={{
              width: `calc(86% * ${trackPct} / 100)`,
              background: `linear-gradient(90deg, ${accent}66, ${accent})`,
            }}
          />
          <div className="relative flex justify-between">
            {steps.map((key, i) => {
              const completed = i < activeIdx
              const active = i === activeIdx
              const isNatija = key === 'NATIJA'
              const filled = completed || (active && !isNatija)
              return (
                <div key={key} className="flex w-[20%] flex-col items-center gap-1">
                  <span
                    className={`grid size-3.5 place-items-center rounded-full transition-all duration-300 ${
                      active ? 'scale-110' : ''
                    } ${filled ? '' : 'bg-slate-200'}`}
                    style={
                      filled
                        ? {
                            background: accent,
                            boxShadow: active
                              ? `0 0 0 3px ${accent}22, 0 0 10px ${accent}66`
                              : `0 0 0 2px ${accent}1f`,
                          }
                        : undefined
                    }
                  >
                    {completed ? (
                      <Check className="size-3 text-white" strokeWidth={4} />
                    ) : (
                      <span
                        className={`size-1.5 rounded-full ${active && !isNatija ? 'bg-white' : 'bg-transparent'}`}
                      />
                    )}
                  </span>
                  <span
                    className={`w-full text-center text-[9px] leading-tight font-bold tracking-[0.02em] ${
                      active
                        ? isNatija
                          ? 'text-slate-400'
                          : 'text-slate-800'
                        : completed
                          ? 'text-slate-600'
                          : 'text-slate-400'
                    }`}
                    style={active && !isNatija ? { color: accent } : undefined}
                  >
                    {key}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-display text-[10px] font-bold tracking-[0.14em] text-slate-500">
            SAVOL <span className="text-slate-800">{pad}</span>
            <span className="mx-1 text-slate-300">/</span>
            <span className="text-slate-400">{padTotal}</span>
            <span className="mx-1.5 text-slate-200">·</span>
            <span className="text-slate-400">
              {stageCurrent}/{stageTotal}
            </span>
          </span>
          <span className="font-display text-[12px] font-semibold tabular-nums" style={{ color: accent }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Thin 60-question progress bar (all sizes) */}
      <div className="relative mt-2 h-[5px] w-full rounded-full bg-slate-200/70 lg:mt-3">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${accent}66, ${accent})`,
            boxShadow: `0 0 10px ${accent}99`,
          }}
        />
        {/* Soft moving glow at the tip */}
        <div
          className="animate-progress-glow absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${pct}%`,
            background: accent,
            boxShadow: `0 0 12px 3px ${accent}66`,
          }}
        />
      </div>
    </div>
  )
}

export default JourneyProgress