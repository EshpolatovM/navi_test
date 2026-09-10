import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../../lib/utils'
import { clampScore } from './ResultProgress'

/**
 * Circular score ring — reserved for the single dominant metric (top
 * direction, #1 career, archetype identity). A donut reads as "how strong is
 * this match" at a glance and anchors meaning with the score centered inside.
 *
 * The SVG uses a fixed viewBox (so strokes stay proportional) and scales to
 * the container, which is sized responsively with Tailwind classes — on a
 * phone (~96px) the ring stays compact and the centered score keeps its size
 * and legibility without becoming a shrunken desktop chart.
 */

export function ScoreRing({
  value,
  accent,
  size = 120,
  stroke = 9,
  delay = 0.35,
  label,
  children,
  className,
}: {
  value: number
  accent: string
  /** coordinate-space size (viewBox) — the rendered px come from `className` */
  size?: number
  stroke?: number
  delay?: number
  /** small caption below the centered value */
  label?: string
  children?: React.ReactNode
  /** rendered size: default w-[96px] md:w-[120px], override per usage */
  className?: string
}) {
  const v = clampScore(value)
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r

  return (
    <div className={cn('relative aspect-square w-[96px] shrink-0 md:w-[120px]', className)}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden className="h-full w-full rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-elevated-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={stroke}
          strokeLinecap="round"
          opacity={0.5}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - v / 100) }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children ?? (
          <span
            className="font-display font-bold leading-none tracking-[-0.03em] tabular-nums"
            style={{ color: accent, fontSize: 'clamp(22px, 7.5vw, 30px)' }}
          >
            {Math.round(v)}
            <span className="text-[0.58em] font-semibold" style={{ color: 'inherit', opacity: 0.6 }}>
              %
            </span>
          </span>
        )}
        {label && (
          <span className="mt-[2px] max-w-full truncate px-2 text-center text-[8.5px] font-bold tracking-[0.12em] uppercase text-[var(--text-muted)] sm:text-[9.5px]">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}