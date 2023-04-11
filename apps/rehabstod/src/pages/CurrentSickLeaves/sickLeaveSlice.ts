/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ActiveSickLeavesRequest, SickLeaveColumn } from '../../store/types/sickLeave'

export interface SickLeaveState {
  showPersonalInformation: boolean
  ascending: boolean
  currentColumn: SickLeaveColumn
  filterRequest: ActiveSickLeavesRequest
}

const initialState: SickLeaveState = {
  showPersonalInformation: true,
  ascending: false,
  currentColumn: SickLeaveColumn.Startdatum,
  filterRequest: { doctorIds: [], diagnoses: [], fromSickLeaveLength: 1, toSickLeaveLength: 365 },
}

const sickLeaveSlice = createSlice({
  name: 'sickLeave',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    resetFilters(state) {
      state.filterRequest = initialState.filterRequest
    },
    updateFilter(state, { payload }: PayloadAction<ActiveSickLeavesRequest>) {
      state.filterRequest = payload
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
export const sickLeaveReducer = sickLeaveSlice.reducer
export const sickLeaveReducerPath = sickLeaveSlice.name
