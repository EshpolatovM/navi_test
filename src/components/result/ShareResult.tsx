import { useState } from 'react'
import { Check, Copy, Share } from '@icon-park/react'
import { useSettings } from '../SettingsContext'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'
import type { ResultData } from './useResultData'
import { resultShareSummary } from './shareSummary'

function ShareResult({ data }: { data: ResultData }) {
  const { t } = useSettings()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${resultShareSummary(data, t)}\n${window.location.href}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const handleTelegram = () => {
    const text = encodeURIComponent(resultShareSummary(data, t))
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`, '_blank')
  }

  return (
    <section id="share" className="animate-fade-in">
      <div className="mx-auto max-w-[560px] rounded-[2rem] bg-[var(--surface-elevated)] px-6 py-6 text-center ring-1 backdrop-blur">
        <Share className="mx-auto size-6 text-[var(--text-muted)]" strokeWidth={4} />
        <h2 className="mt-3 font-display text-[18px] font-bold text-[var(--text-primary)]">
          {t('share.title')}
        </h2>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--accent)]">{t('share.hashtag')}</span>
        </p>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <InteractiveHoverButton
            type="button"
            variant="ghost"
            size="md"
            arrow={false}
            text={t('share.telegram')}
            onClick={handleTelegram}
            style={{ '--accent': '#229ED9' } as React.CSSProperties}
          />
          <InteractiveHoverButton
            type="button"
            variant="ghost"
            size="md"
            arrow={false}
            icon={copied ? <Check className="size-4 text-emerald-500" /> : <Copy style={{ color: 'var(--accent)' }} className="size-4" />}
            text={copied ? t('share.copied') : t('share.copyLink')}
            onClick={handleCopy}
          />
        </div>
      </div>
    </section>
  )
}

export default ShareResult
