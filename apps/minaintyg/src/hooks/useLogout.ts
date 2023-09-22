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
        form.method = 'POST'
        form.action = '/logout'
        document.body.appendChild(form)
        form.submit()
      }
    }
  }
}
