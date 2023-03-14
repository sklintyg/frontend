import { CertificateDataValueType, ValueType, ValueDiagnosisList } from '@frontend/common'
import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { apiCallBegan } from '../api/apiActions'
import { updateCertificate, updateCertificateDataElement } from '../certificate/certificateActions'
import { throwError } from '../error/errorActions'
import { createSilentErrorRequestFromApiError } from '../error/errorCreator'
import {
  getIcfCodes,
  getIcfCodesError,
  getIcfCodesStarted,
  getIcfCodesSuccess,
  setOriginalIcd10Codes,
  toggleIcfFunctionDisabler,
  updateIcfCodes,
} from './icfActions'

export const handleGetIcfCodes: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/icf',
      method: 'POST',
      data: action.payload,
      onStart: getIcfCodesStarted.type,
      onSuccess: getIcfCodesSuccess.type,
      onError: getIcfCodesError.type,
      functionDisablerType: toggleIcfFunctionDisabler.type,
    })
  )
}

const handleGetIcfCodesStarted: Middleware<Dispatch> = () => () => (): void => {
  return
}

export const handleGetIcfCodesSuccess: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(updateIcfCodes(action.payload))
}

const handleGetIcfCodesError: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(throwError(createSilentErrorRequestFromApiError(action.payload.error)))
}

function handleUpdateIcfState(value: ValueType, dispatch: Dispatch<AnyAction>) {
  const icdCodes = getIcdCodesFromQuestionValue(value)

  if (icdCodes) {
    dispatch(getIcfCodes({ icdCodes: icdCodes }))
    dispatch(setOriginalIcd10Codes(icdCodes))
  }
}

const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  for (const questionId in action.payload.data) {
    if (Object.prototype.hasOwnProperty.call(action.payload.data, questionId)) {
      const question = action.payload.data[questionId]
      handleUpdateIcfState(question.value, dispatch)
    }
  }
}

const handleUpdateCertificateDataElement: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  handleUpdateIcfState(action.payload.value, dispatch)
}

function getIcdCodesFromQuestionValue(value: ValueType | null): string[] | undefined {
  if (value && value.type === CertificateDataValueType.DIAGNOSIS_LIST) {
    return (value as ValueDiagnosisList).list.filter((code) => code.terminology.toLowerCase().includes('icd')).map((code) => code.code)
  } else {
    return undefined
  }
}

const middlewareMethods = {
  [getIcfCodes.type]: handleGetIcfCodes,
  [getIcfCodesStarted.type]: handleGetIcfCodesStarted,
  [getIcfCodesSuccess.type]: handleGetIcfCodesSuccess,
  [getIcfCodesError.type]: handleGetIcfCodesError,
  [updateCertificate.type]: handleUpdateCertificate,
  [updateCertificateDataElement.type]: handleUpdateCertificateDataElement,
}

export const icfMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
