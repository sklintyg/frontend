import { createAction } from '@reduxjs/toolkit'
import { ValueDiagnosisList } from '@frontend/common'
import { FunctionDisabler, TOGGLE_FUNCTION_DISABLER } from '../../utils/functionDisablerUtils'

const SRS = '[SRS]'
export const setDiagnosisListValue = createAction<ValueDiagnosisList>(`${SRS} Set diagnosis list value`)

export const setDiagnosisCodes = createAction<string[]>(`${SRS} Set diagnosis codes`)

export const toggleSRSFunctionDisabler = createAction<FunctionDisabler>(`${SRS} ${TOGGLE_FUNCTION_DISABLER}`)

export const getSRSCodes = createAction(`${SRS} Get SRS codes`)

export const getSRSCodesStarted = createAction<ValueDiagnosisList>(`${SRS} Get SRS codes started`)

export const getSRSCodesError = createAction<ValueDiagnosisList>(`${SRS} Get SRS codes error`)

export const getSRSCodesSuccess = createAction<ValueDiagnosisList>(`${SRS} Get SRS codes success`)

export const updateError = createAction<boolean>(`${SRS} Update error`)
