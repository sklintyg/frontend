import type { ThunkMiddleware } from '@reduxjs/toolkit'
import { createAction } from '@reduxjs/toolkit'
import { api } from '../api'
import type { RootState } from '../reducer'
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
