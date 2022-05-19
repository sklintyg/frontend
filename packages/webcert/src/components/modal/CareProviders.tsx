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
        <details className="ic-expandable" key={careProvider.unitId} open>
          <summary className="ic-expandable-button iu-focus">{careProvider.unitName}</summary>
          <CareUnits careUnits={careProvider.careUnits} chooseCareProvider={chooseCareProvider} />
        </details>
      ))}
    </>
  )
}
