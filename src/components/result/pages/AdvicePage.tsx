import { Navigate } from 'react-router-dom'
import { useResultStore } from '../resultStore'
import AdviceSection from '../AdviceSection'

function AdvicePage() {
  const { data } = useResultStore()
  if (!data) return <Navigate to="/result" replace />
  return <AdviceSection advice={data.advice} />
}

export default AdvicePage