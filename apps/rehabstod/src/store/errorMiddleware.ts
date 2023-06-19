import { AnyAction, isRejectedWithValue, Middleware, MiddlewareAPI, ThunkDispatch } from '@reduxjs/toolkit'
import { uuidv4 } from '../utils/uuidv4'
import { api } from './api'
import { setErrorId } from './slices/error.slice'
import { ErrorCodeEnum } from '../schemas/errorSchema'

/**
 * Error handling middleware
 * https://redux-toolkit.js.org/rtk-query/usage/error-handling
 */
export const errorMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI<ThunkDispatch<unknown, unknown, AnyAction>>) =>
  (next) =>
  (action) => {
    if (isRejectedWithValue(action)) {
      const { method, url } = action.meta.baseQueryMeta.request
      let message = 'No message'
      let errorCode
      if (action.payload.data) {
        message = action.payload.data.message ?? 'No message'
        errorCode = action.payload.data.errorCode ?? 'No errorCode'
      }
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
