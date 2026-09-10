import { cn } from '../../../lib/utils'

/**
 * Editorial score furniture shared by every NAVI result card.
 * Rank = quiet editorial 01/02 numbering. ScoreValue = the single dominant
 * number in deliberate large tabular type (Manrope is already
 * loaded for the whole app); the % suffix is always smaller and quieter
 * than the digit.
 */

export function RankNum({ n, className }: { n: number | string; className?: string }) {
  return (
    <span
      className={cn(
        'font-display text-[10px] font-bold tracking-[0.18em] tabular-nums text-[var(--text-muted)]',
        className,
      )}
    >
      {String(n).padStart(2, '0')}
    </span>
  )
}

type ScoreSize = 'sm' | 'md' | 'lg' | 'xl'

const SIZES: Record<ScoreSize, string> = {
  sm: 'text-[16px]',
  md: 'text-[24px]',
  lg: 'text-[34px]',
  xl: 'text-[44px] md:text-[54px]',
}

export function ScoreValue({
  value,
  accent,
  size = 'md',
  suffix = '%',
  className,
}: {
  value: number
  accent: string
  size?: ScoreSize
  suffix?: string | null
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-baseline font-display font-bold tabular-nums leading-none tracking-[-0.03em]',
        SIZES[size],
        className,
      )}
      style={{ color: accent }}
    >
      {Math.round(value)}
      {suffix != null && (
        <span
          aria-hidden
          className="ml-0.5 self-start text-[0.52em] font-semibold tracking-normal"
          style={{ color: 'inherit', opacity: 0.62 }}
        >
          {suffix}
        </span>
      )}
    </span>
  )
}