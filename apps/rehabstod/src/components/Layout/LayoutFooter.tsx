import { IDSFooter, IDSMobileMenu } from '@frontend/ids-react-ts'
import { useGetLinksQuery } from '../../store/api'
import { DynamicLink } from '../DynamicLink/DynamicLink'
import { CookieDialog } from '../dialog/CookieDialog'

export function LayoutFooter() {
  const { data: links } = useGetLinksQuery()

  return (
    <IDSFooter type="inera-admin" headline="Rehabstöd" className="print:hidden" cols={2}>
      <p>Rehabstöd används av rehabkoordinatorer och läkare för att samordna och följa upp sjukskrivna patienters rehabilitering.</p>

      <p slot="link-col-1">
        <DynamicLink type="footer" link={links?.ineraManualRehabstod} />
      </p>
      <p slot="link-col-1">
        <DynamicLink type="footer" link={links?.ineraNationellKundservice} />
      </p>
      <p slot="link-col-2">
        <DynamicLink type="footer" link={links?.rehabstodTillganglighetsredogorelse} />
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
      {links?.ineraMainPage && (
        <p slot="sub-footer-mobile">
          <div className="flex w-full gap-1 whitespace-nowrap">
            <span>Rehabstöd drivs av</span>
            <DynamicLink type="sub-footer" link={links.ineraMainPage} />
          </div>
        </p>
      )}

      <IDSMobileMenu>
        <div className="flex flex-col gap-5 px-5">
          <DynamicLink type="footer" link={links?.ineraManualRehabstod} />
          <DynamicLink type="footer" link={links?.ineraNationellKundservice} />
        </div>
      </IDSMobileMenu>

      <div slot="sub-footer-links" className="inline-block">
        <DynamicLink type="sub-footer" link={links?.ineraBehandlingPersonuppgifter} />
      </div>
      <div slot="sub-footer-links" className="inline-block">
        <CookieDialog />
      </div>
    </IDSFooter>
  )
}
