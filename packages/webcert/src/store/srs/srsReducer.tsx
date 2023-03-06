import { createReducer } from '@reduxjs/toolkit'
import { FunctionDisabler, toggleFunctionDisabler } from '../../utils/functionDisablerUtils'
import { ValueDiagnosisList } from '@frontend/common'
import { setDiagnosisCodes, setDiagnosisListValue, toggleSRSFunctionDisabler, updateError } from './srsActions'

export interface SRSState {
  diagnosisListValue: ValueDiagnosisList | null
  functionDisablers: FunctionDisabler[]
  diagnosisCodes: string[]
  error: boolean
}

const initialState: SRSState = {
  diagnosisListValue: null,
  functionDisablers: [],
  diagnosisCodes: [],
  error: false,
}

const srsReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(setDiagnosisListValue, (state, action) => {
      state.diagnosisListValue = action.payload
    })
    .addCase(setDiagnosisCodes, (state, action) => {
      state.diagnosisCodes = action.payload
    })
    .addCase(toggleSRSFunctionDisabler, (state, action) => {
      state.functionDisablers = toggleFunctionDisabler(state.functionDisablers, action.payload)
    })
    .addCase(updateError, (state, action) => {
      state.error = action.payload
    })
)

export default srsReducer
