import { Unit } from '@frontend/common'
import React from 'react'

interface Props {
  units: Unit[]
  chooseCareProvider: (event: React.MouseEvent) => void
}

export const Units: React.FC<Props> = ({ units, chooseCareProvider }) => {
  return units.map((unit: Unit) => {
    return (
      <p key={unit.unitId}>
        -{' '}
        <button className="ic-link" type="button" id={unit.unitId} onClick={chooseCareProvider}>
          {unit.unitName}
        </button>
      </p>
    )
  })
}
