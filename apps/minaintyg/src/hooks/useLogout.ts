import { getCookie } from 'utils'
import { loginMethodEnum } from '../schema/user.schema'
import { useAppDispatch, useGetUserQuery } from '../store/hooks'
import { invalidateSession } from '../store/middleware/session.middleware'
import { useFakeLogoutMutation } from '../store/testabilityApi'

export function useLogout() {
  const [fakeLogout] = useFakeLogoutMutation()
  const { data: user } = useGetUserQuery()
  const dispatch = useAppDispatch()

  return () => {
    if (user) {
      if (user.loginMethod === loginMethodEnum.enum.FAKE) {
        fakeLogout()
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
    dispatch(invalidateSession())
  }
}
