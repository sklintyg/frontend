import { combineReducers } from 'redux'
import certificateReducer from './certificate/certificateReducer'
import userReducer from './user/userReducer'

export default combineReducers({
  uiCertificate: certificateReducer,
  uiUser: userReducer,
})
