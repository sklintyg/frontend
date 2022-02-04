import React from 'react'
import sosLogo from '../../feature/certificate/CertificateSidePanel/socialstyrelsen.png'
import SidePanelFooter from '../../feature/certificate/CertificateSidePanel/Footer/SidePanelFooter'
import styled from 'styled-components'
import WCDynamicLink from '../utils/WCDynamicLink'

const LogoWrapper = styled.div`
  margin-left: auto;
  width: 40px;
`

const FMBPanelFooter: React.FC = () => {
  return (
    <SidePanelFooter backgroundColor="iu-bg-main iu-m-none" textColor="iu-color-white">
      <WCDynamicLink linkKey={'fmbSoc'} light />
      <LogoWrapper>
        <img alt="" src={sosLogo} />
      </LogoWrapper>
    </SidePanelFooter>
  )
}

export default FMBPanelFooter
