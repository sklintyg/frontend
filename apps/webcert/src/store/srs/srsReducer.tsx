import { createReducer } from '@reduxjs/toolkit'
import { FunctionDisabler, toggleFunctionDisabler } from '../../utils/functionDisablerUtils'
import {
  setDiagnosisCodes,
  setDiagnosisListValue,
  toggleSRSFunctionDisabler,
  updateCertificateId,
  updateError,
  updateIsCertificateRenewed,
  updatePatientId,
  updateSrsInfo,
  updateSickLeaveChoice,
} from './srsActions'
import { SrsInfoForDiagnosis, SrsSickLeaveChoice, ValueDiagnosisList } from '@frontend/common'

export interface SRSState {
  diagnosisListValue: ValueDiagnosisList | null
  functionDisablers: FunctionDisabler[]
  diagnosisCodes: string[]
  srsInfo: SrsInfoForDiagnosis | undefined
  error: boolean
  patientId: string
  certificateId: string
  sickLeaveChoice: SrsSickLeaveChoice

  isCertificateRenewed: boolean
}

const initialState: SRSState = {
  diagnosisListValue: null,
  functionDisablers: [],
  diagnosisCodes: [],
  error: false,
  srsInfo: undefined,
  patientId: '',
  certificateId: '',
  sickLeaveChoice: SrsSickLeaveChoice.NEW,
  isCertificateRenewed: false,
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
    .addCase(updateSrsInfo, (state, action) => {
      state.srsInfo = action.payload
    })
    .addCase(updatePatientId, (state, action) => {
      state.patientId = action.payload
    })
    .addCase(updateCertificateId, (state, action) => {
      state.certificateId = action.payload
    })
    .addCase(updateSickLeaveChoice, (state, action) => {
      state.sickLeaveChoice = action.payload
    })
    .addCase(updateIsCertificateRenewed, (state, action) => {
      state.isCertificateRenewed = action.payload
      if (action.payload) {
        state.sickLeaveChoice = SrsSickLeaveChoice.EXTENSION
      }
    })
)

export default srsReducer
