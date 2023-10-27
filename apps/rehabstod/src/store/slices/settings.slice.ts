/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserPreferences } from '../../schemas'

export interface Settings {
  showSettingsDialog: boolean
  preferences: Partial<UserPreferences>
  showPersonalInformation: boolean
  showAboutDialog: boolean
}

const initialState: Settings = {
  showSettingsDialog: false,
  preferences: {},
  showPersonalInformation: true,
  showAboutDialog: false,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    resetSettingsState() {
      return initialState
    },
    resetSettingsPreferences(state) {
      state.preferences = initialState.preferences
    },
    updateShowSettingsDialog(state, { payload }: PayloadAction<boolean>) {
      state.showSettingsDialog = payload
    },
    updateSettingsPreferences(state, { payload }: PayloadAction<Partial<UserPreferences>>) {
      state.preferences = Object.assign(state.preferences, payload)
    },
    updateShowPersonalInformation(state, { payload }: PayloadAction<boolean>) {
      state.showPersonalInformation = payload
    },
    updateShowAboutDialog(state, { payload }: PayloadAction<boolean>) {
      state.showAboutDialog = payload
    },
  },
})

export const {
  resetSettingsState,
  resetSettingsPreferences,
  updateShowSettingsDialog,
  updateSettingsPreferences,
  updateShowPersonalInformation,
  updateShowAboutDialog,
} = settingsSlice.actions
export const { name: settingsReducerPath, reducer: settingsReducer } = settingsSlice
