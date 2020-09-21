import { combineReducers } from 'redux'
import certificate from './certificate/certificateReducer'

export default combineReducers({
  uiCertificate: certificate,
})
