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
  validateSickLeaveLength,
  validateSickLeaveLengthError,
  validateSickLeaveLengthStarted,
  validateSickLeaveLengthSuccess,
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

function getValidationForSickLeavePeriod(
  value: Value | null,
  personId: string,
  certificate: Certificate,
  dispatch: Dispatch<AnyAction>
): void {
  let diagnoses = null
  let dateRangeList = null
  if (value && value.type === CertificateDataValueType.DATE_RANGE_LIST) {
    dateRangeList = value
    for (const questionId in certificate.data) {
      const question = certificate.data[questionId]
      if (question.value && question.value!.type === CertificateDataValueType.DIAGNOSIS_LIST) {
        diagnoses = question.value
        break
      }
    }
  } else if (value && value.type === CertificateDataValueType.DIAGNOSIS_LIST) {
    diagnoses = value
    for (const questionId in certificate.data) {
      const question = certificate.data[questionId]
      if (question.value && question.value!.type === CertificateDataValueType.DATE_RANGE_LIST) {
        dateRangeList = question.value
        break
      }
    }
  } else {
    return
  }

  if (diagnoses) {
    const diagnosisCodes: string[] = []
    ;(diagnoses as ValueDiagnosisList).list.forEach((diagnosis, index) => {
      diagnosisCodes[index] = diagnosis.code
    })
    dispatch(
      validateSickLeaveLength({
        icd10Codes: diagnosisCodes,
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

    getValidationForSickLeavePeriod(
      action.payload.value,
      getState().ui.uiCertificate.certificate.metadata.patient.personId.id,
      getState().ui.uiCertificate.certificate,
      dispatch
    )
    getFMBDiagnosisCodes(action.payload.value, getState().ui.uiFMB.fmbDiagnosisCodeInfo, dispatch)
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
    if (exists) {
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

export const handleValidateSickLeaveLength: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (!validateSickLeaveLength.match(action)) {
    return
  }

  console.log(action.payload)

  dispatch(
    apiCallBegan({
      url: '/api/fmb/validateSickLeavePeriod',
      method: 'POST',
      data: action.payload,
      onStart: validateSickLeaveLengthStarted.type,
      onSuccess: validateSickLeaveLengthSuccess.type,
      onError: validateSickLeaveLengthError.type,
    })
  )
}

export const handleValidateSickLeaveLengthSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => (next) => (
  action: AnyAction
): void => {
  next(action)

  if (!validateSickLeaveLengthSuccess.match(action)) {
    return
  }

  dispatch(setSickLeavePeriodWarning(action.payload.message))
}

export const fmbMiddleware = [
  handleGetFMBDiagnosisCodeInfo,
  handleGetFMBDiagnosisCodeInfoSuccess,
  handleUpdateCertificate,
  handleUpdateCertificateDataElement,
  handleValidateSickLeaveLength,
  handleValidateSickLeaveLengthSuccess,
]
