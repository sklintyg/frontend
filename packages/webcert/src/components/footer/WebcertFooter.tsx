import { FooterCookiesModal } from './FooterCookiesModal'
import React from 'react'
import styled from 'styled-components'
import WCDynamicLink from '../../utils/WCDynamicLink'
import { Footer } from '@frontend/common'

const LinkList = styled.ul`
  columns: 2;
`

const getFooterMenu = () => {
  const footerMenu: React.ReactNode[] = []

  footerMenu.push(
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

  return footerMenu
}

const getMobileFooterMenu = () => {
  const mobileFooterMenu: React.ReactNode[] = []

  mobileFooterMenu.push(
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

  return mobileFooterMenu
}

export const WebcertFooter: React.FC = () => (
  <Footer
    title="Webcert"
    description="Webcert är en tjänst som drivs av Inera AB."
    footerMenu={getFooterMenu()}
    mobileFooterMenu={getMobileFooterMenu()}
  />
)
