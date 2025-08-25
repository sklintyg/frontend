import '@inera/ids-design/components/footer-1177-admin/footer-1177-admin.css'
import { useGetLinksQuery } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowCookieDialog } from '../../../store/slices/cookieDialog.slice'
import { CookieDialog } from '../../dialog/CookieDialog'
import { DynamicLink } from '../../DynamicLink/DynamicLink'
import { LayoutFooterMobileLinks } from './LayoutFooterMobileLinks'
import { LayoutFooterMobileMenu } from './LayoutFooterMobileMenu'
import { LayoutFooterMobileSubFooter } from './LayoutFooterMobileSubFooter'

export function LayoutFooter() {
  const { data: links } = useGetLinksQuery()
  const dispatch = useAppDispatch()

  return (
    <footer className="ids-footer-1177-admin">
      <CookieDialog />
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
              <button type="button" onClick={() => dispatch(updateShowCookieDialog(true))} className="ids-link ids-link--light">
                Hantering av kakor
              </button>
            </div>

            <LayoutFooterMobileMenu />
            <LayoutFooterMobileLinks />
            <LayoutFooterMobileSubFooter />
          </div>
        </div>
      </div>
    </footer>
  )
}
