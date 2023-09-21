import { IDSButton, IDSSpinner } from '@frontend/ids-react-ts'
import { useGetUserQuery } from '../../store/api'

export function Home() {
  const { data: user, isLoading } = useGetUserQuery()

  if (isLoading) {
    return <IDSSpinner />
  }

  if (!user) {
    return <IDSButton onClick={() => window.open('/login/saml2/sso/eleg', '_self')}>Logga in</IDSButton>
  }

  return <p>Inloggad som: {user.personName}</p>
}
