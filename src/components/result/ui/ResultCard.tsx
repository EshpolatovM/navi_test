import { cn } from '../../../lib/utils'

/**
 * NAVI result-card system — one shell, four deliberate levels.
 *
 *   featured  — primary "north star" moments (top career, top direction,
 *               archetype identity, next step). Larger radius with the soft
 *               NAVI asymmetric corner, accent hairline, elevated at rest.
 *   standard  — ranked data cards (directions, traits, catalog, reports).
 *   compact   — quiet density surfaces (summary trio, section index).
 *   flat      — inner / non-elevated rows pulled up as panels.
 *
 * Every level shares the neutral surface, border language, 250–350ms motion
 * and accent-placement philosophy. Composition differs per content — the
 * surface stays neutral and accent is reserved for icon, score, meter, tags.
 */

export type CardVariant = 'featured' | 'standard' | 'compact' | 'flat'

interface ResultCardProps {
  /** semantic element: plain surface (div) or interactive (button/link) */
  as?: 'div' | 'button' | 'a'
  variant?: CardVariant
  /** legacy alias for `variant="featured"` */
  featured?: boolean
  /** opt out of hover lift on interactive cards */
  hover?: boolean
  onClick?: (e: React.MouseEvent) => void
  href?: string
  /** editorial rank shown top-right on non-featured cards */
  rank?: string
  className?: string
  children: React.ReactNode
  /** reduced-motion friendly entrance delay (ms) */
  delay?: number
}

const VARIANTS: Record<CardVariant, { radius: string; shadow: string }> = {
  featured: {
    radius: 'rounded-[1.5rem] rounded-br-[2.25rem]',
    shadow: 'shadow-[0_18px_44px_-24px_rgba(15,18,25,0.42)]',
  },
  standard: {
    radius: 'rounded-[1.35rem]',
    shadow: 'shadow-[0_2px_14px_-8px_rgba(15,18,25,0.2)]',
  },
  compact: {
    radius: 'rounded-2xl',
    shadow: 'shadow-[0_1px_8px_-4px_rgba(15,18,25,0.14)]',
  },
  flat: {
    radius: 'rounded-2xl',
    shadow: 'shadow-none',
  },
}

export function ResultCard({
  as: Tag = 'div',
  variant,
  featured = false,
  hover = true,
  onClick,
  href,
  rank,
  className,
  children,
  delay = 0,
}: ResultCardProps) {
  const v = VARIANTS[variant ?? (featured ? 'featured' : 'standard')]
  const interactive = Tag !== 'div'
  const TagAny = Tag as React.ElementType

  return (
    <TagAny
      {...(Tag === 'a' ? { href } : {})}
      {...(Tag === 'button'
        ? { type: 'button', onClick }
        : Tag === 'a'
          ? { onClick }
          : {})}
      className={cn(
        'group motion-d1 animate-slide-up relative flex w-full flex-col text-left',
        `overflow-hidden bg-[var(--surface-elevated)] transition-[transform,border-color,box-shadow] duration-300 ${v.radius} ${v.shadow}`,
        interactive && hover
          ? 'cursor-pointer hover:-translate-y-[2px] hover:border-[var(--accent-ring)] hover:shadow-[0_22px_52px_-26px_rgba(15,18,25,0.45)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
          : '',
        className,
      )}
      style={{
        border: '1px solid var(--border)',
        animationDelay: `${delay}ms`,
      }}
    >
      {featured && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: 'var(--accent)', opacity: 0.55 }}
        />
      )}
      {rank && !featured && (
        <span className="absolute right-4 top-4 font-display text-[10px] font-bold tracking-[0.18em] tabular-nums text-[var(--text-muted)]">
          {rank}
        </span>
      )}
      {children}
    </TagAny>
  )
}

/** Icon tile — soft organic rounded square, always accent-tinted, never a full-color block. */
export function ResultIconTile({
  icon,
  color,
  size = 44,
  iconSize = 20,
  interactive = false,
  className,
  radius = '0.8rem',
}: {
  icon: React.ReactNode
  color: string
  size?: number
  iconSize?: number
  interactive?: boolean
  className?: string
  radius?: string
}) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center transition-transform duration-300',
        interactive ? 'group-hover:scale-105' : '',
        className,
      )}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `color-mix(in srgb, ${color} 11%, transparent)`,
        color,
      }}
    >
      <span style={{ display: 'grid', placeItems: 'center', width: iconSize, height: iconSize }}>
        {icon}
      </span>
    </span>
  )
}

/** Compact Ant Design Tag-inspired chip — neutral by default, accent-tint optional. */
export function ResultTag({
  children,
  color,
  className,
}: {
  children: React.ReactNode
  color?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-[0.01em]',
        color ? '' : 'bg-[var(--surface-elevated-2)] text-[var(--text-secondary)]',
        className,
      )}
      style={color ? { color, background: `color-mix(in srgb, ${color} 9%, transparent)` } : undefined}
    >
      {children}
    </span>
  )
}