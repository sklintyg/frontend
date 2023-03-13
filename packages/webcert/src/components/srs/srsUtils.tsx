import { SrsInfoForDiagnosis } from '@frontend/common/src/types/srs'

export const getObservations = () => (recommendations: SrsInfoForDiagnosis) => {
  return recommendations.atgarderObs
}
