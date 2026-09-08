import { useEffect, useState } from 'react'
import { ArrowLeft, FlaskConical, Hammer, HeartHandshake, ListChecks, Palette, Rocket, RotateCcw, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DIMS, computeInterestProfile } from '../data'
import { useSettings } from './SettingsContext'

const DIM_ICONS: LucideIcon[] = [Hammer, FlaskConical, Palette, HeartHandshake, Rocket, ListChecks]

function useCountUp(target: number, delay = 200, duration = 800) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let raf = 0
    let start = 0
    const begin = async () => {
      await new Promise((r) => setTimeout(r, delay))
      start = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration)
        const eased = 1 - Math.pow(1 - p, 3)
        setDisplay(Math.round(eased * target))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    begin()
    return () => cancelAnimationFrame(raf)
  }, [target, delay, duration])
  return display
}

function Donut({ pct, accent, delay = 300 }: { pct: number; accent: string; delay?: number }) {
  const [off, setOff] = useState(327)
  const { t } = useSettings()
  const R = 52
  const C = 2 * Math.PI * R
  useEffect(() => {
    const ti = window.setTimeout(() => setOff(C * (1 - pct / 100)), delay)
    return () => window.clearTimeout(ti)
  }, [pct, C, delay])

  return (
    <div className="relative mx-auto size-40 md:size-44">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(120,113,108,0.14)" strokeWidth="11" />
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke={accent}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={off}
          style={{ transition: `stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1) ${delay}ms` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-center">
          <span className="block font-display text-4xl font-bold tabular-nums" style={{ color: accent }}>
            <DonutCount target={pct} delay={delay} />
          </span>
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {t('ir.strength')}
          </span>
        </span>
      </div>
    </div>
  )
}

function DonutCount({ target, delay }: { target: number; delay: number }) {
  const v = useCountUp(target, delay)
  return <>{v}</>
}

function DimRow({
  d,
  score,
  delay,
  rank,
}: {
  d: number
  score: number
  delay: number
  rank: number
}) {
  const { t } = useSettings()
  const dim = DIMS[d]
  const Icon = DIM_ICONS[d]
  return (
    <div className="animate-slide-up flex items-center gap-3.5" style={{ animationDelay: `${delay}ms` }}>
      <span
        className="grid size-11 shrink-0 place-items-center rounded-2xl text-white"
        style={{ background: dim.color, boxShadow: `0 8px 18px ${dim.color}45` }}
      >
        <Icon style={{ width: 20, height: 20 }} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[14px] font-bold text-slate-800">{t(`dim.${dim.key}.name`)}</span>
            {rank === 0 && (
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white"
                style={{ background: dim.color }}
              >
                {t('ir.topBadge')}
              </span>
            )}
            {rank === 1 && (
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ring-1" style={{ color: dim.color, borderColor: `${dim.color}44`, background: `${dim.color}0d` }}>
                {t('ir.second')}
              </span>
            )}
          </span>
          <span className="font-display text-sm font-semibold tabular-nums" style={{ color: dim.color }}>
            {score}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="animate-grow-x h-full rounded-full"
            style={{
              width: `${score}%`,
              background: `linear-gradient(90deg, ${dim.color}88, ${dim.color})`,
              animationDelay: `${delay + 120}ms`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

function InterestResult({
  answers,
  onRestart,
  onSelect,
}: {
  answers: number[]
  onRestart: () => void
  onSelect: () => void
}) {
  const { t } = useSettings()
  const { scores, top } = computeInterestProfile(answers)
  const first = DIMS[top[0]]
  const second = DIMS[top[1]]
  const accent = first.color

  const ordered = [0, 1, 2, 3, 4, 5].sort((a, b) => scores[b] - scores[a] || a - b)

  return (
    <div className="motion-pan-m animate-question-in relative w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent}24 0%, transparent 70%)` }}
      />

      <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {t('ir.top')}
      </p>

      {/* Hero signal */}
      <div className="mx-auto max-w-[560px] rounded-[2rem] bg-[var(--surface-elevated)] px-6 py-8 text-center ring-1 backdrop-blur md:px-10" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: accent, background: `${accent}12` }}
        >
          <Sparkles style={{ width: 11, height: 11 }} /> {t('ir.profile')}
        </span>

        <div className="mt-6">
          <Donut pct={scores[top[0]]} accent={accent} />
        </div>

        <h2 className="mt-4 font-display text-[26px] leading-tight font-semibold text-slate-900 md:text-[30px]">
          {first.key} · {t(`dim.${first.key}.short`)}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-slate-500">
          {t('ir.para', { adj: first.keyAdj, phrase: first.phrase })}
          {top[1] !== top[0] && ` ${t('ir.para2', { short: t(`dim.${second.key}.short`).toLowerCase() })}`}
        </p>

        {/* Top signals */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {top.slice(0, 3).map((d, i) => (
            <span
              key={d}
              className="animate-slide-up inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 ring-1"
              style={{
                background: `${DIMS[d].color}0a`,
                borderColor: `${DIMS[d].color}2b`,
                animationDelay: `${450 + i * 120}ms`,
              }}
            >
              <span className="font-display text-[11px] font-bold" style={{ color: DIMS[d].color }}>
                {DIMS[d].key}
              </span>
              <span className="text-[12px] font-medium text-slate-600">{t(`dim.${DIMS[d].key}.short`)}</span>
              <span className="text-[11px] font-bold tabular-nums text-slate-400">{scores[d]}%</span>
            </span>
          ))}
        </div>
      </div>

      {/* Full profile */}
      <div className="mx-auto mt-5 max-w-[560px] rounded-[2rem] bg-[var(--surface-elevated)] px-6 py-6 ring-1 backdrop-blur md:px-8" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          {t('ir.all')}
        </p>
        <div className="flex flex-col gap-4">
          {ordered.map((d, rank) => (
            <DimRow key={d} d={d} score={scores[d]} delay={450 + rank * 120} rank={rank} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className="mx-auto mt-5 max-w-[560px] rounded-[2rem] px-6 py-6 ring-1 backdrop-blur md:px-8"
        style={{ background: `${accent}08`, borderColor: `${accent}22` }}
      >
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
          {t('ir.why')}
        </p>
        <p className="text-[13px] leading-relaxed text-slate-600">
          {t('ir.whyBody')}
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold uppercase tracking-[0.06em] text-[var(--accent-contrast)] transition-all duration-200 ease-out select-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', boxShadow: '0 12px 28px -8px var(--accent-shadow)' }}
          >
            <RotateCcw className="size-4" />
            {t('ir.restart')}
          </button>
          <button
            type="button"
            onClick={onSelect}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-900 px-8 text-sm font-bold uppercase tracking-[0.06em] text-white transition-all duration-200 ease-out select-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
          >
            <ArrowLeft className="size-4" />
            {t('ir.other')}
          </button>
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-400">
          {t('ir.disclaimer')}
        </p>
      </div>
    </div>
  )
}

export default InterestResult