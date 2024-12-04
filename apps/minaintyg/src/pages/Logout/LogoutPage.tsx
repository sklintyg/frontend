import { getCookie } from '@frontend/utils'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { loginMethodEnum } from '../../schema/user.schema'
import { api } from '../../store/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { endSession } from '../../store/slice/session.slice'
import { useFakeLogoutMutation } from '../../store/testabilityApi'

export function LogoutPage({ children }: { children?: ReactNode }) {
  const hasSessionEnded = useAppSelector((state) => state.sessionSlice.hasSessionEnded)
  const [fakeLogout] = useFakeLogoutMutation()
  const { data: user } = api.endpoints.getUser.useQueryState()
  const dispatch = useAppDispatch()
  const hasRun = useRef(false)

  const logout = useCallback(() => {
    if (!hasRun.current) {
      hasRun.current = true

      dispatch(endSession({ reason: 'logged-out' }))

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
      dispatch(api.util.resetApiState())
    }
  }, [dispatch, fakeLogout, user])

  useEffect(() => {
    logout()
  }, [logout])

  if (hasSessionEnded) {
    return children
  }

  return null
}
