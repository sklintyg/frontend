import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage/session'
import { persistReducer, persistStore } from 'redux-persist'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants'
import { api } from './api'
import { errorMiddleware } from './errorMiddleware'
import { hsaApi } from './hsaApi'
import { luCertificatesReducer, luCertificatesReducerPath } from './slices/luCertificates.slice'
import { luTableColumnsReducerPath, luTableColumnsSlice } from './slices/luTableColumns.slice'
import { luUnitTableColumnsReducerPath, luUnitTableColumnsSlice } from './slices/luUnitTableColumns.slice'
import { patientTableColumnsReducerPath, patientTableColumnsSlice } from './slices/patientTableColumns.slice'
import { settingsReducer, settingsReducerPath } from './slices/settings.slice'
import { sickLeaveReducer, sickLeaveReducerPath } from './slices/sickLeave.slice'
import { sickLeaveTableColumnsReducerPath, sickLeaveTableColumnsSlice } from './slices/sickLeaveTableColumns.slice'
import { welcomeReducer, welcomeReducerPath } from './slices/welcome.slice'

const persistSickLeaveConfig = {
  key: sickLeaveReducerPath,
  storage,
}

const persistLUConfig = {
  key: luTableColumnsReducerPath,
  storage,
}

const persistedSickLeaveReducer = persistReducer(persistSickLeaveConfig, sickLeaveReducer)
const persistedLUReducer = persistReducer(persistLUConfig, luCertificatesReducer)

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [hsaApi.reducerPath]: hsaApi.reducer,
    [sickLeaveReducerPath]: persistedSickLeaveReducer,
    [welcomeReducerPath]: welcomeReducer,
    [luCertificatesReducerPath]: persistedLUReducer,
    [luTableColumnsReducerPath]: luTableColumnsSlice.reducer,
    [luUnitTableColumnsReducerPath]: luUnitTableColumnsSlice.reducer,
    [patientTableColumnsReducerPath]: patientTableColumnsSlice.reducer,
    [sickLeaveTableColumnsReducerPath]: sickLeaveTableColumnsSlice.reducer,
    [settingsReducerPath]: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([api.middleware, hsaApi.middleware, errorMiddleware]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store)
