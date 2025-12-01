import { TertiaryButton } from '@frontend/components'
import { useGetLinksQuery } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowCookieDialog } from '../../../store/slices/cookieDialog.slice'
import { DynamicLink } from '../../DynamicLink/DynamicLink'
import { ServiceLink } from './ServiceLink'

export function MobileMenu() {
  const { data: links } = useGetLinksQuery()
  const dispatch = useAppDispatch()

  return (
    <>
      <div className="ids-footer-1177-admin__mobile-menu">
        <nav className="ids-mobile-menu ids-mobile-menu--variation-2" aria-label="mobile-menu">
          <ul>
            {[links?.ineraManualRehabstod, links?.ineraNationellKundservice, links?.rehabstodTillganglighetsredogorelse].map((link) =>
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
        </nav>
      </div>
      <div className="ids-footer-1177-admin__mobile-links">
        <DynamicLink link={links?.ineraBehandlingPersonuppgifter} />
        <TertiaryButton onClick={() => dispatch(updateShowCookieDialog(true))}>Hantering av kakor</TertiaryButton>
      </div>
      <div className="ids-footer-1177-admin__sub-footer-mobile">
        <div className="ids-footer-1177-admin__sub-footer-mobile-icon">
          <div className="ids-footer-1177-admin__sub-footer-mobile-service-name">Rehabstöd</div>
        </div>
        <div className="ids-footer-1177-admin__sub-footer-mobile-text">
          <ServiceLink mobile />
        </div>
      </div>
    </>
  )
}
