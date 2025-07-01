import { IDSFooter, IDSHeader, IDSIconAttention, IDSIconChevron, IDSIconExternal, IDSLink } from '@inera/ids-react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import '../styling/inera-admin.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="flex min-h-screen flex-col">
      <IDSHeader type="inera-admin" className="z-40 bg-white print:hidden">
        <a className="ids-heading-2 no-underline" slot="brand-text" href="/">
          Intygstjänster
        </a>
      </IDSHeader>
      <main className="relative flex-1">
        <div className="ids-content mx-auto max-w-screen-md py-24 text-center">
          <div className="mb-10 inline-block">
            <IDSIconAttention height="4.375rem" width="4.375rem" color="var(--IDS-COLOR-ERROR-40)" color2="var(--IDS-COLOR-ERROR-40)" />
          </div>
          <div className="mb-5">
            <h1 className="ids-heading-1">Planerat underhåll</h1>
            <p className="ids-preamble">
              Intygstjänster är stängd för tekniskt underhåll. <br />
              <br />
              Torsdagen den 13 juni mellan kl. 07:00 - 08:00 görs tekniskt underhåll av Intygstjänster. Tjänsterna kommer inte vara
              tillgängliga under tiden.
              <br />
              <br /> Välkommen åter!
            </p>
            <IDSLink>
              <IDSIconChevron />
              <a href="https://www.inera.se">Till Inera.se</a> <IDSIconExternal slot="append-icon" />
            </IDSLink>
            <IDSLink className="pl-3">
              <IDSIconChevron />
              <a href="https://www.inera.se/driftstatus/kommande-atgarder/">Se driftstatus på Inera.se</a>{' '}
              <IDSIconExternal slot="append-icon" />
            </IDSLink>
          </div>
        </div>
      </main>
      <IDSFooter type="inera-admin" headline="Intygstjänster">
        <p>Intygsjänster är en grupp tjänster som drivs av Inera AB.</p>
      </IDSFooter>
    </div>
  </React.StrictMode>
)
