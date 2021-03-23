import { createAction } from '@reduxjs/toolkit'
import { DynamicLinkMap } from './utilsReducer'
import { DiagnosisTypeahead } from '@frontend/common'

export interface GetDiagnosisTypeahead {
  codeSystem: string
  fragment: string
  code: boolean
  maxNumberOfResults: number
}

export const getAllDynamicLinks = createAction('[Utils] Get all dynamic links')
export const getAllDynamicLinksStarted = createAction('[Utils] Get all dynamic links started')
export const getAllDynamicLinksSuccess = createAction<DynamicLinkMap>('[Utils] Get all dynamic links success')
export const getAllDynamicLinksError = createAction<string>('[Utils] Get all dynamic links error')

export const updateDynamicLinks = createAction<DynamicLinkMap>('[Utils] Update dynamic links')

export const getDiagnosisTypeahead = createAction<GetDiagnosisTypeahead>('[Utils] Get diagnosis typeahead')
export const getDiagnosisTypeaheadStarted = createAction('[Utils] Get diagnosis typeahead started')
export const getDiagnosisTypeaheadSuccess = createAction<DiagnosisTypeahead>('[Utils] Get diagnosis typeahead success')
export const getDiagnosisTypeaheadError = createAction<string>('[Utils] Get diagnosis typeahead error')
export const resetDiagnosisTypeahead = createAction('[Utils] Resets diagnosis typeahead')

export const updateDiagnosisTypeahead = createAction<DiagnosisTypeahead>('[Utils] Update diagnosis typeahead')
