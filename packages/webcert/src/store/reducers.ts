import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import uiReducers from './uiReducers'
import { History } from 'history'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createRootReducer = (history: History<unknown>) =>
  combineReducers({
    router: connectRouter(history),
    ui: uiReducers,
  })

export default createRootReducer
