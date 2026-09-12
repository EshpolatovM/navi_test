import { Navigate, Route, Routes } from 'react-router-dom'
import { ResultProvider } from './resultStore'
import { RoadmapProvider } from './RoadmapContext'
import ResultLayout from './ResultLayout'
import OverviewPage from './pages/OverviewPage'
import CareersPage from './pages/CareersPage'
import InterestsPage from './pages/InterestsPage'
import CharacterPage from './pages/CharacterPage'
import ValuesPage from './pages/ValuesPage'
import ArchetypePage from './pages/ArchetypePage'
import StrengthsPage from './pages/StrengthsPage'
import GrowthPage from './pages/GrowthPage'
import AdvicePage from './pages/AdvicePage'
import NextStepPage from './pages/NextStepPage'
import RoadmapPage from './pages/RoadmapPage'
import type { ResultQuery } from './useResultData'

/**
 * The whole /result subtree is loaded lazily (result components, share preview,
 * roadmap generation and PDF/jspdf are not needed until a test is finished).
 * Descendant routes below the parent `/result/*` entry.
 */
function ResultApp({
  query,
  tryCareerTest,
  onOpenSettings,
}: {
  query: ResultQuery
  tryCareerTest: () => void
  onOpenSettings: () => void
}) {
  return (
    <ResultProvider query={query} tryCareerTest={tryCareerTest}>
      <RoadmapProvider>
        <Routes>
          <Route path="result" element={<ResultLayout onOpenSettings={onOpenSettings} />}>
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
        </Routes>
      </RoadmapProvider>
    </ResultProvider>
  )
}

export default ResultApp