/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import _ from 'lodash'
import { SickLeaveFilter } from '../../schemas/sickLeaveSchema'

export interface SickLeaveState {
  showPersonalInformation: boolean
  filter: SickLeaveFilter

  hasAppliedFilters: boolean
}

const initialState: SickLeaveState = {
  showPersonalInformation: true,
  filter: { doctorIds: [], diagnosisChapters: [], fromSickLeaveLength: 1, toSickLeaveLength: 10000 },
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
      state.hasAppliedFilters = !_.isEqual(initialState.filter, state.filter)
    },
    updateShowPersonalInformation(state, { payload }: PayloadAction<boolean>) {
      state.showPersonalInformation = payload
    },
  },
})

export const { reset, resetFilters, updateShowPersonalInformation, updateFilter } = sickLeaveSlice.actions
export const { name: sickLeaveReducerPath, reducer: sickLeaveReducer } = sickLeaveSlice
