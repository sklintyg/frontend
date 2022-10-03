import { combineReducers } from 'redux'
import { api } from './api'
import uiReducers from './uiReducers'

export default combineReducers({
  ui: uiReducers,
  [api.reducerPath]: api.reducer,
})
