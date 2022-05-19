import { CareUnit } from '@frontend/common'
import React from 'react'
import { ExpandableCareUnit } from './ExpandableCareUnit'

interface Props {
  careUnits: CareUnit[]
  chooseCareProvider: (event: React.MouseEvent) => void
}

export const CareUnits: React.FC<Props> = ({ chooseCareProvider, careUnits }) => {
  return (
    <>
      {careUnits.map((careUnit) => (
        <p key={careUnit.unitId}>
          <ExpandableCareUnit
            careUnit={careUnit.unitName}
            units={careUnit.units}
            id={careUnit.unitId}
            chooseCareProvider={chooseCareProvider}
          />
        </p>
      ))}
    </>
  )
}
