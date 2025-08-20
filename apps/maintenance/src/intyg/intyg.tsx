import { AppLink } from '@frontend/components'
import { LayoutFooter, LayoutHeader, PageHero, PageHeroActions } from '@frontend/components/1177'
import React from 'react'
import ReactDOM from 'react-dom/client'
import '../styling/1177.css'

ReactDOM.createRoot(document.getElementById('rootIntyg') as HTMLElement).render(
  <React.StrictMode>
    <div className="flex min-h-screen flex-col">
      <LayoutHeader mode={import.meta.env.MODE} avatar={undefined} skipToContent="#content" />
      <main id="content" className="relative flex-1">
        <div className="ids-content m-auto max-w-screen-xl overflow-hidden px-2.5 py-5">
          <PageHero heading="Planerat underhållsarbete" type="error">
            <p className="ids-preamble">
              Intyg är stängd för tekniskt underhåll. <br />
              <br />
              Torsdagen den 13 juni mellan kl. 07:00 - 08:00 görs tekniskt underhåll av Intyg. Tjänsten kommer inte vara tillgänglig under
              tiden.
              <br />
              <br /> Välkommen åter!
            </p>
            <PageHeroActions>
              <AppLink to="https://www.1177.se" external arrow>
                Till 1177.se
              </AppLink>
              <AppLink
                to="https://www.1177.se/om-1177/nar-du-loggar-in-pa-1177.se/det-har-kan-du-gora-nar-du-loggat-in/hantera-intyg/hantera-dina-lakarintyg-och-lakarutlatanden/"
                external
                arrow
              >
                Om Intyg på 1177.se
              </AppLink>
            </PageHeroActions>
          </PageHero>
        </div>
      </main>
      <LayoutFooter hasSession={false} />
    </div>
  </React.StrictMode>
)
