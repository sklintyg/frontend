import { AnyAction } from '@reduxjs/toolkit'
import { Middleware } from 'redux'

export const dispatchedActions: AnyAction[] = []

export const clearDispatchedActions = () => {
  dispatchedActions.length = 0
}

const handleStoreAction: Middleware = () => (next) => (action: AnyAction): void => {
  dispatchedActions.push(action)

  next(action)
}

export default handleStoreAction
