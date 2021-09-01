import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan } from '../api/apiActions'
import {
  FMBDiagnoseRequest,
  getFMBDiagnosisCodeInfo,
  getFMBDiagnosisCodeInfoError,
  getFMBDiagnosisCodeInfoStarted,
  getFMBDiagnosisCodeInfoSuccess,
  removeFMBDiagnosisCodes,
  setSickLeavePeriodWarning,
  updateFMBDiagnosisCodeInfo,
  updateFMBPanelActive,
  validateSickLeavePeriod,
  validateSickLeavePeriodError,
  validateSickLeavePeriodStarted,
  validateSickLeavePeriodSuccess,
} from './fmbActions'
import { updateCertificate, updateCertificateDataElement } from '../certificate/certificateActions'
import {
  CertificateDataValueType,
  FMBDiagnosisCodeInfo,
  getResourceLink,
  ResourceLinkType,
  Value,
  ValueDiagnosisList,
} from '@frontend/common'
import { Certificate, ValueDateRangeList } from '@frontend/common/src'

export const handleGetFMBDiagnosisCodeInfo: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getFMBDiagnosisCodeInfo.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/fmb/' + action.payload.icd10Code,
      method: 'GET',
      onStart: getFMBDiagnosisCodeInfoStarted.type,
      onSuccess: getFMBDiagnosisCodeInfoSuccess.type,
      onError: getFMBDiagnosisCodeInfoError.type,
      onArgs: {
        ...action.payload,
      },
    })
  )
}

export const handleGetFMBDiagnosisCodeInfoSuccess: Middleware<Dispatch> = ({ dispatch }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!getFMBDiagnosisCodeInfoSuccess.match(action)) {
    return
  }

  dispatch(updateFMBDiagnosisCodeInfo(action.payload))
}

const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch, getState }) => (next) => (action: AnyAction): void => {
  next(action)

  if (!updateCertificate.match(action)) {
    return
  }

  const fmbPanelActive = getResourceLink(action.payload.links, ResourceLinkType.FMB)?.enabled
  dispatch(updateFMBPanelActive(fmbPanelActive))

  if (!fmbPanelActive) {
    return
  }

  for (const questionId in action.payload.data) {
    if (action.payload.data.hasOwnProperty(questionId)) {
      const question = action.payload.data[questionId]
      getFMBDiagnosisCodes(question.value, getState().ui.uiFMB.fmbDiagnosisCodeInfo, dispatch)
    }
  }
}

function isValueDiagnosisList(value: Value | null) {
  return value && value.type === CertificateDataValueType.DIAGNOSIS_LIST
}

function isValueDateRangeList(value: Value | null) {
  return value && value.type === CertificateDataValueType.DATE_RANGE_LIST
}

function isValueListNotEmpty(value: ValueDiagnosisList | ValueDateRangeList) {
  return value && value.list.length > 0
}

function getDiagnosisCodes(diagnoses: ValueDiagnosisList) {
  const diagnosisCodes: string[] = []
  diagnoses.list.forEach((diagnosis, index) => {
    diagnosisCodes[index] = diagnosis.code
  })
  return diagnosisCodes
}

function getValidationForSickLeavePeriod(
  value: Value | null,
  personId: string,
  certificate: Certificate,
  dispatch: Dispatch<AnyAction>
): void {
  let diagnoses = null
  let dateRangeList = null

  if (isValueDateRangeList(value)) {
    dateRangeList = value
    for (const questionId in certificate.data) {
      const question = certificate.data[questionId]
      if (isValueDiagnosisList(question.value)) {
        diagnoses = question.value
        break
      }
    }
  } else if (isValueDiagnosisList(value)) {
    diagnoses = value
    for (const questionId in certificate.data) {
      const question = certificate.data[questionId]
      if (isValueDateRangeList(question.value)) {
        dateRangeList = question.value
        break
      }
    }
  } else {
    return
  }

  if (isValueListNotEmpty(diagnoses as ValueDiagnosisList) && isValueListNotEmpty(dateRangeList as ValueDateRangeList)) {
    dispatch(
      validateSickLeavePeriod({
        icd10Codes: getDiagnosisCodes(diagnoses as ValueDiagnosisList),
        personId: personId,
        dateRangeList: dateRangeList as ValueDateRangeList,
      })
    )
  }
}

export const handleUpdateCertificateDataElement: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => (next) => {
  return (action: AnyAction): void => {
    next(action)

    if (!updateCertificateDataElement.match(action)) {
      return
    }

    if (!getState().ui.uiFMB.fmbPanelActive) {
      return
    }

    getFMBDiagnosisCodes(action.payload.value, getState().ui.uiFMB.fmbDiagnosisCodeInfo, dispatch)

    if (
      action.payload.value &&
      getState().ui.uiCertificate.certificate &&
      (action.payload.value.type === CertificateDataValueType.DATE_RANGE_LIST ||
        action.payload.value.type === CertificateDataValueType.DIAGNOSIS_LIST)
    ) {
      getValidationForSickLeavePeriod(
        action.payload.value,
        getState().ui.uiCertificate.certificate.metadata.patient.personId.id,
        getState().ui.uiCertificate.certificate,
        dispatch
      )
    }
  }
}

function getFMBDiagnosisCodes(value: Value | null, existingFMBDiagnosisCodeInfo: FMBDiagnosisCodeInfo[], dispatch: Dispatch): void {
  if (value && value.type === CertificateDataValueType.DIAGNOSIS_LIST) {
    const valueDiagnosisList = value as ValueDiagnosisList
    removeFMBForRemovedDiagnosisCodes(existingFMBDiagnosisCodeInfo, valueDiagnosisList, dispatch)
    retrieveFMBForAddedDiagnosisCodes(existingFMBDiagnosisCodeInfo, valueDiagnosisList, dispatch)
  }
}

function removeFMBForRemovedDiagnosisCodes(
  existingFMBDiagnosisCodeInfo: FMBDiagnosisCodeInfo[],
  valueDiagnosisList: ValueDiagnosisList,
  dispatch: Dispatch
) {
  existingFMBDiagnosisCodeInfo.forEach((existing) => {
    const remove = valueDiagnosisList.list.findIndex((diagnosis) => existing.icd10Code === diagnosis.code) < 0
    if (remove) {
      dispatch(removeFMBDiagnosisCodes(existing))
    }
  })
}

function retrieveFMBForAddedDiagnosisCodes(
  existingFMBDiagnosisCodeInfo: FMBDiagnosisCodeInfo[],
  valueDiagnosisList: ValueDiagnosisList,
  dispatch: Dispatch
) {
  valueDiagnosisList.list.forEach((diagnosis, index) => {
    const exists = existingFMBDiagnosisCodeInfo.findIndex((existing) => existing.icd10Code === diagnosis.code) > -1
    if (exists || !diagnosis.code) {
      return
    }

    const fmbDiagnoseRequest: FMBDiagnoseRequest = {
      index: index,
      icd10Code: diagnosis.code,
      icd10Description: diagnosis.description,
    }

    dispatch(getFMBDiagnosisCodeInfo(fmbDiagnoseRequest))
  })
}

export const handleValidateSickLeavePeriod: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!validateSickLeavePeriod.match(action)) {
    return
  }

  dispatch(
    apiCallBegan({
      url: '/api/fmb/validateSickLeavePeriod',
      method: 'POST',
      data: action.payload,
      onStart: validateSickLeavePeriodStarted.type,
      onSuccess: validateSickLeavePeriodSuccess.type,
      onError: validateSickLeavePeriodError.type,
    })
  )
}

export const handleValidateSickLeavePeriodSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!validateSickLeavePeriodSuccess.match(action)) {
    return
  }

  dispatch(setSickLeavePeriodWarning(action.payload.message))
}

export const fmbMiddleware = [
  handleGetFMBDiagnosisCodeInfo,
  handleGetFMBDiagnosisCodeInfoSuccess,
  handleUpdateCertificate,
  handleUpdateCertificateDataElement,
  handleValidateSickLeavePeriod,
  handleValidateSickLeavePeriodSuccess,
]
