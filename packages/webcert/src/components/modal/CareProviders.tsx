import { CareProvider } from '@frontend/common'
import React from 'react'
import { CareUnits } from './CareUnits'

interface Props {
  careProviders: CareProvider[]
  chooseCareProvider: (event: React.MouseEvent) => void
}

export const CareProviders: React.FC<Props> = ({ chooseCareProvider, careProviders }) => {
  return (
    <>
      {careProviders.map((careProvider) => (
        <details className="ic-card ic-card--expandable ic-card--sm-unset-style ic-expandable" key={careProvider.id} open>
          <summary className="ic-expandable-button iu-focus">{careProvider.name}</summary>
          {careProvider.careUnits && <CareUnits careUnits={careProvider.careUnits} chooseCareProvider={chooseCareProvider} />}
        </details>
      ))}
    </>
  )
}
