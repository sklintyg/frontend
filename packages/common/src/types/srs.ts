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
