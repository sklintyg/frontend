import { useGetLinksQuery } from '../../../store/api'

export function LayoutFooterMobileMenu() {
  const { data: links } = useGetLinksQuery()

  return (
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
      </nav>{' '}
    </div>
  )
}
