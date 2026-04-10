import { AppLink, classNames, Icon } from '@frontend/components-ids9'
import { IDSFooter1177, IDSMobileMenu, IDSMobileMenuItem } from '@inera/ids-react'

export function LayoutFooter({ hasSession }: { hasSession: boolean }) {
  return (
    <IDSFooter1177
      headline="1177"
      subHeadline=" - tryggt om din hälsa och vård"
      col1={
        <>
          <AppLink block footer arrow to="https://www.1177.se/e-tjanster-support" external>
            Support
          </AppLink>
          <AppLink
            block
            footer
            arrow
            to="https://www.1177.se/om-1177/1177.se/tillganglighet-pa-1177/tillganglighetsredogorelse-for-e-tjanster-pa-1177.se/"
            external
          >
            Tillgänglighet
          </AppLink>
        </>
      }
      col2={
        <>
          <AppLink block footer arrow to="https://www.1177.se/e-tjanster" external>
            Läs mer om e-tjänster
          </AppLink>
          {hasSession && (
            <AppLink block footer arrow to="https://e-tjanster.1177.se/mvk/sitemap.xhtml">
              Webbkarta
            </AppLink>
          )}
        </>
      }
      mobileLinks={
        <>
          <AppLink to="https://www.1177.se/om-1177/1177.se/hantering-av-personuppgifter-pa-1177.se/" colorPreset={3} external>
            Behandling av personuppgifter
          </AppLink>
          <AppLink to="https://www.1177.se/om-1177/1177.se/hantering-av-kakor-cookies-pa-1177.se/" colorPreset={3} external>
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
          {hasSession ? (
            <IDSMobileMenuItem
              className="ids-mobile-menu-item"
              link={
                <a href="https://e-tjanster.1177.se/mvk/sitemap.xhtml" className={classNames(!hasSession && 'hidden')}>
                  Webbkarta
                </a>
              }
            />
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <></>
          )}
        </IDSMobileMenu>
      }
      subFooterMobile={
        <p>
          1177 drivs av{' '}
          <AppLink to="https://www.inera.se/" colorPreset={3} small underlined external>
            Inera AB
          </AppLink>{' '}
          på uppdrag av Sveriges regioner
        </p>
      }
      subFooterLeft={
        <>
          <AppLink to="https://www.1177.se/om-1177/1177.se/hantering-av-personuppgifter-pa-1177.se/" colorPreset={3} small external>
            Behandling av personuppgifter
          </AppLink>
          <AppLink to="https://www.1177.se/om-1177/1177.se/hantering-av-kakor-cookies-pa-1177.se/" colorPreset={3} small external>
            Hantering av kakor
          </AppLink>
        </>
      }
      subFooterRight={
        <p>
          1177 drivs av{' '}
          <AppLink to="https://www.inera.se/" colorPreset={3} small underlined external>
            Inera AB
          </AppLink>{' '}
          på uppdrag av Sveriges regioner
        </p>
      }
      className="print:hidden"
    >
      <p>1177 är en tjänst från Sveriges regioner. Vi finns alltid med dig när du vill må bättre.</p>
    </IDSFooter1177>
  )
}
