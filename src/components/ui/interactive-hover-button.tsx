import React from 'react'
import { Right } from '@icon-park/react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  arrow?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  full?: boolean
  icon?: React.ReactNode
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-10 md:h-9 min-w-32 px-4 text-xs',
  md: 'h-11 min-w-36 px-5 text-[13px] sm:px-6',
  lg: 'h-13 min-w-40 px-8 text-sm',
  icon: 'size-10 p-0 md:size-9',
}

const VARIANTS: Record<ButtonVariant, { rest: string; fill: string; overlay: string }> = {
  primary: {
    rest: 'border-[var(--accent-ring)] bg-[var(--accent-soft)] text-[var(--accent)]',
    fill: 'bg-[var(--accent)]',
    overlay: 'text-[var(--accent-contrast)]',
  },
  ghost: {
    rest: 'border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--text-primary)]',
    fill: 'bg-[var(--accent)]',
    overlay: 'text-[var(--accent-contrast)]',
  },
  destructive: {
    rest: 'border-red-200 bg-red-500/10 text-red-600 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-400',
    fill: 'bg-red-500',
    overlay: 'text-white',
  },
}

/**
 * QuizLab/NAVI action button. Default-browser look never applies: the resting
 * state is a clean surface with a subtle border, and on hover the accent fill
 * grows into the button as the text slides out and an arrow slides in.
 * Sizes are fixed (min-width, no reflow) so nothing around it moves. On touch
 * devices the press state gives the same "into the button" feel via scale.
 */
const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  (
    {
      text = 'Button',
      arrow = true,
      variant = 'ghost',
      size = 'md',
      full = false,
      icon,
      className,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const v = VARIANTS[variant]
    const iconOnly = size === 'icon' && (text === 'Button' || !text)
    const showArrow = arrow && !iconOnly && !icon
    const content = (
      <>
        {icon && <span className="shrink-0 transition-colors duration-300 group-hover:text-inherit">{icon}</span>}
        {!iconOnly && <span>{text}</span>}
      </>
    )

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'group relative cursor-pointer overflow-hidden rounded-full border text-center font-semibold tracking-[0.01em] select-none transition-colors duration-300 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50',
          size === 'icon' ? 'inline-grid place-items-center' : 'inline-flex items-center justify-center',
          SIZES[size],
          v.rest,
          full && 'w-full',
          className,
        )}
        {...props}
      >
        {!iconOnly && (
          <span className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-4 group-hover:opacity-0">
            {content}
          </span>
        )}

        {iconOnly && (
          <span className="relative z-10 flex items-center justify-center transition-colors duration-300 group-hover:text-[var(--accent-contrast)]">
            {icon ?? children}
          </span>
        )}

        {!iconOnly && (
          <span
            className={cn(
              'absolute inset-0 z-10 flex items-center justify-center gap-2 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100',
              v.overlay,
            )}
          >
            {content}
            {showArrow && <Right className="size-3.5" strokeWidth={5.2} />}
          </span>
        )}

        <span aria-hidden className={cn('absolute inset-0 scale-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-100', v.fill)} />
      </button>
    )
  },
)

InteractiveHoverButton.displayName = 'InteractiveHoverButton'

export { InteractiveHoverButton }