import { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { AnyAction } from '@reduxjs/toolkit'
import { apiCallBegan, apiGenericError, apiSilentGenericError } from '../api/apiActions'
import {
  FMBDiagnoseRequest,
  getFMBDiagnosisCodeInfo,
  getFMBDiagnosisCodeInfoError,
  getFMBDiagnosisCodeInfoStarted,
  getFMBDiagnosisCodeInfoSuccess,
  removeFMBDiagnosisCodes,
  setDiagnosisListValue,
  setPatientId,
  setSickLeavePeriodValue,
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
  ValueDateRangeList,
  ValueDiagnosisList,
} from '@frontend/common'

export const handleGetFMBDiagnosisCodeInfo: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/fmb/' + action.payload.icd10Code,
      method: 'GET',
      onStart: getFMBDiagnosisCodeInfoStarted.type,
      onSuccess: getFMBDiagnosisCodeInfoSuccess.type,
      onError: apiSilentGenericError.type,
      onArgs: {
        originalIcd10Code: action.payload.icd10Code,
        originalIcd10Description: action.payload.icd10Description,
        index: action.payload.index,
      },
    })
  )
}

export const handleGetFMBDiagnosisCodeInfoSuccess: Middleware<Dispatch> = ({ dispatch }) => () => (action: AnyAction): void => {
  dispatch(updateFMBDiagnosisCodeInfo(action.payload))
}

const handleUpdateCertificate: Middleware<Dispatch> = ({ dispatch, getState }) => () => (action: AnyAction): void => {
  const fmbPanelActive = getResourceLink(action.payload.links, ResourceLinkType.FMB)?.enabled
  dispatch(updateFMBPanelActive(fmbPanelActive))

  if (!fmbPanelActive) {
    return
  }

  dispatch(setPatientId(action.payload.metadata.patient.personId.id))

  for (const questionId in action.payload.data) {
    if (action.payload.data.hasOwnProperty(questionId)) {
      const question = action.payload.data[questionId]
      if (isValueDateRangeList(question.value)) {
        dispatch(setSickLeavePeriodValue(question.value as ValueDateRangeList))
      }
      if (isValueDiagnoses(question.value)) {
        dispatch(setDiagnosisListValue(question.value as ValueDiagnosisList))
      }
      getFMBDiagnosisCodes(question.value, getState().ui.uiFMB.fmbDiagnosisCodeInfo, dispatch)
    }
  }

  getValidationForSickLeavePeriod(
    getState().ui.uiFMB.patientId,
    getState().ui.uiFMB.sickLeavePeriodValue,
    getState().ui.uiFMB.diagnosisListValue,
    dispatch
  )
}

function isValueDiagnoses(value: Value | null) {
  return value && value.type === CertificateDataValueType.DIAGNOSIS_LIST
}

function isValueDateRangeList(value: Value | null) {
  return value && value.type === CertificateDataValueType.DATE_RANGE_LIST
}

function getDiagnosisCodes(diagnoses: ValueDiagnosisList) {
  const diagnosisCodes: string[] = []
  diagnoses.list.forEach((diagnosis, index) => {
    diagnosisCodes[index] = diagnosis.code
  })
  return diagnosisCodes
}

function getValidationForSickLeavePeriod(
  personId: string,
  sickLeaveValue: ValueDateRangeList,
  diagnoses: ValueDiagnosisList,
  dispatch: Dispatch<AnyAction>
): void {
  if (sickLeaveValue && diagnoses && sickLeaveValue.list.length > 0 && diagnoses.list.length > 0) {
    dispatch(
      validateSickLeavePeriod({
        icd10Codes: getDiagnosisCodes(diagnoses),
        personId: personId,
        dateRangeList: sickLeaveValue,
      })
    )
  } else {
    dispatch(setSickLeavePeriodWarning(''))
  }
}

export const handleUpdateCertificateDataElement: Middleware<Dispatch> = ({ dispatch, getState }: MiddlewareAPI) => () => (
  action: AnyAction
): void => {
  if (!getState().ui.uiFMB.fmbPanelActive) {
    return
  }

  getFMBDiagnosisCodes(action.payload.value, getState().ui.uiFMB.fmbDiagnosisCodeInfo, dispatch)

  if (isValueDateRangeList(action.payload.value)) {
    dispatch(setSickLeavePeriodValue(action.payload.value as ValueDateRangeList))
  } else if (isValueDiagnoses(action.payload.value)) {
    dispatch(setDiagnosisListValue(action.payload.value as ValueDiagnosisList))
  }

  if (
    action.payload.value &&
    (action.payload.value.type === CertificateDataValueType.DATE_RANGE_LIST ||
      action.payload.value.type === CertificateDataValueType.DIAGNOSIS_LIST)
  ) {
    getValidationForSickLeavePeriod(
      getState().ui.uiFMB.patientId,
      getState().ui.uiFMB.sickLeavePeriodValue,
      getState().ui.uiFMB.diagnosisListValue,
      dispatch
    )
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

export const handleValidateSickLeavePeriod: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (action: AnyAction): void => {
  dispatch(
    apiCallBegan({
      url: '/api/fmb/validateSickLeavePeriod',
      method: 'POST',
      data: action.payload,
      onStart: validateSickLeavePeriodStarted.type,
      onSuccess: validateSickLeavePeriodSuccess.type,
      onError: apiSilentGenericError.type,
    })
  )
}

export const handleValidateSickLeavePeriodSuccess: Middleware<Dispatch> = ({ dispatch }: MiddlewareAPI) => () => (
  action: AnyAction
): void => {
  dispatch(setSickLeavePeriodWarning(action.payload.message))
}

const middlewareMethods = {
  [getFMBDiagnosisCodeInfo.type]: handleGetFMBDiagnosisCodeInfo,
  [getFMBDiagnosisCodeInfoSuccess.type]: handleGetFMBDiagnosisCodeInfoSuccess,
  [updateCertificate.type]: handleUpdateCertificate,
  [updateCertificateDataElement.type]: handleUpdateCertificateDataElement,
  [validateSickLeavePeriod.type]: handleValidateSickLeavePeriod,
  [validateSickLeavePeriodSuccess.type]: handleValidateSickLeavePeriodSuccess,
}

export const fmbMiddleware: Middleware<Dispatch> = (middlewareAPI: MiddlewareAPI) => (next) => (action: AnyAction): void => {
  next(action)

  if (middlewareMethods.hasOwnProperty(action.type)) {
    middlewareMethods[action.type](middlewareAPI)(next)(action)
  }
}
