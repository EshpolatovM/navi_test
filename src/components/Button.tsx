const sizes = {
  sm: 'h-10 px-5 text-xs',
  md: 'h-12 px-7 text-sm',
  lg: 'h-14 px-9 text-base',
}

function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  disabled = false,
  className = '',
  ...props
}: {
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  full?: boolean
  disabled?: boolean
  className?: string
  [key: string]: unknown
}) {
  const styles = {
    primary: disabled
      ? 'cursor-not-allowed bg-white/10 text-white/30'
      : 'bg-[#FFD500] text-black hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(255,213,0,0.6)] active:translate-y-0 active:scale-[0.98]',
    ghost: disabled
      ? 'cursor-not-allowed text-white/30'
      : 'text-white hover:text-[#FFD500]',
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-sans font-bold uppercase tracking-[0.04em] transition-all duration-200 ease-out select-none ${sizes[size]} ${
        full ? 'w-full' : ''
      } ${styles[variant]} ${className}`}
      {...props}
    />
  )
}

export default Button
