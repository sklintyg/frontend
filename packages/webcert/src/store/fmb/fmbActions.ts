import { createAction } from '@reduxjs/toolkit'
import { FMBDiagnosisCodeInfo } from '@frontend/common'

export const getFMBDiagnosisCodeInfo = createAction<string>('[FMB] Get diagnosis code info')

export const getFMBDiagnosisCodeInfoStarted = createAction('[FMB] Get diagnosis code info started')

export const getFMBDiagnosisCodeInfoSuccess = createAction<FMBDiagnosisCodeInfo>('[FMB] Get diagnosis code info success')

export const getFMBDiagnosisCodeInfoError = createAction<string>('[FMB] Get diagnosis code info error')

export const updateFMBDiagnosisCodeInfo = createAction<FMBDiagnosisCodeInfo>('[FMB] Update diagnosis code info')
