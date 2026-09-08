import { useEffect, useState } from 'react'
import { RotateCcw, Sparkles } from 'lucide-react'
import { computeResult, DIMS } from '../data'
import { careerDescription, careerName } from '../lib/qa'
import { useSettings } from './SettingsContext'
import QuizIcon from './QuizIcon'

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
            {t('rc.signal')}
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

function Row({
  icon,
  name,
  score,
  accent,
  delay,
  note,
}: {
  icon: React.ReactNode
  name: string
  score: number
  accent: string
  delay: number
  note?: string
}) {
  return (
    <div className="animate-slide-up flex items-center gap-3.5" style={{ animationDelay: `${delay}ms` }}>
      <span
        className="grid size-11 shrink-0 place-items-center rounded-2xl text-white"
        style={{ background: accent, boxShadow: `0 8px 18px ${accent}45` }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="truncate text-[14px] font-bold text-slate-800">{name}</span>
          <span className="font-display text-sm font-semibold tabular-nums" style={{ color: accent }}>
            {score}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="animate-grow-x h-full rounded-full"
            style={{
              width: `${score}%`,
              background: `linear-gradient(90deg, ${accent}88, ${accent})`,
              animationDelay: `${delay + 120}ms`,
            }}
          />
        </div>
        {note && <p className="mt-1 line-clamp-1 text-[11.5px] text-slate-400">{note}</p>}
      </div>
    </div>
  )
}

function ResultCard({ answers, onRestart }: { answers: number[]; onRestart: () => void }) {
  const { t, lang } = useSettings()
  const { profile, ranked, best } = computeResult(answers, lang)
  const accent = best.career.color
  const bestName = careerName(best.career.id, lang) ?? best.career.name
  const bestDesc = careerDescription(best.career.id, lang) ?? best.career.description
  const alternatives = ranked.slice(0, 5)

  const total = Math.max(1, profile.reduce((s, v) => s + v, 0))
  const topDims = [0, 1, 2, 3, 4, 5]
    .sort((a, b) => profile[b] - profile[a])
    .slice(0, 3)
    .map((d) => ({ d, share: Math.round((profile[d] / total) * 100) }))

  return (
    <div className="motion-pan-m animate-question-in relative w-full">
      {/* Soft accent halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent}24 0%, transparent 70%)` }}
      />

      <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {t('rc.top')}
      </p>

      {/* Hero signal */}
      <div className="motion-d1 mx-auto max-w-[560px] rounded-[2rem] bg-[var(--surface-elevated)] px-6 py-8 text-center ring-1 backdrop-blur md:px-10" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent, background: `${accent}12` }}>
          <Sparkles style={{ width: 11, height: 11 }} /> {t('rc.karyera')}
        </span>

        <div className="mt-6">
          <Donut pct={best.score} accent={accent} />
        </div>

        <h2 className="mt-4 font-display text-[26px] leading-tight font-semibold text-slate-900 md:text-[30px]">
          {bestName}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-slate-500">
          {bestDesc}
        </p>

        {/* Strongest signals */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {topDims.map(({ d, share }, i) => (
            <span
              key={d}
              className="animate-slide-up inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 ring-1"
              style={{ background: `${accent}0a`, borderColor: `${accent}2b`, animationDelay: `${450 + i * 120}ms` }}
            >
              <span className="font-display text-[11px] font-bold" style={{ color: accent }}>
                {DIMS[d].key}
              </span>
              <span className="text-[12px] font-medium text-slate-600">{t(`dim.${DIMS[d].key}.name`)}</span>
              <span className="text-[11px] font-bold tabular-nums text-slate-400">{share}%</span>
            </span>
          ))}
        </div>
        <p className="mt-2.5 text-[11.5px] text-slate-400">
          {t('rc.yourSignals', {
            list: topDims.map(({ d }, i) => `${i === 0 ? '' : ', '}${t(`dim.${DIMS[d].key}.name`).toLowerCase()}`).join(''),
          })}
        </p>
      </div>

      {/* Top directions */}
      <div className="motion-d2 mx-auto mt-5 max-w-[560px] rounded-[2rem] bg-[var(--surface-elevated)] px-6 py-6 ring-1 backdrop-blur md:px-8" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}>
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          {t('rc.signals')}
        </p>
        <div className="flex flex-col gap-4">
          {alternatives.map(({ career, score }, idx) => (
            <Row
              key={career.id}
              icon={<QuizIcon name={career.icon} size={20} />}
              name={careerName(career.id, lang) ?? career.name}
              score={score}
              accent={career.color}
              delay={600 + idx * 130}
            />
          ))}
        </div>
      </div>

      {/* Why this fits */}
      <div
        className="motion-d3 mx-auto mt-5 max-w-[560px] rounded-[2rem] px-6 py-6 ring-1 backdrop-blur md:px-8"
        style={{ background: `${accent}08`, borderColor: `${accent}22` }}
      >
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
          {t('rc.why', { name: bestName })}
        </p>
        <ul className="flex flex-col gap-2.5">
          {best.reasons.map((reason, i) => (
            <li
              key={i}
              className="animate-slide-up flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-600"
              style={{ animationDelay: `${900 + i * 140}ms` }}
            >
              <span
                aria-hidden
                className="mt-[7px] size-1.5 shrink-0 rounded-full"
                style={{ background: accent, boxShadow: `0 0 0 3px ${accent}1f` }}
              />
              {reason}
            </li>
          ))}
        </ul>

        <div className="mt-7 text-center">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold uppercase tracking-[0.06em] text-[var(--accent-contrast)] transition-all duration-200 ease-out select-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', boxShadow: '0 12px 28px -8px var(--accent-shadow)' }}
          >
            <RotateCcw className="size-4" />
            {t('rc.restart')}
          </button>
          <p className="mt-3 text-[11px] text-slate-400">
            {t('rc.note')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResultCard