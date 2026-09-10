import { Briefcase, Check, Clock, ListChecks, Sparkles, Target } from 'lucide-react'
import { useSettings } from '../SettingsContext'
import type { DirectionScore } from './useResultData'
import type { Lang } from '../../lib/i18n'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'

/**
 * Post-QIZIQISH result invitation to the REAL KASB TANLASH test.
 *
 * Led by a personal line built from the user's real top interest directions.
 * Rendered only on the interest-result overview, never after the career test.
 */

type Field = 'tech' | 'creative' | 'care'

const FIELD_BY_ID: Record<string, Field> = {
  ai: 'tech',
  it: 'tech',
  gamedev: 'tech',
  mobiledev: 'tech',
  uiux: 'creative',
  mobilograf: 'creative',
  video: 'creative',
  smm: 'creative',
  marketing: 'creative',
  doctor: 'care',
}

function buildInsight(topDirections: DirectionScore[], lang: Lang, t: (k: string, v?: Record<string, string>) => string): string | null {
  const fields: Field[] = []
  for (const d of topDirections.slice(0, 3)) {
    const field = FIELD_BY_ID[d.id]
    if (field && !fields.includes(field)) fields.push(field)
  }
  if (fields.length === 0) return null
  const sep = lang === 'en' ? ' and ' : lang === 'uz' ? ' va ' : ' и '
  const labels = fields.map((f) => t(`invite.career.field.${f}`))
  return t('invite.career.insight', { fields: labels.join(sep) })
}

const META_CHIPS = [
  { key: 'invite.career.metaQuestions', icon: <ListChecks className="size-3.5" strokeWidth={2.3} /> },
  { key: 'invite.career.metaCareers', icon: <Briefcase className="size-3.5" strokeWidth={2.3} /> },
  { key: 'invite.career.metaMinutes', icon: <Clock className="size-3.5" strokeWidth={2.3} /> },
] as const

function InviteCareerCard({
  onTry,
  topDirections,
}: {
  onTry: () => void
  topDirections: DirectionScore[]
}) {
  const { t, lang } = useSettings()

  const insight = buildInsight(topDirections, lang as Lang, (k, v) => t(k, v))

  return (
    <section
      className="motion-d2 animate-slide-up relative overflow-hidden rounded-[2.25rem] rounded-br-[3.5rem] ring-1 backdrop-blur"
      style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        style={{ background: 'var(--accent)', opacity: 0.55 }}
      />

      <div className="relative px-6 py-8 md:px-10 md:py-10">
        {/* Hero icon + personal signal from the real QIZIQISH scores */}
        <div className="mb-6 flex items-start gap-4">
          <span
            className="answer-icon-float grid size-14 shrink-0 place-items-center rounded-[1.15rem] text-[var(--accent)]"
            style={{ background: 'var(--accent-soft)' }}
          >
            <Target className="size-6" strokeWidth={2.2} />
          </span>
          {insight && (
            <p className="pt-1.5 text-[12.5px] leading-snug font-semibold text-[var(--text-secondary)]">
              <Sparkles
                className="-mt-0.5 mr-1.5 inline size-3.5"
                style={{ color: 'var(--accent)' }}
                strokeWidth={2.4}
              />
              {insight}
            </p>
          )}
        </div>

        <p className="text-[11px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase">
          {t('invite.career.eyebrow')}
        </p>

        <h2 className="mt-2.5 max-w-lg font-display text-[26px] leading-[1.15] font-bold tracking-[-0.015em] text-[var(--text-primary)] md:text-[32px]">
          {t('invite.career.headline')}
        </h2>

        <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
          {t('invite.career.desc')}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {META_CHIPS.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-[var(--text-secondary)] ring-1"
              style={{ borderColor: 'var(--border)', background: 'var(--surface-soft)' }}
            >
              {chip.icon}
              {t(chip.key)}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <InteractiveHoverButton
            type="button"
            variant="primary"
            size="lg"
            full
            text={t('invite.career.primary')}
            onClick={onTry}
          />
          <InteractiveHoverButton
            type="button"
            variant="ghost"
            size="lg"
            arrow={false}
            full
            text={t('invite.career.secondary')}
            onClick={() => {}}
          />
        </div>

        <p className="mt-5 flex items-center gap-1.5 text-[11.5px] font-medium text-[var(--text-muted)]">
          <Check className="size-3.5" style={{ color: 'var(--accent)' }} strokeWidth={2.6} />
          {t('invite.career.bothResults')}
        </p>
      </div>
    </section>
  )
}

export default InviteCareerCard