import { Rocket, Compass, RotateCcw } from 'lucide-react'
import { useSettings } from '../SettingsContext'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'
import { ResultCard } from './ui/ResultCard'

interface NextStep {
  titleKey: string
  subtitleKey: string
  icon: string
  name: string
  target: 'career' | 'directions' | 'retake'
}

const ICONS: Record<string, React.ReactNode> = {
  rocket: <Rocket className="size-6" strokeWidth={2.2} />,
  compass: <Compass className="size-6" strokeWidth={2.2} />,
  rotate: <RotateCcw className="size-6" strokeWidth={2.2} />,
}

interface Props {
  nextStep: NextStep
  /** Optional primary action. Omitted = informational card (no retake link). */
  onAction?: () => void
}

function NextStepCard({ nextStep, onAction }: Props) {
  const { t } = useSettings()
  return (
    <section id="nextStep" className="animate-fade-in">
      <ResultCard featured delay={200} className="items-center px-6 py-10 text-center! md:px-10">
        <span
          className="grid size-14 place-items-center rounded-2xl text-[var(--accent)]"
          style={{ background: 'var(--accent-soft)' }}
        >
          {ICONS[nextStep.icon] ?? <Rocket className="size-6" strokeWidth={2.2} />}
        </span>
        <h2 className="mt-5 font-display text-[22px] font-bold text-[var(--text-primary)]">
          {t(nextStep.titleKey)}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-[var(--text-secondary)]">
          {t(nextStep.subtitleKey, { name: nextStep.name })}
        </p>
        {onAction && (
          <InteractiveHoverButton
            type="button"
            variant="primary"
            size="md"
            text={t('next.cta')}
            onClick={onAction}
            className="mt-6"
          />
        )}
      </ResultCard>
    </section>
  )
}

export default NextStepCard