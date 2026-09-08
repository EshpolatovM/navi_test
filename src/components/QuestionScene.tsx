import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { QuizQuestion, StageModel } from '../data'
import { toneFor } from '../lib/tone'
import { useSettings } from './SettingsContext'
import AnswerNode, { type NodePosition } from './AnswerNode'
import JourneyProgress from './JourneyProgress'

// Constellation geometry constants.
// N / NH are generous half-sizes for an answer chip (includes hover growth),
// GAP is the minimum invisible clearance kept around the question bubble.
const N = 122
const NH = 54
const GAP = 46

function QuestionScene({
  question,
  index,
  total,
  stageModel,
  onAnswer,
}: {
  question: QuizQuestion
  index: number
  total: number
  stageModel: StageModel
  onAnswer: (optionIndex: number) => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [phase, setPhase] = useState<'in' | 'out'>('in')
  const [tumbling, setTumbling] = useState(false)
  useEffect(() => {
    let timer = 0
    const onShake = () => {
      setTumbling(true)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setTumbling(false), 1050)
    }
    window.addEventListener('quiz:shake', onShake)
    return () => {
      window.removeEventListener('quiz:shake', onShake)
      window.clearTimeout(timer)
    }
  }, [])

  // Measured geometry — node positions are recomputed so collisions are impossible.
  const orbitRef = useRef<HTMLDivElement | null>(null)
  const bubbleRef = useRef<HTMLDivElement | null>(null)
  const [geo, setGeo] = useState({ w: 1080, h: 600 })
  const [bubbleSize, setBubbleSize] = useState({ bw: 460, bh: 280 })

  useEffect(() => {
    const el = orbitRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const e = entries[0]
      const w = e.borderBoxSize?.[0]?.inlineSize ?? 0
      const h = e.borderBoxSize?.[0]?.blockSize ?? 0
      if (w > 0 && h > 0) setGeo((g) => (g.w === w && g.h === h ? g : { w, h }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = bubbleRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const e = entries[0]
      const w = e.borderBoxSize?.[0]?.inlineSize ?? 0
      const h = e.borderBoxSize?.[0]?.blockSize ?? 0
      if (w > 0 && h > 0) setBubbleSize((s) => (s.bw === w && s.bh === h ? s : { bw: w, bh: h }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (selected === null) return
    const c1 = window.setTimeout(() => setPhase('out'), 330)
    const c2 = window.setTimeout(() => onAnswer(selected), 560)
    return () => {
      window.clearTimeout(c1)
      window.clearTimeout(c2)
    }
  }, [selected, onAnswer])

  const accent = question.accent
  const { t } = useSettings()
  // Difficulty-tuned tone: easy → soft & airy, hard → rich & defined.
  const tone = toneFor(accent, question.difficulty)

  // Stage for this question, derived from the actual question array.
  const boundary =
    stageModel.boundaries.find((s) => index + 1 >= s.from && index + 1 <= s.to) ??
    stageModel.boundaries[stageModel.boundaries.length - 1]
  const stageCurrent = index - boundary.from + 2
  const stageTotal = boundary.to - boundary.from + 1

// --- Symmetric constellation around the centered bubble -------------------
// Node count follows each O*NET-style item's option count (4/5/6), so the
// layout is chosen per question. Every axis is clamped by the measured
// container so nodes can never leave the playfield or reach the bubble's safe zone.
const { w, h } = geo
  const cx = w / 2
  const cy = h / 2
  const Bhh = bubbleSize.bh / 2

  const ps = Math.max(44, Math.min(Bhh + NH + GAP, cy - NH - 44))

  // Bubble width is chosen so the constellation never teeters on safety:
  // worst case a node pulls inward (hover attract + growth). NEED is the
  // minimum clearance kept even when the measured container is narrow.
  const NEED = 24
  const lim = cx - N - 44
  const bw = Math.min(460, w * 0.46, 2 * (lim - N - NEED))
  const Bhw = bw / 2
  const sx = Math.max(44, Math.min(Bhw + N + GAP, lim))
  const sy = Math.min(Math.max(ps - NH - 38, NH + 38), Math.max(cy - NH - 44, 44))

  const orbitPtsFor = (n: number): NodePosition[] => {
    const top = { x: cx, y: cy - ps } as NodePosition
    const lu = { x: cx - sx, y: cy - sy } as NodePosition
    const ru = { x: cx + sx, y: cy - sy } as NodePosition
    const bottom = { x: cx, y: cy + ps } as NodePosition
    const rl = { x: cx + sx, y: cy + sy } as NodePosition
    const ll = { x: cx - sx, y: cy + sy } as NodePosition
    if (n === 3) return [top, ll, rl]
    if (n === 4) return [lu, ru, ll, rl]
    if (n === 5) return [top, lu, ru, ll, rl]
    return [top, lu, ru, bottom, rl, ll]
  }
  const orbitPts = orbitPtsFor(question.opts.length)

  const flyOf = (p: NodePosition) => {
    const dx = Math.sign(p.x - cx)
    const dy = Math.sign(p.y - cy)
    const fx = dx * Math.max(90, Math.round(w * 0.09))
    const fy = dy * Math.round(h * 0.06)
    return { fx, fy }
  }

  const signs: NodePosition = { x: cx, y: cy }
  const bubbleScale = hovered !== null ? 1.025 : selected !== null ? 1.05 : 1

  const bubbleEl = (
    <div className="relative z-10 w-full">
      <div
        className="relative px-5 pt-3 max-md:px-4 max-md:pt-2"
        style={{ transform: 'rotate(-1deg)' }}
      >
        <div
          className="relative rounded-[2rem] px-5 py-4 text-center ring-1 backdrop-blur md:px-9 md:py-7 max-md:px-4 max-md:py-3"
          style={{
            width: '100%',
            background:
              'radial-gradient(120% 120% at 20% 0%, var(--surface-elevated) 0%, var(--surface-soft) 55%, color-mix(in srgb, var(--surface-elevated) 45%, transparent) 100%)',
            borderColor: tone.ring,
            boxShadow: `0 26px 60px -22px rgba(28,25,23,0.3), 0 0 0 1px color-mix(in srgb, var(--surface-elevated) 35%, transparent) inset`,
            transform: `scale(${bubbleScale})`,
            transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <span
            aria-hidden
            className="absolute left-5 top-3.5 font-display text-[9px] font-semibold uppercase tracking-[0.28em] md:top-4 md:text-[10px]"
            style={{ color: tone.deep }}
          >
            {t(`stage.${boundary.def.key}`)}
          </span>
          <Sparkles
            aria-hidden
            className="absolute right-5 top-3.5 mark-float md:top-4"
            style={{ width: 14, height: 14, color: tone.soft }}
            strokeWidth={2.2}
          />
          <p className="pt-4 text-[1.18rem] leading-[1.3] font-bold tracking-[-0.01em] text-slate-800 md:pt-5 md:text-[1.5625rem] md:leading-[1.32] max-[359px]:text-[1.1rem]">
            {question.q}
          </p>
          <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:mt-3 md:text-[10px] max-[359px]:hidden">
            {t('scene.hint')}
          </p>
        </div>
        {/* Asymmetric tail */}
        <span
          aria-hidden
          className="absolute -bottom-2 left-[26%] size-4.5"
          style={{
            transform: 'rotate(45deg)',
            background: 'var(--surface-soft)',
            borderRight: `1.5px solid ${tone.ring}`,
            borderBottom: `1.5px solid ${tone.ring}`,
          }}
        />
      </div>
    </div>
  )

  const orbitNodes = (
    <div ref={orbitRef} className="motion-tray relative hidden h-[600px] w-full max-w-[1080px] mx-auto lg:block">
      {/* Soft halo behind the centered bubble */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full blur-3xl transition-opacity duration-500"
        style={{
          left: cx,
          top: cy,
          width: Math.max(260, bubbleSize.bw * 1.5),
          height: Math.max(260, bubbleSize.bh * 1.5),
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${tone.glow} 0%, transparent 70%)`,
          opacity: hovered !== null ? 1 : 0.75,
        }}
      />

      {/* Question bubble — always dead-center, with a guaranteed safe zone */}
      <div
        ref={bubbleRef}
        className="animate-bubble-float absolute z-20"
        style={{ left: cx, top: cy, width: bw, transform: 'translate(-50%, -50%)', translate: 'calc(var(--gy-x) * 3px) calc(var(--gy-y) * 3px)' }}
      >
        <div className="animate-bubble-pop">{bubbleEl}</div>
      </div>

      {question.opts.map((opt, i) => {
        const p = orbitPts[i]
        const rot = (i % 2 === 0 ? 1 : -1) * (1.5 + (i % 3) * 0.9)
        const fly = flyOf(p)
        return (
          <AnswerNode
            key={i}
            option={opt}
            accent={tone.main}
            index={i}
            letter={String(i + 1)}
            style={p}
            center={signs}
            rotation={rot}
            flyX={`${fly.fx}px`}
            flyY={`${fly.fy}px`}
            floatY={`${6 + (index % 3) * 3}px`}
            delay={140 + i * 45}
            hovered={hovered}
            selected={selected}
            variant="orbit"
            onHover={setHovered}
            onSelect={setSelected}
          />
        )
      })}
    </div>
  )

  const tileNodes = (
    <>
      {/* Phones + tablets (<1024): bubble + 2-column grid */}
      <div className="flex w-full flex-col items-center gap-2.5 lg:hidden max-md:gap-2">
        <div className="flex w-full justify-center">
          <div
            className="w-[min(440px,calc(100vw-1.5rem))]"
            style={{ transform: 'translate3d(calc(var(--gy-x) * 8px), calc(var(--gy-y) * 5px), 0)' }}
          >
            <div style={{ animation: 'bubble-pop 0.6s cubic-bezier(0.22,1,0.36,1) both' }}>{bubbleEl}</div>
          </div>
        </div>

        <div
          className="grid w-full grid-cols-2 gap-2"
          style={{ maxWidth: 440, animation: 'scene-in 0.5s cubic-bezier(0.22,1,0.36,1) both' }}
        >
          {question.opts.map((opt, i) => {
            const c = question.opts.length
            const rot = (i % 2 === 0 ? 1 : -1) * (1 + (i % 3))
            // Per-tile gyro parallax depth (visible, layered): 8/10/12 → 6/7.5/9 px
            const gx = 8 + (i % 3) * 2
            const gy = 6 + (i % 3) * 1.5
            const tx = (i % 2 === 0 ? -1 : 1) * (8 + (i % 3) * 5)
            const tr = (i % 2 === 0 ? -1 : 1) * (5 + (i % 3) * 2.5)
            return (
              <div
                key={i}
                className={`w-full ${c % 2 === 1 && i === c - 1 ? 'col-span-2' : ''}`}
                style={{
                  animation: tumbling
                    ? `tumble-out 0.95s cubic-bezier(0.36,0.07,0.19,0.97) ${i * 55}ms both`
                    : undefined,
                  '--tx': `${tx}px`,
                  '--ty': '26px',
                  '--tr': `${tr}deg`,
                } as React.CSSProperties}
              >
                <div
                  className="w-full"
                  style={{
                    transform: `translate3d(calc(var(--gy-x) * ${gx}px), calc(var(--gy-y) * ${gy}px), 0)`,
                  }}
                >
                  <AnswerNode
                    option={opt}
                    accent={tone.main}
                    index={i}
                    letter={String(i + 1)}
                    style={{ x: 50, y: 46 }}
                    center={{ x: 50, y: 42 }}
                    rotation={rot}
                    flyX="0px"
                    flyY="12px"
                    floatY="0px"
                    delay={140 + i * 60}
                    hovered={hovered}
                    selected={selected}
                    variant="tile"
                    onHover={setHovered}
                    onSelect={tumbling ? () => {} : setSelected}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )

  return (
    <div className="w-full">
      <JourneyProgress
        current={index + 1}
        total={total}
        stages={stageModel.boundaries.map((s) => s.def)}
        stageKey={boundary.def.key}
        stageCurrent={stageCurrent}
        stageTotal={stageTotal}
      />

      <div className={phase === 'out' ? 'animate-scene-out' : 'animate-scene-in'}>
        {orbitNodes}
        {tileNodes}
      </div>
    </div>
  )
}

export default QuestionScene