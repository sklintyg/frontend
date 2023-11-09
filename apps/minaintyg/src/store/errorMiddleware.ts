import { randomUUID } from '@frontend/utils'
import { isRejectedWithValue, Middleware, MiddlewareAPI, SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

export type ErrorObject = (FetchBaseQueryError & { id?: string }) | (SerializedError & { id?: string })

/**
 * Error handling middleware
 * https://redux-toolkit.js.org/rtk-query/usage/error-handling
 */
export const errorMiddleware: Middleware = (_: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const id = randomUUID()
    // const { method, url } = action.meta.baseQueryMeta.request
    // const { status } = action.meta.baseQueryMeta.response

    // Append identifier to payload
    return next(Object.assign(action, { payload: { ...action.payload, id } }))
  }

  return next(action)
}
