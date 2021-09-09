import { createAction } from '@reduxjs/toolkit'
import { Icf, IcfState } from './icfReducer'

export interface IcfRequest {
  icdCodes: string[]
}

export interface IcfResponse {
  disability?: Icf
  activityLimitation?: Icf
}

const ICF = '[ICF]'

export const getIcfCodes = createAction<IcfRequest>(`${ICF} Get icf codes`)

export const getIcfCodesStarted = createAction(`${ICF} Get diagnosis code info started`)

export const getIcfCodesSuccess = createAction<IcfResponse>(`${ICF} Get diagnosis code info success`)

export const getIcfCodesError = createAction<string>(`${ICF} Get diagnosis code info error`)

export const updateIcfCodes = createAction<IcfResponse>(`${ICF} Update diagnosis code info`)
