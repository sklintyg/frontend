import { IDSContainer, IDSSpinner } from '@inera/ids-react'
import { useGetPersonsQuery } from '../../store/testabilityApi'
import { FakeLoginForm } from './components/FakeLoginForm'

export function Welcome() {
  const { data: persons, isLoading } = useGetPersonsQuery()

  return (
    <IDSContainer>
      {isLoading && <IDSSpinner />}
      {persons && <FakeLoginForm persons={persons} />}
    </IDSContainer>
  )
}
