import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import { errorMiddleware } from './errorMiddleware'
import { hsaApi } from './hsaApi'
import { patientTableColumnsReducer, patientTableColumnsReducerPath } from './slices/patientTableColumns.slice'
import { settingsReducer, settingsReducerPath } from './slices/settings.slice'
import { sickLeaveReducer, sickLeaveReducerPath } from './slices/sickLeave.slice'
import { sickLeaveTableColumnsReducer, sickLeaveTableColumnsReducerPath } from './slices/sickLeaveTableColumns.slice'
import { welcomeReducer, welcomeReducerPath } from './slices/welcome.slice'
import { errorReducer, errorReducerPath } from './slices/error.slice'
import { luCertificatesReducer, luCertificatesReducerPath } from './slices/luCertificates.slice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [hsaApi.reducerPath]: hsaApi.reducer,
    [sickLeaveReducerPath]: sickLeaveReducer,
    [luCertificatesReducerPath]: luCertificatesReducer,
    [welcomeReducerPath]: welcomeReducer,
    [sickLeaveTableColumnsReducerPath]: sickLeaveTableColumnsReducer,
    [patientTableColumnsReducerPath]: patientTableColumnsReducer,
    [settingsReducerPath]: settingsReducer,
    [errorReducerPath]: errorReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([api.middleware, hsaApi.middleware, errorMiddleware]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
