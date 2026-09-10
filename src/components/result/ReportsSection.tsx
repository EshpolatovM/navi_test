import { FileText, ChevronRight } from 'lucide-react'
import { useSettings } from '../SettingsContext'
import { ResultCard } from './ui/ResultCard'
import type { ReportItem } from './useResultData'

const BADGE_COLORS: Record<string, string> = {
  'report.interest': '#6366F1',
  'report.match': '#10B981',
  'report.strength': '#F59E0B',
  'report.direction': '#EA580C',
}

function ReportsSection({ reports, onReportClick }: { reports: ReportItem[]; onReportClick: (r: ReportItem, i: number) => void }) {
  const { t } = useSettings()
  return (
    <section id="reports" className="animate-fade-in">
      <h2 className="mb-4 text-center font-display text-[18px] font-bold text-[var(--text-primary)]">
        {t('report.title')}
      </h2>
      <ResultCard variant="standard" delay={200} className="mx-auto max-w-[640px]">
        <div className="flex flex-col [&>:last-child]:border-b-0">
          {reports.map((r, i) => {
            const color = BADGE_COLORS[r.categoryKey] ?? 'var(--accent)'
            return (
              <button
                key={i}
                type="button"
                onClick={() => onReportClick(r, i)}
                className="group flex items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-[var(--surface-elevated-2)]"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-[0.7rem]"
                  style={{ background: `color-mix(in srgb, ${color} 10%, transparent)`, color }}
                >
                  <FileText className="size-4.5" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-bold text-[var(--text-primary)]">
                    {t(r.titleKey)}
                  </span>
                  <span className="block truncate text-[11.5px] text-[var(--text-muted)]">
                    {t(r.descriptionKey)}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            )
          })}
        </div>
      </ResultCard>
    </section>
  )
}

export default ReportsSection