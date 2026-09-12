import { useState } from 'react'
import { Download, Share } from '@icon-park/react'
import { useSettings } from '../SettingsContext'
import { useResultStore } from './resultStore'
import { buildResultPdf, RESULT_PDF_FILENAME } from '../../lib/pdf'
import ShareModal from './ShareModal'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'

/**
 * Header actions shown on every result page: download the full result PDF and
 * open the share sheet (which also offers the AI career roadmap CTA).
 * Buttons are disabled only while a PDF is being generated — the app's own
 * analysed/loading screen is never reused here.
 */
function ResultHeaderActions() {
  const { t, lang } = useSettings()
  const { data } = useResultStore()
  const [pdfBusy, setPdfBusy] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  if (!data) return null

  const downloadPdf = async () => {
    if (pdfBusy) return
    setPdfBusy(true)
    try {
      const doc = await buildResultPdf(data, lang, t)
      doc.save(RESULT_PDF_FILENAME)
    } finally {
      setPdfBusy(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <InteractiveHoverButton
          type="button"
          size="icon"
          variant="ghost"
          arrow={false}
          disabled={pdfBusy}
          aria-label={pdfBusy ? t('result.tools.pdfBusy') : t('result.tools.pdf')}
          onClick={() => void downloadPdf()}
          icon={
            pdfBusy ? (
              <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-[var(--text-secondary)]" />
            ) : (
              <Download className="size-4.5" strokeWidth={4.4} />
            )
          }
        />
        <InteractiveHoverButton
          type="button"
          size="icon"
          variant="primary"
          arrow={false}
          icon={<Share className="size-4.5" strokeWidth={4.4} />}
          aria-label={t('result.tools.share')}
          onClick={() => setShareOpen(true)}
        />
      </div>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} data={data} />
    </>
  )
}

export default ResultHeaderActions