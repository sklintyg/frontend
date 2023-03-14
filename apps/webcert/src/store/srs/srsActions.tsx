import { createAction } from '@reduxjs/toolkit'
import { ValueDiagnosisList } from '@frontend/common'
import { FunctionDisabler, TOGGLE_FUNCTION_DISABLER } from '../../utils/functionDisablerUtils'
import { SrsInfoForDiagnosis, SrsSickLeaveChoice } from '@frontend/common/src/types/srs'

const SRS = '[SRS]'
export const setDiagnosisListValue = createAction<ValueDiagnosisList>(`${SRS} Set diagnosis list value`)

export const setDiagnosisCodes = createAction<string[]>(`${SRS} Set diagnosis codes`)

export const toggleSRSFunctionDisabler = createAction<FunctionDisabler>(`${SRS} ${TOGGLE_FUNCTION_DISABLER}`)

export const getSRSCodes = createAction(`${SRS} Get SRS codes`)

export const getSRSCodesStarted = createAction<ValueDiagnosisList>(`${SRS} Get SRS codes started`)

export const getSRSCodesError = createAction<ValueDiagnosisList>(`${SRS} Get SRS codes error`)

export const getSRSCodesSuccess = createAction<ValueDiagnosisList>(`${SRS} Get SRS codes success`)

export interface RecommendationsRequest {
  patientId: string
  code: string
  certificateId: string
}
export const getRecommendations = createAction<RecommendationsRequest>(`${SRS} Get recommendations`)

export const getRecommendationsStarted = createAction<ValueDiagnosisList>(`${SRS} Get recommendations started`)

export const getRecommendationsError = createAction(`${SRS} Get recommendations error`)

export const getRecommendationsSuccess = createAction<SrsInfoForDiagnosis>(`${SRS} Get recommendations success`)

export const updateError = createAction<boolean>(`${SRS} Update error`)

export const updateSrsInfo = createAction<SrsInfoForDiagnosis>(`${SRS} Update recommendations for diagnosis`)

export const updatePatientId = createAction<string>(`${SRS} Update patient id`)

export const updateCertificateId = createAction<string>(`${SRS} Update certificate id`)

export const updateSickLeaveChoice = createAction<SrsSickLeaveChoice>(`${SRS} Update sick leave choice`)

export const updateIsCertificateRenewed = createAction<boolean>(`${SRS} Update is certificate renewed`)
