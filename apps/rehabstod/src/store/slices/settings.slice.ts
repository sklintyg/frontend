/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserPreferences } from '../../schemas'

export interface Settings {
  showDialog: boolean
  preferences: Partial<UserPreferences>
}

const initialState: Settings = {
  showDialog: false,
  preferences: {},
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
  },
})

export const { resetSettings, showSettingsDialog, hideSettingsDialog, updateSettings } = settingsSlice.actions
export const { name: settingsReducerPath, reducer: settingsReducer } = settingsSlice
