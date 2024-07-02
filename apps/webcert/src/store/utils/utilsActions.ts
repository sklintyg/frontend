import { createAction } from '@reduxjs/toolkit'
import type { Configuration, DynamicLinkMap } from './utilsReducer'
import type { DiagnosisTypeahead } from '../../types'

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
export const updateIsLoadingDynamicLinks = createAction<boolean>('[Utils] Update is loading dynamic links')

export const getDiagnosisTypeahead = createAction<GetDiagnosisTypeahead>('[Utils] Get diagnosis typeahead')
export const getDiagnosisTypeaheadStarted = createAction('[Utils] Get diagnosis typeahead started')
export const getDiagnosisTypeaheadSuccess = createAction<DiagnosisTypeahead>('[Utils] Get diagnosis typeahead success')
export const getDiagnosisTypeaheadError = createAction<string>('[Utils] Get diagnosis typeahead error')
export const resetDiagnosisTypeahead = createAction('[Utils] Resets diagnosis typeahead')

export const updateDiagnosisTypeahead = createAction<DiagnosisTypeahead>('[Utils] Update diagnosis typeahead')

export const getConfig = createAction('[Utils] Get module config')
export const getConfigStarted = createAction('[Utils] Get module config started')
export const getConfigSuccess = createAction<Configuration>('[Utils] Get module config success')
export const getConfigError = createAction<string>('[Utils] Get module config error')

export const updateConfig = createAction<Configuration>('[Utils] Update module config')
export const updateIsLoadingConfig = createAction<boolean>('[Utils] Update is loading config')
