/* eslint-disable no-param-reassign */
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { UserPreferences } from '../../schemas'

interface Settings {
  showSettingsDialog: boolean
  preferences: Partial<UserPreferences>
  showPersonalInformation: boolean
  showAboutDialog: boolean
  darkMode: boolean
}

const initialState: Settings = {
  showSettingsDialog: false,
  preferences: {},
  showPersonalInformation: true,
  showAboutDialog: false,
  darkMode: false,
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
    updateDarkMode(state, { payload }: PayloadAction<boolean>) {
      state.darkMode = payload
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
  updateDarkMode,
} = settingsSlice.actions
export const { name: settingsReducerPath, reducer: settingsReducer } = settingsSlice
