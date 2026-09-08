import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Header from './components/Header'
import QuestionScene from './components/QuestionScene'
import ResultCard from './components/ResultCard'
import InterestResult from './components/InterestResult'
import Roadmap from './components/Roadmap'
import SplashScreen, { type AssessmentMode } from './components/SplashScreen'
import Onboarding from './components/Onboarding'
import SetupModal from './components/SetupModal'
import { useSettings } from './components/SettingsContext'
import { useGyroParallax } from './hooks/useGyroParallax'
import { INTEREST_COUNT, INTEREST_QUESTIONS, QUESTIONS, buildStageModel } from './data'

function App() {
  const { t, onboarded } = useSettings()
  const [settingsOpen, setSettingsOpen] = useState(false)
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

  const careerTotal = QUESTIONS.length
  const careerStageModel = buildStageModel(QUESTIONS)
  const interestStageModel = buildStageModel(INTEREST_QUESTIONS)
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
  const interestQ = INTEREST_QUESTIONS[interestIndex]

  const handleCareerAnswer = (optionIndex: number) => {
    const next = [...careerAnswers]
    next[careerIndex] = optionIndex
    setCareerAnswers(next)
    if (careerIndex === careerTotal - 1) {
      setCareerFinished(true)
    } else {
      setCareerIndex((i) => i + 1)
    }
  }

  const handleInterestAnswer = (optionIndex: number) => {
    const next = [...interestAnswers]
    next[interestIndex] = optionIndex
    setInterestAnswers(next)
    if (interestIndex === INTEREST_COUNT - 1) {
      setInterestFinished(true)
    } else {
      setInterestIndex((i) => i + 1)
    }
  }

  const handleRestartCareer = () => {
    setCareerIndex(0)
    setCareerAnswers([])
    setCareerFinished(false)
    setCheated(false)
  }

  const handleRestartInterest = () => {
    setInterestIndex(0)
    setInterestAnswers([])
    setInterestFinished(false)
  }

  const handleSelect = (m: AssessmentMode) => {
    setMode(m)
    void gyro.enable()
  }

  const handleBack = () => setMode(null)

  const screenDone = mode === 'career' ? careerFinished : interestFinished

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[var(--surface)]">
      {/* Atmospheric glow — one subtle, centered accent aura; never reaches edges */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="animate-aura motion-glow absolute top-[36%] left-1/2 h-[26rem] w-[min(46rem,88vw)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
          style={{
            background: `radial-gradient(circle, var(--accent-glow) 0%, color-mix(in srgb, var(--accent-glow) 55%, transparent) 46%, transparent 72%)`,
            opacity: 1,
          }}
        />
      </div>

      <Header onOpenSettings={onboarded ? () => setSettingsOpen(true) : undefined} />

      {settingsOpen && onboarded && <SetupModal onClose={() => setSettingsOpen(false)} />}

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-4 md:py-8">
        <div className="relative w-full max-w-[640px] lg:max-w-[1080px] xl:max-w-[1240px] 2xl:max-w-[1340px] [perspective:1600px]">
          {mode !== null && !screenDone && (
            <div className="motion-ui mb-1.5 flex justify-start">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-elevated)] py-1.5 pr-3.5 pl-2 text-[11px] font-bold text-slate-600 shadow-[0_8px_20px_-10px_rgba(30,41,59,0.4)] ring-1 ring-slate-200/80 backdrop-blur transition-all duration-200 hover:-translate-x-0.5 hover:text-slate-900"
              >
                <ArrowLeft className="size-3.5" />
                {t('app.back')}
              </button>
            </div>
          )}

          {cheated && mode === 'career' && (
            <div className="animate-pop-in absolute left-1/2 top-0 z-30 -translate-x-1/2 rounded-full bg-slate-900 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-300 shadow-lg">
              {t('app.cheat')}
            </div>
          )}

          {!onboarded ? (
            <Onboarding />
          ) : mode === null ? (
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
                    stageModel={careerStageModel}
                    onAnswer={handleCareerAnswer}
                  />
                </div>
                <Roadmap
                  index={careerIndex}
                  total={careerTotal}
                  boundaries={careerStageModel.boundaries}
                />
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
            <div className="xl:grid xl:grid-cols-[176px_minmax(0,1fr)_176px] xl:items-center xl:gap-8">
              <div className="hidden xl:block" aria-hidden />
              <div className="min-w-0">
                <QuestionScene
                  key={interestIndex}
                  question={interestQ!}
                  index={interestIndex}
                  total={INTEREST_COUNT}
                  stageModel={interestStageModel}
                  onAnswer={handleInterestAnswer}
                />
              </div>
<Roadmap
                  index={interestIndex}
                  total={INTEREST_COUNT}
                  boundaries={interestStageModel.boundaries}
                />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App