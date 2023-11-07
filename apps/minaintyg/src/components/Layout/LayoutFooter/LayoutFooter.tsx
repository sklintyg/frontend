import { IDSFooter, IDSIconChevronBold, IDSIconExternal, IDSLink } from '@frontend/ids-react-ts'
import footerLinks from '../../../data/footer-links.json'
import { LayoutFooterLink } from './LayoutFooterLink'
import { LayoutFooterMobile } from './LayoutFooterMobile'

export function LayoutFooter() {
  return (
    <IDSFooter type="1177" headline="1177" subheadline="– tryggt om din hälsa och vård" cols={2} className="print:hidden">
      <p>1177 är en tjänst från Sveriges regioner. Vi finns alltid med dig när du vill må bättre.</p>

      {footerLinks.map(({ col, links }) =>
        links.map(({ title, url, target }) => (
          <IDSLink key={`${col}-${title}`} slot={`link-col-${col}`}>
            <IDSIconChevronBold />
            <a href={url} target={target}>
              {title}
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

      {['left', 'mobile'].map((slot) => (
        <span key={slot} slot={`sub-footer-${slot}`} className="relative">
          1177 drivs av{' '}
          <LayoutFooterLink href="https://www.inera.se/" target="_blank">
            Inera AB
          </LayoutFooterLink>{' '}
          på uppdrag av Sveriges regioner.
        </span>
      ))}
      <LayoutFooterMobile />
    </IDSFooter>
  )
}
