import React from 'react'
import styled from 'styled-components'
import TextWithInfoModal from '../utils/Modal/TextWithInfoModal'
import externalLinkIcon from '../../images/external_link.svg'

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
              <TextWithInfoModal additionalStyles="ic-link-chevron" modalTitle="Om kakor (cookies)" text="Cookiepolicy">
                <p>
                  Vi använder kakor (cookies) för att den här webbplatsen ska fungera på ett bra sätt för dig. Genom att logga in accepterar
                  du vår användning av kakor.
                </p>
                <h3>Så här använder vi kakor</h3>
                <p>
                  Den typ av kakor som används på den här webbplatsen kallas för sessionskakor. De lagras temporärt i din dators minne under
                  tiden du är inne på webbplatsen. Sessionskakor sparar ingen personlig information om dig, och de försvinner när du stänger
                  din webbläsare.
                </p>
                <p>
                  I Webcert används sessionskakor för att du ska kunna navigera i tjänsten utan att behöva logga in på nytt varje gång du
                  går till en ny sida. De används också för att de filterinställningar du gör ska finnas kvar under hela tiden du är
                  inloggad. För att vara säker på att kakorna inte sparas i din dator efter avslutad session måste du stänga webbläsaren när
                  du har loggat ut.
                </p>
                <h3>Undvika kakor</h3>
                <p>
                  Vill du inte acceptera kakor kan din webbläsare ställas in så att du automatiskt nekar till lagring av kakor eller
                  informeras varje gång en webbplats begär att få lagra en kaka. Genom webbläsaren kan också tidigare lagrade kakor raderas.
                  Se webbläsarens hjälpsidor för mer information.
                </p>
                <p>Väljer du att inte acceptera kakor så kan du inte identifiera dig med e-legitimation i denna e-tjänst.</p>
                <p>
                  Mer information om kakor kan du finna på{' '}
                  <a href="https://pts.se/sv/privat/internet/integritet/kakor-cookies/" target="_blank">
                    Kommunikationsmyndigheten PTS sida om kakor launch
                    <ExternalLinkIconImg src={externalLinkIcon} />
                  </a>
                  .
                </p>
              </TextWithInfoModal>
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
            <a className="ic-link ic-link--external" target="_blank" href="https://www.inera.se/">
              Inera AB <ExternalLinkIconImg src={externalLinkIcon} />
            </a>
          </li>
          <li>
            <a className="ic-link ic-link--external" target="_blank" href="https://www.inera.se/kontakta-oss/felanmalan-och-anvandarstod/">
              Inera Support <ExternalLinkIconImg src={externalLinkIcon} />
            </a>
          </li>
          <li>
            <a className="ic-link ic-link--external" target="_blank" href="https://inera.atlassian.net/wiki/x/SwhmFQ">
              Webcerts informationsyta <ExternalLinkIconImg src={externalLinkIcon} />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
)
