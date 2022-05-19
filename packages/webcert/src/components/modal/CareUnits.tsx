import { CareUnit } from '@frontend/common'
import React from 'react'
import { ExpandableLink } from './ExpandableLink'

interface Props {
  careUnits: CareUnit[]
  chooseCareProvider: (event: React.MouseEvent) => void
}

export const CareUnits: React.FC<Props> = ({ chooseCareProvider, careUnits }) => {
  return (
    <>
      {careUnits.map((careUnit) => (
        <p key={careUnit.unitId}>
          <ExpandableLink link={careUnit.unitName} units={careUnit.units} id={careUnit.unitId} chooseCareProvider={chooseCareProvider} />
        </p>
      ))}
    </>
  )
}
