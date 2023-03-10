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

const fakeSrsPrediction = (): SrsPrediction => ({
  certificateId: faker.lorem.sentence(),
})

const fakeSrsRecommendationList = () => {
  return [fakeSrsRecommendation(), fakeSrsRecommendation(), fakeSrsRecommendation()]
}

const fakeSrsPredictionList = () => {
  return [fakeSrsPrediction(), fakeSrsPrediction(), fakeSrsPrediction()]
}
