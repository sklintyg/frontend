import { randomUUID } from '@frontend/utils'
import type { SerializedError, ThunkMiddleware } from '@reduxjs/toolkit'
import { isPlainObject, isRejectedWithValue } from '@reduxjs/toolkit'
import type { ErrorData } from '../schemas/errorSchema'
import { ErrorCodeEnum } from '../schemas/errorSchema'
import { api, hasRequest, isRejectedEndpoint } from './api'
import type { RootState } from './reducer'

const hasData = (o: unknown): o is { data: unknown } => isPlainObject(o) && 'data' in o

function getActionMessage(payload: unknown, error?: SerializedError) {
  const data = hasData(payload) ? payload.data : undefined
  if (isPlainObject(data) && 'message' in data && typeof data.message === 'string') {
    return data.message
  }
  if (error && error.message) {
    return error.message
  }
  return 'NO_MESSAGE'
}

function getActionStatus(payload: unknown) {
  const data = hasData(payload) ? payload.data : undefined
  if (isPlainObject(data) && 'status' in data && typeof data.status === 'string') {
    return data.status
  }
  return undefined
}

function getRequestMethod(action: unknown) {
  if (isRejectedEndpoint(action) && hasRequest(action.meta.baseQueryMeta)) {
    const { method, url } = action.meta.baseQueryMeta.request
    return ` method '${method}' url '${url}'`
  }
  return ''
}

/**
 * Error handling middleware
 * https://redux-toolkit.js.org/rtk-query/usage/error-handling
 */
export const errorMiddleware: ThunkMiddleware<RootState> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (api.endpoints.logError.matchRejected(action)) {
      return next(action)
    }

    if (isRejectedWithValue(action) && isPlainObject(action.payload)) {
      const errorData: ErrorData = {
        errorId: randomUUID(),
        message: `${getActionMessage(action.payload, action.error)}${getRequestMethod(action)}`,
        errorCode: getActionStatus(action.payload) ?? ErrorCodeEnum.enum.UNKNOWN_INTERNAL_ERROR,
        stackTrace: 'NO_STACK_TRACE',
      }

      // Log to server
      dispatch(api.endpoints.logError.initiate({ errorData }))

      // Append identifier to payload
      return next(Object.assign(action, { payload: { ...action.payload, id: errorData.errorId } }))
    }
    return next(action)
  }
