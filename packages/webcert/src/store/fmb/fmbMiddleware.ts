import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  getFMBDiagnosisCodeInfo,
  getFMBDiagnosisCodeInfoError,
  getFMBDiagnosisCodeInfoStarted,
  getFMBDiagnosisCodeInfoSuccess,
  updateFMBDiagnosisCodeInfo,
  updateFMBDiagnosisCodeInfoList,
  updateFMBPanelActive,
} from '../fmb/fmbActions'
import { updateCertificate, updateCertificateDataElement } from '../certificate/certificateActions'
import {
  CertificateDataValueType,
  FMBDiagnosisCodeInfo,
  getResourceLink,
  ResourceLinkType,
  Value,
  ValueDiagnosisList,
} from '@frontend/common'

const handleGetFMBDiagnosisCodeInfo: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!getFMBDiagnosisCodeInfo.match(action)) {
    return
  }

  const diagnosisCodesWithoutDuplicates = Array.from(new Set<string>(action.payload))
  const existingDiagnosisCodes: FMBDiagnosisCodeInfo[] = []
  const nonExistingDiagnosisCodes: { diagnosisCode: string; index: number }[] = []
  const diagnosisCodes: FMBDiagnosisCodeInfo[] = getState().ui.uiFMB.fmbDiagnosisCodes

  diagnosisCodesWithoutDuplicates.forEach((diagnosisCode: string, index: number) => {
    let found = false
    diagnosisCodes.forEach((diagnosisCodeInfo: FMBDiagnosisCodeInfo) => {
      if (diagnosisCode === diagnosisCodeInfo.icd10Code) {
        found = true
        existingDiagnosisCodes.push(diagnosisCodeInfo)
      }
    })
    if (!found) {
      nonExistingDiagnosisCodes.push({ diagnosisCode, index })
    }
  })

  dispatch(updateFMBDiagnosisCodeInfoList(existingDiagnosisCodes))

  nonExistingDiagnosisCodes.forEach((diagnosis: { diagnosisCode: string; index: number }) => {
    dispatch(
      apiCallBegan({
        url: '/api/fmb/' + diagnosis.diagnosisCode,
        method: 'GET',
        onStart: getFMBDiagnosisCodeInfoStarted.type,
        onSuccess: getFMBDiagnosisCodeInfoSuccess.type,
        onError: getFMBDiagnosisCodeInfoError.type,
        onArgs: {
          index: diagnosis.index,
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

const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!updateCertificate.match(action)) {
    return
  }

  const fmbPanelActive = getResourceLink(action.payload.links, ResourceLinkType.FMB)
  dispatch(updateFMBPanelActive(fmbPanelActive !== undefined))

  if (!fmbPanelActive) {
    return
  }

  for (const questionId in action.payload.data) {
    const question = action.payload.data[questionId]
    getFMBDiagnosisCodes(question.value, dispatch)
  }
}

const handleUpdateCertificateDataElement: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => {
  return (action: AnyAction): void => {
    next(action)

    if (!updateCertificateDataElement.match(action)) {
      return
    }

    if (!getState().ui.uiFMB.fmbPanelActive) {
      return
    }

    getFMBDiagnosisCodes(action.payload.value, dispatch)
  }
}

function getFMBDiagnosisCodes(value: Value | null, dispatch: Dispatch): void {
  if (value && value.type === CertificateDataValueType.DIAGNOSIS_LIST) {
    const valueDiagnosisList = value as ValueDiagnosisList
    dispatch(getFMBDiagnosisCodeInfo(valueDiagnosisList.list.map((valueDiagnosis) => valueDiagnosis.code)))
  }
}

export const fmbMiddleware = [
  handleGetFMBDiagnosisCodeInfo,
  handleGetFMBDiagnosisCodeInfoSuccess,
  handleUpdateCertificate,
  handleUpdateCertificateDataElement,
]
