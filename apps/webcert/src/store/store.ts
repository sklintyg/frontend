import { useDispatch } from 'react-redux'
import { apiMiddleware } from './api/apiMiddleware'
import { certificateMiddleware } from './certificate/certificateMiddleware'
import { userMiddleware } from './user/userMiddleware'
import { fmbMiddleware } from './fmb/fmbMiddleware'
import { utilsMiddleware } from './utils/utilsMiddleware'
import { welcomeMiddleware } from './welcome/welcomeMiddleware'
import { questionMiddleware } from './question/questionMiddleware'
import { icfMiddleware } from './icf/icfMiddleware'
import { sessionMiddleware } from './session/sessionMiddleware'
import { errorMiddleware } from './error/errorMiddleware'
import { patientMiddleware } from './patient/patientMiddleware'
import { listMiddleware } from './list/listMiddleware'
import { configureApplicationStore } from './configureApplicationStore'
import { srsMiddleware } from './srs/srsMiddleware'

const store = configureApplicationStore([
  apiMiddleware,
  certificateMiddleware,
  userMiddleware,
  fmbMiddleware,
  utilsMiddleware,
  welcomeMiddleware,
  questionMiddleware,
  icfMiddleware,
  sessionMiddleware,
  errorMiddleware,
  patientMiddleware,
  listMiddleware,
  srsMiddleware,
])

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>()

export default store
