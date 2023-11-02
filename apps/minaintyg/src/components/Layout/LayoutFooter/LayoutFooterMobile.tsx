import { IDSIconExternal, IDSMobileMenu, IDSMobileMenuItem } from '@frontend/ids-react-ts'
import footerLinks from '../../../data/footer-links.json'
import { LayoutFooterLink } from './LayoutFooterLink'

export function LayoutFooterMobile() {
  return (
    <>
      <IDSMobileMenu>
        {footerLinks.map(({ col, links }) =>
          links.map(({ title, url, target }) => (
            <IDSMobileMenuItem key={`${col}-${title}`}>
              <a href={url} target={target} rel="noreferrer" className="relative">
                {title}
                {target === '_blank' && (
                  <IDSIconExternal
                    className="ids-ml-2 relative -bottom-0.5"
                    inline
                    color="var(--mobile-menu-item-icon_color)"
                    height="100%"
                    width="17"
                  />
                )}
              </a>
            </IDSMobileMenuItem>
          ))
        )}
      </IDSMobileMenu>

      <span slot="sub-footer-links">
        <LayoutFooterLink href="https://www.1177.se/om-1177/1177.se/hantering-av-personuppgifter-pa-1177.se/" target="_blank">
          Behandling av personuppgifter
        </LayoutFooterLink>
      </span>
      <span slot="sub-footer-links">
        <LayoutFooterLink href="https://www.1177.se/om-1177/1177.se/hantering-av-kakor-cookies-pa-1177.se/" target="_blank">
          Hantering av kakor
        </LayoutFooterLink>
      </span>
    </>
  )
}
