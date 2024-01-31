import { forwardRef, Ref } from 'react'
import { useSelector } from 'react-redux'
import { getDiagnosisCode, getDiagnosisDescription, getSickLeaveChoice, getSrsInfo } from '../../../store/srs/srsSelectors'
import { SrsInformationChoice, SrsSickLeaveChoice } from '../../../types'
import { SrsRecommendationsBox } from './SrsRecommendationBox'

export const SRS_OBSERVE_TITLE = 'Tänk på att'
export const SRS_EXTENSION_TITLE = 'Tänk på att vid förlängning'
export const SRS_RECOMMENDATIONS_TITLE = 'Åtgärdsrekommendationer'

const SrsRecommendations = forwardRef((_: unknown, ref: Ref<HTMLDivElement>) => {
  const info = useSelector(getSrsInfo)
  const sickLeaveChoice = useSelector(getSickLeaveChoice)
  const diagnosisCode = useSelector(getDiagnosisCode(SrsInformationChoice.RECOMMENDATIONS))
  const diagnosisDescription = useSelector(getDiagnosisDescription(SrsInformationChoice.RECOMMENDATIONS))
  const isExtension = sickLeaveChoice === SrsSickLeaveChoice.EXTENSION || sickLeaveChoice === SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS

  if (!info) {
    return null
  }

  const isEmpty = info.atgarderStatusCode === 'INFORMATION_SAKNAS'

  return (
    <>
      {isExtension && (
        <SrsRecommendationsBox ref={ref} recommendations={info.atgarderFrl} isEmpty={isEmpty} title={SRS_EXTENSION_TITLE} id={'EXT-'} />
      )}
      <SrsRecommendationsBox
        ref={!isExtension ? ref : null}
        recommendations={info.atgarderObs}
        isEmpty={isEmpty}
        title={SRS_OBSERVE_TITLE}
        id={'OBS-'}
        diagnosisCode={diagnosisCode}
        diagnosisDescription={diagnosisDescription}
      />
      <SrsRecommendationsBox
        recommendations={info.atgarderRek}
        isEmpty={isEmpty}
        title={SRS_RECOMMENDATIONS_TITLE}
        id={'REC-'}
        diagnosisCode={diagnosisCode}
        diagnosisDescription={diagnosisDescription}
      />
    </>
  )
})

export default SrsRecommendations
