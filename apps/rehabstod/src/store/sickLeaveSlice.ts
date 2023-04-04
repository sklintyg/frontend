/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SickLeaveColumn } from './types/sickLeave'

export interface SickLeaveState {
  showPersonalInformation: boolean
  ascending: boolean
  currentColumn: SickLeaveColumn
  filter: string | null
}

const initialState: SickLeaveState = {
  showPersonalInformation: true,
  ascending: false,
  currentColumn: SickLeaveColumn.Startdatum,
  filter: null,
}

const sickLeaveSlice = createSlice({
  name: 'sickLeave',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    resetFilters(state) {
      state.ascending = initialState.ascending
      state.currentColumn = initialState.currentColumn
    },
    updateFilter(state, { payload }: PayloadAction<SickLeaveState['filter']>) {
      state.filter = payload
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

export const { reset, resetFilters, updateShowPersonalInformation, toggleAscending, sortOnColumn, updateFilter } = sickLeaveSlice.actions
export const { name: sickLeaveReducerPath, reducer: sickLeaveReducer } = sickLeaveSlice
