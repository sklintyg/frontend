import { IDSContainer, IDSSpinner } from '@frontend/ids-react-ts'
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
