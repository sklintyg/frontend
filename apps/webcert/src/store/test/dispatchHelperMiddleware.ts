import type { AnyAction } from '@reduxjs/toolkit'
import type { Middleware } from 'redux'

export const dispatchedActions: AnyAction[] = []

export const clearDispatchedActions = () => {
  dispatchedActions.length = 0
}

export const dispatchHelperMiddleware: Middleware =
  () =>
  (next) =>
  (action: AnyAction): void => {
    dispatchedActions.push(action)

    next(action)
  }
