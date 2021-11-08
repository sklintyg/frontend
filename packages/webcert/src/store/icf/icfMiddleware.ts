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
import { CertificateDataValueType, ConfigTypes, Value, ValueDiagnosisList } from '@frontend/common'
import { getSessionStatusError, getSessionStatusSuccess } from '../session/sessionActions'
import { getUserSuccess } from '../user/userActions'

export const handleGetIcfCodes: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
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

export const handleGetIcfCodesSuccess: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(updateLoading(false))
  dispatch(updateIcfCodes(action.payload))
}

const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  for (const questionId in action.payload.data) {
    if (action.payload.data.hasOwnProperty(questionId)) {
      const question = action.payload.data[questionId]
      const icdCodes = getIcdCodesFromQuestionValue(question.value)

      if (icdCodes && icdCodes.length > 0) {
        dispatch(getIcfCodes({ icdCodes: icdCodes }))
      }
    }
  }
}

export const handleUpdateCertificateDataElement: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: AnyAction
): void => {
  if (!(action.payload.config.type === ConfigTypes.UE_DIAGNOSES)) {
    return
  }
  const icdCodes = { icdCodes: (action.payload.value as ValueDiagnosisList).list.map((code) => code.code) } as IcfRequest
  dispatch(getIcfCodes(icdCodes))
}

const handleGetIcfCodesStarted: Middleware<Dispatch> = ({ dispatch }) => () => (): void => {
  dispatch(updateLoading(true))
}

const handleGetIcfCodesError: Middleware<Dispatch> = ({ dispatch }) => () => (): void => {
  dispatch(updateLoading(false))
}

function getIcdCodesFromQuestionValue(value: Value | null): string[] | undefined {
  if (value && value.type === CertificateDataValueType.DIAGNOSIS_LIST) {
    return (value as ValueDiagnosisList).list.map((code) => code.code)
  }
}

const middlewareMethods = {
  [getIcfCodes.type]: handleGetIcfCodes,
  [updateCertificate.type]: handleUpdateCertificate,
  [updateCertificateDataElement.type]: handleUpdateCertificateDataElement,
  [getSessionStatusSuccess.type]: handleGetIcfCodesStarted,
  [getSessionStatusError.type]: handleGetIcfCodesSuccess,
  [getUserSuccess.type]: handleGetIcfCodesError,
}

export const icfMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
