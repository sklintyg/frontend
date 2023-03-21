import { isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'

/**
 * Error handling middleware
 * https://redux-toolkit.js.org/rtk-query/usage/error-handling
 */
export const errorMiddleware: Middleware = (_: MiddlewareAPI) => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    // TODO: dispatch some logging
    // console.log(action)
    // console.log(action.meta.args.endpointName)
    // console.log(action.payload.error)
  }
  return next(action)
}
