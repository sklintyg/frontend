import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  getFMBDiagnosisCodeInfo,
  getFMBDiagnosisCodeInfoError,
  getFMBDiagnosisCodeInfoStarted,
  getFMBDiagnosisCodeInfoSuccess,
  removeFMBDiagnosisCodeInfo,
  updateFMBDiagnosisCodeInfo,
} from '../fmb/fmbActions'
import { updateCertificateDataElement } from '../certificate/certificateActions'
import { CertificateDataValueType, FMBDiagnosisCodeInfo, ValueDiagnosisList } from '@frontend/common'

const handleGetFMBDiagnosisCodeInfo: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!getFMBDiagnosisCodeInfo.match(action)) {
    return
  }

  const diagnosisCodes: FMBDiagnosisCodeInfo[] = getState().ui.uiFMB.fmbDiagnosisCodes
  diagnosisCodes.forEach((diagnosisCodeInfo: FMBDiagnosisCodeInfo) => {
    let found = false;
    action.payload.forEach((diagnosisCode: string) => {
      if (diagnosisCodeInfo.icd10Code === diagnosisCode) {
        found = true;
      }
    })
    if (!found) {
      dispatch(removeFMBDiagnosisCodeInfo(diagnosisCodeInfo.icd10Code))
    }
  })

  action.payload.forEach((diagnosisCode: string, index: number) => {
    dispatch(
      apiCallBegan({
        url: '/api/fmb/' + diagnosisCode,
        method: 'GET',
        onStart: getFMBDiagnosisCodeInfoStarted.type,
        onSuccess: getFMBDiagnosisCodeInfoSuccess.type,
        onError: getFMBDiagnosisCodeInfoError.type,
        onArgs: {
          index: index,
        },
      })
    )
  })
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
      dispatch(getFMBDiagnosisCodeInfo(valueDiagnosisList.list.map(valueDiagnosis => valueDiagnosis.code)))
    }
  }
}

export const fmbMiddleware = [handleGetFMBDiagnosisCodeInfo, handleGetFMBDiagnosisCodeInfoSuccess, handleUpdateCertificateDataElement]
