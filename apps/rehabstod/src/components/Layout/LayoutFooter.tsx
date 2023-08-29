import { IDSFooter, IDSIconExternal } from '@frontend/ids-react-ts'
import { useGetLinksQuery } from '../../store/api'
import { DynamicLink } from '../DynamicLink/DynamicLink'
import { CookieDialog } from '../dialog/CookieDialog'

export function LayoutFooter() {
  const { data: links } = useGetLinksQuery()

  return (
    <IDSFooter type="inera-admin" headline="Rehabstöd" className="print:hidden">
      <p>Rehabstöd används av rehabkoordinatorer och läkare för att samordna och följa upp sjukskrivna patienters rehabilitering.</p>

      <p slot="link-col-1">
        <DynamicLink type="footer" link={links?.ineraManualRehabstod} />
      </p>
      <p slot="link-col-1">
        <DynamicLink type="footer" link={links?.ineraNationellKundservice} />
      </p>

      {links?.ineraMainPage && (
        <p slot="sub-footer-left">
          Rehabstöd drivs av <DynamicLink type="sub-footer" link={links.ineraMainPage} />
        </p>
      )}

      <p slot="sub-footer-right" className="inline-block">
        <DynamicLink type="sub-footer" link={links?.ineraBehandlingPersonuppgifter} />
      </p>
      <div slot="sub-footer-right" className="inline-block">
        <CookieDialog />
      </div>

      {/* Mobile Links */}
      <p slot="sub-footer-mobile">
        <div className="flex w-full gap-1 whitespace-nowrap">
          <span>Rehabstöd drivs av</span>
          <a className="text-white underline outline-white" href="https://www.inera.se">
            Inera AB
          </a>
          <IDSIconExternal style={{ position: 'relative', bottom: '-2px' }} width="14" height="14" color="white" inline />
        </div>
      </p>

      <div slot="sub-footer-links" className="inline-block">
        <DynamicLink type="sub-footer" link={links?.ineraBehandlingPersonuppgifter} />
      </div>
      <div slot="sub-footer-links" className="inline-block">
        <CookieDialog />
      </div>
    </IDSFooter>
  )
}
