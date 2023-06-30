import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import { errorMiddleware } from './errorMiddleware'
import { hsaApi } from './hsaApi'
import { lakarutlatandenTableColumnsReducerPath, lakarutlatandenTableColumnsSlice } from './slices/LUTableColumns.slice'
import { lakarutlatandeUnitTableColumnsReducerPath, lakarutlatandeUnitTableColumnsSlice } from './slices/LUUnitTableColumns.slice'
import { luCertificatesReducer, luCertificatesReducerPath } from './slices/luCertificates.slice'
import { patientTableColumnsReducerPath, patientTableColumnsSlice } from './slices/patientTableColumns.slice'
import { settingsReducer, settingsReducerPath } from './slices/settings.slice'
import { sickLeaveReducer, sickLeaveReducerPath } from './slices/sickLeave.slice'
import { sjukfallTableColumnsReducerPath, sjukfallTableColumnsSlice } from './slices/sickLeaveTableColumns.slice'
import { welcomeReducer, welcomeReducerPath } from './slices/welcome.slice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [hsaApi.reducerPath]: hsaApi.reducer,
    [sickLeaveReducerPath]: sickLeaveReducer,
    [welcomeReducerPath]: welcomeReducer,
    [luCertificatesReducerPath]: luCertificatesReducer,
    [lakarutlatandenTableColumnsReducerPath]: lakarutlatandenTableColumnsSlice.reducer,
    [lakarutlatandeUnitTableColumnsReducerPath]: lakarutlatandeUnitTableColumnsSlice.reducer,
    [patientTableColumnsReducerPath]: patientTableColumnsSlice.reducer,
    [sjukfallTableColumnsReducerPath]: sjukfallTableColumnsSlice.reducer,
    [settingsReducerPath]: settingsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([api.middleware, hsaApi.middleware, errorMiddleware]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
