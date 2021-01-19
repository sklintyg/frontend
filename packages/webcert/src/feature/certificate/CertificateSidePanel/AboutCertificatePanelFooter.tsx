import React from 'react'
import WCDynamicLink from '../../../components/utils/WCDynamicLink'
import SidePanelFooter from './Footer/SidePanelFooter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

const AboutCertificatePanelFooter = () => {
  return (
    <SidePanelFooter backgroundColor="iu-bg-white" textColor="iu-color-main">
      <FontAwesomeIcon icon={faGraduationCap} className="iu-mr-200" />
      <WCDynamicLink linkKey={'ineraIntygsskola'} />
      <FontAwesomeIcon icon={faExternalLinkAlt} className="iu-fs-200 iu-ml-200" />
    </SidePanelFooter>
  )
}

export default AboutCertificatePanelFooter
