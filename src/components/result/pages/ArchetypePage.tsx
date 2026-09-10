import { Navigate } from 'react-router-dom'
import { useResultStore } from '../resultStore'
import ArchetypeSection from '../ArchetypeSection'

function ArchetypePage() {
  const { data } = useResultStore()
  if (!data) return <Navigate to="/result" replace />
  return <ArchetypeSection archetype={data.archetype} />
}

export default ArchetypePage