import { IDSSpinner } from '@frontend/ids-react-ts'
import { useGetUserQuery } from '../../store/api'

export function Home() {
  const { data: user, isLoading } = useGetUserQuery()

  if (isLoading) {
    return <IDSSpinner />
  }

  if (!user) {
    return <p>Inte inloggad</p>
  }

  return <p>Inloggad som: {user.personName}</p>
}
