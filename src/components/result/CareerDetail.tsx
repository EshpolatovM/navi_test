import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Close, Magic } from '@icon-park/react'
import { motion } from 'framer-motion'
import { useSettings } from '../SettingsContext'
import QuizIcon from '../QuizIcon'
import { DIMS } from '../../data'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'
import { useDialogFocus } from '../../hooks/useDialogFocus'
import { ResultTag } from './ui/ResultCard'

interface CareerMatchData {
  id: string
  name: string
  description: string
  score: number
  color: string
  icon: string
  reasons: string[]
  skillKeys: string[]
  primaryDimKey: string
}

function CareerDetail({ career, onClose }: { career: CareerMatchData | null; onClose: () => void }) {
  const { t } = useSettings()
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useDialogFocus(!!career, dialogRef)

  useEffect(() => {
    if (!career) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [career, onClose])

  if (!career) return null

  const primaryIdx = DIMS.findIndex((d) => d.key === career.primaryDimKey)
  const primaryName = primaryIdx >= 0 ? t(`dim.${DIMS[primaryIdx].key}.name`) : career.name

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-black/15 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={career.name}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[var(--surface-elevated)] p-6 focus:outline-none md:p-8"
        style={{ border: '1px solid var(--border)' }}
      >
        <InteractiveHoverButton
          type="button"
          variant="ghost"
          size="icon"
          arrow={false}
          icon={<Close className="size-4" />}
          aria-label={t('settings.close')}
          onClick={onClose}
          className="absolute right-4 top-4"
        />

        <div className="flex items-start gap-4">
          <span
            className="grid size-14 shrink-0 place-items-center rounded-2xl"
            style={{ background: `${career.color}12`, color: career.color }}
          >
            <QuizIcon name={career.icon} size={26} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[20px] font-bold text-[var(--text-primary)]">{career.name}</h2>
            {career.score > 0 && (
              <span className="text-[13px] font-semibold tabular-nums text-[var(--text-secondary)]">
                {career.score}% {t('detail.match')}
              </span>
            )}
          </div>
        </div>

        <p className="mt-5 text-[13px] leading-relaxed text-[var(--text-secondary)]">{career.description}</p>

        {/* Thin progress line */}
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-[var(--surface-elevated-2)]">
          <div
            className="h-full rounded-full"
            style={{ width: `${career.score}%`, background: career.color }}
          />
        </div>

        {/* Reasons */}
        {career.reasons.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {t('career.why')}
            </h3>
            <ul className="flex flex-col gap-2">
              {career.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  <span
                    aria-hidden
                    className="mt-[6px] size-1.5 shrink-0 rounded-full"
                    style={{ background: career.color }}
                  />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {career.skillKeys.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {t('detail.skills')}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {career.skillKeys.map((sk) => (
                <ResultTag key={sk} color={career.color}>
                  {t(sk)}
                </ResultTag>
              ))}
            </div>
          </div>
        )}

        {/* How to start */}
        <div className="mt-6 flex items-start gap-2.5 rounded-xl p-3.5" style={{ background: 'var(--surface)' }}>
          <Magic className="mt-0.5 size-4 shrink-0 text-[var(--text-muted)]" />
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {t('detail.howStart')}
            </h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
              {t('detail.howStartBody', { dim: primaryName })}
            </p>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}

export default CareerDetail