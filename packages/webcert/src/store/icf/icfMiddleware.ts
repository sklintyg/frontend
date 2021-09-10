import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  getIcfCodes,
  getIcfCodesError,
  getIcfCodesStarted,
  getIcfCodesSuccess,
  IcfRequest,
  updateIcfCodes,
  updateLoading,
} from './icfActions'
import { updateCertificate, updateCertificateDataElement } from '../certificate/certificateActions'
import { CertificateDataValueType, ConfigTypes, FMBDiagnosisCodeInfo, Value, ValueDiagnosisList } from '@frontend/common'

export const handleGetIcfCodes: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getIcfCodes.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/icf',
      method: 'POST',
      data: action.payload,
      onStart: getIcfCodesStarted.type,
      onSuccess: getIcfCodesSuccess.type,
      onError: getIcfCodesError.type,
    })
  )
}

export const handleGetIcfCodesSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getIcfCodesSuccess.match(action)) {
    return
  }

  dispatch(updateLoading(false))
  dispatch(updateIcfCodes(action.payload))
}

const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!updateCertificate.match(action)) {
    return
  }

  //Hämta icf data när intyget laddas in
  for (const questionId in action.payload.data) {
    if (action.payload.data.hasOwnProperty(questionId)) {
      const question = action.payload.data[questionId]
      getFMBDiagnosisCodes(question.value, dispatch)
    }
  }
}

export const handleUpdateCertificateDataElement: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => {
  return (action: AnyAction): void => {
    next(action)

    if (!updateCertificateDataElement.match(action)) {
      return
    }
    //om icd kod ändras så ska vi hämta ny icf data

    if (!(action.payload.config.type === ConfigTypes.UE_DIAGNOSES)) {
      return
    }
    const icdCodes = { icdCodes: (action.payload.value as ValueDiagnosisList).list.map((code) => code.code) } as IcfRequest
    dispatch(getIcfCodes(icdCodes))
  }
}

const handleGetIcfCodesStarted: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getIcfCodesStarted.match(action)) {
    return
  }

  dispatch(updateLoading(true))
}

const handleGetIcfCodesError: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getIcfCodesError.match(action)) {
    return
  }

  dispatch(updateLoading(false))
}

function getFMBDiagnosisCodes(value: Value | null, dispatch: Dispatch): void {
  if (value && value.type === CertificateDataValueType.DIAGNOSIS_LIST) {
    const icdCodes = (value as ValueDiagnosisList).list.map((code) => code.code)
    dispatch(getIcfCodes({ icdCodes: icdCodes }))
  }
}

export const icfMiddleware = [
  handleGetIcfCodes,
  handleUpdateCertificate,
  handleUpdateCertificateDataElement,
  handleGetIcfCodesStarted,
  handleGetIcfCodesSuccess,
  handleGetIcfCodesError,
]
