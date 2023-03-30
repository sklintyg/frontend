/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SickLeaveColumn } from '../../store/types/sickLeave'

export interface SickLeaveState {
  showPersonalInformation: boolean
  ascending: boolean
  currentColumn: SickLeaveColumn
}

const initialState: SickLeaveState = {
  showPersonalInformation: true,
  ascending: false,
  currentColumn: SickLeaveColumn.Startdatum,
}

const sickLeaveSlice = createSlice({
  name: 'sickLeave',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    updateShowPersonalInformation(state, { payload }: PayloadAction<boolean>) {
      state.showPersonalInformation = payload
    },
    toggleAscending(state) {
      state.ascending = !state.ascending
    },
    sortOnColumn(state, { payload }: PayloadAction<SickLeaveColumn>) {
      state.currentColumn = payload
      state.ascending = initialState.ascending
    },
  },
})

export const { reset, updateShowPersonalInformation, toggleAscending, sortOnColumn } = sickLeaveSlice.actions
export const sickLeaveReducer = sickLeaveSlice.reducer
export const sickLeaveReducerPath = sickLeaveSlice.name
