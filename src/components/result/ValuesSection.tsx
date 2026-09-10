import { useSettings } from '../SettingsContext'
import { ResultCard } from './ui/ResultCard'
import { RankNum } from './ui/Score'
import { ResultProgress } from './ui/ResultProgress'
import { VALUE_COLORS, VALUE_ICONS } from './ui/visuals'
import type { ValueItem } from './useResultData'

function ValuesSection({ values }: { values: ValueItem[] }) {
  const { t } = useSettings()
  const sorted = [...values].sort((a, b) => b.score - a.score)

  return (
    <section className="animate-fade-in">
      {/* One composed panel — ranked "what matters to me", no percentages */}
      <ResultCard variant="standard" delay={0} className="mx-auto max-w-[640px]">
        <div className="flex flex-col [&>:last-child]:border-b-0">
          {sorted.map((val, i) => {
            const color = VALUE_COLORS[val.id] ?? '#6366F1'
            return (
              <div
                key={val.id}
                className="flex items-center gap-3.5 px-5 py-4"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <RankNum n={i + 1} className="w-7 shrink-0" />
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-[0.7rem]"
                  style={{ background: `color-mix(in srgb, ${color} 10%, transparent)`, color }}
                >
                  {VALUE_ICONS[val.id] ?? null}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[13.5px] font-bold text-[var(--text-primary)]">
                    {t(val.nameKey)}
                  </h3>
                  <div className="mt-2">
                    <ResultProgress value={val.score} accent={color} delay={0.15 + i * 0.06} thickness={5} segments={14} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ResultCard>
    </section>
  )
}

export default ValuesSection