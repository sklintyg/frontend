import SidePanelFooter from '../../feature/certificate/CertificateSidePanel/Footer/SidePanelFooter'
import WCDynamicLink from '../../utils/WCDynamicLink'

const FMBPanelFooter = () => {
  return (
    <SidePanelFooter additionalStyles="iu-m-none">
      <WCDynamicLink linkKey="fmbSoc" />
    </SidePanelFooter>
  )
}

export default FMBPanelFooter
