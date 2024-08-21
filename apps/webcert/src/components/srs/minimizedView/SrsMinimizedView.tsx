import { forwardRef, Ref } from 'react'
import { useSelector } from 'react-redux'
import { getDiagnosisCode, getDiagnosisDescription, getIsCertificateRenewed, getSrsInfo } from '../../../store/srs/srsSelectors'
import { SrsInformationChoice } from '../../../types'
import { SrsRecommendationsBox } from '../recommendations/SrsRecommendationBox'
import { SRS_EXTENSION_TITLE } from '../recommendations/SrsRecommendations'
import SrsRiskGraph from '../risk/SrsRiskGraph'

export const SrsMinimizedView = forwardRef((_: unknown, ref: Ref<HTMLDivElement>) => {
  const info = useSelector(getSrsInfo)
  const diagnosisCode = useSelector(getDiagnosisCode(SrsInformationChoice.RECOMMENDATIONS))
  const diagnosisDescription = useSelector(getDiagnosisDescription(SrsInformationChoice.RECOMMENDATIONS))
  const isCertificateExtension = useSelector(getIsCertificateRenewed)

  if (!info) {
    return null
  }

  const isEmpty = info.atgarderStatusCode === 'INFORMATION_SAKNAS'

  return (
    <>
      <SrsRecommendationsBox
        ref={ref}
        recommendations={info.atgarderReh}
        isEmpty={isEmpty}
        title="Som rehabkoordinator, tänk på att"
        id={'REKO-'}
      />
      <div className="iu-pt-600">
        <SrsRiskGraph />
      </div>
      {isCertificateExtension && (
        <SrsRecommendationsBox recommendations={info.atgarderFrl} isEmpty={isEmpty} title={SRS_EXTENSION_TITLE} id={'EXT-'} />
      )}
      <SrsRecommendationsBox
        recommendations={info.atgarderObs}
        isEmpty={isEmpty}
        title="Som läkare, tänk på att"
        id={'DOCTOR-'}
        diagnosisCode={diagnosisCode}
        diagnosisDescription={diagnosisDescription}
      />
      <SrsRecommendationsBox
        recommendations={info.atgarderRek}
        isEmpty={isEmpty}
        title="Åtgärdsrekommendationer"
        id="REK-"
        diagnosisDescription={diagnosisDescription}
        diagnosisCode={diagnosisCode}
      />
    </>
  )
})
