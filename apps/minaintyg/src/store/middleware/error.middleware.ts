import { randomUUID } from '@frontend/utils'
import { isRejectedWithValue, Middleware, MiddlewareAPI, SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

export type QueryError = (FetchBaseQueryError & { id?: string }) | (SerializedError & { id?: string })

/**
 * Error handling middleware
 * https://redux-toolkit.js.org/rtk-query/usage/error-handling
 */
export const errorMiddleware: Middleware = (_: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    return next(Object.assign(action, { payload: { ...action.payload, id: randomUUID() } }))
  }

  return next(action)
}
