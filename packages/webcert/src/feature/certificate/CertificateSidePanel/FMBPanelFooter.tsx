import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import sosLogo from './socialstyrelsen.png'
import WCDynamicLink from '../../../components/utils/WCDynamicLink'
import SidePanelFooter from './Footer/SidePanelFooter'
import styled from 'styled-components'

const LogoWrapper = styled.div`
  margin-left: auto;
  width: 40px;
`

const FMBPanelFooter: React.FC = () => {
  return (
    <SidePanelFooter backgroundColor="iu-bg-sky-dark" textColor="iu-color-white">
      <WCDynamicLink linkKey={'fmbSoc'} />
      <FontAwesomeIcon icon={faExternalLinkAlt} className="iu-ml-200 iu-fs-100" />
      <LogoWrapper>
        <img alt="" src={sosLogo} />
      </LogoWrapper>
    </SidePanelFooter>
  )
}

export default FMBPanelFooter
