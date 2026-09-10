import { Navigate } from 'react-router-dom'
import { useResultStore } from '../resultStore'
import ValuesSection from '../ValuesSection'

function ValuesPage() {
  const { data } = useResultStore()
  if (!data) return <Navigate to="/result" replace />
  return <ValuesSection values={data.values} />
}

export default ValuesPage