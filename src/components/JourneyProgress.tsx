import { Check } from 'lucide-react'
import { RESULT_STAGE, type StageDef } from '../data'
import { stageVar } from '../lib/theme'
import { useSettings } from './SettingsContext'

type StepState = 'done' | 'active' | 'next'

function StepBadge({ step, state }: { step: StageDef; state: StepState }) {
  const Icon = step.icon
  const sv = stageVar(step.key)
  if (state === 'done') {
    return (
      <span
        className="relative z-10 grid size-5 place-items-center rounded-full text-white transition-all duration-300"
        style={{ background: sv, boxShadow: `0 4px 10px -3px color-mix(in srgb, ${sv} 45%, transparent)` }}
      >
        <Check className="size-3" strokeWidth={3.5} />
      </span>
    )
  }
  if (state === 'active') {
    return (
      <span
        className="relative z-10 grid size-5 place-items-center rounded-full text-white transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${sv}, color-mix(in srgb, ${sv} 45%, var(--accent)))`,
          boxShadow: '0 0 0 3px var(--accent-ring), 0 5px 14px -4px var(--accent-shadow)',
        }}
      >
        <Icon className="size-3" strokeWidth={2.4} />
      </span>
    )
  }
  return (
    <span
      className="relative z-10 grid size-5 place-items-center rounded-full transition-all duration-300"
      style={{ background: `color-mix(in srgb, ${sv} 24%, transparent)`, color: 'var(--text-muted)' }}
    >
      <Icon className="size-2.5" strokeWidth={2.2} />
    </span>
  )
}

function JourneyProgress({
  current,
  total,
  stages,
  stageKey,
  stageCurrent,
  stageTotal,
}: {
  current: number
  total: number
  stages: StageDef[]
  stageKey: string
  stageCurrent: number
  stageTotal: number
}) {
  const { t } = useSettings()
  const pct = Math.round((current / total) * 100)
  const pad = String(current).padStart(2, '0')
  const padTotal = String(total).padStart(2, '0')
  const activeIdx = Math.max(0, stages.findIndex((s) => s.key === stageKey))
  const steps: StageDef[] = [...stages, RESULT_STAGE]
  const stepW = 100 / steps.length
  const ActiveIcon = steps[activeIdx]?.icon ?? RESULT_STAGE.icon

  return (
    <div className="motion-edge mx-auto mb-1.5 w-full max-w-2xl px-1 lg:mb-5">
      {/* Desktop header — stage label + question counter */}
      <div className="hidden items-end justify-between lg:flex">
        <div className="flex flex-col gap-1">
          <span
            className="flex items-center gap-1.5 font-display text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: 'var(--accent)' }}
          >
            <ActiveIcon style={{ width: 13, height: 13 }} strokeWidth={2.4} />
            {t(`stage.${stageKey}`)}
          </span>
          <span className="font-display text-[14px] font-semibold tracking-[0.12em] text-slate-500">
            {t('prog.savol')} <span className="text-slate-800">{pad}</span>
            <span className="mx-1.5 text-slate-300">·</span>
            <span className="text-slate-400">{padTotal}</span>
            <span className="mx-1.5 text-slate-200">·</span>
            <span className="text-slate-400">{stageCurrent}/{stageTotal}</span>
          </span>
        </div>
        <span
          className="font-display text-[15px] font-semibold tabular-nums transition-colors duration-500"
          style={{ color: 'var(--accent)' }}
        >
          {pct}%
        </span>
      </div>

      {/* Mobile & tablet: compact card-stage roadmap */}
      <div className="lg:hidden">
        <div className="rounded-2xl bg-[var(--surface-elevated)] px-1 py-1 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.25)] ring-1 ring-black/[0.04]">
          <div className="relative mx-1">
            {/* Connector segments — tinted by state within the accent family */}
            <div aria-hidden className="absolute top-[8px] right-[10%] left-[10%] h-[2.5px]">
              {steps.slice(0, -1).map((step, i) => {
                const st: StepState = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'next'
                const sv = stageVar(step.key)
                const bg =
                  st === 'done'
                    ? sv
                    : st === 'active'
                      ? `linear-gradient(90deg, color-mix(in srgb, ${sv} 30%, transparent), var(--accent))`
                      : `color-mix(in srgb, ${sv} 16%, transparent)`
                return (
                  <div
                    key={`seg-${i}`}
                    className="absolute h-full rounded-full transition-[background-color,width] duration-500"
                    style={{ left: `${stepW * i}%`, width: `${stepW}%`, background: bg }}
                  />
                )
              })}
            </div>

            <div className="relative flex justify-between">
              {steps.map((step, i) => {
                const state: StepState = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'next'
                return (
                  <div key={step.key} className="flex flex-col items-center gap-[4px]" style={{ width: `${stepW}%` }}>
                    <StepBadge step={step} state={state} />
                    <span
                      className="w-full max-w-full overflow-hidden whitespace-nowrap text-center font-display text-[9px] leading-[1.2] uppercase transition-all duration-300"
                      style={
                        state === 'active'
                          ? { color: 'var(--accent)', fontWeight: 800, letterSpacing: '0.02em' }
                          : state === 'done'
                            ? { color: stageVar(step.key), fontWeight: 700, letterSpacing: '0.02em' }
                            : { color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.02em' }
                      }
                    >
                      {t(`stage.${step.key}`)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between border-t border-slate-100 px-2 pt-0.5">
            <span className="font-display text-[10px] font-bold tracking-[0.12em] text-slate-500">
              {t('prog.savol')} <span className="text-slate-800">{pad}</span>
              <span className="mx-1 text-slate-300">/</span>
              <span className="text-slate-400">{padTotal}</span>
              <span className="mx-1.5 text-slate-200">·</span>
              <span className="text-slate-400">
                {stageCurrent}/{stageTotal}
              </span>
            </span>
            <span className="font-display text-[12px] font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
              {pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Thin question progress bar (all sizes) */}
      <div className="relative mt-1.5 h-[4px] w-full rounded-full bg-slate-200/70 lg:mt-3">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, var(--accent-soft), var(--accent))',
            boxShadow: '0 0 10px var(--accent-glow)',
          }}
        />
        {/* Soft moving glow at the tip */}
        <div
          className="animate-progress-glow absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${pct}%`,
            background: 'var(--accent)',
            boxShadow: '0 0 12px 3px var(--accent-glow)',
          }}
        />
      </div>
    </div>
  )
}

export default JourneyProgress