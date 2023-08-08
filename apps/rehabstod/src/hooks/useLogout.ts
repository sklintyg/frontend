import { useNavigate } from 'react-router-dom'
import { useResetFilters } from './useResetFilters'
import { api, useFakeLogoutMutation } from '../store/api'

export function useLogout() {
  const { data: user } = api.endpoints.getUser.useQueryState()
  const [fakeLogout] = useFakeLogoutMutation()
  const navigate = useNavigate()
  const { resetFilters } = useResetFilters()

  return {
    logout: () => {
      resetFilters()
      if (!user || user.authenticationScheme === 'urn:inera:rehabstod:siths:fake') {
        fakeLogout()
        navigate('/welcome')
      } else {
        window.open('/saml/logout', '_self')
      }
    },
  }
}
