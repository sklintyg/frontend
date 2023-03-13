import { IDSFooter, IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import { useGetLinksQuery } from '../../store/api'
import { CookieDialog } from '../CookieDialog/CookieDialog'
import { DynamicLink } from '../DynamicLink/DynamicLink'

export function LayoutFooter() {
  const { data: links } = useGetLinksQuery()

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

        {links?.ineraFelanmalanAnvandarstodSupport && <DynamicLink text="Inera Support" link={links.ineraFelanmalanAnvandarstodSupport} />}
      </p>

      {links?.ineraHomepage && (
        <p slot="sub-footer-left">
          Rehabstöd drivs av <DynamicLink className="underline decoration-white" link={links.ineraHomepage} text="Inera AB." />
        </p>
      )}

      {links?.ineraPersonuppgifter && (
        <DynamicLink slot="sub-footer-right" text="Behandling av personuppgifter" link={links.ineraPersonuppgifter} />
      )}

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
