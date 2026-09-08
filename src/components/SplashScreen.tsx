import { ArrowRight, Compass, RotateCcw } from 'lucide-react'
import { CAREERS, DIMS, INTEREST_COUNT, QUESTIONS, STAGES } from '../data'
import { useSettings } from './SettingsContext'

export type AssessmentMode = 'interest' | 'career'

interface Resume {
  answered: number
  total: number
  finished: boolean
}

function ModeCard({
  title,
  subtitle,
  badge,
  icon,
  chips,
  cta,
  onSelect,
  delay,
  isResume,
}: {
  title: string
  subtitle: string
  badge: string
  icon: React.ReactNode
  chips: React.ReactNode
  cta: string
  onSelect: () => void
  delay: number
  isResume: boolean
}) {
  return (
    <div
      className="animate-slide-up flex flex-col rounded-3xl bg-[var(--surface-elevated)] p-6 text-left ring-1 backdrop-blur transition-transform duration-300 ease-out hover:-translate-y-1 md:p-7"
      style={{ animationDelay: `${delay}ms`, borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
    >
      <span
        className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold whitespace-nowrap uppercase tracking-[0.18em]"
        style={
          isResume
            ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
            : { background: 'var(--border)', color: 'var(--text-secondary)' }
        }
      >
        {isResume ? <RotateCcw style={{ width: 10, height: 10 }} /> : null}
        {badge}
      </span>

      <div className="mt-4 flex min-h-[3.5rem] items-center gap-4">
        <span
          className="grid size-14 shrink-0 place-items-center rounded-2xl text-white"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
            boxShadow: '0 12px 28px -6px var(--accent-shadow)',
          }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-[19px] font-bold leading-tight tracking-[-0.01em] text-slate-900 md:text-[21px] md:leading-snug">
            {title}
          </h2>
          <p className="mt-0.5 min-h-[3.25rem] text-[12px] leading-snug font-semibold text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-4 min-h-[3.5rem]">{chips}</div>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold uppercase tracking-[0.06em] text-[var(--accent-contrast)] transition-all duration-200 ease-out select-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
            boxShadow: '0 12px 28px -8px var(--accent-shadow)',
          }}
        >
          {isResume ? badge : cta}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

function SplashScreen({
  career,
  interest,
  onSelect,
}: {
  career: Resume | null
  interest: Resume | null
  onSelect: (mode: AssessmentMode) => void
}) {
  const { t } = useSettings()

  return (
    <div className="animate-question-in mx-auto w-full max-w-[1040px] px-1">
      <div className="mb-7 text-center">
        <div
          className="animate-bubble-in mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-[var(--surface-elevated)] text-slate-900 shadow-[0_12px_28px_-10px_rgba(30,41,59,0.4)] ring-1 backdrop-blur md:size-16"
          style={{ borderColor: 'var(--border)' }}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold tracking-[-0.01em] text-slate-900 md:text-[2rem]">
          {t('splash.hello.a')} <span style={{ color: 'var(--accent)' }}>{t('splash.hello.b')}</span>?
        </h1>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-slate-600">
          {t('splash.sub')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <ModeCard
          title={t('card.interest.title')}
          subtitle={t('card.interest.sub')}
          badge={interest?.finished ? t('card.result') : interest ? t('card.resume', { n: interest.answered, total: interest.total }) : t('card.interest.badge')}
          icon={<Compass style={{ width: 30, height: 30 }} strokeWidth={2.1} />}
          chips={
            <div className="flex flex-wrap items-center gap-1.5">
              {DIMS.map((d, i) => (
                <span
                  key={d.key}
                  className="animate-slide-up inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1"
                  style={{ background: `${d.color}0d`, borderColor: `${d.color}33`, animationDelay: `${200 + i * 60}ms` }}
                >
                  <span className="font-display text-[10px] font-bold" style={{ color: d.color }}>
                    {d.key}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">{t(`dim.${d.key}.short`)}</span>
                </span>
              ))}
            </div>
          }
          cta={t('card.cta')}
          onSelect={() => onSelect('interest')}
          delay={150}
          isResume={interest !== null}
        />

        <ModeCard
          title={t('card.career.title')}
          subtitle={t('card.career.sub')}
          badge={career?.finished ? t('card.result') : career ? t('card.resume', { n: career.answered, total: career.total }) : t('card.career.badge')}
          icon={
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
            </svg>
          }
          chips={
            <div className="flex flex-wrap items-center gap-1.5">
              {STAGES.map((s, i) => (
                <span
                  key={s.key}
                  className="animate-slide-up inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1"
                  style={{ background: 'var(--accent-tint)', borderColor: 'var(--accent-ring)', animationDelay: `${200 + i * 70}ms` }}
                >
                  <span className="grid size-4 place-items-center rounded-full text-white" style={{ background: 'var(--accent)' }}>
                    <s.icon style={{ width: 9, height: 9 }} strokeWidth={2.6} />
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.06em] text-slate-600">{t(`stage.${s.key}`)}</span>
                </span>
              ))}
            </div>
          }
          cta={t('card.cta')}
          onSelect={() => onSelect('career')}
          delay={220}
          isResume={career !== null}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-center">
        <span className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
          {t('splash.chip.interest', { n: INTEREST_COUNT })}
        </span>
        <span className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
          {t('splash.chip.career', { n: QUESTIONS.length, m: CAREERS.length })}
        </span>
      </div>
    </div>
  )
}

export default SplashScreen