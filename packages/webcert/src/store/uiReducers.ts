import { combineReducers } from 'redux'
import certificateReducer from './certificate/certificateReducer'
import userReducer from './user/userReducer'
import fmbReducer from './fmb/fmbReducer'
import utilsReducer from './utils/utilsReducer'
import welcomeReducer from './welcome/welcomeReducer'
import questionReducer from './question/questionReducer'
import icfReducer from './icf/icfReducer'
import sessionReducer from './session/sessionReducer'
import errorReducer from './error/errorReducer'
import patientReducer from './patient/patientReducer'
import listReducer from './list/listReducer'

export default combineReducers({
  uiCertificate: certificateReducer,
  uiUser: userReducer,
  uiFMB: fmbReducer,
  uiUtils: utilsReducer,
  uiWelcome: welcomeReducer,
  uiQuestion: questionReducer,
  uiIcf: icfReducer,
  uiSession: sessionReducer,
  uiError: errorReducer,
  uiPatient: patientReducer,
  uiList: listReducer,
})
