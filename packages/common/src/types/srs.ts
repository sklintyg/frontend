export interface SrsInfoForDiagnosis {
  atgarderObs: SrsRecommendation[]
  atgarderRek: SrsRecommendation[]
  atgarderFrl: SrsRecommendation[]
  atgarderReh: SrsRecommendation[]
  predictions: SrsPrediction[]
  atgarderDiagnosisCode: string
  atgarderDiagnosisDescription: string
  atgarderStatusCode: string
  statistikNationellStatistik: number[]
  statistikDiagnosisCode: string
  statistikDiagnosisDescription: string
  statistikStatusCode: string
}

export interface SrsRecommendation {
  recommendationTitle: string
  recommendationText: string
}

export interface SrsPrediction {
  certificateId: string
  //implement in another jira
}

export enum SrsSickLeaveChoice {
  NEW = 'NEW',
  EXTENSION = 'EXTENSION',
  EXTENSION_AFTER_60_DAYS = 'EXTENSION_AFTER_60_DAYS',
}

export enum SrsInformationChoice {
  STATISTICS = 'STATISTICS',
  RECOMMENDATIONS = 'RECOMMENDATIONS',
}

export interface SrsQuestion {
  questionId: string
  text: string
  helpText: string
  priority: number
  answerOptions: SrsAnswerOption[]
}

export interface SrsAnswerOption {
  text: string
  id: string
  priority: number
  defaultValue: boolean
}
