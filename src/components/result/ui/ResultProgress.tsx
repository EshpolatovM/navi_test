import { motion } from 'framer-motion'
import { cn } from '../../../lib/utils'

/**
 * NAVI score meter — one primitive, two intentional visualizations:
 *
 *   segmented  — a "assessment report" meter (default). Discrete cells read as
 *                a deliberate score, not a generic loading bar. Best for
 *                ranked lists (directions, traits, careers, values).
 *   smooth     — continuous bar for fine progress contexts (hero, growth gap).
 *
 * The track is always the neutral raised surface with an inset hairline;
 * the fill uses the card's semantic accent (with a touch of transparency at
 * the leading edge so it sits on the surface rather than glowing).
 */

export function clampScore(v: number): number {
  return Math.max(0, Math.min(100, v))
}

export function ResultProgress({
  value,
  accent,
  delay = 0,
  thickness = 6,
  segmented = true,
  segments = 20,
  className,
  ariaLabel,
}: {
  value: number
  accent: string
  delay?: number
  thickness?: number
  segmented?: boolean
  segments?: number
  className?: string
  ariaLabel?: string
}) {
  const v = clampScore(value)

  if (segmented) {
    const filled = Math.round((v / 100) * segments)
    return (
      <div
        className={cn('flex w-full gap-[3px]', className)}
        style={{ height: thickness }}
        role="meter"
        aria-label={ariaLabel}
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: segments }).map((_, i) => {
          const active = i < filled
          return (
            <motion.span
              key={i}
              className="h-full flex-1 overflow-hidden rounded-full"
              style={{
                background: active
                  ? accent
                  : 'var(--surface-elevated-2)',
              }}
              initial={{ scaleX: 0, opacity: active ? 0.4 : 1 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.55, delay: delay + i * 0.012, ease: [0.22, 1, 0.36, 1] }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={cn('w-full overflow-hidden rounded-full', className)}
      style={{ height: thickness, background: 'var(--surface-elevated-2)', boxShadow: 'inset 0 0 0 1px var(--border)' }}
      role="meter"
      aria-label={ariaLabel}
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: accent }}
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
