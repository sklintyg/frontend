import { IDSFooter1177, IDSMobileMenu, IDSMobileMenuItem } from '@inera/ids-react'
import { AppLink } from '../../../AppLink'
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
        <AppLink key="support" to="https://www.1177.se/e-tjanster-support" underlined={false} external largeIcon arrow>
          Support
        </AppLink>,
        <AppLink
          key="tillgänglighet"
          to="https://www.1177.se/om-1177/1177.se/tillganglighet-pa-1177/tillganglighetsredogorelse-for-e-tjanster-pa-1177.se/"
          underlined={false}
          external
          largeIcon
          arrow
        >
          Läs mer om e-tjänster
        </AppLink>,
      ]}
      col2={[
        <AppLink key="read-more" to="https://www.1177.se/e-tjanster" underlined={false} external largeIcon arrow>
          Läs mer om e-tjänster
        </AppLink>,
        hasSession ? (
          <AppLink key="webbkarta" to="https://e-tjanster.1177.se/mvk/sitemap.xhtml" arrow>
            Webbkarta
          </AppLink>
        ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <></>
        ),
      ]}
      mobileLinks={
        <>
          <AppLink to="https://www.1177.se/om-1177/1177.se/hantering-av-personuppgifter-pa-1177.se/" external>
            Behandling av personuppgifter
          </AppLink>
          <AppLink to="https://www.1177.se/om-1177/1177.se/hantering-av-kakor-cookies-pa-1177.se/" external>
            Hantering av kakor
          </AppLink>
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
          <AppLink to="https://www.inera.se/" colorPreset={4} small external>
            Inera AB
          </AppLink>{' '}
          på uppdrag av Sveriges regioner
        </p>
      }
      subFooterLeft={
        <p>
          1177 drivs av{' '}
          <AppLink to="https://www.inera.se/" colorPreset={4} small external>
            Inera AB
          </AppLink>{' '}
          på uppdrag av Sveriges regioner
        </p>
      }
      subFooterRight={
        <>
          <AppLink to="https://www.1177.se/om-1177/1177.se/hantering-av-personuppgifter-pa-1177.se/" external>
            Behandling av personuppgifter
          </AppLink>
          <AppLink to="https://www.1177.se/om-1177/1177.se/hantering-av-kakor-cookies-pa-1177.se/" external>
            Hantering av kakor
          </AppLink>
        </>
      }
      className="print:hidden"
    >
      <p>1177 är en tjänst från Sveriges regioner. Vi finns alltid med dig när du vill må bättre.</p>
    </IDSFooter1177>
  )
}
