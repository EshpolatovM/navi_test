import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Header from './components/Header'
import QuestionScene from './components/QuestionScene'
import ResultCard from './components/ResultCard'
import InterestScene from './components/InterestScene'
import InterestResult from './components/InterestResult'
import Roadmap from './components/Roadmap'
import SplashScreen, { type AssessmentMode } from './components/SplashScreen'
import { useGyroParallax } from './hooks/useGyroParallax'
import { DIMS, INTEREST_ITEMS, INTEREST_COUNT, QUESTIONS, computeInterestProfile } from './data'
import { toneFor } from './lib/tone'

function App() {
  const [mode, setMode] = useState<AssessmentMode | null>(null)

  // Career test state
  const [careerIndex, setCareerIndex] = useState(0)
  const [careerAnswers, setCareerAnswers] = useState<number[]>([])
  const [careerFinished, setCareerFinished] = useState(false)
  const [cheated, setCheated] = useState(false)

  // Interest test state
  const [interestIndex, setInterestIndex] = useState(0)
  const [interestAnswers, setInterestAnswers] = useState<number[]>([])
  const [interestFinished, setInterestFinished] = useState(false)

  // Accent crossfade for atmospheric background (updated from events only)
  const [accentOld, setAccentOld] = useState('#4F46E5')
  const [accentCurrent, setAccentCurrent] = useState('#4F46E5')

  const careerTotal = QUESTIONS.length
  const gyro = useGyroParallax()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey && e.altKey && (e.key === 'b' || e.key === 'B'))) return
      e.preventDefault()
      const random = QUESTIONS.map((q) => Math.floor(Math.random() * q.opts.length))
      setCareerAnswers(random)
      setMode('career')
      setCareerFinished(true)
      setCheated(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const careerCurrent = QUESTIONS[careerIndex]
  const interestCurrent = INTEREST_ITEMS[interestIndex]
  const interestLead = (i: number) => DIMS[INTEREST_ITEMS[i]?.opts[0]?.dim ?? 0]?.color ?? '#4F46E5'
  const diffFor = (_i: number) => careerCurrent?.difficulty ?? 0.5

  const handleCareerAnswer = (optionIndex: number) => {
    const next = [...careerAnswers]
    next[careerIndex] = optionIndex
    setCareerAnswers(next)
    const oldValue = careerCurrent?.accent ?? '#4F46E5'
    if (careerIndex === careerTotal - 1) {
      setCareerFinished(true)
      setAccentOld(oldValue)
      setAccentCurrent('#8B5CF6')
    } else {
      const nextValue = QUESTIONS[careerIndex + 1]?.accent ?? '#4F46E5'
      setAccentOld(oldValue)
      setAccentCurrent(nextValue)
      setCareerIndex((i) => i + 1)
    }
  }

  const handleInterestAnswer = (optionIndex: number) => {
    const next = [...interestAnswers]
    next[interestIndex] = optionIndex
    setInterestAnswers(next)
    const oldValue = interestLead(interestIndex)
    if (interestIndex === INTEREST_COUNT - 1) {
      setInterestFinished(true)
      const top = computeInterestProfile(next).top[0]
      setAccentOld(oldValue)
      setAccentCurrent(DIMS[top]?.color ?? '#8B5CF6')
    } else {
      setAccentOld(oldValue)
      setAccentCurrent(interestLead(interestIndex + 1))
      setInterestIndex((i) => i + 1)
    }
  }

  const handleRestartCareer = () => {
    setCareerIndex(0)
    setCareerAnswers([])
    setCareerFinished(false)
    setCheated(false)
    setAccentOld('#4F46E5')
    setAccentCurrent(QUESTIONS[0]?.accent ?? '#4F46E5')
  }

  const handleRestartInterest = () => {
    setInterestIndex(0)
    setInterestAnswers([])
    setInterestFinished(false)
    setAccentOld(DIMS[0].color)
    setAccentCurrent(interestLead(0))
  }

  const handleSelect = (m: AssessmentMode) => {
    setMode(m)
    const firstAccent =
      m === 'career'
        ? (QUESTIONS[0]?.accent ?? '#4F46E5')
        : DIMS[INTEREST_ITEMS[0]?.opts[0]?.dim ?? 0]?.color ?? '#4F46E5'
    setAccentOld(firstAccent)
    setAccentCurrent(firstAccent)
    void gyro.enable()
  }

  const handleBack = () => setMode(null)

  const screenDone = mode === 'career' ? careerFinished : interestFinished
  const screenIndex = mode === 'career' ? careerIndex : interestIndex
  const active = mode !== null && !screenDone

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#faf8f4]">
      {/* Atmospheric base blobs — stable, subtle */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-40 -left-40 h-[34rem] w-[34rem] rounded-full bg-[#dfe7f5]/60 blur-3xl" />
        <div className="animate-blob absolute top-[28%] -right-44 h-[30rem] w-[30rem] rounded-full bg-[#f3e6f0]/50 blur-3xl [animation-delay:-6s]" />
        <div className="animate-blob absolute -bottom-32 left-[30%] h-[26rem] w-[26rem] rounded-full bg-white/70 blur-3xl [animation-delay:-12s]" />

        {/* Crossfading accent glows behind the scene (gyro parallax layer) */}
        {active && (
          <div
            className="absolute inset-0"
            style={{
              transform: 'translate3d(calc(var(--gy-x) * 44px), calc(var(--gy-y) * 24px), 0)',
              willChange: 'transform',
            }}
          >
            <div
              key={`old-${accentOld}`}
              className="animate-bg-blob-out absolute left-1/2 top-[44%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: `radial-gradient(circle, ${toneFor(accentOld, diffFor(screenIndex)).glow} 0%, transparent 70%)` }}
            />
            <div
              key={`cur-${accentCurrent}`}
              className="animate-bg-blob-in absolute left-1/2 top-[44%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: `radial-gradient(circle, ${toneFor(accentCurrent, diffFor(screenIndex)).glow} 0%, transparent 70%)` }}
            />
          </div>
        )}
      </div>

      <Header />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-4 md:py-8">
        <div className="relative w-full max-w-[640px] lg:max-w-[1080px] xl:max-w-[1240px] 2xl:max-w-[1340px]">
          {mode !== null && !screenDone && (
            <div className="mb-1.5 flex justify-start">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1 rounded-full bg-white/90 py-1.5 pr-3.5 pl-2 text-[11px] font-bold text-slate-600 shadow-[0_8px_20px_-10px_rgba(30,41,59,0.4)] ring-1 ring-slate-200/80 backdrop-blur transition-all duration-200 hover:-translate-x-0.5 hover:text-slate-900"
              >
                <ArrowLeft className="size-3.5" />
                Ortga
              </button>
            </div>
          )}

          {cheated && mode === 'career' && (
            <div className="animate-pop-in absolute left-1/2 top-0 z-30 -translate-x-1/2 rounded-full bg-slate-900 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-300 shadow-lg">
              Cheat rejim · tasodifiy javoblar
            </div>
          )}

          {mode === null ? (
            <SplashScreen
              career={
                careerAnswers.length > 0
                  ? { answered: Math.max(1, careerAnswers.length), total: careerTotal, finished: careerFinished }
                  : null
              }
              interest={
                interestAnswers.length > 0
                  ? { answered: Math.max(1, interestAnswers.length), total: INTEREST_COUNT, finished: interestFinished }
                  : null
              }
              onSelect={handleSelect}
            />
          ) : mode === 'career' ? (
            careerFinished ? (
              <div className="mx-auto max-w-[640px]">
                <ResultCard answers={careerAnswers} onRestart={handleRestartCareer} />
              </div>
            ) : (
              <div className="xl:grid xl:grid-cols-[176px_minmax(0,1fr)_176px] xl:items-center xl:gap-8">
                <div className="hidden xl:block" aria-hidden />
                <div className="min-w-0">
                  <QuestionScene
                    key={careerIndex}
                    question={careerCurrent}
                    index={careerIndex}
                    total={careerTotal}
                    onAnswer={handleCareerAnswer}
                  />
                </div>
                <Roadmap index={careerIndex} difficulty={careerCurrent?.difficulty ?? 0.5} total={careerTotal} />
              </div>
            )
          ) : interestFinished ? (
            <div className="mx-auto max-w-[640px]">
              <InterestResult
                answers={interestAnswers}
                onRestart={handleRestartInterest}
                onSelect={handleBack}
              />
            </div>
          ) : (
            <div className="mx-auto w-full max-w-[640px]">
              <InterestScene
                key={interestIndex}
                item={interestCurrent}
                index={interestIndex}
                total={INTEREST_COUNT}
                onAnswer={handleInterestAnswer}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App