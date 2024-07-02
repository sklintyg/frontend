import type { AnyAction } from '@reduxjs/toolkit'
import type { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import type {
  FMBDiagnosisCodeInfo,
  ValueDateRangeList,
  ValueDiagnosisList,
  ValueType} from '../../types';
import {
  CertificateDataValueType,
  ResourceLinkType
} from '../../types'
import { getResourceLink, isDateRangeValid } from '../../utils'
import { apiCallBegan, apiSilentGenericError } from '../api/apiActions'
import { updateCertificateDataElement } from '../certificate/certificateActions'
import { getCertificate } from '../certificate/certificateSelectors'
import type {
  FMBDiagnoseRequest} from './fmbActions';
import {
  getFMBDiagnosisCodeInfo,
  getFMBDiagnosisCodeInfoStarted,
  getFMBDiagnosisCodeInfoSuccess,
  initializeFMBPanel,
  removeFMBDiagnosisCodes,
  setDiagnosisListValue,
  setPatientId,
  setPeriodWarning,
  setSickLeavePeriodValue,
  updateFMBDiagnosisCodeInfo,
  updateFMBPanelActive,
  validateSickLeavePeriod,
  validateSickLeavePeriodStarted,
  validateSickLeavePeriodSuccess,
} from './fmbActions'

export const handleGetFMBDiagnosisCodeInfo: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
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

export const handleGetFMBDiagnosisCodeInfoSuccess: Middleware<Dispatch> =
  ({ dispatch }) =>
  () =>
  (action: AnyAction): void => {
    dispatch(updateFMBDiagnosisCodeInfo(action.payload))
  }

const isIcdCodeSystemChosen = (value: ValueType) => {
  if (!value || value.type !== CertificateDataValueType.DIAGNOSIS_LIST) {
    return true
  }
  return (value as ValueDiagnosisList).list.length === 0 || (value as ValueDiagnosisList).list[0].terminology.toLowerCase().includes('icd')
}

const handleInitializeFMBPanel: Middleware<Dispatch> =
  ({ dispatch, getState }) =>
  () =>
  (): void => {
    const certificate = getCertificate(getState())
    if (!certificate) {
      return
    }
    const fmbPanelActive = getResourceLink(certificate.links, ResourceLinkType.FMB)?.enabled
    dispatch(updateFMBPanelActive(fmbPanelActive))

    if (!fmbPanelActive) {
      return
    }

    if (certificate.metadata.patient.reserveId && certificate.metadata.patient.previousPersonId) {
      dispatch(setPatientId(certificate.metadata.patient.previousPersonId.id))
    } else {
      dispatch(setPatientId(certificate.metadata.patient.personId.id))
    }

    for (const questionId in certificate.data) {
      if (Object.prototype.hasOwnProperty.call(certificate.data, questionId)) {
        const question = certificate.data[questionId]
        if (isValueDateRangeList(question.value)) {
          dispatch(setSickLeavePeriodValue(question.value as ValueDateRangeList))
        }
        if (isValueDiagnoses(question.value)) {
          dispatch(setDiagnosisListValue(question.value as ValueDiagnosisList))
        }
        if (!question.value || !isIcdCodeSystemChosen(question.value)) {
          return
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

function isValueDiagnoses(value: ValueType | null) {
  return value && value.type === CertificateDataValueType.DIAGNOSIS_LIST
}

function isValueDateRangeList(value: ValueType | null) {
  return value && value.type === CertificateDataValueType.DATE_RANGE_LIST
}

function getDiagnosisCodes(diagnoses: ValueDiagnosisList) {
  const diagnosisCodes: string[] = []
  diagnoses.list.forEach((diagnosis, index) => {
    diagnosisCodes[index] = diagnosis.code
  })
  return diagnosisCodes
}

const filterOnValidSickLeaveValue = (sickLeaveValue: ValueDateRangeList) => {
  if (!sickLeaveValue || !sickLeaveValue.list) {
    return sickLeaveValue
  }

  return {
    ...sickLeaveValue,
    list: sickLeaveValue.list.slice().filter((value) => value.from && value.to && isDateRangeValid(value.from, value.to)),
  }
}

const getValidationForSickLeavePeriod = (
  personId: string,
  sickLeaveValue: ValueDateRangeList,
  diagnoses: ValueDiagnosisList,
  dispatch: Dispatch
): void => {
  const filteredSickLeaveValue = filterOnValidSickLeaveValue(sickLeaveValue)
  if (filteredSickLeaveValue && diagnoses && filteredSickLeaveValue.list.length > 0 && diagnoses.list.length > 0) {
    dispatch(
      validateSickLeavePeriod({
        icd10Codes: getDiagnosisCodes(diagnoses),
        personId: personId,
        dateRangeList: filteredSickLeaveValue,
      })
    )
  } else {
    dispatch(setPeriodWarning(''))
  }
}

export const handleUpdateCertificateDataElement: Middleware<Dispatch> =
  ({ dispatch, getState }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    if (!getState().ui.uiFMB.fmbPanelActive) {
      return
    }

    if (isIcdCodeSystemChosen(action.payload.value)) {
      getFMBDiagnosisCodes(action.payload.value, getState().ui.uiFMB.fmbDiagnosisCodeInfo, dispatch)
    }

    if (isValueDateRangeList(action.payload.value)) {
      dispatch(setSickLeavePeriodValue(action.payload.value as ValueDateRangeList))
    } else if (isValueDiagnoses(action.payload.value)) {
      dispatch(setDiagnosisListValue(action.payload.value as ValueDiagnosisList))
    }

    if (
      action.payload.value &&
      isIcdCodeSystemChosen(action.payload.value) &&
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

function getFMBDiagnosisCodes(value: ValueType | null, existingFMBDiagnosisCodeInfo: FMBDiagnosisCodeInfo[], dispatch: Dispatch): void {
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
    const remove = valueDiagnosisList.list.findIndex((diagnosis) => existing.originalIcd10Code === diagnosis.code) < 0
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
  valueDiagnosisList.list.forEach((diagnosis) => {
    const exists = existingFMBDiagnosisCodeInfo.findIndex((existing) => existing.originalIcd10Code === diagnosis.code) > -1
    if (exists || !diagnosis.code) {
      return
    }

    const fmbDiagnoseRequest: FMBDiagnoseRequest = {
      index: Number(diagnosis.id) - 1,
      icd10Code: diagnosis.code,
      icd10Description: diagnosis.description,
    }

    dispatch(getFMBDiagnosisCodeInfo(fmbDiagnoseRequest))
  })
}

export const handleValidateSickLeavePeriod: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
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

export const handleValidateSickLeavePeriodSuccess: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  () =>
  (action: AnyAction): void => {
    dispatch(setPeriodWarning(action.payload.message))
  }

const middlewareMethods = {
  [getFMBDiagnosisCodeInfo.type]: handleGetFMBDiagnosisCodeInfo,
  [getFMBDiagnosisCodeInfoSuccess.type]: handleGetFMBDiagnosisCodeInfoSuccess,
  [updateCertificateDataElement.type]: handleUpdateCertificateDataElement,
  [validateSickLeavePeriod.type]: handleValidateSickLeavePeriod,
  [validateSickLeavePeriodSuccess.type]: handleValidateSickLeavePeriodSuccess,
  [initializeFMBPanel.type]: handleInitializeFMBPanel,
}

export const fmbMiddleware: Middleware<Dispatch> =
  (middlewareAPI: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction): void => {
    next(action)

    if (Object.prototype.hasOwnProperty.call(middlewareMethods, action.type)) {
      middlewareMethods[action.type](middlewareAPI)(next)(action)
    }
  }
