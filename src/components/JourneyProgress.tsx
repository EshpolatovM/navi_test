import { Check } from 'lucide-react'
import { STAGES, RESULT_STAGE, type StageDef } from '../data'
import { mix, rgba, toneFor, type Tone } from '../lib/tone'

type StepState = 'done' | 'active' | 'next'

function StepBadge({ step, state, tone }: { step: StageDef; state: StepState; tone: Tone }) {
  const Icon = step.icon
  if (state === 'done') {
    return (
      <span
        className="relative z-10 grid size-6 place-items-center rounded-full text-white shadow-[0_4px_10px_-3px_rgba(15,23,42,0.35)] transition-all duration-300"
        style={{ background: step.accent }}
      >
        <Check className="size-3.5" strokeWidth={3.5} />
      </span>
    )
  }
  if (state === 'active') {
    return (
      <span
        className="relative z-10 grid size-6 place-items-center rounded-full text-white transition-all duration-300"
        style={{
          background: tone.main,
          boxShadow: `0 0 0 3px ${tone.ring}, 0 5px 14px -4px ${tone.shadow}`,
        }}
      >
        <Icon className="size-3.5" strokeWidth={2.4} />
      </span>
    )
  }
  return (
    <span className="relative z-10 grid size-6 place-items-center rounded-full border border-slate-200 bg-slate-100 text-slate-400">
      <Icon className="size-3" strokeWidth={2.2} />
    </span>
  )
}

function JourneyProgress({
  current,
  total,
  accent,
  difficulty,
  stageKey,
  stageCurrent,
  stageTotal,
}: {
  current: number
  total: number
  accent: string
  difficulty: number
  stageKey: string
  stageCurrent: number
  stageTotal: number
}) {
  const pct = Math.round((current / total) * 100)
  const pad = String(current).padStart(2, '0')
  const padTotal = String(total).padStart(2, '0')
  const activeIdx = Math.max(0, STAGES.findIndex((s) => s.key === stageKey))
  const steps: StageDef[] = [...STAGES, RESULT_STAGE]
  const tone = toneFor(accent, difficulty)
  const ActiveIcon = steps[activeIdx]?.icon ?? RESULT_STAGE.icon

  return (
    <div className="mx-auto mb-4 w-full max-w-2xl px-1 lg:mb-5">
      {/* Desktop header — stage label + question counter */}
      <div className="hidden items-end justify-between lg:flex">
        <div className="flex flex-col gap-1">
          <span
            className="flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-[0.24em]"
            style={{ color: tone.deep }}
          >
            <ActiveIcon style={{ width: 13, height: 13 }} strokeWidth={2.4} />
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
          style={{ color: tone.deep }}
        >
          {pct}%
        </span>
      </div>

      {/* Mobile & tablet: compact white-card stage roadmap */}
      <div className="lg:hidden">
        <div className="rounded-2xl bg-white px-1 py-2.5 shadow-[0_1px_1px_rgba(15,23,42,0.05),0_10px_24px_-18px_rgba(15,23,42,0.25)] ring-1 ring-black/[0.04]">
          <div className="relative mx-1">
            {/* Connector segments — colored by each stage once reached */}
            <div aria-hidden className="absolute top-[10px] right-[10%] left-[10%] h-[3px]">
              {steps.slice(0, -1).map((step, i) => {
                const st: StepState = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'next'
                const segTone = toneFor(step.accent, difficulty)
                const bg =
                  st === 'done'
                    ? step.accent
                    : st === 'active'
                      ? `linear-gradient(90deg, ${segTone.tint}, ${segTone.main})`
                      : '#e2e8f0'
                return (
                  <div
                    key={`seg-${i}`}
                    className="absolute h-full rounded-full transition-[background-color,width] duration-500"
                    style={{ left: `${20 * i}%`, width: '20%', background: bg }}
                  />
                )
              })}
            </div>

            <div className="relative flex justify-between">
              {steps.map((step, i) => {
                const state: StepState = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'next'
                return (
                  <div key={step.key} className="flex w-[20%] flex-col items-center gap-[5px]">
                    <StepBadge step={step} state={state} tone={tone} />
                    <span
                      className="w-full whitespace-nowrap text-center font-display text-[9px] leading-[1.25] uppercase transition-all duration-300"
                      style={
                        state === 'active'
                          ? { color: tone.deep, fontWeight: 800, letterSpacing: '0.03em' }
                          : state === 'done'
                            ? { color: mix(step.accent, '#0f172a', 0.3), fontWeight: 700, letterSpacing: '0.02em' }
                            : { color: '#94a3b8', fontWeight: 600, letterSpacing: '0.02em' }
                      }
                    >
                      {step.key}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-slate-100 px-2 pt-1.5">
            <span className="font-display text-[10px] font-bold tracking-[0.14em] text-slate-500">
              SAVOL <span className="text-slate-800">{pad}</span>
              <span className="mx-1 text-slate-300">/</span>
              <span className="text-slate-400">{padTotal}</span>
              <span className="mx-1.5 text-slate-200">·</span>
              <span className="text-slate-400">
                {stageCurrent}/{stageTotal}
              </span>
            </span>
            <span className="font-display text-[12px] font-bold tabular-nums" style={{ color: tone.deep }}>
              {pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Thin 60-question progress bar (all sizes) */}
      <div className="relative mt-2 h-[5px] w-full rounded-full bg-slate-200/70 lg:mt-3">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${rgba(tone.main, 0.4)}, ${tone.main})`,
            boxShadow: `0 0 10px ${tone.glow}`,
          }}
        />
        {/* Soft moving glow at the tip */}
        <div
          className="animate-progress-glow absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${pct}%`,
            background: tone.main,
            boxShadow: `0 0 12px 3px ${tone.glow}`,
          }}
        />
      </div>
    </div>
  )
}

export default JourneyProgress