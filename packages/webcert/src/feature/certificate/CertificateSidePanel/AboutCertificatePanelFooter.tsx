import React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'
import SidePanelFooter from './Footer/SidePanelFooter'

const AboutCertificatePanelFooter: React.FC = () => {
  return (
    <SidePanelFooter additionalStyles="iu-m-none">
      <WCDynamicLink linkKey="ineraIntygsskola" />
    </SidePanelFooter>
  )
}

export default AboutCertificatePanelFooter
