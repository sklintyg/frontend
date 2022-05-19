import { CareProvider } from '@frontend/common'
import React from 'react'
import { CareUnits } from './CareUnits'

interface Props {
  careProviders: CareProvider[]
  chooseUnit: (event: React.MouseEvent) => void
}

export const CareProviders: React.FC<Props> = ({ chooseUnit, careProviders }) => {
  return (
    <>
      {careProviders.map((careProvider) => (
        <details className="ic-card ic-card--expandable ic-card--sm-unset-style ic-expandable" key={careProvider.id} open>
          <summary className="ic-expandable-button iu-focus iu-fs-300 iu-bg-muted-light iu-px-400 iu-mb-05em">{careProvider.name}</summary>
          {careProvider.careUnits && <CareUnits careUnits={careProvider.careUnits} chooseUnit={chooseUnit} />}
        </details>
      ))}
    </>
  )
}
