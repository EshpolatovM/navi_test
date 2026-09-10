import { Compass, PenTool, Search, FlaskConical, Zap } from 'lucide-react'
import { useSettings } from '../SettingsContext'
import { ResultCard } from './ui/ResultCard'
import { RankNum } from './ui/Score'
import type { AdviceItem } from './useResultData'

const ICON_MAP: Record<string, React.ReactNode> = {
  compass: <Compass className="size-4.5" strokeWidth={2.2} />,
  pen_tool: <PenTool className="size-4.5" strokeWidth={2.2} />,
  search: <Search className="size-4.5" strokeWidth={2.2} />,
  flask: <FlaskConical className="size-4.5" strokeWidth={2.2} />,
  zap: <Zap className="size-4.5" strokeWidth={2.2} />,
}

function AdviceSection({ advice }: { advice: AdviceItem[] }) {
  const { t } = useSettings()

  return (
    <section className="animate-fade-in">
      {/* Editorial numbered list — reads as a deliberate plan, not another box grid */}
      <ResultCard variant="standard" delay={0} className="mx-auto max-w-[640px]">
        <div className="flex flex-col">
          {advice.map((item, i) => {
            const last = i === advice.length - 1
            return (
              <div
                key={item.titleKey}
                className="group flex items-start gap-3 px-5 py-4 transition-colors duration-200 hover:bg-[var(--surface-elevated-2)]"
                style={!last ? { borderBottom: '1px solid var(--border)' } : undefined}
              >
                <span
                  className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[0.7rem] text-[var(--accent)]"
                  style={{ background: 'var(--accent-soft)' }}
                >
                  {ICON_MAP[item.icon] ?? <Zap className="size-4.5" strokeWidth={2.2} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <RankNum n={i + 1} />
                    <h3 className="text-[13.5px] font-bold text-[var(--text-primary)]">{t(item.titleKey)}</h3>
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
                    {t(item.bodyKey, item.vars)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </ResultCard>
    </section>
  )
}

export default AdviceSection