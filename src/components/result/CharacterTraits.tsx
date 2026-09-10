import { useSettings } from '../SettingsContext'
import QuizIcon from '../QuizIcon'
import { ResultCard, ResultIconTile } from './ui/ResultCard'
import { RankNum } from './ui/Score'
import type { TraitScore } from './useResultData'

interface Props {
  characterTraits: TraitScore[]
}

const TRAIT_COLOR = '#64748B'

function CharacterTraits({ characterTraits }: Props) {
  const { t } = useSettings()
  const sorted = [...characterTraits].sort((a, b) => b.score - a.score)

  if (sorted.length === 0) return null

  return (
    <section className="animate-fade-in">
      {/* Friendly framing — no clinical labels or percentages */}
      <p className="mx-auto mb-4 max-w-[720px] text-[13px] font-semibold text-[var(--text-secondary)]">
        {t('ovr.characterLead')}
      </p>

      <ResultCard variant="standard" delay={0} className="mx-auto max-w-[720px]">
        <div className="flex flex-col [&>:last-child]:border-b-0">
          {sorted.map((trait, i) => (
            <div
              key={trait.id}
              className="flex items-start gap-3.5 px-5 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <RankNum n={i + 1} className="w-6 shrink-0 pt-1" />
              <ResultIconTile icon={<QuizIcon name={trait.icon} size={18} />} color={TRAIT_COLOR} size={38} />
              <div className="min-w-0 flex-1">
                <h3 className="text-[14px] font-bold text-[var(--text-primary)]">{t(trait.nameKey)}</h3>
                {trait.description && (
                  <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-[var(--text-secondary)] md:line-clamp-none">
                    {trait.description}
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

export default CharacterTraits