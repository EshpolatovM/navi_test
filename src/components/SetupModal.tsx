import { useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { LANGS } from '../lib/i18n'
import { ACCENT_EXTENDED, ACCENT_PALETTE } from '../lib/theme'
import { useSettings } from './SettingsContext'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase">
      {children}
    </p>
  )
}

function ColorSwatch({
  hex,
  name,
  active,
  onPick,
}: {
  hex: string
  name: string
  active: boolean
  onPick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={`color-${name.toLowerCase()}`}
      onClick={onPick}
      className="relative grid size-10 place-items-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
      style={{
        background: hex,
        boxShadow: active
          ? `0 0 0 2px var(--surface-elevated), 0 0 0 5px ${hex}88`
          : '0 6px 14px -6px rgba(0,0,0,0.35)',
      }}
    >
      {active && <Check className="size-4 text-white" strokeWidth={3.2} />}
    </button>
  )
}

function SetupModal({ onClose }: { onClose: () => void }) {
  const { lang, theme, accent, motionEnabled, t, setLang, setTheme, setAccent, setMotionEnabled } =
    useSettings()
  const [showMore, setShowMore] = useState(false)
  const all = showMore ? [...ACCENT_PALETTE, ...ACCENT_EXTENDED] : ACCENT_PALETTE

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--accent-glow)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="motion-pan-m animate-bubble-in max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow)] ring-1 transition-colors"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-[-0.01em] text-slate-900">
            {t('settings.title')}
          </h2>
          <button
            type="button"
            aria-label={t('settings.close')}
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full text-slate-500 ring-1 ring-slate-200/80 transition-all duration-200 hover:text-slate-900 active:scale-90"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <SectionLabel>{t('settings.lang')}</SectionLabel>
            <div className="flex flex-col gap-2">
              {LANGS.map((l) => {
                const active = lang === l.code
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left ring-1 transition-colors"
                    style={{ borderColor: active ? 'var(--accent)' : 'var(--border)', background: active ? 'var(--accent-tint)' : 'transparent' }}
                  >
                    <span className="text-[18px]">{l.flag}</span>
                    <span className="flex-1 text-[13px] font-bold text-slate-800">{l.label}</span>
                    {active && (
                      <span className="grid size-5 place-items-center rounded-full text-white" style={{ background: 'var(--accent)' }}>
                        <Check className="size-3" strokeWidth={3.2} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <SectionLabel>{t('settings.theme')}</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {(['light', 'dark'] as const).map((opt) => {
                const active = theme === opt
                const light = opt === 'light'
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTheme(opt)}
                    className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-800 ring-1 transition-colors"
                    style={{ borderColor: active ? 'var(--accent)' : 'var(--border)', background: active ? 'var(--accent-tint)' : 'transparent' }}
                  >
                    {light ? '☀️' : '🌙'}
                    {t(light ? 'settings.theme.light' : 'settings.theme.dark')}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <SectionLabel>{t('settings.motion')}</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {['on', 'off'].map((opt) => {
                const on = opt === 'on'
                const active = motionEnabled === on
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setMotionEnabled(on)}
                    className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-800 ring-1 transition-colors"
                    style={{ borderColor: active ? 'var(--accent)' : 'var(--border)', background: active ? 'var(--accent-tint)' : 'transparent' }}
                  >
                    {on ? '🌀' : '🧘'}
                    {t(on ? 'settings.motion.on' : 'settings.motion.off')}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <SectionLabel>{t('settings.accent')}</SectionLabel>
            <div className="grid grid-cols-6 justify-items-center gap-3">
              {all.map((p) => (
                <ColorSwatch
                  key={p.hex}
                  hex={p.hex}
                  name={p.name}
                  active={accent === p.hex}
                  onPick={() => setAccent(p.hex)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold text-slate-500 ring-1 transition-colors hover:text-slate-800"
              style={{ borderColor: 'var(--border)' }}
            >
              {t('settings.more')}
              <ChevronDown
                className="size-3.5 transition-transform duration-200"
                style={{ transform: showMore ? 'rotate(180deg)' : 'none' }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetupModal