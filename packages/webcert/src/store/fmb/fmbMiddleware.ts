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
} from '../fmb/fmbActions'
import { FMBDiagnosisCodeInfo } from '@frontend/common'

const handleGetFMBDiagnosisCodeInfo: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!getState().ui.uiFMB.fmbPanelActive || !getFMBDiagnosisCodeInfo.match(action)) {
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

export const fmbMiddleware = [handleGetFMBDiagnosisCodeInfo, handleGetFMBDiagnosisCodeInfoSuccess]
