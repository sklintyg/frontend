/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import isEqual from 'lodash/isEqual'
import { SickLeaveFilter } from '../../schemas/sickLeaveSchema'
import { TimePeriodMetric, TimePeriodOption } from '../../schemas/timePeriodOptionSchema'

export interface SickLeaveState {
  filter: SickLeaveFilter
  hasAppliedFilters: boolean
  sickLeaveLengthIntervals: TimePeriodOption[]
}

const initialState: SickLeaveState = {
  filter: {
    doctorIds: [],
    diagnosisChapters: [],
    sickLeaveLengthIntervals: [],
    toPatientAge: 150,
    fromPatientAge: 1,
    fromSickLeaveEndDate: null,
    toSickLeaveEndDate: null,
    rekoStatusTypeIds: [],
    occupationTypeIds: [],
    unansweredCommunicationFilterTypeId: '',
    textSearch: '',
  },
  hasAppliedFilters: false,
  sickLeaveLengthIntervals: [
    { from: 0, to: 14, metric: TimePeriodMetric.DAYS, id: 1 },
    { from: 15, to: 30, metric: TimePeriodMetric.DAYS, id: 2 },
    { from: 31, to: 60, metric: TimePeriodMetric.DAYS, id: 3 },
    { from: 61, to: 90, metric: TimePeriodMetric.DAYS, id: 4 },
    { from: 91, to: 180, metric: TimePeriodMetric.DAYS, id: 5 },
    { from: 181, to: 365, metric: TimePeriodMetric.DAYS, id: 6 },
    { from: 1, to: 2, metric: TimePeriodMetric.YEARS, id: 7 },
    { from: 2, to: null, metric: TimePeriodMetric.YEARS, id: 8 },
  ],
}

const sickLeaveSlice = createSlice({
  name: 'sickLeave',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    resetSickLeaveFilters(state) {
      state.filter = initialState.filter
    },
    updateFilter(state, { payload }: PayloadAction<Partial<SickLeaveFilter>>) {
      Object.assign(state.filter, payload)
      state.hasAppliedFilters = !isEqual(initialState.filter, state.filter)
    },
  },
})

export const { reset, resetSickLeaveFilters, updateFilter } = sickLeaveSlice.actions
export const { name: sickLeaveReducerPath, reducer: sickLeaveReducer } = sickLeaveSlice
