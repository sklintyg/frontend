import React from 'react'
import SidePanelFooter from '../../feature/certificate/CertificateSidePanel/Footer/SidePanelFooter'

interface Props {
  diagnosisCode: string
}
const FMBPanelFooter: React.FC<Props> = ({ diagnosisCode }) => {
  const getLink = () => {
    const baseURL = 'http://skr.se/'
    return baseURL + diagnosisCode.replace('.', '').toLowerCase()
  }

  return (
    <SidePanelFooter additionalStyles="iu-m-none">
      <div className="iu-flex-column">
        <p className="iu-fw-bold">Mer information</p>
        <a href={getLink()}>Information om {diagnosisCode} hos Rätt Sjukskrivning</a>
      </div>
    </SidePanelFooter>
  )
}

export default FMBPanelFooter
