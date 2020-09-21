import { combineReducers } from 'redux'
import uiReducers from './uiReducers'

export default combineReducers({
  ui: uiReducers,
})
