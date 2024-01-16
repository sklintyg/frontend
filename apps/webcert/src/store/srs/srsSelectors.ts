import {
  SrsAnswer,
  SrsInfoForDiagnosis,
  SrsInformationChoice,
  SrsPrediction,
  SrsQuestion,
  SrsSickLeaveChoice,
} from '@frontend/common/src/types/srs'
import { ValueDiagnosisList } from '@frontend/common/types'
import { getFilteredPredictions } from '../../components/srs/srsUtils'
import { RootState } from '../store'

export const getDiagnosisListValue = (state: RootState): ValueDiagnosisList | null => state.ui.uiSRS.diagnosisListValue

export const getDiagnosisCodes = (state: RootState): string[] => state.ui.uiSRS.diagnosisCodes

export const getHasError = (state: RootState): boolean => state.ui.uiSRS.error

export const getSrsInfo = (state: RootState): SrsInfoForDiagnosis | undefined => state.ui.uiSRS.srsInfo

export const getPatientId = (state: RootState): string => state.ui.uiSRS.patientId

export const getCertificateId = (state: RootState): string => state.ui.uiSRS.certificateId

export const getUnitId = (state: RootState): string => state.ui.uiSRS.unitId

export const getCareGiverId = (state: RootState): string => state.ui.uiSRS.careProviderId

export const getSickLeaveChoice = (state: RootState): SrsSickLeaveChoice => state.ui.uiSRS.sickLeaveChoice

export const getIsCertificateRenewed = (state: RootState): boolean => state.ui.uiSRS.isCertificateRenewed

export const getSrsQuestions = (state: RootState): SrsQuestion[] => state.ui.uiSRS.srsQuestions

export const getRiskOpinion = (state: RootState): string => state.ui.uiSRS.riskOpinion

export const getLoading = (state: RootState): boolean => state.ui.uiSRS.loadingCodes

export const getHasUpdatedAnswers = (state: RootState): boolean => state.ui.uiSRS.hasUpdatedAnswers
export const hasLoggedMeasuresDisplayed = (state: RootState): boolean => state.ui.uiSRS.hasLoggedMeasuresDisplayed

export const getSrsPredictions = (state: RootState): SrsPrediction[] =>
  state.ui.uiSRS.srsPredictions.length > 0
    ? state.ui.uiSRS.srsPredictions
    : state.ui.uiSRS.srsInfo
      ? state.ui.uiSRS.srsInfo.predictions
      : []

export const getPreviousAnswers = (state: RootState): SrsAnswer[] => state.ui.uiSRS.answers

export const getDiagnosisDescription =
  (informationChoice: SrsInformationChoice) =>
  (state: RootState): string => {
    const srsInfo = state.ui.uiSRS.srsInfo
    return srsInfo
      ? informationChoice === SrsInformationChoice.STATISTICS
        ? srsInfo.statistikDiagnosisDescription
        : srsInfo.atgarderDiagnosisDescription
      : ''
  }

export const getDiagnosisCode =
  (informationChoice: SrsInformationChoice) =>
  (state: RootState): string => {
    const srsInfo = state.ui.uiSRS.srsInfo
    return srsInfo
      ? informationChoice === SrsInformationChoice.RECOMMENDATIONS
        ? srsInfo.atgarderDiagnosisCode
        : srsInfo.statistikDiagnosisCode
      : ''
  }

export const getPredictionDiagnosisCode = (state: RootState): string => {
  const predictions = getFilteredPredictions(getSrsPredictions(state))
  return predictions && predictions.length > 0 ? predictions[predictions.length - 1].diagnosisCode : ''
}

export const getPredictionDiagnosisDescription = (state: RootState): string => {
  const predictions = getFilteredPredictions(getSrsPredictions(state))
  return predictions && predictions.length > 0 ? predictions[predictions.length - 1].diagnosisDescription : ''
}
