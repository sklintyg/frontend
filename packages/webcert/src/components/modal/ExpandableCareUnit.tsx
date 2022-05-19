import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import { Unit } from '@frontend/common'

const StyledArrow = styled(FontAwesomeIcon)`
  cursor: pointer;
`

interface Props {
  careUnit: string
  units: Unit[]
  id: string
  chooseCareProvider: (event: React.MouseEvent) => void
}

export const ExpandableCareUnit: React.FC<Props> = ({ careUnit, units, id, chooseCareProvider }) => {
  const [expand, setExpand] = useState(false)

  const CareUnit = () => {
    return (
      <>
        <button className="ic-link iu-fw-heading" type="button" id={id} onClick={chooseCareProvider}>
          {careUnit}
        </button>
        <StyledArrow
          icon={expand ? faAngleUp : faAngleDown}
          className={'iu-mt-200 iu-ml-200 iu-color-cta-dark'}
          onClick={toggleOpen}
          style={{ cursor: 'pointer' }}
        />
      </>
    )
  }

  useEffect(() => {
    setExpand(false)
  }, [careUnit])

  const toggleOpen = () => {
    setExpand(!expand)
  }

  return (
    <>
      {expand && careUnit ? (
        <div className="iu-mb-300 iu-px-400">
          <CareUnit />
          {units.map((unit) => (
            <p>
              <button className="ic-link iu-ml-300" type="button" id={unit.unitId} key={unit.unitId} onClick={chooseCareProvider}>
                {unit.unitName}
              </button>
            </p>
          ))}
        </div>
      ) : (
        <div className="iu-mb-300 iu-px-400">
          <CareUnit />
        </div>
      )}
    </>
  )
}
