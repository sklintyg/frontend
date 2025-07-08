import { IDSFooter1177, IDSLink, IDSMobileMenu, IDSMobileMenuItem } from '@inera/ids-react'
import { classNames } from '../../../utils'

export function LayoutFooter({ hasSession }: { hasSession: boolean }) {
  return (
    <IDSFooter1177
      headline="1177"
      subHeadline=" - tryggt om din hälsa och vårt"
      cols={2}
      col1={[
        <IDSLink key="support">
          <a href="https://www.1177.se/e-tjanster-support" target="_blank" rel="noreferrer">
            <span className="ids-icon-arrow-right-small ids-icon--text-start" />
            Support
          </a>
        </IDSLink>,
        <IDSLink key="tillgänglighet">
          <a
            href="https://www.1177.se/om-1177/1177.se/tillganglighet-pa-1177/tillganglighetsredogorelse-for-e-tjanster-pa-1177.se/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="ids-icon-arrow-right-small ids-icon--text-start" />
            Tillgänglighet
          </a>
        </IDSLink>,
      ]}
      col2={[
        <IDSLink key="read-more">
          <a href="https://www.1177.se/e-tjanster" target="_blank" rel="noreferrer">
            <span className="ids-icon-arrow-right-small ids-icon--text-start" />
            Läs mer om e-tjänster
          </a>
        </IDSLink>,
        <IDSLink key="webbkarta" className={classNames(!hasSession && 'hidden')}>
          <a href="https://e-tjanster.1177.se/mvk/sitemap.xhtml">
            <span className="ids-icon-arrow-right-small ids-icon--text-start" />
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
                <span className="ids-icon-arrow-right-small ids-icon--text-start" />
                Support
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
                <span className="ids-icon-arrow-right-small ids-icon--text-start" />
                Tillgänglighet
              </a>
            }
          />
          <IDSMobileMenuItem
            link={
              <a href="https://www.1177.se/e-tjanster" target="_blank" rel="noreferrer">
                <span className="ids-icon-arrow-right-small ids-icon--text-start" />
                Läs mer om e-tjänster
              </a>
            }
          />
          <IDSMobileMenuItem
            className={classNames(!hasSession && 'hidden')}
            link={
              <a href="https://e-tjanster.1177.se/mvk/sitemap.xhtml" className={classNames(!hasSession && 'hidden')}>
                <span className="ids-icon-arrow-right-small ids-icon--text-start" />
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
              <span className="ids-icon-external-link-small ids-icon--text-end" />
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
              <span className="ids-icon-external-link-small ids-icon--text-end" />
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
