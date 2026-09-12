import { CompassOne, RotateOne, Target } from '@icon-park/react'
import { useSettings } from './SettingsContext'
import NaviLogo from './NaviLogo'
import { InteractiveHoverButton } from './ui/interactive-hover-button'

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
  cta,
  onSelect,
  delay,
  isResume,
}: {
  title: string
  subtitle: string
  badge: string
  icon: React.ReactNode
  cta: string
  onSelect: () => void
  delay: number
  isResume: boolean
}) {
  return (
    <div
      className="surface-card motion-d1 animate-slide-up flex flex-col rounded-3xl bg-[var(--surface-elevated)] p-6 text-left backdrop-blur hover:-translate-y-1 md:p-7"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold whitespace-nowrap uppercase tracking-[0.18em]"
        style={
          isResume
            ? { background: 'var(--accent-soft)', color: 'var(--accent)' }
            : { background: 'var(--border)', color: 'var(--text-secondary)' }
        }
      >
        {isResume ? <RotateOne style={{ width: 10, height: 10 }} /> : null}
        {badge}
      </span>

      <div className="mt-4 flex items-center gap-4">
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
          <p className="mt-0.5 text-[12px] leading-snug font-semibold text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <InteractiveHoverButton
          type="button"
          variant="primary"
          size="md"
          full
          text={isResume ? badge : cta}
          onClick={onSelect}
          aria-label={isResume ? badge : cta}
        />
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
        <NaviLogo width={200} height={43.75} className="float-road mx-auto mb-4" />
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
          icon={<CompassOne style={{ width: 30, height: 30 }} strokeWidth={4.2} />}
          cta={t('card.cta')}
          onSelect={() => onSelect('interest')}
          delay={150}
          isResume={interest !== null}
        />

        <ModeCard
          title={t('card.career.title')}
          subtitle={t('card.career.sub')}
          badge={career?.finished ? t('card.result') : career ? t('card.resume', { n: career.answered, total: career.total }) : t('card.career.badge')}
          icon={<Target style={{ width: 30, height: 30 }} strokeWidth={4.2} />}
          cta={t('card.cta')}
          onSelect={() => onSelect('career')}
          delay={220}
          isResume={career !== null}
        />
      </div>
    </div>
  )
}

export default SplashScreen