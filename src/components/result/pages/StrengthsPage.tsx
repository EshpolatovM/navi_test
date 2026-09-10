import { Navigate } from 'react-router-dom'
import { useResultStore } from '../resultStore'
import StrengthsSection from '../StrengthsSection'

function StrengthsPage() {
  const { data } = useResultStore()
  if (!data) return <Navigate to="/result" replace />
  return <StrengthsSection strengths={data.strengths} />
}

export default StrengthsPage