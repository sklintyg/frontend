import { useParams } from 'react-router-dom'
import { ErrorPageHero } from '../../components/error/ErrorPageHero'
import { ErrorTypeEnum } from '../../schema/error.schema'

export function ErrorPage() {
  const { id, type } = useParams<{ id?: string; type?: ErrorTypeEnum }>()
  return <ErrorPageHero id={id} type={type} />
}
