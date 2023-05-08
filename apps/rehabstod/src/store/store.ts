import { configureStore } from '@reduxjs/toolkit'
import { sickLeaveReducer, sickLeaveReducerPath } from '../pages/CurrentSickLeaves/sickLeaveSlice'
import { welcomeReducer, welcomeReducerPath } from '../pages/Welcome/welcomeSlice'
import { api } from './api'
import { errorMiddleware } from './errorMiddleware'
import { hsaApi } from './hsaApi'
import { patientTableColumnsReducer, patientTableColumnsReducerPath } from './slices/patientTableColumns.slice'
import { sickLeaveTableColumnsReducer, sickLeaveTableColumnsReducerPath } from './slices/sickLeaveTableColumns.slice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [hsaApi.reducerPath]: hsaApi.reducer,
    [sickLeaveReducerPath]: sickLeaveReducer,
    [welcomeReducerPath]: welcomeReducer,
    [sickLeaveTableColumnsReducerPath]: sickLeaveTableColumnsReducer,
    [patientTableColumnsReducerPath]: patientTableColumnsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([api.middleware, hsaApi.middleware, errorMiddleware]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
