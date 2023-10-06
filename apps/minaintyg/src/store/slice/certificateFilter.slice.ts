/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { CertificateFilterOptions } from '../../schema/certificateListFilter.schema'

export type CertificateFilterState = { [K in keyof CertificateFilterOptions]?: string }

const initialState: CertificateFilterState = {}

const certificateFilterSlice = createSlice({
  name: 'certificateFilter',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    update(state, { payload }: PayloadAction<{ key: keyof CertificateFilterState; value: string }>) {
      const { key, value } = payload

      if (!value && state[key]) {
        delete state[key]
      } else {
        state[key] = value
      }
    },
  },
})

export const { reset, update } = certificateFilterSlice.actions
export const { reducer: certificateFilterReducer, name: certificateFilterReducerPath } = certificateFilterSlice
