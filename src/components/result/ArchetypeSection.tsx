import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useSettings } from '../SettingsContext'
import { DIMS } from '../../data'
import { ResultCard } from './ui/ResultCard'
import { ResultProgress } from './ui/ResultProgress'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'

interface ArchetypeData {
  titleKey: string
  subtitleKey: string
  riasecScores: number[]
  dominant: number
}

const DIM_COLORS = ['#10B981', '#2563EB', '#DB2777', '#F59E0B', '#EA580C', '#64748B']

function hexPoint(cx: number, cy: number, r: number, i: number): [number, number] {
  const angle = (Math.PI / 3) * i - Math.PI / 2
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
}

function RiasecHexagon({ scores }: { scores: number[] }) {
  const cx = 140
  const cy = 130
  const outerR = 105
  const innerR = 40

  const gridPolygons = [0.25, 0.5, 0.75, 1.0].map((level) =>
    scores.map((_, i) => hexPoint(cx, cy, outerR * level, i)),
  )

  const maxScore = Math.max(...scores, 1)
  const dataPoints = scores.map((s, i) => {
    const ratio = innerR + (s / maxScore) * (outerR - innerR)
    return hexPoint(cx, cy, ratio, i)
  })
  const dominantColor = DIMS[scores.indexOf(Math.max(...scores))]?.color ?? '#6366F1'

  return (
    <svg viewBox="0 0 280 260" className="mx-auto w-full max-w-[280px] select-none" aria-hidden>
      {gridPolygons.map((pts, li) => (
        <polygon
          key={li}
          points={pts.map((p) => p.join(',')).join(' ')}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={li === gridPolygons.length - 1 ? 1.4 : 0.7}
          opacity={li === gridPolygons.length - 1 ? 0.9 : 0.45}
        />
      ))}

      {dataPoints.map((p, i) => (
        <line
          key={`l${i}`}
          x1={cx}
          y1={cy}
          x2={p[0]}
          y2={p[1]}
          stroke="var(--border-strong)"
          strokeWidth={0.7}
          opacity={0.45}
        />
      ))}

      <polygon
        points={dataPoints.map((p) => p.join(',')).join(' ')}
        fill={dominantColor}
        fillOpacity={0.16}
        stroke={dominantColor}
        strokeWidth={2.4}
        strokeLinejoin="round"
      />

      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={4}
          fill={DIM_COLORS[i]}
          stroke="var(--surface-elevated)"
          strokeWidth={2}
        />
      ))}
    </svg>
  )
}

function ArchetypeSection({ archetype }: { archetype: ArchetypeData }) {
  const { t } = useSettings()
  const [showLevels, setShowLevels] = useState(false)

  const dominantColor = DIMS[archetype.dominant]?.color ?? '#6366F1'
  const levelsSorted = archetype.riasecScores
    .map((s, i) => ({ i, s }))
    .sort((a, b) => b.s - a.s)

  return (
    <section className="animate-fade-in">
      {/* One composed card — identity, shape, friendly levels */}
      <ResultCard delay={0} className="mx-auto max-w-[560px] overflow-hidden px-6 py-8 text-center! md:px-10">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: dominantColor, background: `color-mix(in srgb, ${dominantColor} 12%, transparent)` }}
        >
          {t(`dim.${DIMS[archetype.dominant].key}.short`)}
        </span>

        <h3
          className="mt-4 font-display text-[24px] font-bold md:text-[28px]"
          style={{ color: dominantColor }}
        >
          {t(archetype.titleKey)}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-[var(--text-secondary)]">
          {t(archetype.subtitleKey)}
        </p>

        <div className="mt-6">
          <RiasecHexagon scores={archetype.riasecScores} />
        </div>

        {/* Friendly dimension list — no letters or percentages */}
        <div className="mt-8 flex flex-col items-stretch gap-2.5 text-left">
          {levelsSorted.map(({ i, s }, rowIdx) => {
            const c = DIM_COLORS[i]
            return (
              <div key={DIMS[i].key} className="flex items-center gap-3">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: c }} />
                <span className="w-24 shrink-0 truncate text-[12px] font-semibold text-[var(--text-secondary)]">
                  {t(`dim.${DIMS[i].key}.short`)}
                </span>
                <div className="flex-1">
                  <ResultProgress value={s} accent={c} delay={0.2 + rowIdx * 0.05} thickness={5} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Technical levels behind a quiet toggle */}
        <div className="mt-5">
          <InteractiveHoverButton
            type="button"
            size="sm"
            variant="ghost"
            arrow={false}
            text={t('ovr.archLevels')}
            icon={showLevels ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            onClick={() => setShowLevels((v) => !v)}
          />
          {showLevels && (
            <div className="mt-4 grid grid-cols-3 gap-x-3 gap-y-3">
              {archetype.riasecScores.map((s, i) => (
                <div key={DIMS[i].key} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold tracking-[0.02em] text-[var(--text-muted)]">
                    {t(`dim.${DIMS[i].key}.short`)}
                  </span>
                  <span className="font-display text-[13px] font-bold tabular-nums text-[var(--text-primary)]">
                    {Math.round(s)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ResultCard>

      <p className="mx-auto mt-6 max-w-[560px] px-2 text-center text-[12.5px] leading-relaxed text-[var(--text-muted)]">
        {t('arch.aboutBody')}
      </p>
    </section>
  )
}

export default ArchetypeSection