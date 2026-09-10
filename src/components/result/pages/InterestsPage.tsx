import { Navigate } from 'react-router-dom'
import { useResultStore } from '../resultStore'
import InterestDirections from '../InterestDirections'

function InterestsPage() {
  const { data } = useResultStore()
  if (!data) return <Navigate to="/result" replace />
  return <InterestDirections directionScores={data.directionScores} />
}

export default InterestsPage