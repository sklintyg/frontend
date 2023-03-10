import { IDSFooter, IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import { CookieDialog } from '../CookieDialog/CookieDialog'

export function LayoutFooter() {
  return (
    <IDSFooter type="inera-admin" headline="Rehabstöd">
      <p>Rehabstöd används av rehabkoordinatorer och läkare för att samordna och följa upp sjukskrivna patienters rehabilitering.</p>
      <p slot="link-col-1">
        <IDSLink>
          <a href="//inera.atlassian.net/wiki/x/moiUG" target="_blank" rel="noreferrer">
            Manual Rehabstöd
          </a>
          <IDSIcon slot="append-icon" name="external" />
        </IDSLink>
        <IDSLink>
          <a href="//www.inera.se/kontakta-oss/felanmalan-och-anvandarstod/" target="_blank" rel="noreferrer">
            Inera Support
          </a>
          <IDSIcon slot="append-icon" name="external" />
        </IDSLink>
      </p>

      <p slot="sub-footer-left">
        Rehabstöd drivs av{' '}
        <a className="underline decoration-white" href="//inera.se" target="_blank" rel="noreferrer">
          Inera AB.
        </a>
      </p>

      <IDSLink slot="sub-footer-right">
        <a href="//www.inera.se/om-webbplatsen/behandling-av-personuppgifter/" target="_blank" rel="noreferrer">
          Behandling av personuppgifter
        </a>
        <IDSIcon slot="append-icon" name="external" />
      </IDSLink>

      <div slot="sub-footer-right" className="inline-block">
        <CookieDialog>
          <button className="text-sm text-white underline" trigger="" type="button">
            Hantering av kakor
          </button>
        </CookieDialog>
      </div>
    </IDSFooter>
  )
}
