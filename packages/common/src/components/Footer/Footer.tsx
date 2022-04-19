import React from 'react'
import styled from 'styled-components'
import TextWithInfoModal from '../utils/Modal/TextWithInfoModal'
import externalLinkIcon from '../../images/external_link.svg'
import { FooterCookiesModal } from './FooterCookiesModal'

const LinkList = styled.ul`
  columns: 2;
`

const ExternalLinkIconImg = styled.img`
  display: inline;
  top: 2px;
  left: 3px;
  position: relative;
`

export const Footer: React.FC = () => (
  <footer className="ic-page-footer">
    <div className="ic-page-footer__inner">
      <div className="iu-grid-cols-lg-5 ic-container--narrow-md ic-container iu-mb-500">
        <h2 className="ic-page-footer__heading iu-grid-span-lg-2">
          <span className="iu-color-white">Webcert</span>
        </h2>
      </div>
      <div className="iu-grid-cols-lg-12 ic-container--narrow-md ic-container">
        <div className="iu-grid-span-lg-5 iu-color-white ic-text">
          <p>Webcert är en tjänst som drivs av Inera AB.</p>
        </div>
        <nav className="iu-grid iu-grid-span-lg-7 iu-grid-cols-3 iu-pl-xxl iu-hide-sm iu-hide-md" aria-label="Sidfot meny">
          <LinkList className="ic-link-list ic-link-list--nav">
            <li>
              <a className="ic-link-chevron ic-link ic-link--external" target="_blank" href="https://www.inera.se/">
                Inera AB
                <ExternalLinkIconImg src={externalLinkIcon} />
              </a>
            </li>
            <li>
              <a
                className="ic-link-chevron ic-link ic-link--external"
                target="_blank"
                href="https://www.inera.se/kontakta-oss/felanmalan-och-anvandarstod/">
                Inera Support
                <ExternalLinkIconImg src={externalLinkIcon} />
              </a>
            </li>
            <li>
              <FooterCookiesModal className="ic-link-chevron" />
            </li>
            <li>
              <strong>Problem med inloggning?</strong>
            </li>
            <li>
              <a className="ic-link-chevron ic-link ic-link--external" target="_blank" href="https://inera.atlassian.net/wiki/x/SwhmFQ">
                Webcerts informationsyta
                <ExternalLinkIconImg src={externalLinkIcon} />
              </a>
            </li>
          </LinkList>
        </nav>
      </div>
    </div>
    <div className="ic-page-footer__menu iu-hide-from-lg iu-bg-main">
      <nav className="ic-nav-list" id="mobile-nav" aria-label="Sidfot meny mobil">
        <ul className="ic-nav-list__list">
          <li>
            <div className="ic-container--narrow-md iu-px-none">
              <a className="ic-link ic-link--external" target="_blank" href="https://www.inera.se/">
                Inera AB <ExternalLinkIconImg src={externalLinkIcon} />
              </a>
            </div>
          </li>
          <li>
            <div className="ic-container--narrow-md iu-px-none">
              <a
                className="ic-link ic-link--external"
                target="_blank"
                href="https://www.inera.se/kontakta-oss/felanmalan-och-anvandarstod/">
                Inera Support <ExternalLinkIconImg src={externalLinkIcon} />
              </a>
            </div>
          </li>
          <li>
            <div className="ic-container--narrow-md iu-px-none">
              <a className="ic-link ic-link--external" target="_blank" href="https://inera.atlassian.net/wiki/x/SwhmFQ">
                Webcerts informationsyta <ExternalLinkIconImg src={externalLinkIcon} />
              </a>
            </div>
          </li>
          <li>
            <div className="ic-container--narrow-md iu-px-none">
              <FooterCookiesModal />
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
)
