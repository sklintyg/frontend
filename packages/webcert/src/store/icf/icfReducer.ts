import { createReducer } from '@reduxjs/toolkit'
import { setOriginalIcd10Codes, toggleIcfFunctionDisabler, updateIcfCodes } from './icfActions'
import { FunctionDisabler, toggleFunctionDisabler } from '../../utils/functionDisablerUtils'
import { IcfCodeCollection } from '@frontend/common'

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
    .addCase(toggleIcfFunctionDisabler, (state, action) => {
      state.functionDisablers = toggleFunctionDisabler(state.functionDisablers, action.payload)
    })
    .addCase(setOriginalIcd10Codes, (state, action) => {
      state.originalIcd10Codes = action.payload
    })
)

export default icfReducer
