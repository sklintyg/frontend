import { combineReducers } from 'redux'
import certificateReducer from './certificate/certificateReducer'
import errorReducer from './error/errorReducer'
import fmbReducer from './fmb/fmbReducer'
import icfReducer from './icf/icfReducer'
import listReducer from './list/listReducer'
import patientReducer from './patient/patientReducer'
import questionReducer from './question/questionReducer'
import sessionReducer from './session/sessionReducer'
import userReducer from './user/userReducer'
import utilsReducer from './utils/utilsReducer'
import welcomeReducer from './welcome/welcomeReducer'
import srsReducer from './srs/srsReducer'

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
  uiSRS: srsReducer,
})
