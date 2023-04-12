import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction, PayloadAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  getPredictions,
  getPredictionsError,
  getPredictionsStarted,
  getPredictionsSuccess,
  getQuestions,
  getQuestionsError,
  getQuestionsStarted,
  getQuestionsSuccess,
  getRecommendations,
  getRecommendationsError,
  getRecommendationsStarted,
  getRecommendationsSuccess,
  getSRSCodes,
  getSRSCodesError,
  getSRSCodesStarted,
  getSRSCodesSuccess,
  logSrsInteraction,
  logSrsInteractionError,
  logSrsInteractionStarted,
  logSrsInteractionSuccess,
  PredictionsRequest,
  RecommendationsRequest,
  resetState,
  RiskOpinionRequest,
  setDiagnosisCodes,
  setDiagnosisListValue,
  setRiskOpinion,
  setRiskOpinionError,
  setRiskOpinionStarted,
  setRiskOpinionSuccess,
  updateCareProviderId,
  updateCertificateId,
  updateError,
  updateIsCertificateRenewed,
  updateLoading,
  updatePatientId,
  updateSrsAnswers,
  updateSrsInfo,
  updateSrsPredictions,
  updateSrsQuestions,
  updateUnitId,
} from './srsActions'
import {
  Certificate,
  CertificateDataValueType,
  isRenewedChild,
  SrsEvent,
  SrsInfoForDiagnosis,
  SrsQuestion,
  ValueDiagnosisList,
} from '@frontend/common'
import { updateCertificate, updateCertificateDataElement } from '../certificate/certificateActions'
import { getMainDiagnosisCode } from '../../components/srs/srsUtils'

export const handleGetSRSCodes: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(
    apiCallBegan({
      url: '/api/srs/codes',
      method: 'GET',
      onStart: getSRSCodesStarted.type,
      onSuccess: getSRSCodesSuccess.type,
      onError: getSRSCodesError.type,
    })
  )
}

export const handleGetSRSCodesStarted: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(updateLoading(true))
}

export const handleGetSRSCodesError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(updateError(true))
  dispatch(updateLoading(false))
}

export const handleGetSRSCodesSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: PayloadAction<Record<string, string>>
): void => {
  dispatch(updateError(false))
  dispatch(setDiagnosisCodes(Object.values(action.payload)))
}

export const handleGetRecommendations: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: PayloadAction<RecommendationsRequest>
): void => {
  dispatch(
    apiCallBegan({
      url: `/api/srs/${action.payload.certificateId}/${action.payload.patientId}/${action.payload.code}?prediktion=false&atgard=true&statistik=true`,
      method: 'POST',
      data: [{ questionId: 'empty', answerId: 'empty' }],
      onStart: getRecommendationsStarted.type,
      onSuccess: getRecommendationsSuccess.type,
      onError: getRecommendationsError.type,
    })
  )
}

export const handleGetRecommendationsStarted: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(updateLoading(true))
}

export const handleGetRecommendationsError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(updateError(true))
  dispatch(updateLoading(false))
}

export const handleGetRecommendationsSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: PayloadAction<SrsInfoForDiagnosis>
): void => {
  dispatch(updateError(false))
  dispatch(updateSrsInfo(action.payload))
  dispatch(logSrsInteraction(SrsEvent.SRS_LOADED))
  dispatch(logSrsInteraction(SrsEvent.SRS_MEASURES_DISPLAYED))

  if (
    action.payload.predictions.length > 0 &&
    action.payload.predictions[0].questionsResponses &&
    action.payload.predictions[0].questionsResponses.length > 0
  ) {
    dispatch(updateSrsAnswers(action.payload.predictions[0].questionsResponses))
  }

  dispatch(updateLoading(false))
}

export const handleGetQuestions: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: PayloadAction<string>): void => {
  dispatch(
    apiCallBegan({
      url: `/api/srs/questions/${action.payload}`,
      method: 'GET',
      onStart: getQuestionsStarted.type,
      onSuccess: getQuestionsSuccess.type,
      onError: getQuestionsError.type,
    })
  )
}

export const handleGetQuestionsError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(updateError(true))
}

export const handleGetQuestionsSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: PayloadAction<SrsQuestion[]>
): void => {
  dispatch(updateError(false))
  dispatch(updateSrsQuestions(Object.values(action.payload)))
}

export const handleGetPredictions: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: PayloadAction<PredictionsRequest>
): void => {
  dispatch(
    apiCallBegan({
      url: `/api/srs/${action.payload.certificateId}/${action.payload.patientId}/${
        action.payload.code
      }?prediktion=true&atgard=false&statistik=false${
        action.payload.daysIntoSickLeave ? '&daysIntoSickLeave=' + action.payload.daysIntoSickLeave : ''
      }`,
      method: 'POST',
      data: action.payload.answers,
      onStart: getPredictionsStarted.type,
      onSuccess: getPredictionsSuccess.type,
      onError: getPredictionsError.type,
    })
  )
}

export const handleGetPredictionsError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(updateError(true))
}

export const handleGetPredictionsSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: PayloadAction<SrsInfoForDiagnosis>
): void => {
  dispatch(updateError(false))
  dispatch(updateSrsPredictions(action.payload.predictions))
  if (
    action.payload.predictions.length > 0 &&
    action.payload.predictions[0].questionsResponses &&
    action.payload.predictions[0].questionsResponses.length > 0
  ) {
    dispatch(updateSrsAnswers(action.payload.predictions[0].questionsResponses))
  }
}

export const handleSetRiskOpinion: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: PayloadAction<RiskOpinionRequest>
): void => {
  dispatch(
    apiCallBegan({
      url: `/api/srs/opinion/${action.payload.patientId}/${action.payload.careGiverId}/${action.payload.unitId}/${action.payload.certificateId}/${action.payload.code}`,
      method: 'PUT',
      data: action.payload.riskOpinion,
      headers: {
        'Content-Type': '',
      },
      onStart: setRiskOpinionStarted.type,
      onSuccess: setRiskOpinionSuccess.type,
      onError: setRiskOpinionError.type,
    })
  )
}

export const handleLogSrsInteraction: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (
  action: PayloadAction<SrsEvent>
): void => {
  const srsState = getState().ui.uiSRS
  dispatch(
    apiCallBegan({
      url: `/api/jslog/srs`,
      method: 'POST',
      data: {
        event: action.payload,
        info: {
          careUnitId: srsState.unitId,
          caregiverId: srsState.careProviderId,
          intygId: srsState.certificateId,
          mainDiagnosisCode: getMainDiagnosisCode(srsState.diagnosisListValue),
          userClientContext: 'SRS_UTK',
        },
      },
      onStart: logSrsInteractionStarted.type,
      onSuccess: logSrsInteractionSuccess.type,
      onError: logSrsInteractionError.type,
    })
  )
}

export const handleUpdateCertificateDataElement: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: PayloadAction<{ value: ValueDiagnosisList }>
): void => {
  if (action.payload.value.type === CertificateDataValueType.DIAGNOSIS_LIST) {
    dispatch(setDiagnosisListValue(action.payload.value))
    dispatch(updateSrsPredictions([]))
  }
}

const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch }) => () => (action: PayloadAction<Certificate>): void => {
  dispatch(resetState())

  dispatch(updatePatientId(action.payload.metadata.patient.personId.id.replace('-', '')))
  dispatch(updateCertificateId(action.payload.metadata.id))
  dispatch(updateIsCertificateRenewed(isRenewedChild(action.payload.metadata)))
  dispatch(updateUnitId(action.payload.metadata.careUnit.unitId))
  dispatch(updateCareProviderId(action.payload.metadata.careProvider.unitId))

  for (const questionId in action.payload.data) {
    if (Object.prototype.hasOwnProperty.call(action.payload.data, questionId)) {
      const question = action.payload.data[questionId]
      if (question.value?.type === CertificateDataValueType.DIAGNOSIS_LIST) {
        dispatch(setDiagnosisListValue(question.value))
      }
    }
  }
}

const middlewareMethods = {
  [getSRSCodes.type]: handleGetSRSCodes,
  [getSRSCodesError.type]: handleGetSRSCodesError,
  [getSRSCodesSuccess.type]: handleGetSRSCodesSuccess,
  [getSRSCodesStarted.type]: handleGetSRSCodesStarted,
  [getRecommendations.type]: handleGetRecommendations,
  [getRecommendationsStarted.type]: handleGetRecommendationsStarted,
  [getRecommendationsError.type]: handleGetRecommendationsError,
  [getRecommendationsSuccess.type]: handleGetRecommendationsSuccess,
  [getQuestions.type]: handleGetQuestions,
  [getQuestionsError.type]: handleGetQuestionsError,
  [getPredictions.type]: handleGetPredictions,
  [getPredictionsError.type]: handleGetPredictionsError,
  [getPredictionsSuccess.type]: handleGetPredictionsSuccess,
  [getQuestionsSuccess.type]: handleGetQuestionsSuccess,
  [setRiskOpinion.type]: handleSetRiskOpinion,
  [logSrsInteraction.type]: handleLogSrsInteraction,
  [updateCertificateDataElement.type]: handleUpdateCertificateDataElement,
  [updateCertificate.type]: handleUpdateCertificate,
}

export const srsMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
