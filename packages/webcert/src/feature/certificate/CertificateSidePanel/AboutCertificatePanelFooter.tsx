import React from 'react'
import SchoolIcon from '@material-ui/icons/School'
import LaunchIcon from '@material-ui/icons/Launch'
import WCDynamicLink from '../../../components/utils/WCDynamicLink'
import SidePanelFooter from './Footer/SidePanelFooter'

const AboutCertificatePanelFooter = () => {
  return (
    <SidePanelFooter backgroundColor="iu-bg-white" textColor="iu-color-main">
      <SchoolIcon className="iu-mr-200" />
      <WCDynamicLink linkKey={'ineraIntygsskola'} />
      <LaunchIcon className="iu-fs-200 iu-ml-100" />
    </SidePanelFooter>
  )
}

export default AboutCertificatePanelFooter
