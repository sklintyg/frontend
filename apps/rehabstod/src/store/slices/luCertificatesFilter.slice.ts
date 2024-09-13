/* eslint-disable no-param-reassign */
import { isDateString } from '@frontend/utils'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import type { LUCertificatesFilter } from '../../schemas/luCertificatesSchema'

export interface LuCertificatesState {
  filter: LUCertificatesFilter
  isValidDateRange: boolean
  displayValidationErrors: boolean
  hasAppliedFilters: boolean
}

const initialState: LuCertificatesState = {
  filter: {
    certTypes: [],
    diagnoses: [],
    doctors: [],
    fromDate: null,
    toDate: null,
    questionAndAnswers: null,
    searchText: '',
    fromAge: 1,
    toAge: 150,
  },
  isValidDateRange: true,
  displayValidationErrors: false,
  hasAppliedFilters: false,
}

const luCertificatesSlice = createSlice({
  name: 'luCertificatesFilter',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    update(state, { payload }: PayloadAction<Partial<LUCertificatesFilter>>) {
      Object.assign(state.filter, payload)
      const { fromDate, toDate } = state.filter
      state.isValidDateRange = (isEmpty(fromDate) && isEmpty(toDate)) || (isDateString(fromDate) && isDateString(toDate))
      state.hasAppliedFilters = !isEqual(initialState.filter, state.filter)
    },
    displayErrors(state, { payload }: PayloadAction<boolean>) {
      state.displayValidationErrors = payload
    },
  },
})

export const { reset, update, displayErrors } = luCertificatesSlice.actions
export const { name: luCertificatesReducerPath, reducer: luCertificatesReducer } = luCertificatesSlice
