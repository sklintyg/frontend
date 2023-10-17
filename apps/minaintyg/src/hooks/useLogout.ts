import { getCookie } from '@frontend/utils'
import { useNavigate } from 'react-router-dom'
import { loginMethodEnum } from '../schema/user.schema'
import { useGetUserQuery } from '../store/api'
import { useFakeLogoutMutation } from '../store/testabilityApi'

export function useLogout() {
  const [fakeLogout] = useFakeLogoutMutation()
  const { data: user } = useGetUserQuery()
  const navigate = useNavigate()

  return () => {
    if (user) {
      if (user.loginMethod === loginMethodEnum.enum.FAKE) {
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
    }
  }
}
