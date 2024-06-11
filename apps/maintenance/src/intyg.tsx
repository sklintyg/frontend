import { IDSFooter, IDSHeader, IDSIconAttention, IDSIconChevron, IDSLink } from '@frontend/ids-react-ts'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <IDSHeader type="inera-admin" className="z-40 bg-white print:hidden">
      <a className="ids-heading-2 text-legacy-main no-underline" slot="brand-text" href="/">
        Webcert
      </a>
    </IDSHeader>
    <div className="px-5 md:p-0">
      <div className="ids-content mx-auto max-w-screen-md py-24 text-center">
        <div className="mb-10 inline-block">
          <IDSIconAttention height="4.375rem" width="4.375rem" color="#00706e" color2="#00706e" />
        </div>
        <div className="mb-5">
          <h1 className="ids-heading-1 text-legacy-main">Planerat underhåll</h1>
          <p className="ids-preamble">Webcert är stängd för tekniskt underhåll. Välkommen åter!</p>
          <IDSLink>
            <IDSIconChevron />
            <a href="https://wc2.webcert.intygstjanster.se/">Till startsidan</a>
          </IDSLink>
        </div>
      </div>
    </div>
    <IDSFooter type="inera-legacy" headline="Webcert">
      <p>Webcert är en tjänst som drivs av Inera AB.</p>
    </IDSFooter>
  </React.StrictMode>
)
