import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { QuizQuestion, StageModel } from '../data'
import { toneFor } from '../lib/tone'
import { useSettings } from './SettingsContext'
import AnswerNode from './AnswerNode'
import JourneyProgress from './JourneyProgress'

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

  // Adaptive question-text sizing: the longer the question, the more compact
  // the font, so the bubble never balloons. Bucket by real text length.
  const qlen = question.q.length
  const textSize =
    qlen <= 45
      ? 'question-text-short'
      : qlen <= 80
        ? 'question-text-medium'
        : qlen <= 120
          ? 'question-text-long'
          : 'question-text-extra-long'

  // Stage for this question, derived from the actual question array.
  const boundary =
    stageModel.boundaries.find((s) => index + 1 >= s.from && index + 1 <= s.to) ??
    stageModel.boundaries[stageModel.boundaries.length - 1]
  const stageCurrent = index - boundary.from + 2
  const stageTotal = boundary.to - boundary.from + 1

  const bubbleScale = hovered !== null ? 1.025 : selected !== null ? 1.05 : 1

  const bubbleEl = (
    <div className="relative z-10 w-full">
      <div
        className="relative pt-3 max-md:pt-1.5"
        style={{ transform: 'rotate(-0.5deg)' }}
      >
        <div
          className="question-bubble relative text-center ring-1 backdrop-blur"
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
<p className={`${textSize} pt-2.5 font-bold tracking-[-0.01em] text-slate-800 md:pt-5`}>
            {question.q}
          </p>
          <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:mt-3 md:text-[10px] max-[359px]:hidden">
            {t('scene.hint')}
          </p>
        </div>
        {/* Centered speech-bubble notch — fuses into the card body */}
        <span
          aria-hidden
          className="absolute left-1/2 size-[16px]"
          style={{
            bottom: -4,
            transform: 'translateX(-50%) rotate(45deg)',
            background: 'var(--surface-soft)',
            borderRight: `1.5px solid ${tone.ring}`,
            borderBottom: `1.5px solid ${tone.ring}`,
          }}
        />
      </div>
    </div>
  )

  const questionEl = (
    <div className="quiz-scene-question">
      <div
        className="w-full"
        style={{ transform: 'translate3d(calc(var(--gy-x) * 5px), calc(var(--gy-y) * 4px), 0)' }}
      >
        <div style={{ animation: 'bubble-pop 0.6s cubic-bezier(0.22, 1, 0.36, 1) both' }}>
          {bubbleEl}
        </div>
      </div>
    </div>
  )

  const answerCount = question.opts.length

  const answersEl = (
    <div
      className="answers-grid grid w-full grid-cols-2"
      style={{ animation: 'scene-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both' }}
    >
      {question.opts.map((opt, i) => {
        const full = answerCount % 2 === 1 && i === answerCount - 1
        const rot = (i % 2 === 0 ? -1 : 1) * 0.75
        // Subtle per-card gyro parallax depth only — never changes grid flow.
        const gx = 7 + (i % 3) * 2
        const gy = 5 + (i % 3) * 1.5
        const tx = (i % 2 === 0 ? -1 : 1) * (10 + (i % 3) * 6)
        const tr = (i % 2 === 0 ? -1 : 1) * (6 + (i % 3) * 3)
        return (
          <div
            key={i}
            className={`w-full ${full ? 'col-span-2' : ''}`}
            style={{
              animation: tumbling
                ? `tumble-out 0.95s cubic-bezier(0.36, 0.07, 0.19, 0.97) ${i * 55}ms both`
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
                style={{ x: 50, y: 50 }}
                center={{ x: 50, y: 44 }}
                rotation={rot}
                flyX="0px"
                flyY="10px"
                floatY="0px"
                delay={90 + i * 45}
                hovered={hovered}
                selected={selected}
                variant="tile"
                full={full}
                onHover={setHovered}
                onSelect={tumbling ? () => {} : setSelected}
              />
            </div>
          </div>
        )
      })}
    </div>
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
        <div className="quiz-scene flex w-full flex-col items-center">
          {questionEl}
          {answersEl}
        </div>
      </div>
    </div>
  )
}

export default QuestionScene