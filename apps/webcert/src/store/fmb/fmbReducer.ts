import { createReducer } from '@reduxjs/toolkit'
import { FMBDiagnosisCodeInfo, ValueDateRangeList, ValueDiagnosisList } from '../../types'
import { sortByIndex } from '../../utils'
import { FunctionDisabler, toggleFunctionDisabler } from '../../utils/functionDisablerUtils'
import {
  removeFMBDiagnosisCodes,
  setDiagnosisListValue,
  setPatientId,
  setPeriodWarning,
  setSickLeavePeriodValue,
  toggleFMBFunctionDisabler,
  updateFMBDiagnosisCodeInfo,
  updateFMBPanelActive,
} from './fmbActions'

export interface FMBState {
  fmbDiagnosisCodeInfo: FMBDiagnosisCodeInfo[]
  fmbPanelActive: boolean
  sickLeavePeriodWarning: string
  patientId: string
  sickLeavePeriodValue: ValueDateRangeList | null
  diagnosisListValue: ValueDiagnosisList | null
  functionDisablers: FunctionDisabler[]
}

const initialState: FMBState = {
  fmbDiagnosisCodeInfo: [],
  fmbPanelActive: false,
  sickLeavePeriodWarning: '',
  patientId: '',
  sickLeavePeriodValue: null,
  diagnosisListValue: null,
  functionDisablers: [],
}

const fmbReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateFMBDiagnosisCodeInfo, (state, action) => {
      if (!state.fmbDiagnosisCodeInfo.some((codeInfo) => codeInfo.originalIcd10Code === action.payload.originalIcd10Code)) {
        state.fmbDiagnosisCodeInfo.push(action.payload)
        state.fmbDiagnosisCodeInfo.sort(sortByIndex)
      }
    })
    .addCase(updateFMBPanelActive, (state, action) => {
      state.fmbPanelActive = action.payload
    })
    .addCase(removeFMBDiagnosisCodes, (state, action) => {
      const index = state.fmbDiagnosisCodeInfo.findIndex((value) => value.originalIcd10Code === action.payload.originalIcd10Code)
      if (index > -1) {
        state.fmbDiagnosisCodeInfo.splice(index, 1)
      }
    })
    .addCase(setPeriodWarning, (state, action) => {
      state.sickLeavePeriodWarning = action.payload
    })
    .addCase(setPatientId, (state, action) => {
      state.patientId = action.payload
    })
    .addCase(setSickLeavePeriodValue, (state, action) => {
      state.sickLeavePeriodValue = action.payload
    })
    .addCase(setDiagnosisListValue, (state, action) => {
      state.diagnosisListValue = action.payload
    })
    .addCase(toggleFMBFunctionDisabler, (state, action) => {
      state.functionDisablers = toggleFunctionDisabler(state.functionDisablers, action.payload)
    })
)

export default fmbReducer
