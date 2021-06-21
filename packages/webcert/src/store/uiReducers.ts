import { combineReducers } from 'redux'
import certificateReducer from './certificate/certificateReducer'
import userReducer from './user/userReducer'
import fmbReducer from './fmb/fmbReducer'
import utilsReducer from './utils/utilsReducer'
import welcomeReducer from './welcome/welcomeReducer'

export default combineReducers({
  uiCertificate: certificateReducer,
  uiUser: userReducer,
  uiFMB: fmbReducer,
  uiUtils: utilsReducer,
  uiWelcome: welcomeReducer,
})
