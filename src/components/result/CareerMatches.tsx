import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSettings } from '../SettingsContext'
import QuizIcon from '../QuizIcon'
import { ResultCard, ResultIconTile, ResultTag } from './ui/ResultCard'
import { RankNum, ScoreValue } from './ui/Score'
import { ScoreLabel } from './ui/ScoreLabel'
import { ResultProgress } from './ui/ResultProgress'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'
import type { CareerMatchData } from './useResultData'

interface Props {
  topCareers: CareerMatchData[]
  allCareers: CareerMatchData[]
  onCareerClick: (career: CareerMatchData) => void
}

const LIST_PREVIEW = 8

function CareerMatches({ topCareers, allCareers, onCareerClick }: Props) {
  const { t } = useSettings()
  const [expanded, setExpanded] = useState(false)

  const hero = topCareers[0]
  const rest = allCareers.slice(1)
  const visible = expanded ? rest : rest.slice(0, LIST_PREVIEW)

  if (!hero) return null

  return (
    <section className="flex flex-col gap-8 md:gap-12">
      {/* ═══ HERO #1 CAREER — the strongest match ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-[780px]"
      >
        <ResultCard variant="featured" delay={0} className="p-5 sm:p-7 md:p-9">
          <div className="flex items-start justify-between gap-4">
            <RankNum n={1} />
            <ScoreValue value={hero.score} accent={hero.color} size="xl" />
          </div>

          <div className="mt-5 flex items-center gap-3.5 sm:mt-6 sm:gap-4">
            <ResultIconTile
              icon={<QuizIcon name={hero.icon} size={24} />}
              color={hero.color}
              size={48}
              iconSize={25}
              className="w-12! shrink-0 md:w-14!"
            />
            <div className="min-w-0">
              <h2 className="font-display text-[21px] leading-tight font-bold text-[var(--text-primary)] sm:text-[22px] md:text-[27px]">
                {hero.name}
              </h2>
              <div className="mt-1.5">
                <ScoreLabel score={hero.score} accent={hero.color} />
              </div>
            </div>
          </div>

          <div className="mt-5 md:mt-6">
            <ResultProgress value={hero.score} accent={hero.color} delay={0.35} thickness={7} />
          </div>

          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-[var(--text-secondary)]">
            {hero.description}
          </p>

          {hero.reasons.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {t('career.why')}
              </h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {hero.reasons.slice(0, 3).map((reason, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[var(--text-secondary)]"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] size-1.5 shrink-0 rounded-full"
                      style={{ background: hero.color }}
                    />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-4 border-t border-[var(--border)] pt-4 sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
            <div className="flex flex-wrap items-center gap-1.5">
              {hero.skillKeys.map((sk) => (
                <ResultTag key={sk} color={hero.color}>
                  {t(sk)}
                </ResultTag>
              ))}
            </div>
            <div className="w-full shrink-0 sm:w-auto">
              <InteractiveHoverButton
                type="button"
                variant="primary"
                size="md"
                full
                text={t('career.details')}
                onClick={() => onCareerClick(hero)}
                className="sm:w-auto"
              />
            </div>
          </div>
        </ResultCard>
      </motion.div>

      {/* ═══ RANKED LIST — every other match, strongest first ═══ */}
      {rest.length > 0 && (
        <div className="mx-auto w-full max-w-[780px]">
          <ResultCard variant="standard" delay={140}>
            <div className="flex flex-col [&>:last-child]:border-b-0">
              {visible.map((career, i) => (
                <motion.button
                  key={career.id}
                  type="button"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  onClick={() => onCareerClick(career)}
                  className="group flex items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-[var(--surface-elevated-2)]"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <RankNum n={i + 2} className="w-6 shrink-0" />
                  <ResultIconTile icon={<QuizIcon name={career.icon} size={18} />} color={career.color} size={36} />
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-bold text-[var(--text-primary)]">
                    {career.name}
                  </span>
                  <div className="w-14 shrink-0 sm:w-24">
                    <ResultProgress value={career.score} accent={career.color} delay={0.2 + i * 0.03} thickness={6} segments={12} />
                  </div>
                  <ScoreValue value={career.score} accent={career.color} size="sm" className="w-9 shrink-0 justify-end" />
                </motion.button>
              ))}
            </div>
          </ResultCard>

          {rest.length > LIST_PREVIEW && (
            <div className="mt-4 flex justify-center">
              <InteractiveHoverButton
                type="button"
                size="sm"
                variant="ghost"
                arrow={false}
                text={expanded ? t('result.careers.more') : t('result.careers.moreWithCount', { count: rest.length })}
                icon={expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                onClick={() => setExpanded((v) => !v)}
              />
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default CareerMatches