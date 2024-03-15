import { createAction } from '@reduxjs/toolkit'
import { FMBDiagnosisCodeInfo, ValueDateRangeList, ValueDiagnosisList } from '../../types'
import { FunctionDisabler, TOGGLE_FUNCTION_DISABLER } from '../../utils/functionDisablerUtils'

export interface FMBDiagnoseRequest {
  icd10Code: string
  icd10Description: string
  index: number
}

export interface FMBValidateSickLeavePeriodRequest {
  icd10Codes: string[]
  dateRangeList: ValueDateRangeList
  personId: string
}

export interface ValidateSickLeavePeriodResponse {
  message: string
}

const FMB = '[FMB]'

export const getFMBDiagnosisCodeInfo = createAction<FMBDiagnoseRequest>(`${FMB} Get diagnosis code info`)

export const getFMBDiagnosisCodeInfoStarted = createAction(`${FMB} Get diagnosis code info started`)

export const getFMBDiagnosisCodeInfoSuccess = createAction<FMBDiagnosisCodeInfo>(`${FMB} Get diagnosis code info success`)

export const getFMBDiagnosisCodeInfoError = createAction<string>(`${FMB} Get diagnosis code info error`)

export const updateFMBDiagnosisCodeInfo = createAction<FMBDiagnosisCodeInfo>(`${FMB} Update diagnosis code info`)

export const updateFMBPanelActive = createAction<boolean>(`${FMB} Update panel active`)

export const removeFMBDiagnosisCodes = createAction<FMBDiagnosisCodeInfo>(`${FMB} Remove diagnosis code info`)

export const setSickLeavePeriodWarning = createAction<string>(`${FMB} Set sick leave period warning`)

export const setPatientId = createAction<string>(`${FMB} Set patient id`)

export const setSickLeavePeriodValue = createAction<ValueDateRangeList>(`${FMB} Set sick leave period value`)

export const setDiagnosisListValue = createAction<ValueDiagnosisList>(`${FMB} Set diagnosis list value`)

export const validateSickLeavePeriod = createAction<FMBValidateSickLeavePeriodRequest>(`${FMB} Validate sick leave period`)
export const validateSickLeavePeriodStarted = createAction(`${FMB} Validate sick leave period started`)
export const validateSickLeavePeriodSuccess = createAction<ValidateSickLeavePeriodResponse>(`${FMB} Validate sick leave period success`)
export const validateSickLeavePeriodError = createAction(`${FMB} Validate sick leave period error`)

export const toggleFMBFunctionDisabler = createAction<FunctionDisabler>(`${FMB} ${TOGGLE_FUNCTION_DISABLER}`)

export const initializeFMBPanel = createAction(`${FMB} Initialize FMB Panel`)
