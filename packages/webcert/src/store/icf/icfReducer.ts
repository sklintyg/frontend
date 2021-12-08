import { createReducer } from '@reduxjs/toolkit'
import { toggleIcfFunctionDisabler, updateIcfCodes } from './icfActions'
import { FunctionDisabler, toggleFunctionDisabler } from '../../components/utils/functionDisablerUtils'

export interface IcfCode {
  title: string
  description: string
  includes?: string
  code: string
}

export interface Icd10Code {
  code: string
  title: string
}

export interface IcfCodeCollection {
  icfCodes: IcfCode[]
  icd10Codes: Icd10Code[]
}

export interface AvailableIcfCodes {
  commonCodes: IcfCodeCollection
  uniqueCodes: IcfCodeCollection[]
}

export interface IcfState {
  disability?: AvailableIcfCodes
  activityLimitation?: AvailableIcfCodes
  functionBlockers: FunctionDisabler[]
}

const initialState: IcfState = {
  functionBlockers: [],
}

const icfReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateIcfCodes, (state, action) => {
      state.activityLimitation = action.payload.activityLimitation
      state.disability = action.payload.disability
    })
    .addCase(toggleIcfFunctionDisabler, (state, action) => {
      state.functionBlockers = toggleFunctionDisabler(state.functionBlockers, action.payload)
    })
)

export default icfReducer
