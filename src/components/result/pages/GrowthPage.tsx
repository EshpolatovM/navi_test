import { Navigate } from 'react-router-dom'
import { useResultStore } from '../resultStore'
import GrowthSection from '../GrowthSection'

function GrowthPage() {
  const { data } = useResultStore()
  if (!data) return <Navigate to="/result" replace />
  return <GrowthSection growthAreas={data.growthAreas} />
}

export default GrowthPage