import faker from 'faker'
import { SrsAnswer, SrsAnswerOption, SrsInfoForDiagnosis, SrsPrediction, SrsQuestion, SrsRecommendation } from '../types'

export const fakeSrsInfo = (value?: Partial<SrsInfoForDiagnosis>): SrsInfoForDiagnosis => ({
  atgarderObs: fakeSrsRecommendationList(),
  atgarderRek: fakeSrsRecommendationList(),
  atgarderReh: fakeSrsRecommendationList(),
  atgarderFrl: fakeSrsRecommendationList(),
  predictions: fakeSrsPredictionList(),
  atgarderDiagnosisDescription: faker.lorem.sentence(),
  atgarderDiagnosisCode: faker.lorem.word(),
  atgarderStatusCode: 'OK',
  statistikNationellStatistik: [],
  statistikDiagnosisCode: faker.lorem.word(),
  statistikDiagnosisDescription: faker.lorem.sentence(),
  statistikStatusCode: 'OK',
  ...value,
})

const fakeSrsRecommendation = (): SrsRecommendation => ({
  recommendationTitle: faker.lorem.sentence(),
  recommendationText: faker.lorem.sentence(),
})

export const fakeSrsPrediction = (diagnosisCode?: string): SrsPrediction => ({
  certificateId: faker.lorem.sentence(),
  diagnosisCode: diagnosisCode ? diagnosisCode : faker.lorem.word(),
  diagnosisDescription: faker.lorem.sentence(),
  statusCode: faker.lorem.word(),
  level: 1,
  description: faker.lorem.sentence(),
  physiciansOwnOpinionRisk: 'HOGRE',
  daysIntoSickLeave: 15,
  prevalence: 0.5,
  probabilityOverLimit: 0.2,
  questionsResponses: [],
  timestamp: '2020-02-02',
  modelVersion: faker.lorem.word(),
})

export const fakeSrsAnswer = (): SrsAnswer => ({
  questionId: faker.lorem.word(),
  answerId: faker.lorem.word(),
})

export const fakeSrsQuestion = (answerOptions?: SrsAnswerOption[]): SrsQuestion => ({
  questionId: faker.lorem.word(),
  answerOptions: answerOptions ? answerOptions : [],
  text: faker.lorem.sentence(),
  helpText: faker.lorem.sentence(),
  priority: 0,
})

export const fakeSrsAnswerOption = (defaultValue?: boolean): SrsAnswerOption => ({
  id: faker.lorem.word(),
  text: faker.lorem.sentence(),
  priority: 0,
  defaultValue: defaultValue ? defaultValue : false,
})

const fakeSrsRecommendationList = () => {
  return Array.from({ length: 5 }, () => fakeSrsRecommendation())
}

const fakeSrsPredictionList = () => {
  return [fakeSrsPrediction(), fakeSrsPrediction(), fakeSrsPrediction()]
}
