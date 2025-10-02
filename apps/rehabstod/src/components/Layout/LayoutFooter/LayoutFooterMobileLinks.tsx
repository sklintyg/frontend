import { useGetLinksQuery } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { updateShowCookieDialog } from '../../../store/slices/cookieDialog.slice'

export function LayoutFooterMobileLinks() {
  const { data: links } = useGetLinksQuery()
  const dispatch = useAppDispatch()

  return (
    <div className="ids-footer-1177-admin__mobile-links">
      {links?.ineraBehandlingPersonuppgifter && (
        <a className="ids-link ids-link--icon ids-link--small ids-link--underlined" href={links.ineraBehandlingPersonuppgifter.url}>
          {links.ineraBehandlingPersonuppgifter.text}
          <span className="ids-icon-external-link-small ids-icon--text-end" />
        </a>
      )}
      <button
        type="button"
        onClick={() => dispatch(updateShowCookieDialog(true))}
        className="ids-link ids-link--icon ids-link--small ids-link--underlined"
      >
        Hantering av kakor
      </button>
    </div>
  )
}
