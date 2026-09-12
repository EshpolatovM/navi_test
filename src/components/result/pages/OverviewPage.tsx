import { useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Right } from '@icon-park/react'
import { useSettings } from '../../SettingsContext'
import QuizIcon from '../../QuizIcon'
import { useResultStore } from '../resultStore'
import ReportsSection from '../ReportsSection'
import ShareResult from '../ShareResult'
import InviteCareerCard from '../InviteCareerCard'
import { ResultCard, ResultIconTile } from '../ui/ResultCard'
import { SectionHeading } from '../ui/SectionHeading'
import { ScoreRing } from '../ui/ScoreRing'
import { RankNum, ScoreValue } from '../ui/Score'
import { ScoreLabel } from '../ui/ScoreLabel'
import { ResultProgress } from '../ui/ResultProgress'
import { DIRECTION_COLORS } from '../InterestDirections'
import { VALUE_COLORS, VALUE_ICONS, DIM_ICON_NAMES } from '../ui/visuals'
import NextStepCard from '../NextStepCard'

function ResultOverviewPage() {
  const { t } = useSettings()
  const { data, query, tryCareerTest } = useResultStore()
  const navigate = useNavigate()

  const MORE_SECTIONS = useMemo(() => [
    { path: '/result/character', label: t('nav.character') },
    { path: '/result/archetype', label: t('nav.archetype') },
    { path: '/result/growth', label: t('nav.growth') },
    { path: '/result/advice', label: t('nav.advice') },
    { path: '/result/roadmap', label: t('roadmap.title') },
  ], [t])

  if (!data) return <Navigate to="/result" replace />

  const direction = data.directionScores[0]
  const hasCareerSource = query.career.finished
  const topCareers = data.topCareers.slice(0, 3)
  const showCareerInvite = query.interest.finished && !query.career.finished && !!tryCareerTest

  const sortedDirections = [...data.directionScores].sort((a, b) => b.score - a.score)
  const sortedValues = [...data.values].sort((a, b) => b.score - a.score)

  const handleNextStep = () => {
    if (data.nextStep.target === 'career') navigate('/result/careers')
    else if (data.nextStep.target === 'directions') navigate('/result/interests')
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* ═══ 1. ENG MOS YO‘NALISH — the primary result ═══ */}
      {direction && (
        <ResultCard variant="featured" delay={0} className="mx-auto w-full max-w-[780px] p-5 sm:p-7 md:p-9">
          <div className="flex items-center justify-between gap-4">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]"
              style={{ background: 'var(--accent-soft)' }}
            >
              {t('result.hero.topDirection')}
            </span>
            <RankNum n={1} />
          </div>

          <div className="mt-5 flex flex-col items-center gap-5 sm:mt-6 sm:flex-row sm:items-center sm:gap-8">
            <ScoreRing value={direction.score} accent="var(--accent)" size={124} stroke={10} />
            <div className="w-full min-w-0 flex-1 text-center sm:text-left">
              <h2 className="font-display text-[24px] leading-tight font-bold text-[var(--text-primary)] sm:text-[26px] md:text-[31px]">
                {t(direction.nameKey)}
              </h2>
              <div className="mt-2 flex items-center justify-center gap-3 sm:justify-start">
                <QuizIcon name={direction.icon} size={18} />
                <ScoreLabel score={direction.score} accent="var(--accent)" />
              </div>
              <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-[var(--text-secondary)] line-clamp-3 sm:mx-0 md:line-clamp-none">
                {direction.explanation}
              </p>
            </div>
          </div>
        </ResultCard>
      )}

      {/* ═══ 2. TOP KASBLAR — the strongest few ═══ */}
      {hasCareerSource && topCareers.length > 0 && (
        <section className="mx-auto w-full max-w-[780px]">
          <SectionHeading
            title={t('career.top')}
            hint={t('ovr.careersHint')}
            to="/result/careers"
            action={t('result.careers.viewAll')}
          />
          <ResultCard variant="standard" delay={120} className="mt-4">
            <div className="flex flex-col [&>:last-child]:border-b-0">
              {topCareers.map((career, i) => (
                <div
                  key={career.id}
                  className="flex items-center gap-3 px-5 py-3.5"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <RankNum n={i + 1} className="w-6 shrink-0" />
                  <ResultIconTile icon={<QuizIcon name={career.icon} size={18} />} color={career.color} size={36} />
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-bold text-[var(--text-primary)]">
                    {career.name}
                  </span>
                  <div className="w-14 shrink-0 sm:w-24">
                    <ResultProgress value={career.score} accent={career.color} delay={0.2 + i * 0.06} thickness={6} segments={12} />
                  </div>
                  <ScoreValue value={career.score} accent={career.color} size="sm" className="w-9 shrink-0 justify-end" />
                </div>
              ))}
            </div>
          </ResultCard>
        </section>
      )}

      {/* ═══ 3. KUCHLI TOMONLAR — 3 with one short sentence each ═══ */}
      {data.strengths.length > 0 && (
        <section className="mx-auto w-full max-w-[780px]">
          <SectionHeading
            title={t('ovr.strengthsTitle')}
            hint={t('ovr.strengthsHint')}
            to="/result/strengths"
            action={t('career.details')}
          />
          <ResultCard variant="standard" delay={160} className="mt-4">
            <div className="flex flex-col [&>:last-child]:border-b-0">
              {data.strengths.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-start gap-3.5 px-5 py-4"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <ResultIconTile icon={<QuizIcon name={DIM_ICON_NAMES[s.id] ?? 'zap'} size={18} />} color={s.color} size={38} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold text-[var(--text-primary)]">{t(s.nameKey)}</div>
                    <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">
                      {s.description}
                    </p>
                  </div>
                  <RankNum n={i + 1} className="shrink-0 pt-0.5" />
                </div>
              ))}
            </div>
          </ResultCard>
        </section>
      )}

      {/* ═══ 4. QIZIQISHLAR — ranked score visualization ═══ */}
      <section className="mx-auto w-full max-w-[780px]">
        <SectionHeading
          title={t('nav.interests')}
          hint={t('ovr.interestsHint')}
          to="/result/interests"
          action={t('career.details')}
        />
        <ResultCard variant="standard" delay={200} className="mt-4">
          <div className="flex flex-col [&>:last-child]:border-b-0">
            {sortedDirections.map((dir, i) => {
              const color = DIRECTION_COLORS[dir.id] ?? 'var(--accent)'
              return (
                <div
                  key={dir.id}
                  className="flex items-center gap-3 px-5 py-2.5"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <ResultIconTile icon={<QuizIcon name={dir.icon} size={16} />} color={color} size={32} />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[var(--text-primary)]">
                    {t(dir.nameKey)}
                  </span>
                  <div className="w-16 shrink-0 sm:w-28">
                    <ResultProgress value={dir.score} accent={color} delay={0.2 + i * 0.03} thickness={5} segments={12} />
                  </div>
                </div>
              )
            })}
          </div>
        </ResultCard>
      </section>

      {/* ═══ 5. SEN UCHUN MUHIM — values, ranked ═══ */}
      {sortedValues.length > 0 && (
        <section className="mx-auto w-full max-w-[780px]">
          <SectionHeading
            title={t('ovr.valuesTitle')}
            hint={t('ovr.valuesHint')}
            to="/result/values"
            action={t('career.details')}
          />
          <ResultCard variant="standard" delay={240} className="mt-4">
            <div className="flex flex-col [&>:last-child]:border-b-0">
              {sortedValues.slice(0, 3).map((val, i) => {
                const color = VALUE_COLORS[val.id] ?? '#6366F1'
                return (
                  <div
                    key={val.id}
                    className="flex items-center gap-3 px-5 py-3.5"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <RankNum n={i + 1} className="w-6 shrink-0" />
                    <span
                      className="grid size-8 shrink-0 place-items-center rounded-[0.6rem]"
                      style={{ background: `color-mix(in srgb, ${color} 10%, transparent)`, color }}
                    >
                      {VALUE_ICONS[val.id] ?? null}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13.5px] font-bold text-[var(--text-primary)]">
                      {t(val.nameKey)}
                    </span>
                    <div className="w-16 shrink-0 sm:w-24">
                      <ResultProgress value={val.score} accent={color} delay={0.2 + i * 0.06} thickness={6} segments={12} />
                    </div>
                  </div>
                )
              })}
            </div>
          </ResultCard>
        </section>
      )}

      {/* ═══ 6. KEYINGI QADAM — one clear recommendation ═══ */}
      <NextStepCard
        nextStep={data.nextStep}
        onAction={data.nextStep.target === 'retake' ? undefined : handleNextStep}
      />

      {/* ═══ QUIET EXPLORE — remaining routes, no cards ═══ */}
      <nav aria-label={t('ovr.moreSections')} className="mx-auto w-full max-w-[780px]">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {t('ovr.moreSections')}
          </span>
          {MORE_SECTIONS.map((s) => (
            <button
              key={s.path}
              type="button"
              onClick={() => navigate(s.path)}
              className="group inline-flex items-center gap-0.5 text-[12.5px] font-semibold text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--accent)]"
            >
              {s.label}
              <Right className="size-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </nav>

      {data.reports.length > 0 && (
        <ReportsSection
          reports={data.reports}
          onReportClick={(_r, i) => {
            const toCareer = data.sources.includes('career')
            if (i === 0) navigate('/result/interests')
            else if (i === 1) navigate(toCareer ? '/result/careers' : '/result/interests')
            else if (i === 2) navigate(toCareer ? '/result/careers' : '/result/strengths')
          }}
        />
      )}

      <ShareResult data={data} />

      {showCareerInvite && <InviteCareerCard onTry={tryCareerTest} topDirections={data.directionScores} />}
    </div>
  )
}

export default ResultOverviewPage