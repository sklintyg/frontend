import { createAction } from '@reduxjs/toolkit'
import type { AvailableIcfCodes } from './icfReducer'
import type { FunctionDisabler} from '../../utils/functionDisablerUtils';
import { TOGGLE_FUNCTION_DISABLER } from '../../utils/functionDisablerUtils'

export interface IcfRequest {
  icdCodes: string[]
}

export interface IcfResponse {
  disability?: AvailableIcfCodes
  activityLimitation?: AvailableIcfCodes
}

const ICF = '[ICF]'

export const getIcfCodes = createAction<IcfRequest>(`${ICF} Get icf codes`)

export const getIcfCodesStarted = createAction(`${ICF} Get diagnosis code info started`)

export const getIcfCodesSuccess = createAction<IcfResponse>(`${ICF} Get diagnosis code info success`)

export const getIcfCodesError = createAction<string>(`${ICF} Get diagnosis code info error`)

export const updateIcfCodes = createAction<IcfResponse>(`${ICF} Update diagnosis code info`)

export const setOriginalIcd10Codes = createAction<string[]>(`${ICF} Set original icd 10 codes`)

export const toggleIcfFunctionDisabler = createAction<FunctionDisabler>(`${ICF} ${TOGGLE_FUNCTION_DISABLER}`)
