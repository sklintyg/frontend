import React from 'react'
import SidePanelFooter from '../../feature/certificate/CertificateSidePanel/Footer/SidePanelFooter'

interface Props {
  diagnosisCode: string
}
const FMBPanelFooter: React.FC<Props> = ({ diagnosisCode }) => {
  const link = `http://skr.se/${diagnosisCode.replace('.', '').toLowerCase()}`

  return (
    <SidePanelFooter additionalStyles="iu-m-none">
      <div className="iu-flex-column">
        <p className="iu-fw-bold">Mer information</p>
        <a href={link}>Information om {diagnosisCode} hos Rätt Sjukskrivning</a>
      </div>
    </SidePanelFooter>
  )
}

export default FMBPanelFooter
