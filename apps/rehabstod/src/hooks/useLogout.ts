import { useNavigate } from 'react-router-dom'
import { useFakeLogoutMutation, useGetUserQuery } from '../store/api'
import { useResetFilters } from './useResetFilters'

export function useLogout() {
  const { data: user } = useGetUserQuery()
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
