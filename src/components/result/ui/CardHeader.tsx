import { cn } from '../../../lib/utils'

/**
 * Canonical NAVI card header — the editorial strip that gives every data card
 * its hierarchy: quiet rank/eyebrow on the left, the dominant score anchored
 * right, then icon + title + meta. Mirrors the Ant Card header anatomy
 * (title · extra) but tuned to the NAVI editorial voice.
 */
export function CardHeader({
  icon,
  eyebrow,
  title,
  meta,
  rank,
  score,
  right,
  className,
  titleClass,
  align = 'start',
}: {
  icon?: React.ReactNode
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  meta?: React.ReactNode
  /** editorial rank — shown as a quiet label above the title when present */
  rank?: React.ReactNode
  /** dominant score — anchored to the right edge */
  score?: React.ReactNode
  /** anything extra pinned to the top-right (replaces `score`) */
  right?: React.ReactNode
  className?: string
  titleClass?: string
  align?: 'start' | 'center'
}) {
  return (
    <div className={cn('flex w-full flex-col gap-1', align === 'center' && 'items-center text-center', className)}>
      <div className={cn('flex w-full items-start justify-between gap-3', align === 'center' && 'justify-center')}>
        <div className={cn('flex min-w-0 items-start gap-3.5', align === 'center' && 'flex-col items-center')}>
          {icon}
          <div className={cn('min-w-0 flex-1', align === 'center' && 'flex items-center flex-col')}>
            {eyebrow != null ? (
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">{eyebrow}</div>
            ) : (
              rank != null && <div className="mb-1">{rank}</div>
            )}
            {title != null && (
              <h3
                className={cn(
                  'truncate text-[15px] leading-snug font-bold text-[var(--text-primary)]',
                  titleClass,
                )}
              >
                {title}
              </h3>
            )}
            {meta != null && <div className="mt-1.5 flex flex-wrap items-center gap-1.5">{meta}</div>}
          </div>
        </div>
        {score != null && <div className="shrink-0">{score}</div>}
        {right != null && <div className="shrink-0">{right}</div>}
      </div>
    </div>
  )
}