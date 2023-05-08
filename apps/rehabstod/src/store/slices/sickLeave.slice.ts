/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import isEqual from 'lodash/isEqual'
import { SickLeaveFilter } from '../../schemas/sickLeaveSchema'

export interface SickLeaveState {
  showPersonalInformation: boolean
  filter: SickLeaveFilter

  hasAppliedFilters: boolean
}

const initialState: SickLeaveState = {
  showPersonalInformation: true,
  filter: { doctorIds: [], diagnosisChapters: [], sickLeaveLengthIntervals: [], toPatientAge: 150, fromPatientAge: 1 },
  hasAppliedFilters: false,
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
      state.hasAppliedFilters = !isEqual(initialState.filter, state.filter)
    },
    updateShowPersonalInformation(state, { payload }: PayloadAction<boolean>) {
      state.showPersonalInformation = payload
    },
  },
})

export const { reset, resetFilters, updateShowPersonalInformation, updateFilter } = sickLeaveSlice.actions
export const { name: sickLeaveReducerPath, reducer: sickLeaveReducer } = sickLeaveSlice
