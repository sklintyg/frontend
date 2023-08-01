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
  probabilityOverLimit?: number
  prevalence: number
  questionsResponses: SrsAnswer[]
  physiciansOwnOpinionRisk: string
  daysIntoSickLeave: number
  modelVersion: string
  timestamp: string
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

export enum SrsEvent {
  SRS_LOADED = 'SRS_LOADED',
  SRS_PANEL_ACTIVATED = 'SRS_PANEL_ACTIVATED',
  SRS_CONSENT_ANSWERED = 'SRS_CONSENT_ANSWERED',
  SRS_QUESTION_ANSWERED = 'SRS_QUESTION_ANSWERED',
  SRS_CALCULATE_CLICKED = 'SRS_CALCULATE_CLICKED',
  SRS_HIDE_QUESTIONS_CLICKED = 'SRS_HIDE_QUESTIONS_CLICKED',
  SRS_SHOW_QUESTIONS_CLICKED = 'SRS_SHOW_QUESTIONS_CLICKED',
  SRS_MEASURES_SHOW_MORE_CLICKED = 'SRS_MEASURES_SHOW_MORE_CLICKED',
  SRS_MEASURES_EXPAND_ONE_CLICKED = 'SRS_MEASURES_EXPAND_ONE_CLICKED',
  SRS_MEASURES_LINK_CLICKED = 'SRS_MEASURES_LINK_CLICKED',
  SRS_STATISTICS_ACTIVATED = 'SRS_STATISTICS_ACTIVATED',
  SRS_STATISTICS_LINK_CLICKED = 'SRS_STATISTICS_LINK_CLICKED',
  SRS_MEASURES_DISPLAYED = 'SRS_MEASURES_DISPLAYED',
}

export enum SrsUserClientContext {
  SRS_FRL = 'SRS_FRL',
  SRS_SIGNED = 'SRS_SIGNED',
  SRS_UTK = 'SRS_UTK',
  SRS_REH = 'SRS_REH',
}
