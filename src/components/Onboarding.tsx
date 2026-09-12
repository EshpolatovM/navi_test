import { useState } from 'react'
import { ArrowLeft, Check, Moon, Sun } from '@icon-park/react'
import { LANGS } from '../lib/i18n'
import { useSettings } from './SettingsContext'
import { InteractiveHoverButton } from './ui/interactive-hover-button'

const STEPS = ['lang', 'theme'] as const
type Step = (typeof STEPS)[number]

function ThemePreview({ dark }: { dark: boolean }) {
  const vars = dark
    ? {
        '--surface': '#121212',
        '--surface-elevated': '#1f1f1f',
        '--text-primary': '#ececf2',
        '--text-secondary': '#a6adbc',
        '--border': 'rgba(255,255,255,0.09)',
      }
    : {
        '--surface': '#f7f7f7',
        '--surface-elevated': '#ffffff',
        '--text-primary': '#20232b',
        '--text-secondary': '#565b66',
        '--border': 'rgba(30,34,43,0.1)',
      }
  return (
    <div
      aria-hidden
      className="pointer-events-none w-full overflow-hidden rounded-xl p-3"
      style={{ ...vars, background: 'var(--surface)', border: '1px solid var(--border)' } as React.CSSProperties}
    >
      <div className="mb-2 h-2 w-1/3 rounded-full" style={{ background: 'var(--text-primary)' }} />
      <div className="mb-1.5 h-1.5 w-full rounded-full" style={{ background: 'var(--border)' }} />
      <div className="mb-1.5 h-1.5 w-5/6 rounded-full" style={{ background: 'var(--border)' }} />
      <div className="h-5 rounded-lg" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }} />
    </div>
  )
}

function Onboarding() {
  const { lang, theme, t, setLang, setTheme, completeOnboarding } = useSettings()
  const [step, setStep] = useState<Step>('lang')
  const stepIdx = STEPS.indexOf(step)

  const go = (next: Step) => setStep(next)
  const back = () => {
    if (stepIdx > 0) setStep(STEPS[stepIdx - 1])
  }

  return (
    <div className="motion-pan-m animate-question-in relative mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 py-6">
      {/* back control */}
      {stepIdx > 0 && (
        <InteractiveHoverButton
          type="button"
          variant="ghost"
          size="sm"
          arrow={false}
          icon={<ArrowLeft className="size-3.5" />}
          text={t('app.back')}
          aria-label={t('app.back')}
          onClick={back}
          className="absolute top-6 left-0"
        />
      )}

      {/* step indicator */}
      <div className="mb-8 flex items-center justify-center gap-1.5">
        {STEPS.map((s, i) => (
          <span
            key={s}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === stepIdx ? 26 : 8,
              background: i <= stepIdx ? 'var(--accent)' : 'var(--border)',
            }}
          />
        ))}
      </div>

      <div key={step} className="animate-bubble-in flex flex-1 flex-col">
        {/* -------- LANG -------- */}
        {step === 'lang' && (
          <>
            <div className="mb-5 text-center">
              <h1 className="text-2xl font-extrabold tracking-[-0.01em] text-slate-900 md:text-[1.75rem]">
                {t('onb.lang.title')}
              </h1>
              <p className="mt-1.5 text-[13px] text-slate-500">{t('onb.lang.sub')}</p>
            </div>
            <div className="flex flex-col gap-3">
              {LANGS.map((l) => {
                const active = lang === l.code
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLang(l.code)
                      go('theme')
                    }}
                    className="flex w-full items-center gap-3.5 rounded-2xl border bg-[var(--surface-elevated)] p-4 text-left shadow-[0_10px_30px_-18px_rgba(30,41,59,0.4)] transition-all duration-200 hover:-translate-y-0.5"
                    style={{ borderColor: active ? 'var(--accent)' : 'var(--border)' }}
                  >
                    <span
                      className="grid size-12 shrink-0 place-items-center rounded-xl text-[15px] font-extrabold tracking-[0.08em] ring-1"
                      style={{ background: active ? 'var(--accent-soft)' : 'rgba(0,0,0,0.03)', color: active ? 'var(--accent)' : 'var(--text-secondary)' }}
                    >
                      {l.badge}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-[15px] font-bold tracking-[0.04em] text-slate-900">
                        {l.label}
                      </span>
                      <span className="block text-[12px] text-slate-500">{l.native}</span>
                    </span>
                    {active && (
                      <span
                        className="grid size-6 place-items-center rounded-full text-white"
                        style={{ background: 'var(--accent)', boxShadow: '0 2px 10px var(--accent-shadow)' }}
                      >
                        <Check className="size-3.5" strokeWidth={6.4} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* -------- THEME -------- */}
        {step === 'theme' && (
          <>
            <div className="mb-5 text-center">
              <h1 className="text-2xl font-extrabold tracking-[-0.01em] text-slate-900 md:text-[1.75rem]">
                {t('onb.theme.title')}
              </h1>
              <p className="mt-1.5 text-[13px] text-slate-500">{t('onb.theme.sub')}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['light', 'dark'] as const).map((opt) => {
                const active = theme === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTheme(opt)}
                    className="flex flex-col items-start gap-3 rounded-2xl border bg-[var(--surface-elevated)] p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5"
                    style={{ borderColor: active ? 'var(--accent)' : 'var(--border)', boxShadow: '0 10px 30px -18px rgba(30,41,59,0.4)' }}
                  >
                    <ThemePreview dark={opt === 'dark'} />
                    <span className="flex w-full items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
                        {opt === 'light' ? (
                          <Sun style={{ width: 15, height: 15 }} strokeWidth={4.8} />
                        ) : (
                          <Moon style={{ width: 15, height: 15 }} strokeWidth={4.8} />
                        )}
                        {t(opt === 'light' ? 'onb.theme.light' : 'onb.theme.dark')}
                      </span>
                      {active && (
                        <span
                          className="grid size-5 place-items-center rounded-full text-white"
                          style={{ background: 'var(--accent)' }}
                        >
                          <Check className="size-3" strokeWidth={6.4} />
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-auto pt-8">
              <InteractiveHoverButton
                type="button"
                variant="primary"
                size="lg"
                full
                text={t('onb.start')}
                onClick={completeOnboarding}
              />
              <p className="mt-2.5 text-center text-[11px] text-slate-400">{t('onb.hint')}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Onboarding