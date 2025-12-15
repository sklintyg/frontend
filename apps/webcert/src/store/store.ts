import type { TypedUseSelectorHook } from 'react-redux'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch, useSelector } from 'react-redux'
import { api } from './api'
import { apiMiddleware } from './api/apiMiddleware'
import { certificateMiddleware } from './certificate/certificateMiddleware'
import { configureApplicationStore } from './configureApplicationStore'
import { errorMiddleware } from './error/errorMiddleware'
import { fmbMiddleware } from './fmb/fmbMiddleware'
import { icfMiddleware } from './icf/icfMiddleware'
import { listMiddleware } from './list/listMiddleware'
import { patientMiddleware } from './patient/patientMiddleware'
import { ppStep02Middleware } from './pp/ppStep02ReducerSlice'
import { questionMiddleware } from './question/questionMiddleware'
import type { RootState } from './reducer'
import { sessionMiddleware } from './session/sessionMiddleware'
import { srsMiddleware } from './srs/srsMiddleware'
import { userMiddleware } from './user/userMiddleware'
import { utilsMiddleware } from './utils/utilsMiddleware'
import { welcomeMiddleware } from './welcome/welcomeMiddleware'

const store = configureApplicationStore([
  api.middleware,
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
  ppStep02Middleware,
])

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
