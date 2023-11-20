import { randomUUID } from '@frontend/utils'
import { AnyAction, isPlainObject, Middleware, MiddlewareAPI, PayloadAction, SerializedError, ThunkDispatch } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { api, hasRequest, isRejectedEndpoint } from '../api'

export type QueryError = (FetchBaseQueryError & { id?: string }) | (SerializedError & { id?: string })

export const isQueryError = (action: PayloadAction<unknown>): action is PayloadAction<QueryError> =>
  isPlainObject(action.payload) && 'id' in action.payload && typeof action?.payload.id === 'string'

function getMessage(action: AnyAction): string {
  if (action.payload && action.payload.data && action.payload.data.message) {
    return action.payload.data.message
  }
  if (action.error && action.error.message) {
    return action.error.message
  }
  return 'NO_MESSAGE'
}

/**
 * Error handling middleware
 * https://redux-toolkit.js.org/rtk-query/usage/error-handling
 */
export const errorMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI<ThunkDispatch<unknown, unknown, AnyAction>>) =>
  (next) =>
  (action) => {
    if (isRejectedEndpoint(action) && action.payload) {
      const id = randomUUID()
      const request = hasRequest(action.meta.baseQueryMeta) ? action.meta.baseQueryMeta.request : null
      const message = request ? `'${getMessage(action)}' method '${request.method}' url '${request.url}'` : getMessage(action)

      dispatch(
        api.endpoints.logError.initiate({
          id,
          code: action.payload.status,
          message,
          stackTrace: action.error ? action.error.stack : 'NO_STACK_TRACE',
        })
      )

      return next(Object.assign(action, { payload: { ...action.payload, id: randomUUID() } }))
    }
    return next(action)
  }
