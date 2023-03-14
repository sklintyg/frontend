import { IDSFooter } from '@frontend/ids-react-ts'
import { useGetLinksQuery } from '../../store/api'
import { CookieDialog } from '../CookieDialog/CookieDialog'
import { DynamicLink } from '../DynamicLink/DynamicLink'

export function LayoutFooter() {
  const { data: links } = useGetLinksQuery()

  return (
    <IDSFooter type="inera-admin" headline="Rehabstöd">
      <p>Rehabstöd används av rehabkoordinatorer och läkare för att samordna och följa upp sjukskrivna patienters rehabilitering.</p>

      <p slot="link-col-1">
        {links?.ineraManualRehabstod && <DynamicLink type="footer" link={links.ineraManualRehabstod} />}
        {links?.ineraNationellKundservice && <DynamicLink type="footer" link={links.ineraNationellKundservice} />}
      </p>

      {links?.ineraMainPage && (
        <p slot="sub-footer-left">
          Rehabstöd drivs av <DynamicLink type="sub-footer" link={links.ineraMainPage} />
        </p>
      )}

      <p slot="sub-footer-right" className="inline-block">
        {links?.ineraPersonuppgifter && <DynamicLink type="sub-footer" link={links.ineraPersonuppgifter} />}
      </p>
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
