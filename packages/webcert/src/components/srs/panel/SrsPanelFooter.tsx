import React from 'react'
import SidePanelFooter from '../../../feature/certificate/CertificateSidePanel/Footer/SidePanelFooter'
import { getDiagnosisCode, getDiagnosisDescription } from '../../../store/srs/srsSelectors'
import { useSelector } from 'react-redux'
import { ExternalLinkIcon, SrsInformationChoice } from '@frontend/common'

interface Props {
  informationChoice: SrsInformationChoice
}
const SrsPanelFooter: React.FC<Props> = ({ informationChoice }) => {
  const diagnosisDescription = useSelector(getDiagnosisDescription(informationChoice))
  const diagnosisCode = useSelector(getDiagnosisCode(informationChoice))
  const link = `https://skr.se/${diagnosisCode ? diagnosisCode.replace('.', '').toLowerCase() : ''}`

  return (
    <SidePanelFooter additionalStyles="iu-m-none">
      <div className="iu-flex-column">
        <p className="iu-fw-bold">Mer information</p>
        <a href={link} target="_blank">
          Information om {diagnosisDescription} hos Rätt Sjukskrivning
        </a>
        <ExternalLinkIcon className="iu-ml-200 iu-fs-100" />
      </div>
    </SidePanelFooter>
  )
}

export default SrsPanelFooter
