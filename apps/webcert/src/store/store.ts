import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import { apiMiddleware } from './api/apiMiddleware'
import { certificateMiddleware } from './certificate/certificateMiddleware'
import { configureApplicationStore } from './configureApplicationStore'
import { errorMiddleware } from './error/errorMiddleware'
import { fmbMiddleware } from './fmb/fmbMiddleware'
import { icfMiddleware } from './icf/icfMiddleware'
import { listMiddleware } from './list/listMiddleware'
import { patientMiddleware } from './patient/patientMiddleware'
import { questionMiddleware } from './question/questionMiddleware'
import { sessionMiddleware } from './session/sessionMiddleware'
import { srsMiddleware } from './srs/srsMiddleware'
import { userMiddleware } from './user/userMiddleware'
import { utilsMiddleware } from './utils/utilsMiddleware'
import { welcomeMiddleware } from './welcome/welcomeMiddleware'

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
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
