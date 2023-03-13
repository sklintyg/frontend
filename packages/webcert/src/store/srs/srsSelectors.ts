import { RootState } from '../store'
import { ValueDiagnosisList } from '@frontend/common'
import { SrsInfoForDiagnosis } from '@frontend/common/src/types/srs'

export const getDiagnosisListValue = (state: RootState): ValueDiagnosisList | null => state.ui.uiSRS.diagnosisListValue

export const getDiagnosisCodes = (state: RootState): string[] => state.ui.uiSRS.diagnosisCodes

export const getHasError = (state: RootState): boolean => state.ui.uiSRS.error

export const getSrsInfo = (state: RootState): SrsInfoForDiagnosis | undefined => state.ui.uiSRS.srsInfo

export const getPatientId = (state: RootState): string => state.ui.uiSRS.patientId

export const getCertificateId = (state: RootState): string => state.ui.uiSRS.certificateId

export const getSickLeaveChoice = (state: RootState): string => state.ui.uiSRS.sickLeaveChoice

export const getIsCertificateRenewed = (state: RootState): boolean => state.ui.uiSRS.isCertificateRenewed

export const getDiagnosisDescription = (state: RootState): string =>
  state.ui.uiSRS.srsInfo && state.ui.uiSRS.srsInfo.atgarderDiagnosisDescription ? state.ui.uiSRS.srsInfo.atgarderDiagnosisDescription : ''

export const getDiagnosisCode = (state: RootState): string =>
  state.ui.uiSRS.srsInfo && state.ui.uiSRS.srsInfo.atgarderDiagnosisCode ? state.ui.uiSRS.srsInfo.atgarderDiagnosisCode : ''
