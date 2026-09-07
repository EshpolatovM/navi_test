import { FlaskConical, Hammer, HeartHandshake, ListChecks, Palette, Rocket } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Option, Riaset } from '../data'

const DIM_ICONS: LucideIcon[] = [Hammer, FlaskConical, Palette, HeartHandshake, Rocket, ListChecks]

function primaryDim(w: Riaset): number {
  let best = 0
  for (let i = 1; i < w.length; i++) if (w[i] > w[best]) best = i
  return best
}

export interface NodePosition {
  x: number
  y: number
}

function AnswerNode({
  option,
  accent,
  index,
  letter,
  style,
  center,
  rotation,
  flyX,
  flyY,
  floatY,
  delay,
  hovered,
  selected,
  variant,
  full,
  onHover,
  onSelect,
}: {
  option: Option
  accent: string
  index: number
  letter: string
  style: NodePosition
  center: NodePosition
  rotation: number
  flyX: string
  flyY: string
  floatY: string
  delay: number
  hovered: number | null
  selected: number | null
  variant: 'orbit' | 'tile'
  full?: boolean
  onHover: (i: number | null) => void
  onSelect: (i: number) => void
}) {
  const Icon = DIM_ICONS[primaryDim(option.w)]
  const isHover = hovered === index
  const isPicked = selected === index
  const dimmed =
    (selected !== null && !isPicked) || (hovered !== null && !isHover && selected === null)

  let dx = 0
  let dy = 0
  let s = 1
  if (isHover) {
    dx = Math.sign(center.x - style.x) * 11
    dy = Math.sign(center.y - style.y) * 11
    s = 1.07
  } else if (hovered !== null && selected === null) {
    dx = -Math.sign(center.x - style.x) * 6
    dy = -Math.sign(center.y - style.y) * 6
  }
  if (isPicked) s = 1.12

  const innerStyle: React.CSSProperties = {
    transform: `translate(${dx}px, ${dy}px) rotate(${rotation}deg) scale(${s})`,
    transition: 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.34s ease, opacity 0.34s ease, background 0.34s ease, color 0.34s ease',
    opacity: dimmed ? 0.45 : 1,
    background: isPicked ? accent : 'rgba(255,255,255,0.92)',
    color: isPicked ? '#ffffff' : '#292524',
    border: isPicked ? '1px solid transparent' : `1px solid ${accent}26`,
    borderRadius: `1.3rem ${1.1 + (index % 3) * 0.22}rem 1.4rem ${1.15 + (index % 2) * 0.3}rem`,
    boxShadow: isPicked
      ? `0 18px 42px -12px ${accent}b3`
      : isHover
        ? `0 14px 34px -12px ${accent}59, 0 0 0 4px ${accent}14`
        : '0 10px 26px -14px rgba(28,25,23,0.28)',
  }

  const outerAnim =
    variant === 'orbit'
      ? `node-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both, node-float 6s ease-in-out ${delay + 1000}ms infinite`
      : `scene-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`

  const styleBase: React.CSSProperties =
    variant === 'orbit'
      ? {
          left: style.x,
          top: style.y,
          animation: outerAnim,
          ...({ '--nx': flyX, '--ny': flyY, '--fy': floatY } as React.CSSProperties),
        }
      : {
          animation: outerAnim,
        }

  return (
    <button
      type="button"
      aria-label={option.text}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(index)}
      tabIndex={selected === null ? 0 : -1}
      disabled={selected !== null}
      style={styleBase}
      className={
        variant === 'orbit'
          ? 'absolute z-10 select-none outline-none focus-visible:opacity-100'
          : `w-full select-none outline-none ${full ? 'col-span-2' : ''}`
      }
    >
      <span
        style={innerStyle}
        className="flex min-h-[54px] w-full cursor-pointer items-center gap-3 px-3.5 py-2 text-left"
      >
        <span className="relative shrink-0">
          <span
            aria-hidden
            className="grid place-items-center rounded-full"
            style={{
              width: 40,
              height: 40,
              background: isPicked ? 'rgba(255,255,255,0.22)' : `${accent}12`,
              color: isPicked ? '#fff' : accent,
              transform: isHover ? 'scale(1.12) rotate(-4deg)' : undefined,
              transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            <Icon style={{ width: 19, height: 19 }} strokeWidth={2.1} />
          </span>
          <span
            aria-hidden
            className="absolute -top-1.5 -right-1.5 grid size-4.5 place-items-center rounded-full font-display text-[9px] font-semibold"
            style={{ background: isPicked ? '#fff' : 'white', color: isPicked ? accent : '#78716c', boxShadow: `0 2px 6px ${accent}33` }}
          >
            {letter}
          </span>
        </span>
        <span className="flex-1 text-[12.5px] leading-snug font-medium [overflow-wrap:anywhere]">{option.text}</span>
      </span>
    </button>
  )
}

export default AnswerNode