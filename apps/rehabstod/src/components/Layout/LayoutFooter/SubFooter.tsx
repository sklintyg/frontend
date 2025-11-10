import { TertiaryButton } from '@frontend/components'
import { useGetLinksQuery } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowCookieDialog } from '../../../store/slices/cookieDialog.slice'
import { DynamicLink } from '../../DynamicLink/DynamicLink'
import { MobileMenu } from './MobileMenu'
import { ServiceLink } from './ServiceLink'

export function SubFooter() {
  const { data: links } = useGetLinksQuery()
  const dispatch = useAppDispatch()

  return (
    <div className="ids-footer-1177-admin__sub-footer">
      <div className="ids-footer-1177-admin__sub-footer-container">
        <div className="ids-footer-1177-admin__sub-footer-row">
          <div className="ids-footer-1177-admin__sub-footer-left">
            <ServiceLink />
          </div>
          <div className="ids-footer-1177-admin__sub-footer-right">
            <DynamicLink link={links?.ineraBehandlingPersonuppgifter} small colorPreset={4} />
            <TertiaryButton small colorPreset={4} onClick={() => dispatch(updateShowCookieDialog(true))}>
              Hantering av kakor
            </TertiaryButton>
          </div>
          <MobileMenu />
        </div>
      </div>
    </div>
  )
}
