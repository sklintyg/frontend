/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import isEqual from 'lodash/isEqual'
import { LUCertificatesFilter } from '../../schemas/luCertificatesSchema'

export interface SickLeaveState {
  filter: LUCertificatesFilter
  hasAppliedFilters: boolean
  showPersonalInformation: boolean
  certificateFilterTypes: { name: string; id: string }[]
  unansweredCommunicationFilterTypes: { name: string; id: string }[]
}

const initialState: SickLeaveState = {
  showPersonalInformation: true,
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
  hasAppliedFilters: false,
  certificateFilterTypes: [
    { name: 'Läkarutlåtande för sjukersättning, FK7800', id: 'FK7800' },
    { name: 'Läkarutlåtande för aktivitetsersättning vid nedsatt arbetsförmåga, FK7801', id: 'FK7801' },
    { name: 'Läkarutlåtande för aktivitetsersättning vid förlängd skolgång, FK7802', id: 'FK7802' },
  ],
  unansweredCommunicationFilterTypes: [
    { name: 'Enbart läkarutlåtanden utan obesvarade ärenden', id: '1' },
    { name: 'Enbart läkarutlåtanden med obesvarade ärenden', id: '2' },
    { name: 'Läkarutlåtanden med obesvarade kompletteringar', id: '3' },
    { name: 'Läkarutlåtanden med obesvarade frågor och svar', id: '4' },
  ],
}

const sickLeaveSlice = createSlice({
  name: 'luCertificates',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    resetFilters(state) {
      state.filter = initialState.filter
    },
    updateFilter(state, { payload }: PayloadAction<Partial<LUCertificatesFilter>>) {
      Object.assign(state.filter, payload)
      state.hasAppliedFilters = !isEqual(initialState.filter, state.filter)
    },
    updateShowPersonalInformation(state, { payload }: PayloadAction<boolean>) {
      state.showPersonalInformation = payload
    },
  },
})

export const { reset, resetFilters, updateShowPersonalInformation, updateFilter } = sickLeaveSlice.actions
export const { name: luCertificatesReducerPath, reducer: luCertificatesReducer } = sickLeaveSlice
