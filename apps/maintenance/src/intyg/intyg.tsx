import { LayoutFooter, LayoutHeader, PageHero, PageHeroActions } from '@frontend/components/1177'
import { IDSIconChevron, IDSLink } from '@frontend/ids-react-ts'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="flex min-h-screen flex-col">
      <LayoutHeader mode={import.meta.env.MODE} />
      <main className="relative flex-1">
        <div className="ids-content m-auto max-w-screen-xl overflow-hidden px-2.5 py-5">
          <PageHero heading="Välkommen till Intyg" type="none">
            <p className="ids-preamble">
              I Intyg kan du läsa och skriva ut dina digitala läkarintyg. Du kan också skicka dem digitalt till antingen Försäkringskassan
              eller Transportstyrelsen. För att kunna logga in behöver du en e-legitimation.
            </p>
            <p className="ids-preamble">Intyg är en del av 1177 och du når Intyg från huvudmenyn när du är inloggad.</p>
            <PageHeroActions>
              <IDSLink>
                <IDSIconChevron />
                <a href={import.meta.env.VITE_LOGIN_URL}>Till inloggning</a>
              </IDSLink>
              <IDSLink>
                <IDSIconChevron />
                <a href="https://www.1177.se/om-1177/nar-du-loggar-in-pa-1177.se/det-har-kan-du-gora-nar-du-loggat-in/hantera-intyg/hantera-dina-lakarintyg-och-lakarutlatanden/">
                  Om Intyg på 1177.se
                </a>
              </IDSLink>
            </PageHeroActions>
          </PageHero>
        </div>
      </main>
      <LayoutFooter hasSession={false} />
    </div>
  </React.StrictMode>
)
