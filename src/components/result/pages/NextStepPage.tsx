import { Navigate, useNavigate } from 'react-router-dom'
import { useResultStore } from '../resultStore'
import NextStepCard from '../NextStepCard'

function NextStepPage() {
  const navigate = useNavigate()
  const { data } = useResultStore()

  if (!data) return <Navigate to="/result" replace />

  const target = data.nextStep.target
  const handleAction = () => {
    if (target === 'career') navigate('/result/careers')
    else if (target === 'directions') navigate('/result/interests')
  }

  return <NextStepCard nextStep={data.nextStep} onAction={target === 'retake' ? undefined : handleAction} />
}

export default NextStepPage