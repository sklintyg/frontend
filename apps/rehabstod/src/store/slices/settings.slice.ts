/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserPreferences } from '../../schemas'

export interface Settings {
  showDialog: boolean
  preferences: Partial<UserPreferences>
  showPersonalInformation: boolean
}

const initialState: Settings = {
  showDialog: false,
  preferences: {},
  showPersonalInformation: true,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    resetSettings() {
      return initialState
    },
    showSettingsDialog(state) {
      state.showDialog = true
    },
    hideSettingsDialog(state) {
      state.showDialog = false
    },
    updateSettings(state, { payload }: PayloadAction<Partial<UserPreferences>>) {
      state.preferences = Object.assign(state.preferences, payload)
    },
    updateShowPersonalInformation(state, { payload }: PayloadAction<boolean>) {
      state.showPersonalInformation = payload
    },
  },
})

export const { resetSettings, showSettingsDialog, hideSettingsDialog, updateSettings, updateShowPersonalInformation } =
  settingsSlice.actions
export const { name: settingsReducerPath, reducer: settingsReducer } = settingsSlice
