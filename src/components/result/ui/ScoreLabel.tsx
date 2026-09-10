import { useSettings } from '../../SettingsContext'

/**
 * Semantic level derived from the actual score — never hardcoded.
 * Mirrors Ant Design's "Status" pattern: value → tier → color.
 */
export function scoreLevel(score: number): 'strong' | 'good' | 'moderate' | 'basic' {
  if (score >= 75) return 'strong'
  if (score >= 55) return 'good'
  if (score >= 35) return 'moderate'
  return 'basic'
}

export function ScoreLabel({
  score,
  accent,
  className,
}: {
  score: number
  accent?: string
  className?: string
}) {
  const { t } = useSettings()
  const level = scoreLevel(score)
  const color = accent ?? 'var(--accent)'
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.06em] uppercase ${className ?? ''}`}
      style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)` }}
    >
      <span aria-hidden className="size-1 rounded-full" style={{ background: color }} />
      {t(`result.matchLevel.${level}`)}
    </span>
  )
}