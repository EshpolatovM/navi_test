import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Check, Close, Copy, Link, Magic, Message, Send, Share } from '@icon-park/react'
import { useSettings } from '../SettingsContext'
import { useRoadmap } from './RoadmapContext'
import { translate, type Lang } from '../../lib/i18n'
import { buildSharePreview } from '../../lib/shareImage'
import { copyShare, dataUrlToFile, nativeShare, openInTab, shareConfig, telegramUrl, whatsappUrl } from '../../lib/share'
import type { ResultData } from './useResultData'
import { resultShareSummary } from './shareSummary'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'
import { useDialogFocus } from '../../hooks/useDialogFocus'

function ShareModal({ open, onClose, data }: { open: boolean; onClose: () => void; data: ResultData }) {
  const { lang } = useSettings()
  const { generate, busy, matches, roadmap } = useRoadmap()
  const navigate = useNavigate()
  const [preview, setPreview] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useDialogFocus(open, panelRef)

  const t = useMemo(
    () => (key: string, vars?: Record<string, string | number>) => translate(lang as Lang, key, vars),
    [lang],
  )

  useEffect(() => {
    if (!open) return
    let cancelled = false
    buildSharePreview(data, lang, t)
      .then((url) => {
        if (!cancelled) setPreview(url)
      })
      .catch(() => { /* preview is decorative */ })
    return () => {
      cancelled = true
    }
  }, [open, data, lang, t])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const payload = {
    title: t('result.share.nativeTitle'),
    text: resultShareSummary(data, t),
    url: shareConfig.resultUrl,
  }

  const canOpenRoadmap = matches(data) && !!roadmap

  const runCreate = async () => {
    setError(false)
    try {
      await generate(data)
      onClose()
      navigate('/result/roadmap')
    } catch {
      setError(true)
    }
  }

  const doCopy = async () => {
    const ok = await copyShare(payload)
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    }
  }

  const doSystem = async () => {
    const files = preview ? [dataUrlToFile(preview, 'quizlab-result.png')] : undefined
    await nativeShare(payload, files)
  }

  const nativeShareAvailable = typeof navigator !== 'undefined' && 'share' in navigator

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label={t('result.share.close')}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t('result.tools.share')}
        className="animate-slide-up relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-[var(--surface)] ring-1 ring-[var(--border)] shadow-2xl focus:outline-none sm:max-w-md sm:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="font-display text-[18px] font-bold text-[var(--text-primary)]">{t('result.tools.share')}</h2>
          <InteractiveHoverButton
            type="button"
            size="icon"
            variant="ghost"
            arrow={false}
            icon={<Close className="size-4.5" strokeWidth={4.4} />}
            aria-label={t('result.share.close')}
            onClick={onClose}
          />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 pt-4 pb-6">
          {/* Preview image */}
          {preview && (
            <div>
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {t('result.share.previewLabel')}
              </span>
              <img
                src={preview}
                alt={t('result.share.previewLabel')}
                className="aspect-[1200/630] w-full rounded-2xl object-cover ring-1 ring-[var(--border)]"
              />
            </div>
          )}

          {/* AI career roadmap CTA */}
          <div className="rounded-2xl bg-[var(--surface-elevated)] p-4 ring-1 ring-[var(--border)]">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]" style={{ background: 'var(--accent-soft)' }}>
              <Magic className="size-3.5" />
              AI CAREER ROADMAP
            </span>
            <h3 className="mt-3 text-[15px] leading-snug font-bold text-[var(--text-primary)]">{t('roadmap.shareCta')}</h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">{t('roadmap.shareDesc')}</p>

            {error && (
              <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[12px] font-semibold text-red-700 ring-1 ring-red-200">
                {t('roadmap.error')}
              </p>
            )}

            {busy ? (
              <div className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-[12px] font-bold text-[var(--accent-contrast)] opacity-80">
                <span aria-hidden className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                {t('roadmap.createBusy')}
              </div>
            ) : canOpenRoadmap ? (
              <InteractiveHoverButton
                type="button"
                variant="primary"
                size="md"
                full
                text={t('roadmap.open')}
                onClick={() => {
                  onClose()
                  navigate('/result/roadmap')
                }}
                className="mt-3"
              />
            ) : (
              <InteractiveHoverButton
                type="button"
                variant="primary"
                size="md"
                full
                text={t('roadmap.create')}
                onClick={() => void runCreate()}
                className="mt-3"
              />
            )}
            {error && (
              <InteractiveHoverButton
                type="button"
                variant="ghost"
                size="md"
                full
                arrow={false}
                text={t('roadmap.retry')}
                onClick={() => void runCreate()}
                className="mt-2"
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              {t('result.share.system')}
            </span>
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>

          {/* Plain share targets */}
          <div className="grid grid-cols-2 gap-3">
            <InteractiveHoverButton
              type="button"
              variant="ghost"
              size="md"
              full
              arrow={false}
              icon={<Send style={{ color: 'var(--accent)' }} className="size-4" />}
              text="Telegram"
              onClick={() => openInTab(telegramUrl(payload))}
              style={{ '--accent': '#0EA5E9' } as React.CSSProperties}
            />
            <InteractiveHoverButton
              type="button"
              variant="ghost"
              size="md"
              full
              arrow={false}
              icon={<Message style={{ color: 'var(--accent)' }} className="size-4" />}
              text="WhatsApp"
              onClick={() => openInTab(whatsappUrl(payload))}
              style={{ '--accent': '#10B981' } as React.CSSProperties}
            />
            <InteractiveHoverButton
              type="button"
              variant="ghost"
              size="md"
              full
              arrow={false}
              icon={copied ? <Check className="size-4 text-emerald-500" /> : <Copy style={{ color: 'var(--accent)' }} className="size-4" />}
              text={copied ? t('result.share.copied') : t('result.share.copy')}
              onClick={() => void doCopy()}
              style={{ '--accent': '#475569' } as React.CSSProperties}
            />
            <InteractiveHoverButton
              type="button"
              variant="ghost"
              size="md"
              full
              arrow={false}
              icon={<Share style={{ color: 'var(--accent)' }} className="size-4" />}
              text={t('result.share.system')}
              onClick={() => void doSystem()}
            />

            {!nativeShareAvailable && (
              <InteractiveHoverButton
                type="button"
                variant="ghost"
                size="md"
                full
                arrow={false}
                icon={<Link style={{ color: 'var(--accent)' }} className="size-4" />}
                text={shareConfig.resultUrl.replace(/^https?:\/\//, '')}
                onClick={() => openInTab(payload.url)}
                style={{ '--accent': '#64748B' } as React.CSSProperties}
              />
            )}
          </div>

          <p className="text-center text-[11px] leading-relaxed text-[var(--text-muted)]">{t('result.share.hint')}</p>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ShareModal