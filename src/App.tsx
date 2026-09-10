import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import NaviIntro from './components/NaviIntro'
import QuestionScene from './components/QuestionScene'
import Roadmap from './components/Roadmap'
import SplashScreen, { type AssessmentMode } from './components/SplashScreen'
import Onboarding from './components/Onboarding'
import SetupModal from './components/SetupModal'
import ResultLayout from './components/result/ResultLayout'
import { ResultProvider } from './components/result/resultStore'
import { RoadmapProvider } from './components/result/RoadmapContext'
import OverviewPage from './components/result/pages/OverviewPage'
import CareersPage from './components/result/pages/CareersPage'
import InterestsPage from './components/result/pages/InterestsPage'
import CharacterPage from './components/result/pages/CharacterPage'
import ValuesPage from './components/result/pages/ValuesPage'
import ArchetypePage from './components/result/pages/ArchetypePage'
import StrengthsPage from './components/result/pages/StrengthsPage'
import GrowthPage from './components/result/pages/GrowthPage'
import AdvicePage from './components/result/pages/AdvicePage'
import NextStepPage from './components/result/pages/NextStepPage'
import RoadmapPage from './components/result/pages/RoadmapPage'
import { useSettings } from './components/SettingsContext'
import { useGyroParallax } from './hooks/useGyroParallax'
import { localizeCareer, localizeInterest } from './lib/qa'
import { playUiSound } from './lib/sound'
import { resetAudio, startBackgroundMusic } from './lib/audio'
import { resetHaptics } from './lib/haptics'
import { clearQuizLabData } from './lib/reset'
import { INTEREST_COUNT, INTEREST_QUESTIONS, QUESTIONS, buildStageModel } from './data'

/**
 * Loading rules:
 *  - `NaviIntro` is the ONLY loading/intro surface in the app. It plays once
 *    per browser, gated on the QuizLab-owned `quizlab_intro_seen` flag, and
 *    never reappears on refresh, route change, theme/language switch or
 *    result navigation.
 *  - Result calculation is synchronous. When a test completes (QIZIQISH 24/24,
 *    REAL KASB TANLASH 60/60) the result opens immediately — no loader.
 */
const SESSION_KEY = 'navi_session_v1'

/** First-visit brand intro marker (QuizLab-owned, separate from other keys). */
const INTRO_SEEN_KEY = 'quizlab_intro_seen'

function readIntroSeen(): boolean {
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) === '1'
  } catch {
    /* private mode */
    return false
  }
}

function markIntroSeen() {
  try {
    localStorage.setItem(INTRO_SEEN_KEY, '1')
  } catch {
    /* private mode */
  }
}

interface SessionState {
  mode: AssessmentMode | null
  careerAnswers: number[]
  careerFinished: boolean
  interestAnswers: number[]
  interestFinished: boolean
}

const EMPTY_SESSION: SessionState = {
  mode: null,
  careerAnswers: [],
  careerFinished: false,
  interestAnswers: [],
  interestFinished: false,
}

function readSession(): SessionState {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return EMPTY_SESSION
    const s = JSON.parse(raw) as Partial<SessionState>
    const careerFinished = !!s.careerFinished
    const interestFinished = !!s.interestFinished
    if (!careerFinished && !interestFinished) return EMPTY_SESSION
    const careerAnswers = Array.isArray(s.careerAnswers) ? s.careerAnswers.map(Number) : []
    const interestAnswers = Array.isArray(s.interestAnswers) ? s.interestAnswers.map(Number) : []
    if (careerFinished && careerAnswers.length !== QUESTIONS.length) return EMPTY_SESSION
    if (interestFinished && interestAnswers.length !== INTEREST_COUNT) return EMPTY_SESSION
    const mode: AssessmentMode | null = s.mode === 'career' || s.mode === 'interest' ? s.mode : null
    return { mode, careerAnswers, careerFinished, interestAnswers, interestFinished }
  } catch {
    return EMPTY_SESSION
  }
}

function App() {
  const { t, onboarded, lang, motionEnabled, resetData } = useSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const session = useMemo(() => readSession(), [])

  // Career test state
  const [mode, setMode] = useState<AssessmentMode | null>(session.mode)
  const [careerIndex, setCareerIndex] = useState(0)
  const [careerAnswers, setCareerAnswers] = useState<number[]>(session.careerAnswers)
  const [careerFinished, setCareerFinished] = useState(session.careerFinished)
  const [cheated, setCheated] = useState(false)

  // Interest test state
  const [interestIndex, setInterestIndex] = useState(0)
  const [interestAnswers, setInterestAnswers] = useState<number[]>(session.interestAnswers)
  const [interestFinished, setInterestFinished] = useState(session.interestFinished)

  // First-visit brand intro — only on the first open of the browser (see
  // `quizlab_intro_seen`), never on refresh or subsequent navigation.
  const [introVisible, setIntroVisible] = useState(() => !readIntroSeen())

  const careerTotal = QUESTIONS.length
  const careerStageModel = buildStageModel(QUESTIONS)
  const interestStageModel = buildStageModel(INTEREST_QUESTIONS)
  const gyro = useGyroParallax()

  // Persist a finished result so refresh/back lands straight on the result page.
  useEffect(() => {
    if (!careerFinished && !interestFinished) {
      try {
        sessionStorage.removeItem(SESSION_KEY)
      } catch {
        /* private mode */
      }
      return
    }
    const snap: SessionState = { mode, careerAnswers, careerFinished, interestAnswers, interestFinished }
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(snap))
    } catch {
      /* private mode */
    }
  }, [mode, careerAnswers, careerFinished, interestAnswers, interestFinished])

  useEffect(() => {
    gyro.setMotion(motionEnabled)
  }, [motionEnabled, gyro])

  // Background music starts once; it never restarts between questions, stages or
  // on the result screen. Browser autoplay is handled internally.
  useEffect(() => {
    startBackgroundMusic()
  }, [])

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

  const careerCurrent = localizeCareer(QUESTIONS[careerIndex], lang)
  const interestQ = localizeInterest(INTEREST_QUESTIONS[interestIndex], lang)

  const handleCareerAnswer = (optionIndex: number) => {
    const next = [...careerAnswers]
    next[careerIndex] = optionIndex
    setCareerAnswers(next)
    if (careerIndex === careerTotal - 1) {
      // Test complete — the result store assembles everything synchronously,
      // so the result opens straight away. No analysis loader.
      setCareerFinished(true)
      navigate('/result', { replace: true })
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
      navigate('/result', { replace: true })
    } else {
      setInterestIndex((i) => i + 1)
    }
  }

  const handleSelect = (m: AssessmentMode) => {
    playUiSound('select')
    void gyro.enable()
    setMode(m)
  }

  const handleBack = () => {
    playUiSound('back')
    setMode(null)
  }

  // Post-QIZIQISH invite → start the REAL KASB TANLASH test at question 1.
  // The QIZIQISH result stays untouched so both results coexist afterwards.
  const handleTryCareerTest = () => {
    playUiSound('select')
    void gyro.enable()
    setMode('career')
    setCareerIndex(0)
    setCareerAnswers([])
    setCareerFinished(false)
    setCheated(false)
    navigate('/')
  }

  const handleIntroComplete = () => {
    markIntroSeen()
    setIntroVisible(false)
  }

  // Delete Account: wipe every QuizLab/NAVI persistent key, reset all React
  // state and land on the first-visit flow. Everything from here on mirrors a
  // brand-new user — no test/result/session can be restored via Back/refresh.
  const handleDeleteAccount = () => {
    clearQuizLabData()
    resetAudio()
    resetHaptics()

    setSettingsOpen(false)
    resetData()

    setMode(null)
    setCareerIndex(0)
    setCareerAnswers([])
    setCareerFinished(false)
    setInterestIndex(0)
    setInterestAnswers([])
    setInterestFinished(false)
    setCheated(false)
    setIntroVisible(true)

    navigate('/', { replace: true })
  }

  // First visit: premium brand intro → language onboarding → main app. The
  // intro only ever plays once (`quizlab_intro_seen`), so on refresh the app
  // opens straight into onboarding (or the app for returning users).
  if (introVisible) return <NaviIntro onComplete={handleIntroComplete} />

  if (!onboarded) {
    return (
      <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[var(--surface)]">
        <Header />
        <main className="relative z-10 flex flex-1 items-start justify-center px-4 py-2 md:items-center md:py-8">
          <div className="relative w-full max-w-[640px] [perspective:1600px]">
            <Onboarding />
          </div>
        </main>
      </div>
    )
  }

  const screenDone = mode === 'career' ? careerFinished : interestFinished
  const inTest = mode !== null && !screenDone
  const hasResult = careerFinished || interestFinished

  const resultQuery = {
    career: { answers: careerAnswers, finished: careerFinished },
    interest: { answers: interestAnswers, finished: interestFinished },
  }

  // Home shell — splash, then the selected test. A finished-test card routes to
  // the result instead of replaying the test.
  const homeView = (
    <>
      <Header onOpenSettings={() => setSettingsOpen(true)} hideBrand={mode === null} />

      <main
        className={
          inTest
            ? 'relative z-10 flex min-h-0 flex-1 items-start justify-center overflow-hidden px-4 py-2 md:items-center'
            : 'relative z-10 flex flex-1 items-start justify-center overflow-hidden px-4 py-2 md:items-center md:py-8'
        }
      >
        <div className="relative w-full max-w-[640px] lg:max-w-[1080px] xl:max-w-[1240px] 2xl:max-w-[1340px] [perspective:1600px]">
          {cheated && mode === 'career' && (
            <div className="animate-pop-in absolute left-1/2 top-0 z-30 -translate-x-1/2 rounded-full bg-slate-900 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-300 shadow-lg">
              {t('app.cheat')}
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
          ) : screenDone ? (
            <Navigate to="/result" replace />
          ) : mode === 'career' ? (
            <div className="xl:grid xl:grid-cols-[minmax(180px,1fr)_minmax(0,900px)_minmax(180px,1fr)] xl:items-center xl:gap-8">
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
          ) : (
            <div className="xl:grid xl:grid-cols-[minmax(180px,1fr)_minmax(0,900px)_minmax(180px,1fr)] xl:items-center xl:gap-8">
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
    </>
  )

  return (
    <div
      className={
        inTest
          ? 'relative flex h-dvh flex-col overflow-hidden bg-[var(--surface)]'
          : 'relative flex min-h-dvh flex-col overflow-hidden bg-[var(--surface)]'
      }
    >
      {settingsOpen && <SetupModal onClose={() => setSettingsOpen(false)} onDeleteAccount={handleDeleteAccount} />}

      {hasResult ? (
        <ResultProvider query={resultQuery} tryCareerTest={handleTryCareerTest}>
          <RoadmapProvider>
            <Routes>
              <Route path="/" element={<>{homeView}</>} />
              <Route path="/result" element={<ResultLayout onOpenSettings={() => setSettingsOpen(true)} />}>
                <Route index element={<OverviewPage />} />
                <Route path="careers" element={<CareersPage />} />
                <Route path="interests" element={<InterestsPage />} />
                <Route path="character" element={<CharacterPage />} />
                <Route path="values" element={<ValuesPage />} />
                <Route path="archetype" element={<ArchetypePage />} />
                <Route path="strengths" element={<StrengthsPage />} />
                <Route path="growth" element={<GrowthPage />} />
                <Route path="advice" element={<AdvicePage />} />
                <Route path="next-step" element={<NextStepPage />} />
                <Route path="roadmap" element={<RoadmapPage />} />
                <Route path="*" element={<Navigate to="/result" replace />} />
              </Route>
              <Route path="*" element={<Navigate to="/result" replace />} />
            </Routes>
          </RoadmapProvider>
        </ResultProvider>
      ) : (
        <>
          {location.pathname.startsWith('/result') && <Navigate to="/" replace />}
          {homeView}
        </>
      )}
    </div>
  )
}

export default App