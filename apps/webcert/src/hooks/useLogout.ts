import { getCookie } from '@frontend/utils'
import { useAppDispatch, useAppSelector } from '../store/store'
import { triggerFakeLogout } from '../store/user/userActions'
import { getUser, getUserResourceLink } from '../store/user/userSelectors'
import { LoginMethod, ResourceLinkType } from '../types'

export function useLogout() {
  const link = useAppSelector(getUserResourceLink(ResourceLinkType.LOG_OUT))
  const user = useAppSelector(getUser)
  const dispatch = useAppDispatch()

  const logout = () => {
    if (!link) {
      return null
    }

    if (!user || user.loginMethod === LoginMethod.FAKE) {
      dispatch(triggerFakeLogout())
      window.open('/welcome', '_self')
    } else {
      triggerSamlLogout()
    }
  }

  const triggerSamlLogout = () => {
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

  return { logout, link }
}
