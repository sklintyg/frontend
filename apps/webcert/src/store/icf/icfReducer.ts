import { createReducer } from '@reduxjs/toolkit'
import type { IcfCodeCollection } from '../../types'
import { setOriginalIcd10Codes, updateIcfCodes } from './icfActions'

export interface AvailableIcfCodes {
  commonCodes: IcfCodeCollection
  uniqueCodes: IcfCodeCollection[]
}

export interface IcfState {
  disability?: AvailableIcfCodes
  activityLimitation?: AvailableIcfCodes
  originalIcd10Codes: string[]
}

const initialState: IcfState = {
  originalIcd10Codes: [],
}

const icfReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateIcfCodes, (state, action) => {
      state.activityLimitation = action.payload.activityLimitation
      state.disability = action.payload.disability
    })
    .addCase(setOriginalIcd10Codes, (state, action) => {
      state.originalIcd10Codes = action.payload
    })
)

export default icfReducer
