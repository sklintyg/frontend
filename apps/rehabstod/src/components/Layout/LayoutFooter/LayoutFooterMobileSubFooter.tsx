import { useGetLinksQuery } from '../../../store/api'
import { DynamicLink } from '../../DynamicLink/DynamicLink'

export function LayoutFooterMobileSubFooter() {
  const { data: links } = useGetLinksQuery()

  return (
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
  )
}
