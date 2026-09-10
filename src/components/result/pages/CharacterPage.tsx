import { Navigate } from 'react-router-dom'
import { useResultStore } from '../resultStore'
import CharacterTraits from '../CharacterTraits'

function CharacterPage() {
  const { data } = useResultStore()
  if (!data) return <Navigate to="/result" replace />
  return <CharacterTraits characterTraits={data.characterTraits} />
}

export default CharacterPage