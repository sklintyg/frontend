import { IDSFooter, IDSIconChevronBold, IDSIconExternal, IDSLink, IDSMobileMenu, IDSMobileMenuItem } from '@frontend/ids-react-ts'
import navigation from '../../data/1177-navbar-services.json'
import { resolveNavigationUrl } from '../../utils/resolveNavigationUrl'
import { LayoutFooterLink } from './LayoutFooterLink'

const footerLinks = [
  {
    col: '2',
    links: [
      ['Support', 'https://www.1177.se/e-tjanster-support', '_blank'],
      [
        'Tillgänglighet',
        'https://www.1177.se/om-1177/1177.se/tillganglighet-pa-1177/tillganglighetsredogorelse-for-e-tjanster-pa-1177.se/',
        '_blank',
      ],
    ],
  },
  {
    col: '3',
    links: [
      ['Läs mer om e-tjänster', 'https://www.1177.se/e-tjanster', '_blank'],
      ['Webbkarta', 'https://e-tjanster.1177.se/mvk/sitemap.xhtml', '_self'],
    ],
  },
]

export function LayoutFooter() {
  const startLinkItem = navigation.menu.items.find(({ name }) => name === 'Start')
  return (
    <IDSFooter type="1177" headline="1177" subheadline="– tryggt om din hälsa och vård" className="print:hidden">
      <p>1177 är en tjänst från Sveriges regioner. Vi finns alltid med dig när du vill må bättre.</p>

      {footerLinks.map(({ col, links }) =>
        links.map(([name, url, target]) => (
          <IDSLink key={`${col}-${name}`} slot={`link-col-${col}`}>
            <IDSIconChevronBold />
            <a href={url} target={target}>
              {name}
            </a>
            {target === '_blank' && <IDSIconExternal slot="append-icon" />}
          </IDSLink>
        ))
      )}

      <span slot="sub-footer-right" className="relative">
        <LayoutFooterLink href="https://www.1177.se/om-1177/1177.se/hantering-av-personuppgifter-pa-1177.se/" target="_blank">
          Behandling av personuppgifter
        </LayoutFooterLink>
      </span>
      <span slot="sub-footer-right" className="relative">
        <LayoutFooterLink href="https://www.1177.se/om-1177/1177.se/hantering-av-kakor-cookies-pa-1177.se/" target="_blank">
          Hantering av kakor
        </LayoutFooterLink>
      </span>

      {startLinkItem &&
        ['left', 'mobile'].map((slot) => (
          <span key={slot} slot={`sub-footer-${slot}`} className="relative">
            1177 drivs av{' '}
            <LayoutFooterLink href={resolveNavigationUrl(startLinkItem.url)} target="_blank">
              Inera AB
            </LayoutFooterLink>{' '}
            på uppdrag av Sveriges regioner.
          </span>
        ))}

      <IDSMobileMenu>
        {footerLinks.map(({ col, links }) =>
          links.map(([name, url, target]) => (
            <IDSMobileMenuItem key={`${col}-${name}`}>
              <a href={url} target={target} rel="noreferrer" className="relative">
                {name}
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
    </IDSFooter>
  )
}
