import type { Option } from '../data'
import { primaryDim } from '../lib/utils'
import { playAnswerSound } from '../lib/sound'
import AnimatedAnswerIcon from './AnimatedAnswerIcon'

const DIM_ICON_NAMES: string[] = ['hammer', 'flask', 'palette', 'heart', 'rocket', 'list']

export interface NodePosition {
  x: number
  y: number
}

function AnswerNode({
  option,
  accent,
  index,
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
  const iconName = option.icon ?? DIM_ICON_NAMES[primaryDim(option.w)]
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
    background: isPicked ? 'var(--accent)' : 'var(--surface-elevated)',
    color: isPicked ? 'var(--accent-contrast)' : 'var(--text-primary)',
    border: isPicked ? '1px solid transparent' : `1px solid ${accent}26`,
    boxShadow: isPicked
      ? `0 18px 42px -12px var(--accent-shadow)`
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
      onClick={() => {
        playAnswerSound(option.sound)
        onSelect(index)
      }}
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
        className={`answer-shape flex w-full cursor-pointer items-center gap-3 px-3.5 py-2.5 text-left min-h-[48px] md:min-h-[72px] md:gap-4 md:px-4 md:py-3`}
      >
        <span className="grid size-[34px] shrink-0 place-items-center rounded-full md:size-10"
          style={{
            background: isPicked ? 'color-mix(in srgb, var(--accent-contrast) 22%, transparent)' : `${accent}12`,
            color: isPicked ? 'var(--accent-contrast)' : accent,
            transform: isHover ? 'scale(1.1) rotate(-5deg)' : isPicked ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <span className="answer-icon-float grid place-items-center">
            <AnimatedAnswerIcon name={iconName} size={20} />
          </span>
        </span>
        <span className="min-w-0 flex-1 break-words text-[12.5px] leading-[1.25] font-semibold md:text-[16px] md:leading-[1.3]">{option.text}</span>
      </span>
    </button>
  )
}

export default AnswerNode
