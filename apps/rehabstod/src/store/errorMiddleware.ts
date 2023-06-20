import { AnyAction, isRejectedWithValue, Middleware, MiddlewareAPI, ThunkDispatch } from '@reduxjs/toolkit'
import { ErrorCodeEnum } from '../schemas/errorSchema'
import { uuidv4 } from '../utils/uuidv4'
import { api } from './api'
import { setErrorId } from './slices/error.slice'

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
      const message = action.payload.data?.message ?? 'No message'
      const errorCode = action.payload.data?.errorCode ?? undefined
      const errorMessage = `${message}' method '${method}' url '${url}`
      const errorId = uuidv4()
      dispatch(
        api.endpoints.logError.initiate({
          errorData: {
            errorId,
            errorCode: errorCode ?? ErrorCodeEnum.enum.UNKNOWN_INTERNAL_ERROR,
            message: errorMessage,
            stackTrace: null,
          },
        })
      )
      dispatch(setErrorId(errorId))
    }
    return next(action)
  }
