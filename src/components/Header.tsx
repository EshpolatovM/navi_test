import { Settings } from 'lucide-react'
import { useSettings } from './SettingsContext'

function Header({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const { theme, setTheme, t } = useSettings()
  return (
    <header className="relative z-10 flex items-center justify-between px-4 py-3.5 md:px-8">
      <a href="/" className="motion-ui flex items-center gap-2.5">
        <span
          className="grid size-9 place-items-center rounded-lg text-white"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
            boxShadow: '0 6px 16px var(--accent-shadow)',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
          </svg>
        </span>
        <span className="text-lg font-extrabold tracking-tight text-slate-900">
          Quiz<span style={{ color: 'var(--accent)' }}>Lab</span>
        </span>
      </a>

      <div className="motion-ui flex items-center gap-2">
        <button
          type="button"
          aria-label={t(theme === 'dark' ? 'theme.toLight' : 'theme.toDark')}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="grid size-9 place-items-center rounded-full bg-[var(--surface-elevated)] text-[15px] leading-none ring-1 ring-slate-200/80 transition-all duration-200 hover:-translate-y-0.5 active:scale-90"
        >
          <span aria-hidden>{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>

        {onOpenSettings && (
          <button
            type="button"
            aria-label="Sozlamalar"
            onClick={onOpenSettings}
            className="grid size-9 place-items-center rounded-full bg-[var(--surface-elevated)] text-slate-500 ring-1 ring-slate-200/80 transition-all duration-200 hover:-translate-y-0.5 hover:text-slate-900 active:scale-90"
          >
            <Settings className="size-4.5" strokeWidth={2.2} />
          </button>
        )}
      </div>
    </header>
  )
}

export default Header