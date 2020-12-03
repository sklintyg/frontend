import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  getFMBDiagnosisCodeInfo,
  getFMBDiagnosisCodeInfoError,
  getFMBDiagnosisCodeInfoStarted,
  getFMBDiagnosisCodeInfoSuccess,
  updateFMBDiagnosisCodeInfo,
} from '../fmb/fmbActions'
import { updateCertificateDataElement } from '../certificate/certificateActions'
import { CertificateDataValueType, ValueDiagnosisList } from '@frontend/common'

const handleGetFMBDiagnosisCodeInfo: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!getFMBDiagnosisCodeInfo.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/fmb/' + action.payload,
      method: 'GET',
      onStart: getFMBDiagnosisCodeInfoStarted.type,
      onSuccess: getFMBDiagnosisCodeInfoSuccess.type,
      onError: getFMBDiagnosisCodeInfoError.type,
    })
  )
}

const handleGetFMBDiagnosisCodeInfoSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getFMBDiagnosisCodeInfoSuccess.match(action)) {
    return
  }

  dispatch(updateFMBDiagnosisCodeInfo(action.payload))
}

const handleUpdateCertificateDataElement: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => {
  return (action: AnyAction): void => {
    next(action)

    if (!updateCertificateDataElement.match(action)) {
      return
    }

    if (action.payload.value && action.payload.value.type === CertificateDataValueType.DIAGNOSIS_LIST) {
      const valueDiagnosisList = action.payload.value as ValueDiagnosisList
      valueDiagnosisList.list.forEach((valueDiagnosis) => dispatch(getFMBDiagnosisCodeInfo(valueDiagnosis.code)))
    }
  }
}

export const fmbMiddleware = [handleGetFMBDiagnosisCodeInfo, handleGetFMBDiagnosisCodeInfoSuccess, handleUpdateCertificateDataElement]
