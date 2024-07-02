import type React from 'react'
import styled from 'styled-components'
import WCDynamicLink from '../../utils/WCDynamicLink'
import { Footer } from './Footer/Footer'
import { FooterCookiesModal } from './FooterCookiesModal'

const LinkList = styled.ul`
  columns: 2;
`

const getFooterMenu = () => {
  return (
    <LinkList className="ic-link-list ic-link-list--nav">
      <li className="ic-link-chevron iu-color-cta-dark">
        <WCDynamicLink linkKey="ineraStartsida" />
      </li>
      <li className="ic-link-chevron iu-color-cta-dark">
        <WCDynamicLink linkKey="ineraKundserviceAnmalFel" />
      </li>
      <li>
        <FooterCookiesModal className="ic-link-chevron" />
      </li>
      <li>
        <strong>Problem med inloggning?</strong>
      </li>
      <li className="ic-link-chevron iu-color-cta-dark">
        <WCDynamicLink linkKey="intygstjansterInformationFAQ" />
      </li>
    </LinkList>
  )
}

const getMobileFooterMenu = () => {
  return (
    <ul>
      <li>
        <div className="ic-container--narrow-md iu-px-none">
          <WCDynamicLink linkKey="ineraStartsida" />
        </div>
      </li>
      <li>
        <div className="ic-container--narrow-md iu-px-none">
          <WCDynamicLink linkKey="ineraKundserviceAnmalFel" />
        </div>
      </li>
      <li>
        <div className="ic-container--narrow-md iu-px-none">
          <WCDynamicLink linkKey="intygstjansterInformationFAQ" />
        </div>
      </li>
      <li>
        <div className="ic-container--narrow-md iu-px-none">
          <FooterCookiesModal />
        </div>
      </li>
    </ul>
  )
}

export const WebcertFooter: React.FC = () => (
  <Footer
    title="Webcert"
    description="Webcert är en tjänst som drivs av Inera AB."
    footerMenu={getFooterMenu()}
    mobileFooterMenu={getMobileFooterMenu()}
  />
)
