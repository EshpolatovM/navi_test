import type { ElementType } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Check, Close, Delete, MusicOne, Shake, VolumeUp } from '@icon-park/react'
import { LANGS } from '../lib/i18n'
import { useSettings } from './SettingsContext'
import { useQuizAudio } from '../hooks/useQuizAudio'
import { useHaptics } from '../hooks/useHaptics'
import { InteractiveHoverButton } from './ui/interactive-hover-button'
import BlindPullToggle from './ui/blind-pull-toggle'
import { useDialogFocus } from '../hooks/useDialogFocus'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase">
      {children}
    </p>
  )
}

function ToggleRow({
  icon: Icon,
  title,
  sub,
  on,
  onToggle,
}: {
  icon: ElementType
  title: string
  sub: string
  on: boolean
  onToggle: (next: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onToggle(!on)}
      className="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors"
      style={{ borderColor: on ? 'var(--accent)' : 'var(--border)', background: on ? 'var(--accent-tint)' : 'transparent' }}
    >
      <span
        className="grid size-9 shrink-0 place-items-center rounded-lg transition-colors"
        style={{ background: on ? 'var(--accent-soft)' : 'rgba(0,0,0,0.03)', color: on ? 'var(--accent)' : 'var(--text-secondary)' }}
      >
        <Icon style={{ width: 17, height: 17 }} strokeWidth={4.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-bold text-slate-800">{title}</span>
        <span className="mt-0.5 block text-[11px] leading-snug text-slate-400">{sub}</span>
      </span>
      <span
        aria-hidden
        className="relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors"
        style={{ background: on ? 'var(--accent)' : 'var(--surface-soft)', boxShadow: 'inset 0 0 0 1px var(--border-strong)' }}
      >
        <span
          className="absolute h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ease-out"
          style={{ left: 3, transform: on ? 'translateX(16px)' : 'translateX(0)' }}
        />
      </span>
    </button>
  )
}

function SetupModal({ onClose, onDeleteAccount }: { onClose: () => void; onDeleteAccount: () => void }) {
  const { lang, theme, t, setLang } = useSettings()
  const { soundEnabled, setSoundEnabled, musicEnabled, setMusicEnabled } = useQuizAudio()
  const { hapticsEnabled, setHapticsEnabled } = useHaptics()
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLDivElement>(null)

  useDialogFocus(true, panelRef)
  useDialogFocus(confirmDeleteOpen, confirmRef)

  // Escape closes the top-most dialog: the delete confirmation first, then the
  // settings panel itself.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (confirmDeleteOpen) setConfirmDeleteOpen(false)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmDeleteOpen, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 17, 22, 0.45)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="motion-pan-m animate-bubble-in max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow)] ring-1 transition-colors focus:outline-none"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-[-0.01em] text-slate-900">
            {t('settings.title')}
          </h2>
          <InteractiveHoverButton
            type="button"
            size="sm"
            variant="ghost"
            arrow={false}
            icon={<Close className="size-4" />}
            aria-label={t('settings.close')}
            onClick={onClose}
          />
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
                    className="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors"
                    style={{ borderColor: active ? 'var(--accent)' : 'var(--border)', background: active ? 'var(--accent-tint)' : 'transparent' }}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg text-[11px] font-extrabold tracking-[0.06em]" style={{ background: active ? 'var(--accent-soft)' : 'rgba(0,0,0,0.03)', color: active ? 'var(--accent)' : 'var(--text-secondary)' }}>{l.badge}</span>
                    <span className="flex-1 text-[13px] font-bold text-slate-800">{l.label}</span>
                    {active && (
                      <span className="grid size-5 place-items-center rounded-full text-white" style={{ background: 'var(--accent)' }}>
                        <Check className="size-3" strokeWidth={6.4} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <SectionLabel>{t('settings.theme')}</SectionLabel>
            <div className="flex items-center gap-4 rounded-2xl px-3 py-2">
              <BlindPullToggle />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-slate-800">{t('settings.theme.mode')}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-400">{t('settings.theme.control')}</p>
              </div>
              <span
                className="shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-[0.04em]"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                {t(theme === 'dark' ? 'theme.dark' : 'theme.light')}
              </span>
            </div>
          </div>

          <div>
            <SectionLabel>{t('settings.audio')}</SectionLabel>
            <div className="flex flex-col gap-2">
              <ToggleRow
                icon={VolumeUp}
                title={t('settings.sound')}
                sub={t('settings.sound.sub')}
                on={soundEnabled}
                onToggle={setSoundEnabled}
              />
              <ToggleRow
                icon={Shake}
                title={t('settings.haptics')}
                sub={t('settings.haptics.sub')}
                on={hapticsEnabled}
                onToggle={setHapticsEnabled}
              />
              <ToggleRow
                icon={MusicOne}
                title={t('settings.music')}
                sub={t('settings.music.sub')}
                on={musicEnabled}
                onToggle={setMusicEnabled}
              />
            </div>
          </div>

          {/* Danger zone — intentionally quieter than the settings above */}
          <div className="border-t pt-5" style={{ borderColor: 'var(--border)' }}>
            <InteractiveHoverButton
              type="button"
              variant="destructive"
              size="md"
              full
              arrow={false}
              icon={<Delete className="size-4" />}
              text={t('settings.deleteAccount')}
              aria-label={t('settings.deleteAccount')}
              onClick={() => setConfirmDeleteOpen(true)}
            />
            <p className="mt-2 px-1 text-[11px] leading-snug text-slate-400">{t('settings.deleteAccount.sub')}</p>
          </div>
        </div>
      </div>

      {/* Delete-account confirmation */}
      {confirmDeleteOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          style={{ background: 'rgba(15, 17, 22, 0.5)', backdropFilter: 'blur(8px)' }}
          onClick={() => setConfirmDeleteOpen(false)}
        >
          <div
            ref={confirmRef}
            tabIndex={-1}
            role="alertdialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="motion-pan-m animate-bubble-in w-full max-w-sm rounded-3xl bg-[var(--surface-elevated)] p-6 text-center shadow-[var(--shadow)] ring-1 focus:outline-none"
            style={{ borderColor: 'rgba(225,29,72,0.18)' }}
          >
            <span className="mx-auto grid size-12 place-items-center rounded-2xl" style={{ background: 'rgba(225,29,72,0.12)', color: '#E11D48' }}>
              <Delete className="size-5" strokeWidth={4.4} />
            </span>
            <h3 className="mt-4 text-[16px] leading-snug font-extrabold tracking-[-0.01em] text-slate-900">
              {t('delete.confirmTitle')}
            </h3>
            <p className="mx-auto mt-2 max-w-[260px] text-[12.5px] leading-relaxed text-slate-500">
              {t('delete.confirmDesc')}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <InteractiveHoverButton
                type="button"
                variant="ghost"
                size="md"
                arrow={false}
                text={t('delete.cancel')}
                onClick={() => setConfirmDeleteOpen(false)}
              />
              <InteractiveHoverButton
                type="button"
                variant="destructive"
                size="md"
                arrow={false}
                text={t('delete.confirm')}
                onClick={() => {
                  setConfirmDeleteOpen(false)
                  onDeleteAccount()
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SetupModal