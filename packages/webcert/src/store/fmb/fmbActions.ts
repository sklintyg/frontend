import { createAction } from '@reduxjs/toolkit'
import { FMBDiagnosisCodeInfo } from '@frontend/common'

export interface FMBDiagnoseRequest {
  icd10Code: string
  icd10Description: string
  index: number
}

const FMB = '[FMB]'

export const getFMBDiagnosisCodeInfo = createAction<FMBDiagnoseRequest>(`${FMB} Get diagnosis code info`)

export const getFMBDiagnosisCodeInfoStarted = createAction(`${FMB} Get diagnosis code info started`)

export const getFMBDiagnosisCodeInfoSuccess = createAction<FMBDiagnosisCodeInfo>(`${FMB} Get diagnosis code info success`)

export const getFMBDiagnosisCodeInfoError = createAction<string>(`${FMB} Get diagnosis code info error`)

export const updateFMBDiagnosisCodeInfo = createAction<FMBDiagnosisCodeInfo>(`${FMB} Update diagnosis code info`)

export const updateFMBPanelActive = createAction<boolean>(`${FMB} Update panel active`)

export const removeFMBDiagnosisCodes = createAction<FMBDiagnosisCodeInfo>(`${FMB} Remove diagnosis code info`)
