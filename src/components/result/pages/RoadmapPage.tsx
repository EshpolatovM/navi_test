import { useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Check, Copy, FileDown, MessageCircle, RefreshCw, Send, Sparkles } from 'lucide-react'
import { useSettings } from '../../SettingsContext'
import { useResultStore } from '../resultStore'
import { useRoadmap } from '../RoadmapContext'
import { buildRoadmapPdf, ROADMAP_PDF_FILENAME } from '../../../lib/pdf'
import { copyShare, openInTab, shareConfig, telegramUrl, whatsappUrl } from '../../../lib/share'
import { InteractiveHoverButton } from '../../ui/interactive-hover-button'
import { ResultCard } from '../ui/ResultCard'

const PHASE_KEYS = ['roadmap.step.start', 'roadmap.step.project', 'roadmap.step.skills', 'roadmap.step.portfolio', 'roadmap.step.next']

function formatDate(ts: number, lang: string): string {
  return new Date(ts).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Inline segments: `**bold**` and `*italic*` within a line, rest plain. */
function renderRich(line: string, keyPrefix: string): ReactNode {
  const parts = line.split(/(\*\*[^*]+\*\*)/g)
  const nodes = parts
    .filter((p) => p.length > 0)
    .map((p, i) =>
      p.startsWith('**') && p.endsWith('**') ? (
        <strong key={`${keyPrefix}-${i}`} className="font-bold text-[var(--text-primary)]">
          {p.slice(2, -2)}
        </strong>
      ) : (
        <span key={`${keyPrefix}-${i}`}>{p}</span>
      ),
    )
  return <>{nodes}</>
}

function RoadmapPage() {
  const { t, lang } = useSettings()
  const { data } = useResultStore()
  const { roadmap, busy, generate, matches } = useRoadmap()
  const [pdfBusy, setPdfBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(false)
  const [confirming, setConfirming] = useState(false)

  if (!data) return <Navigate to="/result" replace />

  const doCopy = async () => {
    const ok = await copyShare({ title: t('result.share.nativeTitle'), text: t('roadmap.share.text'), url: shareConfig.resultUrl })
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    }
  }

  const downloadPdf = async () => {
    if (!roadmap || pdfBusy) return
    setPdfBusy(true)
    try {
      const doc = await buildRoadmapPdf(roadmap.blocks, roadmap.steps, lang, t)
      doc.save(ROADMAP_PDF_FILENAME)
    } finally {
      setPdfBusy(false)
    }
  }

  const regenerate = async () => {
    setError(false)
    setConfirming(false)
    try {
      await generate(data)
    } catch {
      setError(true)
    }
  }

  const stale = roadmap !== null && !matches(data)

  return (
    <div className="flex flex-col gap-7">
      {/* Hero */}
      <ResultCard delay={0} className="px-6 py-7 text-center!">
        <span className="absolute inset-x-0 top-0 h-[3px] rounded-b-full" style={{ background: 'var(--accent)', opacity: 0.55 }} />
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]" style={{ background: 'var(--accent-soft)' }}>
          <Sparkles className="size-3.5" />
          {t('roadmap.heroKicker')}
        </span>
        <h2 className="mt-4 font-display text-[24px] leading-tight font-bold text-[var(--text-primary)] md:text-[28px]">
          {t('roadmap.title')}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[var(--text-secondary)]">
          {t('roadmap.heroSub')}
        </p>
        <p className="mx-auto mt-3 max-w-md text-[12px] leading-relaxed text-[var(--text-muted)]">{t('roadmap.shareDesc')}</p>
      </ResultCard>

      {/* Outdated result banner */}
      {stale && (
        <div className="animate-slide-up rounded-2xl bg-amber-50 px-4 py-3 text-[12.5px] font-semibold text-amber-800 ring-1 ring-amber-200">
          {t('roadmap.emptyTitle')} — {t('roadmap.regenerate')}
        </div>
      )}

      {/* Empty / ready states */}
      {roadmap === null && (
        <ResultCard delay={0} className="flex-col items-center px-6 py-12 text-center!">
          <span className="grid size-14 place-items-center rounded-2xl text-white" style={{ background: 'var(--accent)', boxShadow: '0 14px 28px -14px rgba(15,18,25,0.35)' }}>
            <Sparkles className="size-6" />
          </span>
          <h3 className="mt-4 text-[16px] font-bold text-[var(--text-primary)]">{t('roadmap.emptyTitle')}</h3>
          <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-[var(--text-secondary)]">{t('roadmap.emptyDesc')}</p>
          {error && (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[12px] font-semibold text-red-700 ring-1 ring-red-200">
              {t('roadmap.error')}
            </p>
          )}
          {busy ? (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-[12px] font-bold text-[var(--accent-contrast)] opacity-80">
              <span aria-hidden className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              {t('roadmap.createBusy')}
            </div>
          ) : (
            <InteractiveHoverButton
              type="button"
              variant="primary"
              size="md"
              text={t('roadmap.create')}
              onClick={() => void regenerate()}
              className="mt-5"
            />
          )}
        </ResultCard>
      )}

      {roadmap && (
        <>
          {/* Tools row */}
          <div className="animate-slide-up flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t('roadmap.createdOn')} {formatDate(roadmap.createdAt, lang)}
            </span>
            <div className="flex items-center gap-2">
              <InteractiveHoverButton
                type="button"
                variant="ghost"
                size="sm"
                arrow={false}
                disabled={pdfBusy}
                aria-label={t('result.tools.pdf')}
                text={pdfBusy ? t('result.tools.pdfBusy') : t('result.tools.pdf')}
                icon={
                  pdfBusy ? (
                    <span aria-hidden className="size-3.5 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-[var(--text-secondary)]" />
                  ) : (
                    <FileDown className="size-4" />
                  )
                }
                onClick={() => void downloadPdf()}
              />
              <InteractiveHoverButton
                type="button"
                variant="ghost"
                size="sm"
                arrow={false}
                icon={<RefreshCw className="size-4" />}
                text={t('roadmap.regenerate')}
                onClick={() => setConfirming((v) => !v)}
              />
              <InteractiveHoverButton
                type="button"
                variant="ghost"
                size="icon"
                arrow={false}
                icon={<Send className="size-4" />}
                aria-label="Telegram"
                onClick={() => openInTab(telegramUrl({ title: t('result.share.nativeTitle'), text: t('roadmap.share.text'), url: shareConfig.resultUrl }))}
                style={{ '--accent': '#0EA5E9' } as React.CSSProperties}
              />
              <InteractiveHoverButton
                type="button"
                variant="ghost"
                size="icon"
                arrow={false}
                icon={<MessageCircle className="size-4" />}
                aria-label="WhatsApp"
                onClick={() => openInTab(whatsappUrl({ title: t('result.share.nativeTitle'), text: t('roadmap.share.text'), url: shareConfig.resultUrl }))}
                style={{ '--accent': '#10B981' } as React.CSSProperties}
              />
              <InteractiveHoverButton
                type="button"
                variant="ghost"
                size="icon"
                arrow={false}
                aria-label={t('result.share.copy')}
                icon={copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                onClick={() => void doCopy()}
              />
            </div>
          </div>

          {confirming && (
            <div className="animate-slide-up flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
              <span className="text-[12.5px] font-semibold text-amber-800">{t('roadmap.confirm')}</span>
              <div className="flex items-center gap-2">
                <InteractiveHoverButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  arrow={false}
                  text={t('roadmap.cancel')}
                  onClick={() => setConfirming(false)}
                  className="border-amber-200! bg-white!"
                  style={{ '--accent': '#D97706' } as React.CSSProperties}
                />
                <InteractiveHoverButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  arrow={false}
                  text={t('roadmap.retry')}
                  disabled={busy}
                  onClick={() => void regenerate()}
                  className="border-amber-600! bg-amber-600! text-white!"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="animate-slide-up flex items-center justify-between gap-3 rounded-2xl bg-red-50 px-4 py-3 ring-1 ring-red-200">
              <span className="text-[12.5px] font-semibold text-red-700">{t('roadmap.error')}</span>
              <InteractiveHoverButton
                type="button"
                variant="destructive"
                size="sm"
                arrow={false}
                text={t('roadmap.retry')}
                disabled={busy}
                onClick={() => void regenerate()}
              />
            </div>
          )}

          {/* Timeline */}
          <section className="motion-d2 animate-slide-up">
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              {t('roadmap.timeline')}
            </h2>
            <div className="relative">
              <span aria-hidden className="absolute top-2 bottom-2 left-[19px] w-0.5 rounded bg-[var(--accent)] opacity-25" />
              <ol className="space-y-4">
                {roadmap.steps.map((step, i) => (
                  <li key={`${step.title}-${i}`} className="relative flex gap-4 pl-0">
                    <span
                      className="grid size-10 shrink-0 place-items-center rounded-full text-[12px] font-bold text-white"
                      style={{ background: 'var(--accent)', boxShadow: '0 10px 20px -10px rgba(15,18,25,0.3)' }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1 rounded-2xl bg-[var(--surface-elevated)] p-4 ring-1 ring-[var(--border)]">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                        {t(PHASE_KEYS[i] ?? PHASE_KEYS[PHASE_KEYS.length - 1])}
                      </span>
                      <h3 className="mt-1 text-[15px] font-bold text-[var(--text-primary)]">{step.title}</h3>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">{renderRich(step.text, `step-${i}`)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* AI sections */}
          {roadmap.blocks.map((block, bi) => (
            <section key={`${block.heading}-${bi}`} className="motion-d3 animate-slide-up">
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {String(bi + 1).padStart(2, '0')} · <span className="text-[var(--accent)]">{block.heading}</span>
              </h2>
              <div className="space-y-3">
                {block.lines.map((line, li) =>
                  line.startsWith('- ') ? (
                    <div key={`${bi}-${li}`} className="flex gap-2.5 rounded-2xl bg-[var(--surface-elevated)] p-4 ring-1 ring-[var(--border)]">
                      <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full" style={{ background: 'var(--accent)' }} />
                      <p className="text-[12.5px] leading-relaxed text-[var(--text-secondary)]">{renderRich(line.slice(2), `b-${bi}-${li}`)}</p>
                    </div>
                  ) : (
                    <p key={`${bi}-${li}`} className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
                      {renderRich(line, `b-${bi}-${li}`)}
                    </p>
                  ),
                )}
              </div>
            </section>
          ))}

          {/* Disclaimer */}
          <p className="text-center text-[11px] leading-relaxed text-[var(--text-muted)]">{t('roadmap.note')}</p>
        </>
      )}
    </div>
  )
}

export default RoadmapPage