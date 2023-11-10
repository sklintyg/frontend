import { getCookie } from '@frontend/utils'
import { loginMethodEnum } from '../schema/user.schema'
import { api } from '../store/api'
import { useAppDispatch, useGetUserQuery } from '../store/hooks'
import { updateHasSessionEnded } from '../store/slice/session.slice'
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
    dispatch(updateHasSessionEnded(true))
    dispatch(api.util.invalidateTags(['User']))
  }
}
