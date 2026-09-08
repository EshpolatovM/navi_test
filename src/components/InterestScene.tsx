import { useEffect, useState } from 'react'
import { FlaskConical, Hammer, HeartHandshake, ListChecks, Palette, Rocket, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DIMS, type InterestItem } from '../data'
import { rgba, toneFor } from '../lib/tone'
import InterestProgress from './InterestProgress'

const DIM_ICONS: LucideIcon[] = [Hammer, FlaskConical, Palette, HeartHandshake, Rocket, ListChecks]

function InterestTile({
  text,
  dim,
  index,
  total,
  hovered,
  selected,
  onHover,
  onSelect,
}: {
  text: string
  dim: number
  index: number
  total: number
  hovered: number | null
  selected: number | null
  onHover: (i: number | null) => void
  onSelect: (i: number) => void
}) {
  const Icon = DIM_ICONS[dim]
  const color = DIMS[dim].color
  const isHover = hovered === index
  const isPicked = selected === index
  const dimmed =
    (selected !== null && !isPicked) || (hovered !== null && !isHover && selected === null)

  const gx = 16 + (index % 3) * 8
  const gy = 9 + (index % 3) * 4.5
  const tx = (index % 2 === 0 ? -1 : 1) * (8 + (index % 3) * 5)
  const tr = (index % 2 === 0 ? -1 : 1) * (5 + (index % 3) * 2.5)

  return (
    <div className={`w-full ${total % 2 === 1 && index === total - 1 ? 'col-span-2' : ''}`}>
      <div
        className="w-full scene-in"
        style={{
          '--tx': `${tx}px`,
          '--ty': '26px',
          '--tr': `${tr}deg`,
          animationDelay: `${140 + index * 60}ms`,
        } as React.CSSProperties}
      >
        <div
          className="w-full"
          style={{ transform: `translate3d(calc(var(--gy-x) * ${gx}px), calc(var(--gy-y) * ${gy}px), 0)` }}
        >
          <button
            type="button"
            aria-label={text}
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
              className="flex min-h-[54px] w-full cursor-pointer items-center gap-3 px-3.5 py-2 text-left"
              style={{
                background: isPicked ? color : 'rgba(255,255,255,0.94)',
                color: isPicked ? '#ffffff' : '#292524',
                border: isPicked ? '1px solid transparent' : `1px solid ${rgba(color, 0.24)}`,
                borderRadius: `1.3rem ${1.1 + (index % 3) * 0.22}rem 1.4rem ${1.15 + (index % 2) * 0.3}rem`,
                boxShadow: isPicked
                  ? `0 18px 42px -12px ${rgba(color, 0.7)}`
                  : isHover
                    ? `0 14px 34px -12px ${rgba(color, 0.35)}, 0 0 0 4px ${rgba(color, 0.12)}`
                    : '0 10px 26px -14px rgba(28,25,23,0.28)',
                transition: 'transform 0.34s cubic-bezier(0.22,1,0.36,1), box-shadow 0.34s ease, background 0.3s ease, color 0.3s ease',
              }}
            >
              <span className="relative shrink-0">
                <span
                  aria-hidden
                  className="grid size-10 place-items-center rounded-full"
                  style={{
                    background: isPicked ? 'rgba(255,255,255,0.22)' : `${rgba(color, 0.12)}`,
                    color: isPicked ? '#ffffff' : color,
                    transform: isHover ? 'scale(1.12) rotate(-4deg)' : undefined,
                    transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                >
                  <Icon style={{ width: 19, height: 19 }} strokeWidth={2.1} />
                </span>
                <span
                  aria-hidden
                  className="absolute -top-1.5 -right-1.5 grid size-4.5 place-items-center rounded-full font-display text-[9px] font-semibold"
                  style={{
                    background: isPicked ? '#ffffff' : 'white',
                    color: isPicked ? color : DIMS[dim].color,
                    boxShadow: `0 2px 6px ${rgba(color, 0.2)}`,
                  }}
                >
                  {String(index + 1)}
                </span>
              </span>
              <span className="flex-1 text-[12.5px] leading-snug font-medium [overflow-wrap:anywhere]">{text}</span>
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

  const activeDims = Array.from(new Set(item.opts.map((o) => o.dim)))
  const accent = DIMS[activeDims[0]]?.color ?? '#8B5CF6'
  const t = toneFor(accent, 0.55)

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
          Qiziqish testi
        </span>
        <Sparkles
          aria-hidden
          className="mark-float absolute right-5 top-4"
          style={{ width: 15, height: 15, color: t.soft }}
          strokeWidth={2.2}
        />
        <div className="flex items-center justify-center gap-1 pt-5 max-md:pt-4">
          {DIMS.map((d, i) => (
            <span
              key={d.key}
              title={d.name}
              className="grid size-4.5 place-items-center rounded-full font-display text-[7.5px] font-bold text-white transition-opacity duration-300"
              style={{ background: d.color, opacity: activeDims.includes(i) ? 1 : 0.25 }}
            >
              {d.key}
            </span>
          ))}
        </div>
        <p className="pt-3 font-display text-[1.3rem] leading-snug font-bold text-slate-800 md:text-[1.45rem]">
          {item.q}
        </p>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 max-md:mt-2 max-[359px]:hidden">
          O&lsquo;zingni eng ko&lsquo;p o&lsquo;ziga tortganini tanla
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
      <InterestProgress current={index + 1} total={total} accent={accent} activeDims={activeDims} />

      <div className={phase === 'out' ? 'animate-scene-out' : 'animate-scene-in'}>
        <div className="mx-auto w-full max-w-[560px]">
          <div className="mt-2 flex flex-col items-center gap-3 max-md:gap-2.5">
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
              {item.opts.map((opt, i) => (
                <InterestTile
                  key={i}
                  text={opt.text}
                  dim={opt.dim}
                  index={i}
                  total={item.opts.length}
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
        Bu test qaysi ish faoliyatlari sizni ko&lsquo;proq quvvatlantirishini aniqlaydi.
      </p>
      {phase !== 'out' && selected === null && (
        <div className="mt-4 text-center lg:hidden">
          <p className="text-[12px] font-medium text-slate-400">Javob berib davom eting</p>
        </div>
      )}
    </div>
  )
}

export default InterestScene