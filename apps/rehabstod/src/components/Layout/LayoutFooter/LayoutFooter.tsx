import { useGetLinksQuery } from '../../../store/api'
import { LinkColumn } from './LinkColumn'
import { SubFooter } from './SubFooter'

export function LayoutFooter() {
  const { data: links } = useGetLinksQuery()

  return (
    <footer className="ids-footer-1177-admin print:hidden">
      <div className="ids-footer-1177-admin__inner-wrapper">
        <div className="ids-footer-1177-admin__inner">
          <div className="ids-footer-1177-admin__headline-row">
            <h1 className="ids-footer-1177-admin__headline">Rehabstod</h1>
          </div>
          <div className="ids-footer-1177-admin__content">
            <div className="ids-footer-1177-admin__text">
              <p className="ids-body">Rehabstöd används för att samordna och följa upp sjukskrivna patienters rehabilitering.</p>
            </div>
            {links && (
              <>
                <LinkColumn links={[links.ineraManualRehabstod, links.ineraNationellKundservice]} />
                <LinkColumn links={[links.rehabstodTillganglighetsredogorelse]} />
              </>
            )}
          </div>
        </div>
      </div>
      <SubFooter />
    </footer>
  )
}
