import { randomUUID } from '@frontend/utils'
import { ThunkMiddleware, UnknownAction, isPlainObject } from '@reduxjs/toolkit'
import { api, hasRequest, isRejectedEndpoint } from '../api'
import { RootState } from '../reducer'

const hasMessage = (o: unknown): o is { message: string } => isPlainObject(o) && 'message' in o && typeof o.message === 'string'

function getMessage(action: UnknownAction): string {
  if (isRejectedEndpoint(action)) {
    if (action.payload && hasMessage(action.payload.data)) {
      return action.payload.data.message
    }
    if (action.error && action.error.message) {
      return action.error.message
    }
  }
  return 'NO_MESSAGE'
}

/**
 * Error handling middleware
 * https://redux-toolkit.js.org/rtk-query/usage/error-handling
 */
export const errorMiddleware: ThunkMiddleware<RootState> =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    if (api.endpoints.getSessionPing.matchRejected(action) && !getState().sessionSlice.errorId) {
      return next(action)
    }

    if (isRejectedEndpoint(action) && action.payload) {
      const id = randomUUID()
      const request = hasRequest(action.meta.baseQueryMeta) ? action.meta.baseQueryMeta.request : null
      const message = request ? `'${getMessage(action)}' method '${request.method}' url '${request.url}'` : getMessage(action)
      const { hasSession } = getState().sessionSlice

      if (hasSession) {
        dispatch(
          api.endpoints.logError.initiate({
            id,
            code: action.payload.status,
            message,
            stackTrace: action.error ? action.error.stack : 'NO_STACK_TRACE',
          })
        )
      }

      return next(Object.assign(action, { payload: { ...action.payload, id } }))
    }
    return next(action)
  }
