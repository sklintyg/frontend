import { useNavigate } from 'react-router-dom'
import { getCookie } from '@frontend/utils'
import { api } from '../store/api'
import { useFakeLogoutMutation } from '../store/testabilityApi'
import { useResetFilters } from './useResetFilters'

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
        const form = document.createElement('form')
        const input = document.createElement('input')
        form.method = 'POST'
        form.action = '/logout'
        input.type = 'hidden'
        input.name = '_csrf'
        input.value = getCookie('XSRF-TOKEN') ?? ''
        form.appendChild(input)
        document.body.appendChild(form)
        form.submit()
      }
    },
  }
}
