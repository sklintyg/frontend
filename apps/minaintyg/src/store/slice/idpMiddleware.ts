import { getCookie } from '@frontend/utils'
import { createListenerMiddleware } from '@reduxjs/toolkit'
import { loginMethodEnum } from '../../schema/user.schema'
import { api } from '../api'
import type { RootState } from '../reducer'
import { testabilityApi } from '../testabilityApi'
import { endSession } from './session.slice'

const listenerMiddleware = createListenerMiddleware<RootState>()

listenerMiddleware.startListening({
  matcher: api.endpoints.getSessionPing.matchFulfilled,
  effect: async (action, { dispatch, getState }) => {
    const session = action.payload
    const { data: user } = api.endpoints.getUser.select()(getState())

    if (user && session && session.secondsUntilExpire <= 30) {
      dispatch(endSession({ reason: 'logged-out' }))
      if (user.loginMethod === loginMethodEnum.enum.FAKE) {
        dispatch(testabilityApi.endpoints.fakeLogout.initiate())
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
      dispatch(api.util.resetApiState())
    }
  },
})

export const { middleware: idpMiddleware } = listenerMiddleware
