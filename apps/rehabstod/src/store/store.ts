import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { api } from './api'
import { errorMiddleware } from './errorMiddleware'
import { hsaApi } from './hsaApi'
import { sickLeaveReducer, sickLeaveReducerPath } from './sickLeaveSlice'
import { welcomeReducer, welcomeReducerPath } from './welcomeSlice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [hsaApi.reducerPath]: hsaApi.reducer,
    [sickLeaveReducerPath]: sickLeaveReducer,
    [welcomeReducerPath]: welcomeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([api.middleware, hsaApi.middleware, errorMiddleware]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
