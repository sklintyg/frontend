import { IDSFooter1177, IDSLink, IDSMobileMenu, IDSMobileMenuItem } from '@inera/ids-react'
import { Icon } from '../../../Icon'
import { classNames } from '../../../utils'

export function LayoutFooter({ hasSession }: { hasSession: boolean }) {
  return (
    <IDSFooter1177
      headline="1177"
      subHeadline=" - tryggt om din hälsa och vårt"
      cols={2}
      col1Size="3"
      col2Size="3"
      col1={[
        <IDSLink key="support">
          <a href="https://www.1177.se/e-tjanster-support" target="_blank" rel="noreferrer">
            <Icon icon="arrow-right" textStart />
            Support
            <Icon icon="external-link" textEnd />
          </a>
        </IDSLink>,
        <IDSLink key="tillgänglighet">
          <a
            href="https://www.1177.se/om-1177/1177.se/tillganglighet-pa-1177/tillganglighetsredogorelse-for-e-tjanster-pa-1177.se/"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon="arrow-right" textStart />
            Tillgänglighet
            <Icon icon="external-link" textEnd />
          </a>
        </IDSLink>,
      ]}
      col2={[
        <IDSLink key="read-more">
          <a href="https://www.1177.se/e-tjanster" target="_blank" rel="noreferrer">
            <Icon icon="arrow-right" textStart />
            Läs mer om e-tjänster
            <Icon icon="external-link" textEnd />
          </a>
        </IDSLink>,
        <IDSLink key="webbkarta" className={classNames(!hasSession && 'hidden')}>
          <a href="https://e-tjanster.1177.se/mvk/sitemap.xhtml">
            <Icon icon="arrow-right" textStart />
            Webbkarta
          </a>
        </IDSLink>,
      ]}
      mobileLinks={
        <>
          <IDSLink>
            <a href="https://www.1177.se/om-1177/1177.se/hantering-av-personuppgifter-pa-1177.se/" target="_blank" rel="noreferrer">
              Behandling av personuppgifter
            </a>
          </IDSLink>
          <IDSLink>
            <a href="https://www.1177.se/om-1177/1177.se/hantering-av-kakor-cookies-pa-1177.se/" target="_blank" rel="noreferrer">
              Hantering av kakor
            </a>
          </IDSLink>
        </>
      }
      mobileMenu={
        <IDSMobileMenu variation={1}>
          <IDSMobileMenuItem
            link={
              <a href="https://www.1177.se/e-tjanster-support" target="_blank" rel="noreferrer">
                Support
                <Icon icon="external-link" textEnd />
              </a>
            }
          />
          <IDSMobileMenuItem
            link={
              <a
                href="https://www.1177.se/om-1177/1177.se/tillganglighet-pa-1177/tillganglighetsredogorelse-for-e-tjanster-pa-1177.se/"
                target="_blank"
                rel="noreferrer"
              >
                Tillgänglighet
                <Icon icon="external-link" textEnd />
              </a>
            }
          />
          <IDSMobileMenuItem
            link={
              <a href="https://www.1177.se/e-tjanster" target="_blank" rel="noreferrer">
                Läs mer om e-tjänster
                <Icon icon="external-link" textEnd />
              </a>
            }
          />
          <IDSMobileMenuItem
            className={classNames('ids-mobile-menu-item', !hasSession && 'hidden')}
            link={
              <a href="https://e-tjanster.1177.se/mvk/sitemap.xhtml" className={classNames(!hasSession && 'hidden')}>
                Webbkarta
              </a>
            }
          />
        </IDSMobileMenu>
      }
      subFooterMobile={
        <p>
          1177 drivs av{' '}
          <IDSLink colorPreset={4} small underlined>
            <a href="html-external-link">
              Inera AB
              <Icon icon="external-link" textEnd />
            </a>
          </IDSLink>{' '}
          på uppdrag av Sveriges regioner
        </p>
      }
      subFooterLeft={
        <p>
          1177 drivs av{' '}
          <IDSLink colorPreset={4} small underlined>
            <a href="https://www.inera.se/" target="_blank" rel="noreferrer">
              Inera AB
              <Icon icon="external-link" textEnd />
            </a>
          </IDSLink>{' '}
          på uppdrag av Sveriges regioner
        </p>
      }
      subFooterRight={
        <>
          <IDSLink>
            <a href="https://www.1177.se/om-1177/1177.se/hantering-av-personuppgifter-pa-1177.se/" target="_blank" rel="noreferrer">
              Behandling av personuppgifter
            </a>
          </IDSLink>
          <IDSLink>
            <a href="https://www.1177.se/om-1177/1177.se/hantering-av-kakor-cookies-pa-1177.se/" target="_blank" rel="noreferrer">
              Hantering av kakor
            </a>
          </IDSLink>
        </>
      }
      className="print:hidden"
    >
      <p>1177 är en tjänst från Sveriges regioner. Vi finns alltid med dig när du vill må bättre.</p>
    </IDSFooter1177>
  )
}
