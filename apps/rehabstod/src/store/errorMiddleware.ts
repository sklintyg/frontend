import { randomUUID } from '@frontend/utils'
import { isPlainObject, SerializedError, ThunkMiddleware } from '@reduxjs/toolkit'
import { ErrorCodeEnum, ErrorData } from '../schemas/errorSchema'
import { api, hasRequest, isRejectedEndpoint } from './api'
import { RootState } from './reducer'

function getActionMessage(data: unknown, error: SerializedError) {
  if (isPlainObject(data) && 'message' in data && typeof data.message === 'string') {
    return data.message
  }
  if (error && error.message) {
    return error.message
  }
  return 'NO_MESSAGE'
}

function getActionStatus(data: unknown) {
  if (isPlainObject(data) && 'status' in data && typeof data.status === 'string') {
    return data.status
  }
  return undefined
}

/**
 * Error handling middleware
 * https://redux-toolkit.js.org/rtk-query/usage/error-handling
 */
export const errorMiddleware: ThunkMiddleware<RootState> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (
      !api.endpoints.logError.matchRejected(action) &&
      isRejectedEndpoint(action) &&
      hasRequest(action.meta.baseQueryMeta) &&
      action.payload
    ) {
      const { method, url } = action.meta.baseQueryMeta.request
      const message = getActionMessage(action.payload.data, action.error)
      const errorCode = getActionStatus(action.payload.data) ?? ErrorCodeEnum.enum.UNKNOWN_INTERNAL_ERROR
      const errorData: ErrorData = {
        errorId: randomUUID(),
        message: `${message}' method '${method}' url '${url}'`,
        errorCode,
        stackTrace: 'NO_STACK_TRACE',
      }

      // Log to server
      dispatch(api.endpoints.logError.initiate({ errorData }))

      // Append identifier to payload
      return next(Object.assign(action, { payload: { ...action.payload, id: errorData.errorId } }))
    }
    return next(action)
  }
