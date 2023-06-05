import { createReducer } from '@reduxjs/toolkit'
import { FunctionDisabler, toggleFunctionDisabler } from '../../utils/functionDisablerUtils'
import {
  resetState,
  setDiagnosisCodes,
  setDiagnosisListValue,
  toggleSRSFunctionDisabler,
  updateCareProviderId,
  updateCertificateId,
  updateError,
  updateHasUpdatedAnswers,
  updateIsCertificateRenewed,
  updateLoadingCodes,
  updateLoadingRecommendations,
  updatePatientId,
  updateRiskOpinion,
  updateSickLeaveChoice,
  updateSrsAnswers,
  updateSrsInfo,
  updateSrsPredictions,
  updateSrsQuestions,
  updateUnitId,
} from './srsActions'
import { SrsAnswer, SrsInfoForDiagnosis, SrsPrediction, SrsQuestion, SrsSickLeaveChoice, ValueDiagnosisList } from '@frontend/common'
import { getFilteredPredictions } from '../../components/srs/srsUtils'

export interface SRSState {
  diagnosisListValue: ValueDiagnosisList | null
  functionDisablers: FunctionDisabler[]
  diagnosisCodes: string[]
  srsInfo: SrsInfoForDiagnosis | undefined
  srsQuestions: SrsQuestion[]
  error: boolean
  patientId: string
  certificateId: string
  unitId: string
  careProviderId: string
  sickLeaveChoice: SrsSickLeaveChoice
  isCertificateRenewed: boolean
  srsPredictions: SrsPrediction[]
  riskOpinion: string
  loadingCodes: boolean
  loadingRecommendations: boolean
  answers: SrsAnswer[]
  hasUpdatedAnswers: boolean
}

const getInitialState = (functionDisablers?: FunctionDisabler[]): SRSState => {
  return {
    diagnosisListValue: null,
    functionDisablers: functionDisablers ? functionDisablers : [],
    diagnosisCodes: [],
    error: false,
    srsInfo: undefined,
    patientId: '',
    certificateId: '',
    unitId: '',
    careProviderId: '',
    sickLeaveChoice: SrsSickLeaveChoice.NEW,
    isCertificateRenewed: false,
    srsQuestions: [],
    srsPredictions: [],
    riskOpinion: '',
    loadingCodes: false,
    loadingRecommendations: false,
    answers: [],
    hasUpdatedAnswers: true,
  }
}

const srsReducer = createReducer(getInitialState(), (builder) =>
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

      const predictions = action.payload ? action.payload.predictions : []
      if (predictions.length > 0) {
        const filteredPredictions = getFilteredPredictions(predictions)
        state.riskOpinion = filteredPredictions[0].physiciansOwnOpinionRisk
      }
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
    .addCase(updateSrsQuestions, (state, action) => {
      state.srsQuestions = action.payload
    })
    .addCase(updateSrsPredictions, (state, action) => {
      state.srsPredictions = action.payload
    })
    .addCase(updateRiskOpinion, (state, action) => {
      state.riskOpinion = action.payload
    })
    .addCase(updateUnitId, (state, action) => {
      state.unitId = action.payload
    })
    .addCase(updateCareProviderId, (state, action) => {
      state.careProviderId = action.payload
    })
    .addCase(updateLoadingCodes, (state, action) => {
      state.loadingCodes = action.payload
    })
    .addCase(updateLoadingRecommendations, (state, action) => {
      state.loadingRecommendations = action.payload
    })
    .addCase(updateSrsAnswers, (state, action) => {
      state.answers = action.payload
    })
    .addCase(updateIsCertificateRenewed, (state, action) => {
      state.isCertificateRenewed = action.payload
      if (action.payload) {
        state.sickLeaveChoice = SrsSickLeaveChoice.EXTENSION
      }
    })
    .addCase(updateHasUpdatedAnswers, (state, action) => {
      state.hasUpdatedAnswers = action.payload
    })
    .addCase(resetState, (state) => getInitialState(state.functionDisablers))
)

export default srsReducer
