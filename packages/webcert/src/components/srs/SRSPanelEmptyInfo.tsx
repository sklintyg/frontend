import React from 'react'
import errorImage from '../../images/fel-1.svg'
import CenteredImageWithContent from '../image/CenteredImageWithContent'

const SRSPanelEmptyInfo: React.FC = () => {
  return (
    <CenteredImageWithContent imgSrc={errorImage}>
      <p>Ange minst en diagnos för att få stöd för sjukskrivning.</p>
    </CenteredImageWithContent>
  )
}

export default SRSPanelEmptyInfo
