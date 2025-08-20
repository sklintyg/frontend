import { AppLink } from '@frontend/components'
import { PageHero, PageHeroActions } from '@frontend/components/1177'
import { IDSFooterIneraAdmin, IDSHeaderIneraAdmin } from '@inera/ids-react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import '../styling/inera-admin.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="flex min-h-screen flex-col">
      <IDSHeaderIneraAdmin className="z-40 print:hidden" brandText="Intygstjänster" />
      <main className="relative flex-1">
        <div className="ids-content mx-auto max-w-screen-md py-24 text-center">
          <PageHero heading="Planerat underhåll" type="error">
            <p className="ids-preamble">
              Intygstjänster är stängd för tekniskt underhåll. <br />
              <br />
              Torsdagen den 13 juni mellan kl. 07:00 - 08:00 görs tekniskt underhåll av Intygstjänster. Tjänsterna kommer inte vara
              tillgängliga under tiden.
              <br />
              <br /> Välkommen åter!
            </p>
            <PageHeroActions>
              <AppLink to="https://www.inera.se" arrow external>
                Till Inera.se
              </AppLink>
              <AppLink to="https://www.inera.se/driftstatus/kommande-atgarder/" arrow external>
                Se driftstatus på Inera.se
              </AppLink>
            </PageHeroActions>
          </PageHero>
        </div>
      </main>
      <IDSFooterIneraAdmin headline="Intygstjänster">
        <p>Intygsjänster är en grupp tjänster som drivs av Inera AB.</p>
      </IDSFooterIneraAdmin>
    </div>
  </React.StrictMode>
)
