import React from 'react'
import SidePanelFooter from '../../feature/certificate/CertificateSidePanel/Footer/SidePanelFooter'
import { getDiagnosisCode, getDiagnosisDescription } from '../../store/srs/srsSelectors'
import { useSelector } from 'react-redux'
import { ExternalLinkIcon } from '@frontend/common'

const FMBPanelFooter: React.FC = () => {
  const diagnosisDescription = useSelector(getDiagnosisDescription)
  const diagnosisCode = useSelector(getDiagnosisCode)
  const link = `http://skr.se/${diagnosisCode.replace('.', '').toLowerCase()}`

  return (
    <SidePanelFooter additionalStyles="iu-m-none">
      <div className="iu-flex-column">
        <p className="iu-fw-bold">Mer information</p>
        <a href={link}>Information om {diagnosisDescription} hos Rätt Sjukskrivning</a>
        <ExternalLinkIcon className="iu-ml-200 iu-fs-100" />
      </div>
    </SidePanelFooter>
  )
}

export default FMBPanelFooter
