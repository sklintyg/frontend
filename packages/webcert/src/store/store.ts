import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { api } from './api'
import { apiMiddleware } from './api/apiMiddleware'
import { certificateMiddleware } from './certificate/certificateMiddleware'
import { errorMiddleware } from './error/errorMiddleware'
import { fmbMiddleware } from './fmb/fmbMiddleware'
import { icfMiddleware } from './icf/icfMiddleware'
import { listMiddleware } from './list/listMiddleware'
import { patientMiddleware } from './patient/patientMiddleware'
import reducer from './reducers'
import { sessionMiddleware } from './session/sessionMiddleware'
import { userMiddleware } from './user/userMiddleware'
import { utilsMiddleware } from './utils/utilsMiddleware'
import { welcomeMiddleware } from './welcome/welcomeMiddleware'

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware,
      apiMiddleware,
      certificateMiddleware,
      userMiddleware,
      fmbMiddleware,
      utilsMiddleware,
      welcomeMiddleware,
      icfMiddleware,
      sessionMiddleware,
      errorMiddleware,
      patientMiddleware,
      listMiddleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>()

export default store
