import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import { getIcfCodes, getIcfCodesError, getIcfCodesStarted, getIcfCodesSuccess, IcfRequest, updateIcfCodes } from './icfActions'
import { updateCertificate, updateCertificateDataElement } from '../certificate/certificateActions'
import { ConfigTypes, FMBDiagnosisCodeInfo, ValueDiagnosisList } from '@frontend/common'

export const handleGetIcfCodes: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getIcfCodes.match(action)) {
    return
  }
  console.log('api call', action.payload)
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

  dispatch(updateIcfCodes(action.payload))
}

const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!updateCertificate.match(action)) {
    return
  }

  //Hämta icf data när intyget laddas in
  /*if (getState().ui.uiCertificate.certificate)
    }*/
  if (getState().ui.uiFMB.fmbDiagnosisCodeInfo.length > 0) {
    console.log(getState().ui.uiFMB.fmbDiagnosisCodeInfo)
    const icdCodes = getState().ui.uiFMB.fmbDiagnosisCodeInfo.map((icdCode: FMBDiagnosisCodeInfo) => icdCode.icd10Code) as IcfRequest
    dispatch(getIcfCodes(icdCodes))
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
    console.log(action.payload.value)
    const icdCodes = { icdCodes: (action.payload.value as ValueDiagnosisList).list.map((code) => code.code) } as IcfRequest
    console.log('icdCodes', icdCodes)
    dispatch(getIcfCodes(icdCodes))
  }
}

export const icfMiddleware = [handleGetIcfCodes, handleGetIcfCodesSuccess, handleUpdateCertificate, handleUpdateCertificateDataElement]
