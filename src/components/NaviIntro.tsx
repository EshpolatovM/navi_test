import { useEffect, useRef, useState } from 'react'
import NaviLogo from './NaviLogo'

type Phase = 'in' | 'hold' | 'out'

const IN_MS = 560
const HOLD_MS = 540
const OUT_MS = 480

export interface NaviIntroProps {
  /** Called once, right after the fade-out finishes. */
  onComplete?: () => void
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * First-visit brand intro. The ONLY loading/intro surface in the app.
 *
 * A near-black full-viewport canvas with the centered NAVI wordmark, calm
 * scale+opacity entrance, a short hold, then a soft fade-out. It plays once
 * per browser (gated upstream via `quizlab_intro_seen`) and unmounts itself
 * completely afterwards — it is never shown again on refresh or navigation.
 */
function NaviIntro({ onComplete }: NaviIntroProps) {
  const [phase, setPhase] = useState<Phase>('in')
  const finished = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    const finish = () => {
      if (finished.current) return
      finished.current = true
      onCompleteRef.current?.()
    }

    if (prefersReducedMotion()) {
      // Reduced motion: skip the choreography, just a very short static pass.
      const t = window.setTimeout(finish, 260)
      return () => window.clearTimeout(t)
    }

    const holdT = window.setTimeout(() => setPhase('hold'), IN_MS)
    const outT = window.setTimeout(() => setPhase('out'), IN_MS + HOLD_MS)
    const doneT = window.setTimeout(finish, IN_MS + HOLD_MS + OUT_MS)
    return () => {
      window.clearTimeout(holdT)
      window.clearTimeout(outT)
      window.clearTimeout(doneT)
    }
  }, [])

  const logoClass =
    phase === 'out' ? 'navi-intro-logo navi-intro-logo-out' : 'navi-intro-logo navi-intro-logo-in'

  return (
    <div className="navi-intro-overlay fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden overscroll-none bg-[#121212] px-6">
      <NaviLogo width={200} height={43.75} className={logoClass} />
    </div>
  )
}

export default NaviIntro