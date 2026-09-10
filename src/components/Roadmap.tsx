import { Check, Compass } from 'lucide-react'
import { RESULT_STAGE, type StageBoundary, type StageDef } from '../data'
import { stageVar } from '../lib/theme'
import { useSettings } from './SettingsContext'

type Status = 'done' | 'active' | 'upcoming'

interface Step extends StageDef {
  status: Status
  meta?: string
}

function Roadmap({
  index,
  total,
  boundaries,
}: {
  index: number
  total: number
  boundaries: StageBoundary[]
}) {
  const { t } = useSettings()
  const stageIndex =
    boundaries.findIndex((b) => index + 1 >= b.from && index + 1 <= b.to) < 0
      ? boundaries.length - 1
      : boundaries.findIndex((b) => index + 1 >= b.from && index + 1 <= b.to)
  const activeBoundary = boundaries[stageIndex]
  const local = index + 1 - activeBoundary.from + 1
  const stageTotal = activeBoundary.to - activeBoundary.from + 1

  const startStep: StageDef = {
    ...activeBoundary.def,
    key: 'BOSHLASH',
    label: 'Boshlash',
  }

  const steps: Step[] = [
    {
      ...startStep,
      status: index === 0 ? 'active' : 'done',
      meta: t('road.total', { n: total }),
    },
    ...boundaries.map((b, si) => {
      const range = `${String(b.from).padStart(2, '0')}\u2013${b.to} / ${total}`
      const status: Status = si < stageIndex ? 'done' : si === stageIndex ? 'active' : 'upcoming'
      return {
        ...b.def,
        status,
        meta:
          status === 'active'
            ? `${range} \u00b7 ${t('road.savol', { a: local, s: stageTotal })}`
            : range,
      }
    }),
    {
      ...RESULT_STAGE,
      status: 'upcoming' as Status,
      meta: t('road.signal'),
    },
  ]

  const activeStep = steps.find((s) => s.status === 'active') ?? steps[0]

  const dotStyle = (s: Step): React.CSSProperties => {
    const sv = stageVar(s.key)
    if (s.status === 'done')
      return {
        background: sv,
        boxShadow: `0 2px 8px color-mix(in srgb, ${sv} 45%, transparent)`,
      }
    if (s.status === 'active')
      return {
        background: `linear-gradient(135deg, ${sv}, color-mix(in srgb, ${sv} 42%, var(--accent)))`,
        boxShadow: '0 0 0 3.5px var(--accent-ring), 0 4px 14px var(--accent-glow)',
      }
    return { background: `color-mix(in srgb, ${sv} 20%, transparent)`, color: 'var(--text-muted)' }
  }

  const labelStyle = (s: Step): React.CSSProperties =>
    s.status === 'active'
      ? { color: 'var(--accent)' }
      : s.status === 'done'
        ? { color: 'var(--text-secondary)' }
        : { color: 'var(--text-muted)' }

  return (
    <>
      {/* Compact horizontal bar — visible below xl */}
      <div className="w-full xl:hidden" aria-label={t('road.aside')}>
        <div
          className="flex items-center gap-3 rounded-2xl bg-[var(--surface-soft)] px-4 py-3 backdrop-blur-md"
          style={{ border: '1px solid var(--border)' }}
        >
          <span className="relative z-10 grid size-[18px] shrink-0 place-items-center rounded-full text-white" style={dotStyle(activeStep)}>
            {activeStep.status === 'done' ? (
              <Check style={{ width: 12, height: 12 }} strokeWidth={3.5} />
            ) : activeStep.key === 'BOSHLASH' ? (
              <Compass style={{ width: 12, height: 12 }} strokeWidth={2.4} />
            ) : (
              <activeStep.icon style={{ width: 12, height: 12 }} strokeWidth={2.4} />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <span className="block truncate text-[11px] font-bold uppercase tracking-[0.12em]" style={labelStyle(activeStep)}>
              {t(`stage.${activeStep.key}`)}
            </span>
            <span className="block text-[10px] font-medium tabular-nums text-[var(--text-muted)]">
              {activeStep.meta}
            </span>
          </div>
          <div className="flex items-center gap-[3px]">
            {steps.map((s) => (
              <span
                key={s.key}
                aria-hidden
                className="h-1.5 w-3 rounded-full sm:w-4"
                style={dotStyle(s)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Full sidebar — visible on xl+ */}
      <aside className="motion-edge float-road hidden w-[176px] shrink-0 xl:block" aria-label={t('road.aside')}>
        <div
          className="rounded-2xl bg-[var(--surface-soft)] p-3.5 backdrop-blur-md"
          style={{
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <p className="mb-2 px-1.5 font-display text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
            {t('road.title')}
          </p>

          <ol>
            {steps.map((s, i) => {
              const isLast = i === steps.length - 1
              const Icon = s.icon
              return (
                <li key={s.key} className="relative flex items-start gap-3 px-0.5 py-1.5">
                  {!isLast && (
                    <span
                      aria-hidden
                      className="absolute top-6 left-[7px] h-[calc(100%-10px)] w-px"
                      style={{
                        background: s.status === 'done' ? `color-mix(in srgb, ${stageVar(s.key)} 35%, transparent)` : 'var(--border)',
                      }}
                    />
                  )}

                  <span className="relative z-10 mt-0.5 grid size-[15px] shrink-0 place-items-center rounded-full text-white" style={dotStyle(s)}>
                    {s.status === 'done' ? (
                      <Check style={{ width: 11, height: 11 }} strokeWidth={3.5} />
                    ) : s.status === 'active' && s.key === 'BOSHLASH' ? (
                      <Compass style={{ width: 11, height: 11 }} strokeWidth={2.4} />
                    ) : (
                      <Icon style={{ width: 11, height: 11 }} strokeWidth={2.4} />
                    )}
                  </span>

                  <span className="min-w-0">
                    <span className="flex items-center gap-1 font-display text-[12.5px] font-bold uppercase tracking-[0.11em]" style={labelStyle(s)}>
                      {t(`stage.${s.key}`)}
                    </span>
                    <span className="block text-[11px] font-medium tabular-nums text-slate-500">
                      {s.meta}
                    </span>
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </aside>
    </>
  )
}

export default Roadmap
