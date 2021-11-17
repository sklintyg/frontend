import React from 'react'
import WCDynamicLink from '../../../components/utils/WCDynamicLink'
import SidePanelFooter from './Footer/SidePanelFooter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

const AboutCertificatePanelFooter = () => {
  return (
    <SidePanelFooter backgroundColor="iu-bg-white" textColor="iu-color-main">
      <WCDynamicLink linkKey={'ineraIntygsskola'} />
    </SidePanelFooter>
  )
}

export default AboutCertificatePanelFooter
