import { CareUnit } from '@frontend/common'
import React from 'react'
import { Units } from './Units'

interface Props {
  careUnits: CareUnit[]
  chooseCareProvider: (event: React.MouseEvent) => void
}

export const CareUnits: React.FC<Props> = ({ chooseCareProvider, careUnits }) => {
  return (
    <>
      {careUnits.map((careUnit) => (
        <p key={careUnit.unitId}>
          <button className="ic-link" type="button" id={careUnit.unitId} onClick={chooseCareProvider}>
            {careUnit.unitName}
          </button>
          {careUnit.units && <Units units={careUnit.units} chooseCareProvider={chooseCareProvider} />}
        </p>
      ))}
    </>
  )
}
