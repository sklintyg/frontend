import { createAction, ThunkMiddleware } from '@reduxjs/toolkit'
import { api } from '../api'
import { RootState } from '../reducer'
import { endSession } from '../slice/session.slice'

export const invalidateSession = createAction('INVALIDATE_SESSION')

export const sessionMiddleware: ThunkMiddleware<RootState> =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (invalidateSession.match(action)) {
      dispatch(endSession({ reason: 'logged-out' }))
      dispatch(api.util.resetApiState())
    }
    return next(action)
  }
