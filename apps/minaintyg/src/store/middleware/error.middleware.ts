import { randomUUID } from '@frontend/utils'
import type { ThunkMiddleware, UnknownAction } from '@reduxjs/toolkit'
import { isPlainObject, isRejectedWithValue } from '@reduxjs/toolkit'
import type { ErrorCodeEnum } from '../../schema/error.schema'
import { api, hasRequest } from '../api'
import type { RootState } from '../reducer'

const hasMessage = (o: unknown): o is { message: string } => isPlainObject(o) && 'message' in o && typeof o.message === 'string'

function getMessage(action: UnknownAction): string {
  if (isRejectedWithValue(action) && isPlainObject(action.payload)) {
    if (action.payload && 'data' in action.payload && hasMessage(action.payload.data)) {
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

    if (isRejectedWithValue(action) && isPlainObject(action.payload)) {
      const id = randomUUID()
      const baseQueryMeta = 'baseQueryMeta' in action.meta ? action.meta.baseQueryMeta : null
      const request = hasRequest(baseQueryMeta) ? baseQueryMeta.request : null
      const message = request ? `'${getMessage(action)}' method '${request.method}' url '${request.url}'` : getMessage(action)
      const { hasSession } = getState().sessionSlice

      if (hasSession) {
        dispatch(
          api.endpoints.logError.initiate({
            id,
            code: 'status' in action.payload ? (action.payload.status as ErrorCodeEnum) : 'UNKNOWN_INTERNAL_ERROR',
            message,
            stackTrace: action.error ? action.error.stack : 'NO_STACK_TRACE',
          })
        )
      }

      return next(Object.assign(action, { payload: { ...action.payload, id } }))
    }
    return next(action)
  }
