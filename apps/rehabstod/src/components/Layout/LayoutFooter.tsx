import '@inera/ids-design/components/footer-1177-admin/footer-1177-admin.css'
import { useState } from 'react'
import { useGetLinksQuery } from '../../store/api'
import { CookieDialog } from '../dialog/CookieDialog'
import { DynamicLink } from '../DynamicLink/DynamicLink'

export function LayoutFooter() {
  const { data: links } = useGetLinksQuery()
  const [cookieDialogOpen, setCookieDialogOpen] = useState(false)

  return (
    <footer className="ids-footer-1177-admin">
      <CookieDialog open={cookieDialogOpen} onOpenChange={setCookieDialogOpen} />
      <div className="ids-footer-1177-admin__inner-wrapper">
        <div className="ids-footer-1177-admin__inner">
          <div className="ids-footer-1177-admin__headline-row">
            <h1 className="ids-footer-1177-admin__headline">Rehabstöd</h1>
          </div>
          <div className="ids-footer-1177-admin__content">
            <div className="ids-footer-1177-admin__text">
              <p>Rehabstöd används för att samordna och följa upp sjukskrivna patienters rehabilitering.</p>
            </div>

            <div className="ids-footer-1177-admin__link-col">
              <ul>
                <li>
                  <DynamicLink arrow colorpreset={1} link={links?.ineraManualRehabstod} />
                </li>
                <li>
                  <DynamicLink arrow colorpreset={1} link={links?.ineraNationellKundservice} />
                </li>
              </ul>
            </div>

            <div className="ids-footer-1177-admin__link-col">
              <ul>
                <li>
                  <DynamicLink arrow colorpreset={1} link={links?.rehabstodTillganglighetsredogorelse} />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="ids-footer-1177-admin__sub-footer">
        <div className="ids-footer-1177-admin__sub-footer-container">
          <div className="ids-footer-1177-admin__sub-footer-row">
            <div className="ids-footer-1177-admin__sub-footer-left">
              <p>
                <span>Rehabstöd drivs av</span> <DynamicLink small underlined light link={links?.ineraMainPage} />
              </p>
            </div>
            <div className="ids-footer-1177-admin__sub-footer-right">
              {links?.ineraBehandlingPersonuppgifter && (
                <a className="ids-link ids-link--light" href={links.ineraBehandlingPersonuppgifter.url}>
                  {links.ineraBehandlingPersonuppgifter.text}
                  <span className="ids-icon-external-link-small ids-icon--text-end" />
                </a>
              )}
              <button type="button" onClick={() => setCookieDialogOpen(true)} className="ids-link ids-link--light">
                Hantering av kakor
              </button>
            </div>

            <div className="ids-footer-1177-admin__mobile-menu">
              <nav className="ids-mobile-menu ids-mobile-menu--variation-2" aria-label="mobile-menu">
                <ul>
                  {[links?.ineraManualRehabstod, links?.ineraNationellKundservice, links?.rehabstodTillganglighetsredogorelse].map(
                    (link) =>
                      link ? (
                        <li key={link.url} className="ids-mobile-menu-item">
                          <div className="ids-mobile-menu-item__inner">
                            <a href={link.url} target={link.target}>
                              {link.text}
                              {link.target === '_blank' && <span className="ids-icon-external-link ids-icon--text-end ml-1" />}
                            </a>
                          </div>
                        </li>
                      ) : null
                  )}
                </ul>
              </nav>{' '}
            </div>

            <div className="ids-footer-1177-admin__mobile-links">
              {links?.ineraBehandlingPersonuppgifter && (
                <a className="ids-link ids-link--icon ids-link--small ids-link--underlined" href={links.ineraBehandlingPersonuppgifter.url}>
                  {links.ineraBehandlingPersonuppgifter.text}
                  <span className="ids-icon-external-link-small ids-icon--text-end" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setCookieDialogOpen(true)}
                className="ids-link ids-link--icon ids-link--small ids-link--underlined"
              >
                Hantering av kakor
              </button>
            </div>

            <div className="ids-footer-1177-admin__sub-footer-mobile">
              <div className="ids-footer-1177-admin__sub-footer-mobile-icon">
                <div className="ids-footer-1177-admin__sub-footer-mobile-service-name">Rehabstöd</div>
              </div>
              <div className="ids-footer-1177-admin__sub-footer-mobile-text">
                <p>
                  <span>Rehabstöd drivs av</span> <DynamicLink small underlined link={links?.ineraMainPage} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
