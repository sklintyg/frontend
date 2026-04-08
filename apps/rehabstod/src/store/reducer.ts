import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage/session'
import { api } from './api'
import { hsaApi } from './hsaApi'
import { cookieDialogReducer, cookieDialogReducerPath } from './slices/cookieDialog.slice'
import { luCertificatesReducer, luCertificatesReducerPath } from './slices/luCertificatesFilter.slice'
import { luTableColumnsReducerPath, luTableColumnsSlice } from './slices/luTableColumns.slice'
import { luUnitTableColumnsReducerPath, luUnitTableColumnsSlice } from './slices/luUnitTableColumns.slice'
import { patientTableColumnsReducerPath, patientTableColumnsSlice } from './slices/patientTableColumns.slice'
import { settingsReducer, settingsReducerPath } from './slices/settings.slice'
import { sickLeaveReducer, sickLeaveReducerPath } from './slices/sickLeaveFilter.slice'
import { sickLeaveTableColumnsReducerPath, sickLeaveTableColumnsSlice } from './slices/sickLeaveTableColumns.slice'

const persistSickLeaveConfig = {
  key: sickLeaveReducerPath,
  storage,
}

const persistLUConfig = {
  key: luTableColumnsReducerPath,
  storage,
}

const persistSettingsConfig = {
  key: settingsReducerPath,
  storage,
  allowlist: ['darkMode'],
}

const persistedSickLeaveReducer = persistReducer(persistSickLeaveConfig, sickLeaveReducer)
const persistedLUReducer = persistReducer(persistLUConfig, luCertificatesReducer)
const persistedSettingsReducer = persistReducer(persistSettingsConfig, settingsReducer)

export const reducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [hsaApi.reducerPath]: hsaApi.reducer,
  [sickLeaveReducerPath]: persistedSickLeaveReducer,
  [luCertificatesReducerPath]: persistedLUReducer,
  [luTableColumnsReducerPath]: luTableColumnsSlice.reducer,
  [luUnitTableColumnsReducerPath]: luUnitTableColumnsSlice.reducer,
  [patientTableColumnsReducerPath]: patientTableColumnsSlice.reducer,
  [sickLeaveTableColumnsReducerPath]: sickLeaveTableColumnsSlice.reducer,
  [settingsReducerPath]: persistedSettingsReducer,
  [cookieDialogReducerPath]: cookieDialogReducer,
})

export type RootState = ReturnType<typeof reducer>
