import { AnyAction, isRejectedWithValue, Middleware, MiddlewareAPI, ThunkDispatch } from '@reduxjs/toolkit'
import { uuidv4 } from '../components/Error/util/errorUtils'
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
    if (isRejectedWithValue(action)) {
      const { method, url } = action.meta.baseQueryMeta.request
      let message = 'No message'
      let errorCode = 'No errorCode'
      if (action.payload.data) {
        message = action.payload.data.message ?? 'No message'
        errorCode = action.payload.data.errorCode ?? 'No errorCode'
      }
      const errorMessage = `${message}' method '${method}' url '${url}`
      const errorId = uuidv4()
      const errorData = {
        errorId,
        errorCode,
        message: errorMessage,
        stackTrace: null,
      }
      dispatch(api.endpoints.logError.initiate({ ...errorData, errorData }))
      dispatch(setErrorId(errorId))
    }
    return next(action)
  }
