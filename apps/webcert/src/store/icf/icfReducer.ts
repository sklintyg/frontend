import { createReducer } from '@reduxjs/toolkit'
import type { IcfCodeCollection } from '../../types'
import type { FunctionDisabler } from '../../utils/functionDisablerUtils'
import { setOriginalIcd10Codes, updateIcfCodes } from './icfActions'

export interface AvailableIcfCodes {
  commonCodes: IcfCodeCollection
  uniqueCodes: IcfCodeCollection[]
}

export interface IcfState {
  disability?: AvailableIcfCodes
  activityLimitation?: AvailableIcfCodes
  functionDisablers: FunctionDisabler[]
  originalIcd10Codes: string[]
}

const initialState: IcfState = {
  functionDisablers: [],
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
