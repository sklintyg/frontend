import React from 'react'
import WCDynamicLink from '../../../components/utils/WCDynamicLink'
import SidePanelFooter from './Footer/SidePanelFooter'

const AboutCertificatePanelFooter: React.FC = () => {
  return (
    <SidePanelFooter backgroundColor="iu-bg-white" textColor="iu-color-main" additionalStyles={'iu-m-none'}>
      <WCDynamicLink linkKey={'ineraIntygsskola'} />
    </SidePanelFooter>
  )
}

export default AboutCertificatePanelFooter
