import { configureStore } from '@reduxjs/toolkit'
import reducer from './reducers'
import { useDispatch } from 'react-redux'
import apiMiddleware from './api/apiMiddleware'
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

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      // correctly typed middlewares can just be used
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
      listMiddleware
      // ,
      // you can also manually type middlewares manually
      // untypedMiddleware as Middleware<
      //   (action: Action<'specialAction'>) => number,
      //   RootState
      //   >
    ),
  // prepend and concat calls can be chained
  // .concat(logger)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
