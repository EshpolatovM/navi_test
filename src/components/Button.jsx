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
}) {
  const styles = {
    primary: disabled
      ? 'cursor-not-allowed bg-[var(--bg-elevated)] text-[var(--text-secondary)]/50 shadow-none'
      : 'bg-gradient-to-b from-[#ffd970] to-[var(--accent)] text-[#141005] shadow-[0_10px_28px_-12px_rgba(245,197,66,0.75)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(245,197,66,0.85)] active:translate-y-0 active:scale-[0.98]',
    ghost: disabled
      ? 'cursor-not-allowed text-[var(--text-secondary)]/50'
      : 'text-[var(--text-primary)] hover:text-[var(--accent)]',
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-sans font-bold uppercase tracking-[0.04em] transition-all duration-200 ease-out select-none ${sizes[size]} ${
        full ? 'w-full' : ''
      } ${styles[variant]} ${className}`}
      {...props}
    />
  )
}

export default Button