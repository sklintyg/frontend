import { AnyAction, createAction, isPlainObject, Middleware, MiddlewareAPI, ThunkDispatch } from '@reduxjs/toolkit'
import { api, isRejectedEndpoint } from '../api'
import { updateHasSessionEnded } from '../slice/session.slice'

export const invalidateSession = createAction('INVALIDATE_SESSION')

export const sessionMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI<ThunkDispatch<unknown, unknown, AnyAction>>) =>
  (next) =>
  (action) => {
    if (isRejectedEndpoint(action) && isPlainObject(action.meta.baseQueryMeta)) {
      const { baseQueryMeta } = action.meta
      if ('response' in baseQueryMeta && baseQueryMeta.response instanceof Response) {
        const { status } = baseQueryMeta.response
        if (status >= 401 && status <= 403) {
          // TODO: Once we have a session poll we can look at the application state to
          // see if a session was previously active.
          dispatch(invalidateSession())
        }
      }
    }

    if (invalidateSession.match(action)) {
      dispatch(updateHasSessionEnded(true))
      dispatch(api.util.invalidateTags(['User']))
    }

    return next(action)
  }
