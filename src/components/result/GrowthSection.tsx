import { Right } from '@icon-park/react'
import { useSettings } from '../SettingsContext'
import { ResultCard, ResultTag } from './ui/ResultCard'
import { RankNum } from './ui/Score'
import { ResultProgress } from './ui/ResultProgress'
import type { GrowthItem } from './useResultData'

function GrowthSection({ growthAreas }: { growthAreas: GrowthItem[] }) {
  const { t } = useSettings()

  return (
    <section className="animate-fade-in">
      <div className="mx-auto flex max-w-[640px] flex-col gap-3.5">
        {growthAreas.map((g, i) => (
          <ResultCard key={g.id} delay={300 + i * 60} className="p-5">
            <div className="flex items-center gap-3">
              <RankNum n={i + 1} className="shrink-0" />
              <h3 className="min-w-0 flex-1 truncate text-[14px] font-bold text-[var(--text-primary)]">
                {t(g.nameKey)}
              </h3>
            </div>

            {g.description && (
              <p className="mt-2.5 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--text-secondary)] md:line-clamp-3">
                {g.description}
              </p>
            )}

            <div className="mt-4">
              <ResultProgress value={g.current} accent={g.color} delay={0.2 + i * 0.07} thickness={6} />
            </div>

            <div className="mt-3.5">
              <ResultTag color={g.color}>
                <Right className="size-3" />
                {t(g.actionKey)}
              </ResultTag>
            </div>
          </ResultCard>
        ))}
      </div>
    </section>
  )
}

export default GrowthSection