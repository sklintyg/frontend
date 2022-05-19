import React, { useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../store/user/userSelectors'
import { setUnit } from '../../store/user/userActions'
import { SimpleTable, Unit } from '@frontend/common'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const StyledArrow = styled(FontAwesomeIcon)`
  cursor: pointer;
`

interface ExpandableTableRowProps {
  careUnit: string
  careUnitId: string
  units: Unit[]
  handleChooseUnit: (event: React.MouseEvent) => void
}

const ExpandableTableRow: React.FC<ExpandableTableRowProps> = ({ careUnit, careUnitId, units, handleChooseUnit }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleOpen = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      <tr>
        <td>
          <StyledArrow icon={isExpanded ? faAngleUp : faAngleDown} className="iu-color-cta-dark iu-mr-300" onClick={toggleOpen} />
          <button className="ic-link iu-text-left" type="button" id={careUnitId} onClick={handleChooseUnit}>
            {careUnit}
          </button>
        </td>
        <td>0</td>
        <td>0</td>
      </tr>
      {units && units.map((unit) => <ExpandedUnit isExpanded={isExpanded} unit={unit} handleChooseUnit={handleChooseUnit} />)}
    </>
  )
}

interface ExpandedUnitProps {
  isExpanded: boolean
  unit: Unit
  handleChooseUnit: (event: React.MouseEvent) => void
}

const ExpandedUnit: React.FC<ExpandedUnitProps> = ({ unit, isExpanded, handleChooseUnit }) => {
  if (!isExpanded) {
    return null
  }

  return (
    <tr>
      <td>
        <button className="ic-link iu-ml-700 iu-text-left" type="button" id={unit.unitId} onClick={handleChooseUnit}>
          {unit.unitName}
        </button>
      </td>
      <td>0</td>
      <td>0</td>
    </tr>
  )
}

export const CareProviderModalContent: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser)

  const handleChooseUnit = (event: React.MouseEvent) => {
    const unitId = event.currentTarget.id

    dispatch(setUnit(unitId))
  }

  return (
    <>
      {user?.careProviders.map((careProvider) => {
        const headings = [careProvider.name, 'Ej hanterade ärenden', 'Ej signerade utkast']

        return (
          <SimpleTable headings={headings}>
            {careProvider.careUnits.map((careUnit) => {
              return (
                <ExpandableTableRow
                  careUnit={careUnit.unitName}
                  careUnitId={careUnit.unitId}
                  units={careUnit.units}
                  handleChooseUnit={handleChooseUnit}
                />
              )
            })}
          </SimpleTable>
        )
      })}
    </>
  )
}
