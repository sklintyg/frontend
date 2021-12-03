import { createReducer } from '@reduxjs/toolkit'
import { toggleIcfFunctionBlocker, updateIcfCodes, updateLoading } from './icfActions'
import { FunctionBlocker, toggleFunctionBlocker } from '../../components/utils/functionBlockerUtils'

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
  loading: boolean
  functionBlockers: FunctionBlocker[]
}

const initialState: IcfState = {
  loading: false,
  functionBlockers: [],
}

const icfReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateIcfCodes, (state, action) => {
      state.activityLimitation = action.payload.activityLimitation
      state.disability = action.payload.disability
    })
    .addCase(updateLoading, (state, action) => {
      state.loading = action.payload
    })
    .addCase(toggleIcfFunctionBlocker, (state, action) => {
      state.functionBlockers = toggleFunctionBlocker(state.functionBlockers, action.payload)
    })
)

export default icfReducer
