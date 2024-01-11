import { randomUUID } from '@frontend/utils'
import { AnyAction, Middleware, MiddlewareAPI, ThunkDispatch, isRejectedWithValue } from '@reduxjs/toolkit'
import { api } from './api'
import { ErrorCodeEnum, ErrorData } from '../schemas/errorSchema'

/**
 * Error handling middleware
 * https://redux-toolkit.js.org/rtk-query/usage/error-handling
 */
export const errorMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI<ThunkDispatch<unknown, unknown, AnyAction>>) =>
  (next) =>
  (action) => {
    function getMessage() {
      if (action.payload.data && action.payload.data.message) {
        return action.payload.data.message
      }
      if (action.error && action.error.message) {
        return action.error.message
      }
      return 'NO_MESSAGE'
    }

    function getLogMessage(message: string, method: string, url: string) {
      return `${message}' method '${method}' url '${url}'`
    }

    function getErrorCode() {
      return action.payload.data?.status ?? ErrorCodeEnum.enum.UNKNOWN_INTERNAL_ERROR
    }

    if (isRejectedWithValue(action) && !api.endpoints.logError.matchRejected(action)) {
      const { method, url } = action.meta.baseQueryMeta.request
      const message = getMessage()
      const errorCode = getErrorCode()
      const errorData: ErrorData = {
        errorId: randomUUID(),
        message: getLogMessage(message, method, url),
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
