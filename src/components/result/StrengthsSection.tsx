import { useSettings } from '../SettingsContext'
import QuizIcon from '../QuizIcon'
import { ResultCard, ResultIconTile } from './ui/ResultCard'
import { RankNum } from './ui/Score'
import { ResultProgress } from './ui/ResultProgress'
import { DIM_ICON_NAMES } from './ui/visuals'
import type { StrengthItem } from './useResultData'

function StrengthsSection({ strengths }: { strengths: StrengthItem[] }) {
  const { t } = useSettings()
  const sorted = [...strengths].sort((a, b) => b.score - a.score)

  return (
    <section className="animate-fade-in">
      {/* Ranked panel — icon + strength + one short sentence */}
      <ResultCard variant="standard" delay={0} className="mx-auto max-w-[640px]">
        <div className="flex flex-col [&>:last-child]:border-b-0">
          {sorted.map((s, i) => (
            <div
              key={s.id}
              className="flex items-start gap-3.5 px-5 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <RankNum n={i + 1} className="w-6 shrink-0 pt-1" />
              <ResultIconTile icon={<QuizIcon name={DIM_ICON_NAMES[s.id] ?? 'zap'} size={18} />} color={s.color} size={38} />
              <div className="min-w-0 flex-1">
                <h3 className="text-[14px] font-bold text-[var(--text-primary)]">{t(s.nameKey)}</h3>
                <div className="mt-2 max-w-[280px]">
                  <ResultProgress value={s.score} accent={s.color} delay={0.15 + i * 0.06} thickness={5} segments={14} />
                </div>
                {s.description && (
                  <p className="mt-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                    {s.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ResultCard>
    </section>
  )
}

export default StrengthsSection