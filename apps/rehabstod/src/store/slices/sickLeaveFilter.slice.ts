/* eslint-disable no-param-reassign */
import { isDateString } from '@frontend/utils'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import type { SickLeaveFilter } from '../../schemas/sickLeaveSchema'

export interface SickLeaveState {
  filter: SickLeaveFilter
  isValidDateRange: boolean
  displayValidationErrors: boolean
  hasAppliedFilters: boolean
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
  isValidDateRange: true,
  displayValidationErrors: false,
  hasAppliedFilters: false,
}

const sickLeaveFilterSlice = createSlice({
  name: 'sickLeaveFilter',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    update(state, { payload }: PayloadAction<Partial<SickLeaveFilter>>) {
      Object.assign(state.filter, payload)
      const { fromSickLeaveEndDate, toSickLeaveEndDate } = state.filter
      state.isValidDateRange =
        (isEmpty(fromSickLeaveEndDate) && isEmpty(toSickLeaveEndDate)) ||
        (isDateString(fromSickLeaveEndDate) && isDateString(toSickLeaveEndDate))
      state.hasAppliedFilters = !isEqual(initialState.filter, state.filter)
    },
    displayErrors(state, { payload }: PayloadAction<boolean>) {
      state.displayValidationErrors = payload
    },
  },
})

export const { reset, update, displayErrors } = sickLeaveFilterSlice.actions
export const { name: sickLeaveReducerPath, reducer: sickLeaveReducer } = sickLeaveFilterSlice
