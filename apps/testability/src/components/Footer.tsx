import { IDSDialog, IDSContainer, IDSRow, IDSColumn, IDSButton } from '@inera/ids-react'
import '@inera/ids-design/components/footer-inera-admin/footer-inera-admin.css'
import { useState } from 'react';

type FooterProps = {
  isDarkMode: boolean;
  onThemeChange: (isDarkMode: boolean) => void;
};

export function Footer({ isDarkMode, onThemeChange }: FooterProps) {

  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false)

  return (
    <footer className="ids-footer-inera-admin">
      <div className="ids-footer-inera-admin__inner-wrapper">
        <div className="ids-footer-inera-admin__inner">
          <div className="ids-footer-inera-admin__headline-wrapper">
            <h2 className="ids-footer-inera-admin__headline"> Inera </h2>
          </div>

          <div className="ids-footer-inera-admin__content">
            <div className="ids-footer-inera-admin__text">
              Inera är kommunernas och regionernas digitaliseringsbolag med uppdrag att utveckla välfärden
              <div className="ids-footer-inera-admin__darkmode-toggle">
                <div className="ids-darkmode-toggle">
                  <input
                    type="checkbox"
                    aria-label="darkmode"
                    id="id-5b8ec870-74a0-4aa8-b128-1dc57a59eb90"
                    checked={isDarkMode}
                    onChange={(e) => onThemeChange(e.target.checked)}
                  />
                  <div className="ids-label-wrapper">
                    <label className="ids-label" htmlFor="id-5b8ec870-74a0-4aa8-b128-1dc57a59eb90">
                      Utseende
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="ids-footer-inera-admin__cols">
              <div className="ids-footer-inera-admin__link-col ids-footer-inera-admin__link-col--33">
                <ul>
                  <li>
                    <a
                      href="https://inera.atlassian.net/wiki/x/hYFi"
                      className="ids-link ids-link--icon ids-link--footer ids-link--block ids-link--color-1"
                    >
                      <span className="ids-icon-arrow-right-small ids-icon--text-start" aria-hidden="true"></span>Intygtjänster
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="ids-link ids-link--icon ids-link--footer ids-link--block ids-link--color-1"
                    >
                      <span className="ids-icon-arrow-right-small ids-icon--text-start" aria-hidden="true"></span>Tillgänglighetredogörelse
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ids-footer-inera-admin__mobile-menu">
        {' '}
        <nav className="ids-mobile-menu ids-mobile-menu--variation-2" aria-label="mobile-menu">
          <ul>
            <li className="ids-mobile-menu-item">
              <div className="ids-mobile-menu-item__inner">
                <a href="https://inera.atlassian.net/wiki/x/hYFi">Intygtjänster</a>
              </div>
            </li>
            <li className="ids-mobile-menu-item">
              <div className="ids-mobile-menu-item__inner">
                <a href="#">Tillgänglighetredogörelse</a>
              </div>
            </li>
          </ul>
        </nav>{' '}
      </div>

      <div className="ids-footer-inera-admin__sub-footer">
        <div className="ids-footer-inera-admin__sub-footer-container">
          <div className="ids-footer-inera-admin__sub-footer-inner">
            <div className="ids-footer-inera-admin__sub-footer-left">
              <a href="https://www.1177.se/om-1177/1177.se/hantering-av-personuppgifter-pa-1177.se/" className="ids-link ids-link--small ids-link--color-3">
                Behandling av personuppgifter
              </a>
              <button type="button" onClick={() => setIsCookieModalOpen(true)} className="ids-link ids-link--small ids-link--color-3">
                Hantering av kakor
              </button>
            </div>
            <div className="ids-footer-inera-admin__sub-footer-right">
              <p>
                {' '}
                Tjänsten drivs av{' '}
                <a
                  href="https://www.inera.se/"
                  className="ids-link ids-link--icon ids-link--underlined ids-link--small ids-link--color-3"
                >
                  <span>
                    Inera AB<span className="ids-icon-external-link-small ids-icon--text-end" aria-hidden="true"></span>
                  </span>
                </a>{' '}
                på uppdrag av Sveriges regioner
              </p>
            </div>

            <div className="ids-footer-inera-admin__mobile-links">
              <a href="https://www.inera.se/om-webbplatsen/behandling-av-personuppgifter/" className="ids-link ids-link--color-3">
                Behandling av personuppgifter
              </a>
              <button type="button" onClick={() => setIsCookieModalOpen(true)} className="ids-link ids-link--color-3">
                Hantering av kakor
              </button>
            </div>
          </div>
        </div>

        <div className="ids-footer-inera-admin__sub-footer-mobile">
          <div className="ids-footer-inera-admin__sub-footer-mobile-text">
            <p>
              {' '}
              Tjänsten drivs av{' '}
              <a
                href="https://www.inera.se/"
                className="ids-link ids-link--icon ids-link--underlined ids-link--small ids-link--color-3"
              >
                <span>
                  Inera AB<span className="ids-icon-external-link-small ids-icon--text-end" aria-hidden="true"></span>
                </span>
              </a>{' '}
              på uppdrag av Sveriges regioner
            </p>
          </div>
        </div>
      </div>
      <IDSDialog role="dialog" show={isCookieModalOpen} onVisibilityChange={setIsCookieModalOpen}>
        <IDSContainer className="flex flex-col gap-4">
          <IDSRow>
            <IDSColumn>
              <h1 className="ids-heading-xl">Om kakor (cookies)</h1>
              <p>Vi använder kakor (cookies) för att den här webbplatsen ska fungera på ett bra sätt för dig. Genom att logga in accepterar du vår användning av kakor.</p>
            </IDSColumn>
          </IDSRow>
          <IDSRow>
            <IDSColumn>
              <h2 className="ids-heading-s">Såhär använder vi kakor</h2>
              <p>Den typ av kakor som används på den här webbplatsen kallas för sessionskakor. De lagras temporärt i din dators minne under tiden du är inne på webbplatsen. Sessionskakor sparar ingen personlig information om dig, och de försvinner när du stänger din webbläsare. I Rehabstöd används sessionskakor för att du ska kunna navigera i tjänsten utan att behöva logga in på nytt varje gång du går till en ny sida. De används också för att de filterinställningar du gör ska finnas kvar under hela tiden du är inloggad. För att vara säker på att kakorna inte sparas i din dator efter avslutad session måste du stänga webbläsaren när du har loggat ut.</p>
            </IDSColumn>
          </IDSRow>
          <IDSRow>
            <IDSColumn>
              <h2 className="ids-heading-s">Undvika kakor</h2>
              <p>Vill du inte acceptera kakor kan din webbläsare ställas in så att du automatiskt nekar till lagring av kakor eller informeras varje gång en webbplats begär att få lagra en kaka. Genom webbläsaren kan också tidigare lagrade kakor raderas. Se webbläsarens hjälpsidor för mer information. Väljer du att inte acceptera kakor så kan du inte identifiera dig med e-legitimation i denna e-tjänst.
Mer information om kakor kan du finna på <a className='ids-anchor ids-ml-2' href=" https://pts.se/internet-och-telefoni/kakor-cookies/">Post- och telestyrelsens sida om kakor</a></p>
            </IDSColumn>
          </IDSRow>
          <IDSRow>
            <IDSColumn className='flex justify-center'>
              <IDSButton
                type='button'
                onClick={() => setIsCookieModalOpen(false)}
              >
                Stäng
              </IDSButton>
            </IDSColumn>
          </IDSRow>
        </IDSContainer>
      </IDSDialog>
    </footer>
    
  )
}