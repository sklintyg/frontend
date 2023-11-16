import { AnyAction, createAction, Middleware, MiddlewareAPI, ThunkDispatch } from '@reduxjs/toolkit'
import { api } from '../api'
import { endSession } from '../slice/session.slice'

export const invalidateSession = createAction('INVALIDATE_SESSION')

export const sessionMiddleware: Middleware =
  ({ dispatch }: MiddlewareAPI<ThunkDispatch<unknown, unknown, AnyAction>>) =>
  (next) =>
  (action) => {
    if (invalidateSession.match(action)) {
      dispatch(endSession({ reason: 'logged-out' }))
      dispatch(api.util.resetApiState())
    }
    return next(action)
  }
