import { createAction } from '@reduxjs/toolkit'
import { IcfState } from './icfReducer'

export interface IcdCodeQuery {
  icd10Code: string
}

const ICF = '[ICF]'

export const getIcfCodes = createAction<IcdCodeQuery[]>(`${ICF} Get icf codes`)

export const getIcfCodesStarted = createAction(`${ICF} Get diagnosis code info started`)

export const getIcfCodesSuccess = createAction<IcfState>(`${ICF} Get diagnosis code info success`)

export const getIcfCodesError = createAction<string>(`${ICF} Get diagnosis code info error`)

export const updateIcfCodes = createAction<IcfState>(`${ICF} Update diagnosis code info`)
