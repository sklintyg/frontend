import { combineReducers } from 'redux'
import certificateReducer from './certificate/certificateReducer'
import userReducer from './user/userReducer'
import fmbReducer from './fmb/fmbReducer'
import utilsReducer from './utils/utilsReducer'
import welcomeReducer from './welcome/welcomeReducer'
import questionReducer from './question/questionReducer'
import icfReducer from './icf/icfReducer'


export default combineReducers({
  uiCertificate: certificateReducer,
  uiUser: userReducer,
  uiFMB: fmbReducer,
  uiUtils: utilsReducer,
  uiWelcome: welcomeReducer,
  uiQuestion: questionReducer,
  uiIcf: icfReducer,
})
