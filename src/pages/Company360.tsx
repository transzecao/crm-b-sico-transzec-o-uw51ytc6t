import { Navigate, useParams } from 'react-router-dom'

export default function Company360() {
  const { id } = useParams()
  return <Navigate to={`/empresa/${id}/editar`} replace />
}
