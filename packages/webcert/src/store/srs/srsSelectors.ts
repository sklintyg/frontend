import { RootState } from '../store'
import { SrsInformationChoice, ValueDiagnosisList } from '@frontend/common'
import { SrsInfoForDiagnosis } from '@frontend/common/src/types/srs'

export const getDiagnosisListValue = (state: RootState): ValueDiagnosisList | null => state.ui.uiSRS.diagnosisListValue

export const getDiagnosisCodes = (state: RootState): string[] => state.ui.uiSRS.diagnosisCodes

export const getHasError = (state: RootState): boolean => state.ui.uiSRS.error

export const getSrsInfo = (state: RootState): SrsInfoForDiagnosis | undefined => state.ui.uiSRS.srsInfo

export const getPatientId = (state: RootState): string => state.ui.uiSRS.patientId

export const getCertificateId = (state: RootState): string => state.ui.uiSRS.certificateId

export const getSickLeaveChoice = (state: RootState): string => state.ui.uiSRS.sickLeaveChoice

export const getIsCertificateRenewed = (state: RootState): boolean => state.ui.uiSRS.isCertificateRenewed

export const getDiagnosisDescription = (informationChoice: SrsInformationChoice) => (state: RootState): string => {
  const srsInfo = state.ui.uiSRS.srsInfo
  return srsInfo
    ? informationChoice === SrsInformationChoice.STATISTICS
      ? srsInfo.statistikDiagnosisDescription
      : srsInfo.atgarderDiagnosisDescription
    : ''
}

export const getDiagnosisCode = (informationChoice: SrsInformationChoice) => (state: RootState): string => {
  const srsInfo = state.ui.uiSRS.srsInfo
  return srsInfo
    ? informationChoice === SrsInformationChoice.RECOMMENDATIONS
      ? srsInfo.atgarderDiagnosisCode
      : srsInfo.statistikDiagnosisCode
    : ''
}
