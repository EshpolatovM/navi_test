import { useSettings } from '../SettingsContext'
import QuizIcon from '../QuizIcon'
import { ResultCard, ResultIconTile } from './ui/ResultCard'
import { RankNum, ScoreValue } from './ui/Score'
import { ScoreLabel } from './ui/ScoreLabel'
import { ResultProgress } from './ui/ResultProgress'
import type { DirectionScore } from './useResultData'

interface Props {
  directionScores: DirectionScore[]
}

export const DIRECTION_COLORS: Record<string, string> = {
  ai: '#6366F1',
  it: '#2563EB',
  smm: '#DB2777',
  marketing: '#EA580C',
  uiux: '#7C3AED',
  video: '#F59E0B',
  mobilograf: '#EC4899',
  doctor: '#10B981',
  gamedev: '#8B5CF6',
  mobiledev: '#06B6D4',
}

function InterestDirections({ directionScores }: Props) {
  const { t } = useSettings()
  const sorted = [...directionScores].sort((a, b) => b.score - a.score)
  const [hero, ...rest] = sorted

  if (!hero) return null

  const heroColor = DIRECTION_COLORS[hero.id] ?? 'var(--accent)'

  return (
    <section className="flex flex-col gap-6">
      {/* ═══ #1 DIRECTION — featured hero ═══ */}
      <ResultCard variant="featured" delay={0} className="mx-auto w-full max-w-[780px] p-5 sm:p-7 md:p-9">
        <div className="flex items-start justify-between gap-4">
          <RankNum n={1} />
          <ScoreValue value={hero.score} accent={heroColor} size="xl" />
        </div>

        <div className="mt-5 flex items-start gap-3.5 sm:mt-6 sm:gap-4">
          <ResultIconTile
            icon={<QuizIcon name={hero.icon} size={24} />}
            color={heroColor}
            size={48}
            iconSize={25}
            className="w-12! shrink-0 md:w-14!"
          />
          <div className="min-w-0">
            <h2 className="font-display text-[21px] leading-tight font-bold text-[var(--text-primary)] sm:text-[22px] md:text-[26px]">
              {t(hero.nameKey)}
            </h2>
            <div className="mt-1.5">
              <ScoreLabel score={hero.score} accent={heroColor} />
            </div>
          </div>
        </div>

        <div className="mt-5 md:mt-6">
          <ResultProgress value={hero.score} accent={heroColor} delay={0.35} thickness={7} segmented={false} />
        </div>

        <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-[var(--text-secondary)]">
          {hero.explanation}
        </p>
      </ResultCard>

      {/* ═══ RANKED LIST — score visualization, nothing else ═══ */}
      <ResultCard variant="standard" delay={120} className="mx-auto w-full max-w-[720px]">
        <div className="flex flex-col [&>:last-child]:border-b-0">
          {rest.map((dir, i) => {
            const color = DIRECTION_COLORS[dir.id] ?? 'var(--accent)'
            return (
              <div
                key={dir.id}
                className="flex items-center gap-3 px-5 py-3.5"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <RankNum n={i + 2} className="w-6 shrink-0" />
                <ResultIconTile icon={<QuizIcon name={dir.icon} size={18} />} color={color} size={36} />
                <span className="min-w-0 flex-1 truncate text-[13.5px] font-bold text-[var(--text-primary)]">
                  {t(dir.nameKey)}
                </span>
                <div className="w-14 shrink-0 sm:w-24">
                  <ResultProgress
                    value={dir.score}
                    accent={color}
                    delay={0.2 + i * 0.04}
                    thickness={6}
                    segments={12}
                  />
                </div>
                <ScoreValue value={dir.score} accent={color} size="sm" className="w-9 shrink-0 justify-end" />
              </div>
            )
          })}
        </div>
      </ResultCard>
    </section>
  )
}

export default InterestDirections