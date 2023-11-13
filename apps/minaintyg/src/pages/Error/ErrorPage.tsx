import { useParams } from 'react-router-dom'
import { ErrorPageHero, ErrorTypeEnum } from '../../components/error/ErrorPageHero'

export function ErrorPage() {
  const { id, type } = useParams<{ id?: string; type?: ErrorTypeEnum }>()
  // TODO: useEffect hook that logs error back to the backend.
  return <ErrorPageHero id={id} type={type} />
}
