import { createReducer } from '@reduxjs/toolkit'
import { getFilteredPredictions } from '../../components/srs/srsUtils'
import type { SrsAnswer, SrsInfoForDiagnosis, SrsPrediction, SrsQuestion, ValueDiagnosisList } from '../../types'
import { SrsSickLeaveChoice, SrsUserClientContext } from '../../types'
import {
  resetState,
  setDiagnosisCodes,
  setDiagnosisListValue,
  updateCareProviderId,
  updateCertificateId,
  updateError,
  updateHasLoadedSRSContent,
  updateHasLoggedMeasuresDisplayed,
  updateHasUpdatedAnswers,
  updateIsCertificateRenewed,
  updateLoadingCodes,
  updateLoadingRecommendations,
  updateLoggedCertificateId,
  updatePatientId,
  updateRiskOpinion,
  updateSickLeaveChoice,
  updateSrsAnswers,
  updateSrsInfo,
  updateSrsPredictions,
  updateSrsQuestions,
  updateUnitId,
  updateUserClientContext,
  updateUserLaunchFromOrigin,
} from './srsActions'

export interface SRSState {
  diagnosisListValue: ValueDiagnosisList | null
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
  userClientContext: SrsUserClientContext | undefined
  userLaunchFromOrigin: string
  loggedCertificateId: string
  hasLoadedSRSContent: boolean
  hasLoggedMeasuresDisplayed: boolean
}

const getInitialState = (): SRSState => {
  return {
    diagnosisListValue: null,
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
    userClientContext: undefined,
    userLaunchFromOrigin: '',
    loggedCertificateId: '',
    hasLoadedSRSContent: false,
    hasLoggedMeasuresDisplayed: false,
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
        state.userClientContext = SrsUserClientContext.SRS_FRL
      }
    })
    .addCase(updateHasUpdatedAnswers, (state, action) => {
      state.hasUpdatedAnswers = action.payload
    })
    .addCase(resetState, () => getInitialState())
    .addCase(updateUserClientContext, (state, action) => {
      state.userClientContext = action.payload
    })
    .addCase(updateUserLaunchFromOrigin, (state, action) => {
      state.userLaunchFromOrigin = action.payload
    })
    .addCase(updateLoggedCertificateId, (state, action) => {
      state.loggedCertificateId = action.payload
    })
    .addCase(updateHasLoadedSRSContent, (state, action) => {
      state.hasLoadedSRSContent = action.payload
    })
    .addCase(updateHasLoggedMeasuresDisplayed, (state, action) => {
      state.hasLoggedMeasuresDisplayed = action.payload
    })
)

export default srsReducer
