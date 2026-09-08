import { useEffect, useState } from 'react'
import { FlaskConical, Hammer, HeartHandshake, ListChecks, Palette, Rocket } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DIMS, INTEREST_LEVELS, type InterestItem } from '../data'
import { rgba, toneFor } from '../lib/tone'
import InterestProgress from './InterestProgress'

const DIM_ICONS: LucideIcon[] = [Hammer, FlaskConical, Palette, HeartHandshake, Rocket, ListChecks]

function LevelTile({
  label,
  index,
  hovered,
  selected,
  onHover,
  onSelect,
}: {
  label: string
  index: number
  hovered: number | null
  selected: number | null
  onHover: (i: number | null) => void
  onSelect: (i: number) => void
}) {
  const isHover = hovered === index
  const isPicked = selected === index
  const dimmed =
    (selected !== null && !isPicked) || (hovered !== null && !isHover && selected === null)

  const gx = 12 + (index % 3) * 8
  const gy = 7 + (index % 3) * 4
  const tx = (index % 2 === 0 ? -1 : 1) * (6 + (index % 3) * 5)
  const tr = (index % 2 === 0 ? -1 : 1) * (4 + (index % 3) * 2.5)

  return (
    <div className="w-full">
      <div
        className="scene-in w-full"
        style={{
          '--tx': `${tx}px`,
          '--ty': '26px',
          '--tr': `${tr}deg`,
          animationDelay: `${60 + index * 40}ms`,
        } as React.CSSProperties}
      >
        <div
          className="w-full"
          style={{ transform: `translate3d(calc(var(--gy-x) * ${gx}px), calc(var(--gy-y) * ${gy}px), 0)` }}
        >
          <button
            type="button"
            aria-label={label}
            onMouseEnter={() => onHover(index)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(index)}
            disabled={selected !== null}
            tabIndex={selected === null ? 0 : -1}
            className="w-full select-none outline-none focus-visible:opacity-100"
            style={{
              opacity: dimmed ? 0.45 : 1,
              transform: isHover ? 'translateY(-2px) scale(1.02)' : isPicked ? 'translateY(0) scale(1.03)' : undefined,
              transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, opacity 0.34s ease',
            }}
          >
            <span
              className="flex min-h-[54px] w-full cursor-pointer items-center gap-3 border px-3.5 py-2 text-left"
              style={{
                background: isPicked ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.94)',
                color: isPicked ? '#1e293b' : '#292524',
                borderColor: isPicked ? '#94a3b8' : 'rgba(15,23,42,0.08)',
                borderRadius: `1.2rem ${1.05 + (index % 3) * 0.18}rem 1.25rem ${1.1 + (index % 2) * 0.25}rem`,
                boxShadow: isPicked
                  ? '0 16px 40px -14px rgba(15,23,42,0.5), inset 0 0 0 2px rgba(15,23,42,0.55)'
                  : isHover
                    ? '0 12px 30px -14px rgba(15,23,42,0.4), 0 0 0 3px rgba(15,23,42,0.12)'
                    : '0 10px 26px -14px rgba(28,25,23,0.28)',
                transition: 'transform 0.34s cubic-bezier(0.22,1,0.36,1), box-shadow 0.34s ease, background 0.3s ease',
              }}
            >
              <span className="relative shrink-0">
                <span
                  aria-hidden
                  className="grid size-9 place-items-center rounded-full font-display text-[11px] font-bold"
                  style={{
                    background: isPicked ? '#e2e8f0' : '#f1f5f9',
                    color: isPicked ? '#1e293b' : '#64748b',
                    boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.06)',
                  }}
                >
                  {String(index + 1)}
                </span>
              </span>
              <span className="flex-1 text-[13px] leading-snug font-semibold">{label}</span>
              <span
                aria-hidden
                className={`size-4.5 shrink-0 rounded-full transition-all duration-300 ${isPicked ? '' : 'ring-1 ring-slate-200'}`}
                style={{
                  background: isPicked ? '#1e293b' : 'transparent',
                  boxShadow: isPicked ? '0 0 0 3px rgba(30,41,59,0.15)' : undefined,
                }}
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

function InterestScene({
  item,
  index,
  total,
  onAnswer,
}: {
  item: InterestItem
  index: number
  total: number
  onAnswer: (optionIndex: number) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [phase, setPhase] = useState<'in' | 'out'>('in')

  useEffect(() => {
    if (selected === null) return
    const c1 = window.setTimeout(() => setPhase('out'), 330)
    const c2 = window.setTimeout(() => onAnswer(selected), 560)
    return () => {
      window.clearTimeout(c1)
      window.clearTimeout(c2)
    }
  }, [selected, onAnswer])

  const accent = DIMS[item.dim]?.color ?? '#8B5CF6'
  const t = toneFor(accent, 0.55)
  const DimIcon = DIM_ICONS[item.dim]

  const bubbleScale = hovered !== null ? 1.025 : selected !== null ? 1.05 : 1

  const bubbleEl = (
    <div className="relative z-10 w-full">
      <div
        className="relative rounded-[2rem] px-6 py-6 text-center ring-1 backdrop-blur md:px-9 md:py-7 max-md:px-5 max-md:py-3.5"
        style={{
          width: '100%',
          background:
            'radial-gradient(120% 120% at 20% 0%, #ffffff 0%, rgba(255,255,255,0.82) 55%, rgba(255,255,255,0.55) 100%)',
          borderColor: t.ring,
          boxShadow: `0 26px 60px -22px rgba(28,25,23,0.3), 0 0 0 1px rgba(255,255,255,0.8) inset`,
          transform: `scale(${bubbleScale})`,
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <span
          aria-hidden
          className="absolute left-5 top-4 font-display text-[10px] font-semibold uppercase tracking-[0.28em]"
          style={{ color: t.deep }}
        >
          Qiziqish
        </span>
        <span
          aria-hidden
          className="absolute right-5 top-4 mark-float"
          style={{ color: t.deep }}
        >
          <DimIcon style={{ width: 15, height: 15 }} strokeWidth={2.2} />
        </span>

        <div className="flex items-center justify-center gap-1 pt-5 max-md:pt-4">
          {DIMS.map((d, i) => (
            <span
              key={d.key}
              title={d.name}
              className="grid size-4.5 place-items-center rounded-full text-white"
              style={{
                background: d.color,
                opacity: i === item.dim ? 1 : 0.25,
                boxShadow: i === item.dim ? `0 0 0 3px ${rgba(d.color, 0.22)}` : undefined,
                transition: 'opacity 0.3s ease',
              }}
            >
              <span className="text-[7.5px] font-bold">{d.key}</span>
            </span>
          ))}
        </div>

        <p className="pt-3 font-display text-[1.15rem] leading-snug font-bold text-slate-800 md:text-[1.35rem] max-md:pt-3">
          {item.q}
        </p>
      </div>
      <span
        aria-hidden
        className="absolute -bottom-2 left-[26%] size-4.5"
        style={{
          transform: 'rotate(45deg)',
          background: 'rgba(255,255,255,0.85)',
          borderRight: `1.5px solid ${t.ring}`,
          borderBottom: `1.5px solid ${t.ring}`,
        }}
      />
    </div>
  )

  return (
    <div className="w-full">
      <InterestProgress current={index + 1} total={total} accent={accent} activeDims={[item.dim]} />

      <div className={phase === 'out' ? 'animate-scene-out' : 'animate-scene-in'}>
        <div className="mx-auto w-full max-w-[560px]">
          <div className="mt-1 flex flex-col items-center gap-3 max-md:gap-2.5">
            <div
              className="w-[min(440px,calc(100vw-2rem))]"
              style={{ transform: 'translate3d(calc(var(--gy-x) * 8px), calc(var(--gy-y) * 5px), 0)' }}
            >
              <div style={{ animation: 'bubble-pop 0.6s cubic-bezier(0.22,1,0.36,1) both' }}>{bubbleEl}</div>
            </div>

            <div
              className="mt-2 grid w-full grid-cols-2 gap-2.5 max-md:gap-2"
              style={{ animation: 'scene-in 0.5s cubic-bezier(0.22,1,0.36,1) both' }}
            >
              {INTEREST_LEVELS.map((label, i) => (
                <LevelTile
                  key={label}
                  label={label}
                  index={i}
                  hovered={hovered}
                  selected={selected}
                  onHover={setHovered}
                  onSelect={setSelected}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-4 hidden max-w-[560px] text-center text-[12px] font-medium text-slate-400 lg:block">
        Har bir faoliyat sizga qanchalik yoqqanini baholang — qiziqish darajasi qanchalik aniq bo&lsquo;lsa,
        profilingiz shunchalik ishonchli chiqadi.
      </p>
      {phase !== 'out' && selected === null && (
        <div className="mt-3 text-center lg:hidden">
          <p className="text-[12px] font-medium text-slate-400">Javob berib davom eting</p>
        </div>
      )}
    </div>
  )
}

export default InterestScene