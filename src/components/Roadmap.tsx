import { Check, Compass } from 'lucide-react'
import { RESULT_STAGE, type StageBoundary, type StageDef } from '../data'
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

  const dotStyle = (s: Step): React.CSSProperties =>
    s.status === 'done'
      ? { background: 'var(--accent-dark)', boxShadow: '0 2px 6px var(--accent-soft)' }
      : s.status === 'active'
        ? {
            background: 'var(--accent)',
            boxShadow: '0 0 0 3.5px var(--accent-ring), 0 2px 8px var(--accent-soft)',
          }
        : { background: 'var(--accent-soft)', color: 'var(--text-muted)' }

  const labelStyle = (s: Step): React.CSSProperties =>
    s.status === 'active'
      ? { color: 'var(--accent)' }
      : s.status === 'done'
        ? { color: 'var(--text-secondary)' }
        : { color: 'var(--text-muted)' }

  return (
    <aside className="hidden w-[176px] shrink-0 xl:block" aria-label={t('road.aside')}>
      <div
        className="rounded-2xl bg-[var(--surface-soft)] p-3.5 backdrop-blur-md"
        style={{
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <p className="mb-2 px-1.5 font-display text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
          {t('road.title')}
        </p>

        <ol>
          {steps.map((s, i) => {
            const isLast = i === steps.length - 1
            const Icon = s.icon
            return (
              <li key={s.key} className="relative flex items-start gap-2.5 px-0.5 py-[5px]">
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute top-6 left-[7px] h-[calc(100%-9px)] w-px"
                    style={{
                      background: s.status === 'done' ? 'var(--accent-soft)' : 'var(--border)',
                    }}
                  />
                )}

                <span className="relative z-10 mt-0.5 grid size-[14px] shrink-0 place-items-center rounded-full text-white" style={dotStyle(s)}>
                  {s.status === 'done' ? (
                    <Check style={{ width: 11, height: 11 }} strokeWidth={3.5} />
                  ) : s.status === 'active' && s.key === 'BOSHLASH' ? (
                    <Compass style={{ width: 10, height: 10 }} strokeWidth={2.4} />
                  ) : (
                    <Icon style={{ width: 10, height: 10 }} strokeWidth={2.4} />
                  )}
                </span>

                <span className="min-w-0">
                  <span className="flex items-center gap-1 font-display text-[11px] font-bold uppercase tracking-[0.13em]" style={labelStyle(s)}>
                    {t(`stage.${s.key}`)}
                  </span>
                  <span className="block text-[10px] font-medium tabular-nums text-slate-400">
                    {s.meta}
                  </span>
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </aside>
  )
}

export default Roadmap