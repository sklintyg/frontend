import React from 'react'
import SidePanelFooter from '../../../feature/certificate/CertificateSidePanel/Footer/SidePanelFooter'
import { getDiagnosisCode, getDiagnosisDescription } from '../../../store/srs/srsSelectors'
import { useDispatch, useSelector } from 'react-redux'
import { ExternalLinkIcon, SrsEvent, SrsInformationChoice } from '@frontend/common'
import { logSrsInteraction } from '../../../store/srs/srsActions'

interface Props {
  informationChoice: SrsInformationChoice
}
const SrsPanelFooter = React.forwardRef<HTMLDivElement, Props>(({ informationChoice }, ref) => {
  const dispatch = useDispatch()
  const diagnosisDescription = useSelector(getDiagnosisDescription(informationChoice))
  const diagnosisCode = useSelector(getDiagnosisCode(informationChoice))
  const link = `https://skr.se/${diagnosisCode ? diagnosisCode.replace('.', '').toLowerCase() : ''}`

  const onClick = () => {
    if (informationChoice === SrsInformationChoice.STATISTICS) {
      dispatch(logSrsInteraction(SrsEvent.SRS_STATISTICS_LINK_CLICKED))
    } else {
      dispatch(logSrsInteraction(SrsEvent.SRS_MEASURES_LINK_CLICKED))
    }
  }

  return (
    <SidePanelFooter additionalStyles="iu-m-none">
      <div className="iu-flex-column" ref={ref}>
        <p className="iu-fw-bold">Mer information</p>
        <a href={link} target="_blank" rel="noreferrer" onClick={onClick}>
          Information om {diagnosisDescription} hos Rätt Sjukskrivning
        </a>
        <ExternalLinkIcon className="iu-ml-200 iu-fs-100" />
      </div>
    </SidePanelFooter>
  )
})

export default SrsPanelFooter
