import React from 'react'
import WCDynamicLink from '../../../components/utils/WCDynamicLink'
import SidePanelFooter from './Footer/SidePanelFooter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

const AboutCertificatePanelFooter = () => {
  return (
    <SidePanelFooter backgroundColor="iu-bg-white" textColor="iu-color-main">
      <a href={'https://inera.atlassian.net/wiki/spaces/EIT/pages/358876066/Intygsskolan'} target="_blank">
        Hitta svar på dina frågor i Ineras intygsskola
      </a>
      <FontAwesomeIcon icon={faExternalLinkAlt} className="iu-fs-200 iu-ml-200" />
    </SidePanelFooter>
  )
}

export default AboutCertificatePanelFooter
