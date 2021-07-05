import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import sosLogo from '../../feature/certificate/CertificateSidePanel/socialstyrelsen.png'
import SidePanelFooter from '../../feature/certificate/CertificateSidePanel/Footer/SidePanelFooter'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const LogoWrapper = styled.div`
  margin-left: auto;
  width: 40px;
`

const FMBPanelFooter: React.FC = () => {
  return (
    <SidePanelFooter backgroundColor="iu-bg-main" textColor="iu-color-white">
      <Link className="ic-link iu-fs-200 iu-color-white" target="_blank" to={{ pathname: 'https://roi.socialstyrelsen.se/fmb' }}>
        <p className="iu-fs-200">
          Läs mer om FMB hos Socialstyrelsen
          <FontAwesomeIcon icon={faExternalLinkAlt} className="iu-ml-200 iu-fs-100" />
        </p>
      </Link>
      <LogoWrapper>
        <img alt="" src={sosLogo} />
      </LogoWrapper>
    </SidePanelFooter>
  )
}

export default FMBPanelFooter
