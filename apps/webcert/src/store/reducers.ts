import { connectRouter } from 'connected-react-router'
import type { History } from 'history'
import { combineReducers } from 'redux'
import uiReducers from './uiReducers'

const createRootReducer = (history: History<unknown>) =>
  combineReducers({
    router: connectRouter(history),
    ui: uiReducers,
  })

export default createRootReducer
