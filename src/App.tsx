import { useEffect, useState } from 'react'
import Header from './components/Header'
import QuestionScene from './components/QuestionScene'
import ResultCard from './components/ResultCard'
import Roadmap from './components/Roadmap'
import SplashScreen from './components/SplashScreen'
import { useGyroParallax } from './hooks/useGyroParallax'
import { QUESTIONS } from './data'

function App() {
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [finished, setFinished] = useState(false)
  const [cheated, setCheated] = useState(false)

  // Accent crossfade for atmospheric background (updated from events only)
  const [accentOld, setAccentOld] = useState('#2563EB')
  const [accentCurrent, setAccentCurrent] = useState('#2563EB')

  const total = QUESTIONS.length
  const gyro = useGyroParallax()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey && e.altKey && (e.key === 'b' || e.key === 'B'))) return
      e.preventDefault()
      const random = QUESTIONS.map((q) => Math.floor(Math.random() * q.opts.length))
      setAnswers(random)
      setStarted(true)
      setFinished(true)
      setCheated(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const current = QUESTIONS[index]
  const isLast = index === total - 1

  const handleAnswer = (optionIndex: number) => {
    const next = [...answers]
    next[index] = optionIndex
    setAnswers(next)
    const oldValue = QUESTIONS[index]?.accent ?? '#2563EB'
    if (isLast) {
      setFinished(true)
      setAccentOld(oldValue)
      setAccentCurrent('#7C3AED')
    } else {
      const nextValue = QUESTIONS[index + 1]?.accent ?? '#2563EB'
      setAccentOld(oldValue)
      setAccentCurrent(nextValue)
      setIndex((i) => i + 1)
    }
  }

  const handleRestart = () => {
    setIndex(0)
    setAnswers([])
    setFinished(false)
    setStarted(true)
    setCheated(false)
    setAccentOld('#2563EB')
    setAccentCurrent(QUESTIONS[0]?.accent ?? '#2563EB')
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#faf8f4]">
      {/* Atmospheric base blobs — stable, subtle */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-[#dfe7f5]/60 blur-3xl" />
        <div className="animate-blob absolute top-[28%] -right-44 h-[30rem] w-[30rem] rounded-full bg-[#f3e6f0]/50 blur-3xl [animation-delay:-6s]" />
        <div className="animate-blob absolute -bottom-32 left-[30%] h-[26rem] w-[26rem] rounded-full bg-white/70 blur-3xl [animation-delay:-12s]" />

        {/* Crossfading accent glows behind the scene (gyro parallax layer) */}
        {started && !finished && (
          <div
            className="absolute inset-0"
            style={{
              transform: 'translate3d(calc(var(--gy-x) * 18px), calc(var(--gy-y) * 11px), 0)',
              willChange: 'transform',
            }}
          >
            <div
              key={`old-${accentOld}`}
              className="animate-bg-blob-out absolute left-1/2 top-[44%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: `radial-gradient(circle, ${accentOld}30 0%, transparent 70%)` }}
            />
            <div
              key={`cur-${accentCurrent}`}
              className="animate-bg-blob-in absolute left-1/2 top-[44%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: `radial-gradient(circle, ${accentCurrent}30 0%, transparent 70%)` }}
            />
          </div>
        )}
      </div>

      <Header />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-4 md:py-8">
        <div className="relative w-full max-w-[640px] lg:max-w-[1080px] xl:max-w-[1240px] 2xl:max-w-[1340px]">
          {cheated && (
            <div className="animate-pop-in absolute -top-1 left-1/2 z-30 -translate-x-1/2 rounded-full bg-slate-900 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-300 shadow-lg">
              Cheat rejim · tasodifiy javoblar
            </div>
          )}

          {!started ? (
            <SplashScreen
              onStart={() => {
                setStarted(true)
                const first = QUESTIONS[0]?.accent ?? '#2563EB'
                setAccentOld(first)
                setAccentCurrent(first)
                void gyro.enable()
              }}
            />
          ) : finished ? (
            <div className="mx-auto max-w-[640px]">
              <ResultCard answers={answers} onRestart={handleRestart} />
            </div>
          ) : (
            <div className="xl:grid xl:grid-cols-[176px_minmax(0,1fr)_176px] xl:items-center xl:gap-8">
              <div className="hidden xl:block" aria-hidden />
              <div className="min-w-0">
                <QuestionScene
                  key={index}
                  question={current}
                  index={index}
                  total={total}
                  onAnswer={handleAnswer}
                />
              </div>
              <Roadmap index={index} total={total} accent={current?.accent ?? '#2563EB'} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App