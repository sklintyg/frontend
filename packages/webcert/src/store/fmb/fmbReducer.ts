import { createReducer } from '@reduxjs/toolkit'
import {
  removeFMBDiagnosisCodes,
  setDiagnosisListValue,
  setPatientId,
  setSickLeavePeriodValue,
  setSickLeavePeriodWarning,
  toggleFMBFunctionDisabler,
  updateFMBDiagnosisCodeInfo,
  updateFMBPanelActive,
} from './fmbActions'
import { FMBDiagnosisCodeInfo } from '@frontend/common'
import { ValueDateRangeList, ValueDiagnosisList } from '@frontend/common/src/types/certificate'
import { FunctionDisabler, toggleFunctionDisabler } from '../../components/utils/functionDisablerUtils'

interface FMBState {
  fmbDiagnosisCodeInfo: FMBDiagnosisCodeInfo[]
  fmbPanelActive: boolean
  sickLeavePeriodWarning: string
  patientId: string
  sickLeavePeriodValue: ValueDateRangeList | null
  diagnosisListValue: ValueDiagnosisList | null
  functionBlockers: FunctionDisabler[]
}

const initialState: FMBState = {
  fmbDiagnosisCodeInfo: [],
  fmbPanelActive: false,
  sickLeavePeriodWarning: '',
  patientId: '',
  sickLeavePeriodValue: null,
  diagnosisListValue: null,
  functionBlockers: [],
}

const fmbReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(updateFMBDiagnosisCodeInfo, (state, action) => {
      state.fmbDiagnosisCodeInfo.push(action.payload)
      state.fmbDiagnosisCodeInfo.sort((a, b) => a.index - b.index)
    })
    .addCase(updateFMBPanelActive, (state, action) => {
      state.fmbPanelActive = action.payload
    })
    .addCase(removeFMBDiagnosisCodes, (state, action) => {
      const index = state.fmbDiagnosisCodeInfo.findIndex((value) => value.icd10Code === action.payload.icd10Code)
      if (index > -1) {
        state.fmbDiagnosisCodeInfo.splice(index, 1)
      }
    })
    .addCase(setSickLeavePeriodWarning, (state, action) => {
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
      state.functionBlockers = toggleFunctionDisabler(state.functionBlockers, action.payload)
    })
)

export default fmbReducer
