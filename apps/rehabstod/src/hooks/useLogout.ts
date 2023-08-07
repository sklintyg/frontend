import { useNavigate } from 'react-router-dom'
import { api, useFakeLogoutMutation } from '../store/api'

export function useLogout() {
  const { data: user } = api.endpoints.getUser.useQueryState()
  const [fakeLogout] = useFakeLogoutMutation()
  const navigate = useNavigate()

  return {
    logout: () => {
      if (!user || user.authenticationScheme === 'urn:inera:rehabstod:siths:fake') {
        fakeLogout()
        navigate('/welcome')
      } else {
        window.open('/saml/logout', '_self')
      }
    },
  }
}
