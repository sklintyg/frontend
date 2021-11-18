import React from 'react'
import WCDynamicLink from '../../../components/utils/WCDynamicLink'
import SidePanelFooter from './Footer/SidePanelFooter'

const AboutCertificatePanelFooter = () => {
  return (
    <SidePanelFooter backgroundColor="iu-bg-white" textColor="iu-color-main">
      <WCDynamicLink linkKey={'ineraIntygsskola'} />
    </SidePanelFooter>
  )
}

export default AboutCertificatePanelFooter
