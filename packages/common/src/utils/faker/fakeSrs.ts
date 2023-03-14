import faker from 'faker'
import { SrsInfoForDiagnosis, SrsPrediction, SrsRecommendation } from '../../types'

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

export const fakeSrsPrediction = (): SrsPrediction => ({
  certificateId: faker.lorem.sentence(),
  diagnosisCode: faker.lorem.word(),
  diagnosisDescription: faker.lorem.sentence(),
  statusCode: faker.lorem.word(),
  level: 1,
  description: faker.lorem.sentence(),
  physiciansOwnOpinionRisk: 'HOGRE',
  daysIntoSickLeave: 15,
  prevalence: 0.5,
  probabilityOverLimit: 0.2,
  questionsResponses: [],
  timestamp: new Date(),
  modelVersion: faker.lorem.word(),
})

const fakeSrsRecommendationList = () => {
  return [fakeSrsRecommendation(), fakeSrsRecommendation(), fakeSrsRecommendation()]
}

const fakeSrsPredictionList = () => {
  return [fakeSrsPrediction(), fakeSrsPrediction(), fakeSrsPrediction()]
}
