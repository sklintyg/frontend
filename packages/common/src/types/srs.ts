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

export interface SrsPredictionInfo {
  predictions: SrsPrediction[]
  extensionChain: SrsExtensionChain[]
}

export interface SrsRecommendation {
  recommendationTitle: string
  recommendationText: string
}

export interface SrsPrediction {
  certificateId: string
  diagnosisCode: string
  diagnosisDescription: string
  statusCode: string
  level: number
  description: string
  probabilityOverLimit: number
  prevalence: number
  questionsResponses: SrsAnswer[]
  physiciansOwnOpinionRisk: string
  daysIntoSickLeave: number
  modelVersion: string
  timestamp: Date
}

export interface SrsExtensionChain {
  mainDiagnosisCode: string
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

export interface SrsAnswer {
  questionId: string
  answerId: string
}
