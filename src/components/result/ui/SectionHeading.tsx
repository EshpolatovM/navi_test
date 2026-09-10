import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../../lib/utils'

/**
 * Consistent section heading used across result blocks.
 * Title left, optional quiet "Batafsil"/"Barchasini ko'rish" link right.
 * Keeps hierarchy strong without a wall of cards.
 */
export function SectionHeading({
  title,
  hint,
  to,
  action,
  className,
}: {
  title: string
  /** short muted sub-line under the title */
  hint?: string
  /** route for the trailing link */
  to?: string
  /** translated link label */
  action?: string
  className?: string
}) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        <h2 className="font-display text-[20px] leading-tight font-bold tracking-[-0.01em] text-[var(--text-primary)] sm:text-[23px]">
          {title}
        </h2>
        {hint && (
          <p className="mt-1 text-[12px] text-[var(--text-muted)]">{hint}</p>
        )}
      </div>
      {to && (
        <Link
          to={to}
          className="group flex shrink-0 items-center gap-0.5 pb-1 text-[12px] font-bold text-[var(--accent)]"
        >
          {action ?? ''}
          <ChevronRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}