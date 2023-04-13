/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SickLeaveColumn, SickLeaveFilter } from '../../schemas/sickLeaveSchema'

export interface SickLeaveState {
  showPersonalInformation: boolean
  ascending: boolean
  currentColumn: SickLeaveColumn
  filter: SickLeaveFilter
}

const initialState: SickLeaveState = {
  showPersonalInformation: true,
  ascending: false,
  currentColumn: SickLeaveColumn.Startdatum,
  filter: { doctorIds: [], diagnosisChapters: [], fromSickLeaveLength: 1, toSickLeaveLength: 365 },
}

const sickLeaveSlice = createSlice({
  name: 'sickLeave',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    resetFilters(state) {
      state.filter = initialState.filter
    },
    updateFilter(state, { payload }: PayloadAction<Partial<SickLeaveFilter>>) {
      Object.assign(state.filter, payload)
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
