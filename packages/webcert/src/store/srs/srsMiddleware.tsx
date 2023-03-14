import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction, PayloadAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  getRecommendations,
  getRecommendationsError,
  getRecommendationsStarted,
  getRecommendationsSuccess,
  getSRSCodes,
  getSRSCodesError,
  getSRSCodesStarted,
  getSRSCodesSuccess,
  RecommendationsRequest,
  setDiagnosisCodes,
  setDiagnosisListValue,
  updateCertificateId,
  updateError,
  updateIsCertificateRenewed,
  updatePatientId,
  updateSrsInfo,
} from './srsActions'
import { Certificate, CertificateDataValueType, ValueDiagnosisList, SrsInfoForDiagnosis, isRenewedChild } from '@frontend/common'
import { updateCertificate, updateCertificateDataElement } from '../certificate/certificateActions'

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

export const handleGetSRSCodesError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(updateError(true))
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

export const handleGetRecommendationsError: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (): void => {
  dispatch(updateError(true))
}

export const handleGetRecommendationsSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: PayloadAction<SrsInfoForDiagnosis>
): void => {
  dispatch(updateError(false))
  dispatch(updateSrsInfo(action.payload))
}

export const handleUpdateCertificateDataElement: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: PayloadAction<{ value: ValueDiagnosisList }>
): void => {
  if (action.payload.value.type === CertificateDataValueType.DIAGNOSIS_LIST) {
    dispatch(setDiagnosisListValue(action.payload.value))
  }
}

const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch }) => () => (action: PayloadAction<Certificate>): void => {
  dispatch(updatePatientId(action.payload.metadata.patient.personId.id.replace('-', '')))
  dispatch(updateCertificateId(action.payload.metadata.id))
  dispatch(updateIsCertificateRenewed(isRenewedChild(action.payload.metadata)))

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
  [getRecommendations.type]: handleGetRecommendations,
  [getRecommendationsError.type]: handleGetRecommendationsError,
  [getRecommendationsSuccess.type]: handleGetRecommendationsSuccess,
  [updateCertificateDataElement.type]: handleUpdateCertificateDataElement,
  [updateCertificate.type]: handleUpdateCertificate,
}

export const srsMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
