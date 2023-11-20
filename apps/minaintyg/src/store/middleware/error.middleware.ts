import { randomUUID } from '@frontend/utils'
import { AnyAction, ThunkMiddleware } from '@reduxjs/toolkit'
import { api, hasRequest, isRejectedEndpoint } from '../api'
import { RootState } from '../reducer'

function getMessage(action: AnyAction): string {
  if (action.payload && action.payload.data && action.payload.data.message) {
    return action.payload.data.message
  }
  if (action.error && action.error.message) {
    return action.error.message
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

      return next(Object.assign(action, { payload: { ...action.payload, id: randomUUID() } }))
    }
    return next(action)
  }
