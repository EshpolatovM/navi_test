import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Moon, Sun } from 'lucide-react'
import { LANGS } from '../lib/i18n'
import { ACCENT_EXTENDED, ACCENT_PALETTE } from '../lib/theme'
import { useSettings } from './SettingsContext'

const STEPS = ['lang', 'theme', 'color'] as const
type Step = (typeof STEPS)[number]

function ThemePreview({ dark }: { dark: boolean }) {
  const vars = dark
    ? {
        '--surface': '#141820',
        '--surface-elevated': '#1b2130',
        '--text-primary': '#ececf2',
        '--text-secondary': '#a6adbc',
        '--border': 'rgba(255,255,255,0.09)',
      }
    : {
        '--surface': '#f4f3ef',
        '--surface-elevated': '#fdfdfa',
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
  const { lang, theme, accent, t, setLang, setTheme, setAccent, completeOnboarding } = useSettings()
  const [step, setStep] = useState<Step>('lang')
  const [pickedColor, setPickedColor] = useState<string | null>(accent)
  const [showMore, setShowMore] = useState(false)
  const stepIdx = STEPS.indexOf(step)

  const go = (next: Step) => setStep(next)
  const back = () => {
    if (stepIdx > 0) setStep(STEPS[stepIdx - 1])
  }

  return (
    <div className="motion-pan-m animate-question-in relative mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 py-6">
      {/* back control */}
      {stepIdx > 0 && (
        <button
          type="button"
          aria-label={t('app.back')}
          onClick={back}
          className="absolute top-6 left-0 inline-flex items-center gap-1 rounded-full bg-[var(--surface-elevated)] px-3 py-1.5 text-[12px] font-bold text-slate-600 shadow-[0_8px_20px_-10px_rgba(30,41,59,0.4)] ring-1 ring-slate-200/80 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="size-3.5" />
          {t('app.back')}
        </button>
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
                    className="flex w-full items-center gap-3.5 rounded-2xl bg-[var(--surface-elevated)] p-4 text-left shadow-[0_10px_30px_-18px_rgba(30,41,59,0.4)] ring-1 transition-all duration-200 hover:-translate-y-0.5"
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
                        <Check className="size-3.5" strokeWidth={3.2} />
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
                    onClick={() => {
                      setTheme(opt)
                      go('color')
                    }}
                    className="flex flex-col items-start gap-3 rounded-2xl bg-[var(--surface-elevated)] p-3.5 text-left ring-1 transition-all duration-200 hover:-translate-y-0.5"
                    style={{ borderColor: active ? 'var(--accent)' : 'var(--border)', boxShadow: '0 10px 30px -18px rgba(30,41,59,0.4)' }}
                  >
                    <ThemePreview dark={opt === 'dark'} />
                    <span className="flex w-full items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
                        {opt === 'light' ? (
                          <Sun style={{ width: 15, height: 15 }} strokeWidth={2.4} />
                        ) : (
                          <Moon style={{ width: 15, height: 15 }} strokeWidth={2.4} />
                        )}
                        {t(opt === 'light' ? 'onb.theme.light' : 'onb.theme.dark')}
                      </span>
                      {active && (
                        <span
                          className="grid size-5 place-items-center rounded-full text-white"
                          style={{ background: 'var(--accent)' }}
                        >
                          <Check className="size-3" strokeWidth={3.2} />
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* -------- COLOR -------- */}
        {step === 'color' && (
          <>
            <div className="mb-2 text-center">
              <h1 className="text-2xl font-extrabold tracking-[-0.01em] text-slate-900 md:text-[1.75rem]">
                {t('onb.color.title')}
              </h1>
              <p className="mt-1.5 text-[13px] text-slate-500">{t('onb.color.sub')}</p>
            </div>

            <div className="my-7 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  aria-hidden
                  className="grid size-16 place-items-center rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
                    boxShadow: '0 14px 32px -10px var(--accent-shadow)',
                  }}
                >
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
                  </svg>
                </span>
                <span className="text-[9px] font-bold tracking-[0.12em] text-slate-400 uppercase">QuizLab</span>
              </div>
            </div>

            <div
              className={`grid justify-items-center gap-3 ${showMore ? 'grid-cols-6' : 'grid-cols-6'}`}
            >
              {[...ACCENT_PALETTE, ...(showMore ? ACCENT_EXTENDED : [])].map((p) => {
                const active = pickedColor === p.hex || (pickedColor === null && accent === p.hex)
                return (
                  <button
                    key={p.hex}
                    type="button"
                    aria-label={`color-${p.name.toLowerCase()}`}
                    onClick={() => {
                      setAccent(p.hex)
                      setPickedColor(p.hex)
                    }}
                    className={`relative place-items-center rounded-full transition-transform duration-200 hover:scale-110 focus-visible:scale-105 active:scale-95 ${
                      showMore ? 'grid size-10' : 'grid size-12'
                    } ${showMore ? 'animate-fade-in' : ''}`}
                    style={{
                      background: p.hex,
                      boxShadow: active
                        ? `0 0 0 3px var(--surface-elevated), 0 0 0 6px ${p.hex}66`
                        : '0 6px 16px -6px rgba(0,0,0,0.35)',
                    }}
                  >
                    {active && <Check className={`text-white ${showMore ? 'size-4' : 'size-5'}`} strokeWidth={3.2} />}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold text-slate-500 ring-1 transition-colors hover:text-slate-800"
              style={{ borderColor: 'var(--border)' }}
            >
              {t('settings.more')}
              <ChevronDown
                className="size-3.5 transition-transform duration-200"
                style={{ transform: showMore ? 'rotate(180deg)' : 'none' }}
              />
            </button>

            <div className="mt-auto pt-8">
              <button
                type="button"
                onClick={completeOnboarding}
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-bold tracking-[0.06em] uppercase text-[var(--accent-contrast)] transition-all duration-200 ease-out select-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
                  boxShadow: '0 12px 28px -8px var(--accent-shadow)',
                }}
              >
                {t('onb.start')}
                <ArrowRight className="size-4" />
              </button>
              <p className="mt-2.5 text-center text-[11px] text-slate-400">{t('onb.hint')}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Onboarding