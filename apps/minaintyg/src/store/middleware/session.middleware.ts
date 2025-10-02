import { getCookie } from '@frontend/utils'
import { createListenerMiddleware, isRejected } from '@reduxjs/toolkit'
import { loginMethodEnum } from '../../schema/user.schema'
import { isQueryError } from '../../utils/isQueryError'
import { api, hasResponse } from '../api'
import type { RootState } from '../reducer'
import { endSession, selectHasSession, selectSessionEndReason } from '../slice/session.slice'
import { testabilityApi } from '../testabilityApi'

const listenerMiddleware = createListenerMiddleware<RootState>()

listenerMiddleware.startListening({
  matcher: api.endpoints.getSessionPing.matchFulfilled,
  effect: (action, { dispatch }) => {
    const session = action.payload

    if (session && session.secondsUntilExpire <= 30) {
      dispatch(endSession({ reason: 'logged-out' }))
    }
  },
})

listenerMiddleware.startListening({
  matcher: isRejected,
  effect: (action, { dispatch, getState }) => {
    const hasSession = selectHasSession(getState())
    const error = isQueryError(action) ? action.payload : null
    const baseQueryMeta = 'baseQueryMeta' in action.meta ? action.meta.baseQueryMeta : null

    if (hasResponse(baseQueryMeta) && hasSession === true) {
      const { status } = baseQueryMeta.response
      const isUnauthorized = status >= 401 && status <= 403

      if (status >= 500 || isUnauthorized) {
        dispatch(endSession(isUnauthorized ? { reason: 'logged-out' } : { reason: 'unavailable', errorId: error?.id }))
      }
    }
  },
})

listenerMiddleware.startListening({
  predicate: (_, currentState, previousState) => selectHasSession(previousState) === true && selectHasSession(currentState) === false,
  effect: (_, { dispatch, getState }) => {
    const { data: user } = api.endpoints.getUser.select()(getState())

    if (user && selectSessionEndReason(getState()) === 'logged-out') {
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
