import { Middleware } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'

export const dispatchedActions: AnyAction[] = []

export const clearDispatchedActions = () => {
  dispatchedActions.length = 0
}

const handleStoreAction: Middleware = () => (next) => (action: AnyAction): void => {
  dispatchedActions.push(action)

  next(action)
}

export default handleStoreAction
