/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import isEqual from 'lodash/isEqual'
import { SickLeaveFilter } from '../../schemas/sickLeaveSchema'
import { TimePeriodMetric, TimePeriodOption } from '../../schemas/timePeriodOptionSchema'

export interface SickLeaveState {
  filter: SickLeaveFilter
  hasAppliedFilters: boolean
  showPersonalInformation: boolean
  sickLeaveLengthIntervals: TimePeriodOption[]
}

const initialState: SickLeaveState = {
  showPersonalInformation: true,
  filter: {
    doctorIds: [],
    diagnosisChapters: [],
    sickLeaveLengthIntervals: [],
    toPatientAge: 150,
    fromPatientAge: 1,
    rekoStatusTypeIds: [],
    occupationTypeIds: [],
    textSearch: '',
  },
  hasAppliedFilters: false,
  sickLeaveLengthIntervals: [
    { from: 0, to: 14, metric: TimePeriodMetric.DAYS, id: 1 },
    { from: 15, to: 30, metric: TimePeriodMetric.DAYS, id: 2 },
    { from: 31, to: 90, metric: TimePeriodMetric.DAYS, id: 3 },
    { from: 91, to: 180, metric: TimePeriodMetric.DAYS, id: 4 },
    { from: 181, to: 365, metric: TimePeriodMetric.DAYS, id: 5 },
    { from: 1, to: 2, metric: TimePeriodMetric.YEARS, id: 6 },
    { from: 2, to: null, metric: TimePeriodMetric.YEARS, id: 7 },
  ],
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
