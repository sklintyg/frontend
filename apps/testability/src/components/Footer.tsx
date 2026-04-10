import { IDSFooterIneraAdmin } from '@inera/ids-react'
import '@inera/ids-design/components/footer-inera-admin/footer-inera-admin.css'

type FooterProps = {
  isDarkMode: boolean;
  onThemeChange: (isDarkMode: boolean) => void;
};

export function Footer({ isDarkMode, onThemeChange }: FooterProps) {
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
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="ids-link ids-link--icon ids-link--footer ids-link--block ids-link--color-1"
                    >
                      <span className="ids-icon-arrow-right-small ids-icon--text-start" aria-hidden="true"></span>Link 1
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="ids-link ids-link--icon ids-link--footer ids-link--block ids-link--color-1"
                    >
                      <span className="ids-icon-arrow-right-small ids-icon--text-start" aria-hidden="true"></span>Link 2
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
                <a href="#">Mobile link 1</a>
              </div>
            </li>
            <li className="ids-mobile-menu-item">
              <div className="ids-mobile-menu-item__inner">
                <a href="#">Mobile link 2</a>
              </div>
            </li>
            <li className="ids-mobile-menu-item">
              <div className="ids-mobile-menu-item__inner">
                <a href="#">Mobile link 3</a>
              </div>
            </li>
          </ul>
        </nav>{' '}
      </div>

      <div className="ids-footer-inera-admin__sub-footer">
        <div className="ids-footer-inera-admin__sub-footer-container">
          <div className="ids-footer-inera-admin__sub-footer-inner">
            <div className="ids-footer-inera-admin__sub-footer-left">
              <a href="#" onClick={(e) => e.preventDefault()} className="ids-link ids-link--small ids-link--color-3">
                Behandling av personuppgifter
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="ids-link ids-link--small ids-link--color-3">
                Hantering av kakor
              </a>
              <button>Inställningar för kakor</button>
            </div>
            <div className="ids-footer-inera-admin__sub-footer-right">
              <p>
                {' '}
                Tjänsten drivs av{' '}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
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
              <a href="#" onClick={(e) => e.preventDefault()} className="ids-link ids-link--color-3">
                Behandling av personuppgifter
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="ids-link ids-link--color-3">
                Hantering av kakor
              </a>
              <button>Inställningar för kakor</button>
            </div>
          </div>
        </div>

        <div className="ids-footer-inera-admin__sub-footer-mobile">
          <div className="ids-footer-inera-admin__sub-footer-mobile-text">
            <p>
              {' '}
              Tjänsten drivs av{' '}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
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
    </footer>
  )
}