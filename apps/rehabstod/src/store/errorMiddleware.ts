import { AnyAction, isRejectedWithValue, Middleware, MiddlewareAPI, ThunkDispatch } from '@reduxjs/toolkit'
import { ErrorCodeEnum, ErrorData } from '../schemas/errorSchema'
import { uuidv4 } from '../utils/uuidv4'
import { api } from './api'

/**
 * Error handling middleware
 * https://redux-toolkit.js.org/rtk-query/usage/error-handling
 */
export const errorMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI<ThunkDispatch<unknown, unknown, AnyAction>>) =>
  (next) =>
  (action) => {
    if (isRejectedWithValue(action) && !api.endpoints.logError.matchRejected(action)) {
      const { method, url } = action.meta.baseQueryMeta.request
      const message = action.payload.message ?? action.payload.data?.message ?? 'No message'
      const errorCode = action.payload.data?.status ?? undefined
      const errorData: ErrorData = {
        errorId: uuidv4(),
        message: `${message}' method '${method}' url '${url}`,
        errorCode: errorCode ?? ErrorCodeEnum.enum.UNKNOWN_INTERNAL_ERROR,
        stackTrace: null,
      }

      // Log to server
      dispatch(api.endpoints.logError.initiate({ errorData }))

      // Append identifier to payload
      return next(Object.assign(action, { payload: { ...action.payload, id: errorData.errorId } }))
    }
    return next(action)
  }
