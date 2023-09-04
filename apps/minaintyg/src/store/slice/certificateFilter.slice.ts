import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { CertificateSelectedOptions } from '../../schema/certificateListFilter.schema'

const initialState: Partial<CertificateSelectedOptions> = {}

const certificateFilterSlice = createSlice({
  name: 'certificateFilter',
  initialState,
  reducers: {
    reset() {
      return initialState
    },
    update(state, { payload }: PayloadAction<Partial<CertificateSelectedOptions>>) {
      Object.assign(state, payload)
    },
  },
})

export const { reset, update } = certificateFilterSlice.actions
export const { reducer: certificateFilterReducer, name: certificateFilterReducerPath } = certificateFilterSlice
