import { useEffect, useRef } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Setting } from '@icon-park/react'
import { useSettings } from '../SettingsContext'
import NaviLogo from '../NaviLogo'
import ResultHeaderActions from './ResultHeaderActions'
import { InteractiveHoverButton } from '../ui/interactive-hover-button'
import BlindPullToggle from '../ui/blind-pull-toggle'

export interface ResultSectionMeta {
  path: string
  labelKey: string
  descKey: string
  next?: string
  prev?: string
}

export const RESULT_SECTIONS: ResultSectionMeta[] = [
  { path: '/result', labelKey: 'result.hero.title', descKey: 'result.pages.overviewDesc', next: '/result/careers' },
  { path: '/result/careers', labelKey: 'nav.careers', descKey: 'result.pages.careersDesc', prev: '/result', next: '/result/interests' },
  { path: '/result/interests', labelKey: 'nav.interests', descKey: 'result.pages.interestsDesc', prev: '/result/careers', next: '/result/character' },
  { path: '/result/character', labelKey: 'nav.character', descKey: 'result.pages.characterDesc', prev: '/result/interests', next: '/result/values' },
  { path: '/result/values', labelKey: 'nav.values', descKey: 'result.pages.valuesDesc', prev: '/result/character', next: '/result/archetype' },
  { path: '/result/archetype', labelKey: 'nav.archetype', descKey: 'result.pages.archetypeDesc', prev: '/result/values', next: '/result/strengths' },
  { path: '/result/strengths', labelKey: 'nav.strengths', descKey: 'result.pages.strengthsDesc', prev: '/result/archetype', next: '/result/growth' },
  { path: '/result/growth', labelKey: 'nav.growth', descKey: 'result.pages.growthDesc', prev: '/result/strengths', next: '/result/advice' },
  { path: '/result/advice', labelKey: 'nav.advice', descKey: 'result.pages.adviceDesc', prev: '/result/growth', next: '/result/next-step' },
  { path: '/result/next-step', labelKey: 'nav.nextStep', descKey: 'result.pages.nextStepDesc', prev: '/result/advice', next: '/result/roadmap' },
  { path: '/result/roadmap', labelKey: 'roadmap.title', descKey: 'result.pages.roadmapDesc', prev: '/result/next-step' },
]

function ResultLayout({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { t } = useSettings()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const titleRef = useRef<HTMLHeadingElement>(null)

  // Move keyboard/screen-reader focus to the section heading on navigation so
  // users never get stranded on the previous section's content.
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true })
  }, [pathname])

  const meta = RESULT_SECTIONS.find((s) => pathname === s.path) ?? RESULT_SECTIONS[0]

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[1080px] flex-col px-4 py-6 sm:px-6 md:px-8 lg:py-8">
      {/* Top bar — NAVI logo (to overview) + theme + settings */}
      <header className="mb-6 flex items-center justify-between gap-3">
        <Link to="/result" aria-label="Natija" className="motion-ui flex items-center">
          <NaviLogo width={120} className="w-[92px]! shrink-0 sm:w-[120px]!" />
        </Link>
        <div className="motion-ui flex items-center gap-1 sm:gap-1.5">
          <ResultHeaderActions />
          <BlindPullToggle className="size-10! md:size-9!" />
          <InteractiveHoverButton
            type="button"
            size="icon"
            variant="ghost"
            arrow={false}
            icon={<Setting className="size-4.5" strokeWidth={4.4} />}
            aria-label="Sozlamalar"
            onClick={onOpenSettings}
          />
        </div>
      </header>

      {/* Back link (upper) */}
      {meta.prev && (
        <InteractiveHoverButton
          type="button"
          size="sm"
          variant="ghost"
          arrow={false}
          icon={<ArrowLeft className="size-3.5" strokeWidth={4.8} />}
          text={t('result.pages.back')}
          onClick={() => navigate(meta.prev!)}
          className="animate-slide-up mb-4 min-w-0"
        />
      )}

      {/* Page title + short description */}
      <div className="animate-slide-up" style={{ animationDelay: '60ms' }}>
        <h1 ref={titleRef} tabIndex={-1} className="font-display text-[28px] leading-tight font-bold tracking-[-0.02em] text-[var(--text-primary)] md:text-[34px]">
          {t(meta.labelKey)}
        </h1>
        <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
          {t(meta.descKey)}
        </p>
      </div>

      <main className="mt-6 flex-1 md:mt-8">
        <Outlet />
      </main>

      {/* Prev / next navigation — two equal cells on phones, auto width from tablet */}
      <div className="mt-10 grid grid-cols-2 gap-3 pb-4 sm:flex sm:items-center sm:justify-between">
        {meta.prev ? (
          <InteractiveHoverButton
            type="button"
            size="md"
            variant="ghost"
            arrow={false}
            icon={<ArrowLeft className="size-4" strokeWidth={4.8} />}
            text={t('result.pages.back')}
            onClick={() => navigate(meta.prev!)}
            className="min-w-0! w-full sm:w-auto"
          />
        ) : (
          <span className="hidden" aria-hidden />
        )}
        {meta.next ? (
          <InteractiveHoverButton
            type="button"
            size="md"
            variant="primary"
            text={t('result.pages.next')}
            onClick={() => navigate(meta.next!)}
            className="min-w-0! w-full sm:w-auto"
          />
        ) : (
          <span className="hidden" aria-hidden />
        )}
      </div>
    </div>
  )
}

export default ResultLayout