import { useParams } from 'react-router-dom'
import { ErrorPageHero, ErrorTypeEnum } from '../../components/error/ErrorPageHero'

export function ErrorPage() {
  const { id, type } = useParams<{ id?: string; type?: ErrorTypeEnum }>()
  return <ErrorPageHero id={id} type={type} />
}
