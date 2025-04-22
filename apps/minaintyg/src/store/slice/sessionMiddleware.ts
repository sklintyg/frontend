import { getCookie } from '@frontend/utils'
import { createListenerMiddleware } from '@reduxjs/toolkit'
import { loginMethodEnum } from '../../schema/user.schema'
import { isQueryError } from '../../utils/isQueryError'
import { api, hasResponse, isRejectedEndpoint } from '../api'
import type { RootState } from '../reducer'
import { testabilityApi } from '../testabilityApi'
import { endSession, selectHasSession } from './session.slice'

const listenerMiddleware = createListenerMiddleware<RootState>()

listenerMiddleware.startListening({
  matcher: api.endpoints.getSessionPing.matchFulfilled,
  effect: async (action, { dispatch }) => {
    const session = action.payload

    if (session && session.secondsUntilExpire <= 30) {
      dispatch(endSession({ reason: 'logged-out' }))
    }
  },
})

listenerMiddleware.startListening({
  matcher: isRejectedEndpoint,
  effect: async (action, { dispatch, getState }) => {
    const hasSession = selectHasSession(getState())
    const error = isQueryError(action) ? action.payload : null

    if (hasResponse(action.meta.baseQueryMeta) && hasSession === true) {
      const { status } = action.meta.baseQueryMeta.response
      const isUnauthorized = status >= 401 && status <= 403

      if (status >= 500 || isUnauthorized) {
        dispatch(endSession(isUnauthorized ? { reason: 'logged-out' } : { reason: 'unavailable', errorId: error?.id }))
      }
    }
  },
})

listenerMiddleware.startListening({
  actionCreator: endSession,
  effect: async (action, { dispatch, getState }) => {
    const { data: user } = api.endpoints.getUser.select()(getState())

    if (user && action.payload.reason === 'logged-out') {
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

export const { middleware: sessionMiddleware } = listenerMiddleware
