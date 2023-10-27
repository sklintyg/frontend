import { createAction } from '@reduxjs/toolkit'
import { SrsAnswer, SrsPrediction, SrsPredictionInfo, SrsQuestion, ValueDiagnosisList } from '@frontend/common'
import { FunctionDisabler, TOGGLE_FUNCTION_DISABLER } from '../../utils/functionDisablerUtils'
import { SrsEvent, SrsInfoForDiagnosis, SrsSickLeaveChoice, SrsUserClientContext } from '@frontend/common/src/types/srs'

const SRS = '[SRS]'
export const setDiagnosisListValue = createAction<ValueDiagnosisList>(`${SRS} Set diagnosis list value`)

export const setDiagnosisCodes = createAction<string[]>(`${SRS} Set diagnosis codes`)

export const toggleSRSFunctionDisabler = createAction<FunctionDisabler>(`${SRS} ${TOGGLE_FUNCTION_DISABLER}`)

export const getSRSCodes = createAction(`${SRS} Get SRS codes`)

export const getSRSCodesStarted = createAction<ValueDiagnosisList>(`${SRS} Get SRS codes started`)

export const getSRSCodesError = createAction<ValueDiagnosisList>(`${SRS} Get SRS codes error`)

export const getSRSCodesSuccess = createAction<ValueDiagnosisList>(`${SRS} Get SRS codes success`)
export const getRecommendations = createAction<RecommendationsRequest>(`${SRS} Get recommendations`)

export const getRecommendationsStarted = createAction<ValueDiagnosisList>(`${SRS} Get recommendations started`)

export const getRecommendationsError = createAction(`${SRS} Get recommendations error`)

export const getRecommendationsSuccess = createAction<SrsInfoForDiagnosis>(`${SRS} Get recommendations success`)

export const updateRiskOpinion = createAction<string>(`${SRS} Update risk opinion`)

export const getQuestions = createAction<string>(`${SRS} Get questions`)

export const getQuestionsStarted = createAction(`${SRS} Get questions started`)

export const getQuestionsError = createAction(`${SRS} Get questions error`)

export const getQuestionsSuccess = createAction<SrsQuestion[]>(`${SRS} Get questions success`)

export const getPredictions = createAction<PredictionsRequest>(`${SRS} Get predictions`)

export const getPredictionsStarted = createAction(`${SRS} Get predictions started`)

export const getPredictionsError = createAction(`${SRS} Get predictions error`)

export const getPredictionsSuccess = createAction<SrsPredictionInfo>(`${SRS} Get predictions success`)

export const setRiskOpinion = createAction<RiskOpinionRequest>(`${SRS} Set risk opinion`)

export const setRiskOpinionStarted = createAction(`${SRS} Set risk opinion started`)

export const setRiskOpinionError = createAction(`${SRS} Set risk opinion error`)

export const setRiskOpinionSuccess = createAction<string>(`${SRS} Set risk opinion success`)

export const updateError = createAction<boolean>(`${SRS} Update error`)

export const updateSrsInfo = createAction<SrsInfoForDiagnosis | undefined>(`${SRS} Update recommendations for diagnosis`)

export const updatePatientId = createAction<string>(`${SRS} Update patient id`)

export const updateCertificateId = createAction<string>(`${SRS} Update certificate id`)

export const updateUnitId = createAction<string>(`${SRS} Update unit id`)

export const updateCareProviderId = createAction<string>(`${SRS} Update care giver id`)

export const updateSickLeaveChoice = createAction<SrsSickLeaveChoice>(`${SRS} Update sick leave choice`)

export const updateIsCertificateRenewed = createAction<boolean>(`${SRS} Update is certificate renewed`)

export const updateSrsQuestions = createAction<SrsQuestion[]>(`${SRS} Update SRS questions`)

export const updateSrsPredictions = createAction<SrsPrediction[]>(`${SRS} Update SRS predictions`)

export const updateSrsAnswers = createAction<SrsAnswer[]>(`${SRS} Update SRS answers`)

export const updateLoadingCodes = createAction<boolean>(`${SRS} Update loading codes`)

export const updateLoadingRecommendations = createAction<boolean>(`${SRS} Update loading recommendations`)

export const resetState = createAction(`${SRS} Reset state`)

export const logSrsInteraction = createAction<SrsEvent>(`${SRS} Log SRS interaction`)

export const logSrsInteractionStarted = createAction(`${SRS} Log SRS interaction started`)

export const logSrsInteractionError = createAction(`${SRS} Log SRS interaction error`)

export const logSrsInteractionSuccess = createAction<string>(`${SRS} Log SRS interaction success`)

export const updateHasUpdatedAnswers = createAction<boolean>(`${SRS} Update has updated answers`)

export const updateUserClientContext = createAction<SrsUserClientContext>(`${SRS} Update user client context`)

export const updateUserLaunchFromOrigin = createAction<string>(`${SRS} Update user launch from origin`)
export const updateLoggedCertificateId = createAction<string>(`${SRS} Update last logged ceritifcateId`)
export const updateHasLoadedSRSContent = createAction<boolean>(`${SRS} Update has loaded SRS content`)
export const updateHasLoggedMeasuresDisplayed = createAction<boolean>(`${SRS} Update has logged measures displayed`)

export interface RecommendationsRequest {
  patientId: string
  code: string
  certificateId: string
}

export interface PredictionsRequest {
  patientId: string
  code: string
  certificateId: string
  answers: SrsAnswer[]
  daysIntoSickLeave: number | undefined
}

export interface RiskOpinionRequest {
  patientId: string
  certificateId: string
  unitId: string
  careGiverId: string
  code: string
  riskOpinion: string
}
