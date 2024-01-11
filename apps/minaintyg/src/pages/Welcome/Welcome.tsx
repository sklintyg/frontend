import { IDSContainer, IDSSpinner } from '@frontend/ids-react-ts'
import { FakeLoginForm } from './components/FakeLoginForm'
import { useGetPersonsQuery } from '../../store/testabilityApi'

export function Welcome() {
  const { data: persons, isLoading } = useGetPersonsQuery()

  return (
    <IDSContainer>
      {isLoading && <IDSSpinner />}
      {persons && <FakeLoginForm persons={persons} />}
    </IDSContainer>
  )
}
