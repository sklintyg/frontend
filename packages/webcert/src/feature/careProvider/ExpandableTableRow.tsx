import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Unit, UnitStatistic } from '@frontend/common'
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getUnitStatistics } from '../../store/user/userSelectors'

const StyledArrow = styled(FontAwesomeIcon)`
  cursor: pointer;
`

interface ExpandedUnitProps {
  isExpanded: boolean
  unit: Unit
  handleChooseUnit: (event: React.MouseEvent) => void
  statistics: UnitStatistic
}

const ExpandedUnit: React.FC<ExpandedUnitProps> = ({ unit, isExpanded, handleChooseUnit, statistics }) => {
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
      <td>{statistics.questionsOnUnit}</td>
      <td>{statistics.draftsOnUnit}</td>
    </tr>
  )
}

interface Props {
  careUnit: string
  careUnitId: string
  units: Unit[]
  handleChooseUnit: (event: React.MouseEvent) => void
}

export const ExpandableTableRow: React.FC<Props> = ({ careUnit, careUnitId, units, handleChooseUnit }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const unitStatistics = useSelector(getUnitStatistics)

  const toggleOpen = () => {
    setIsExpanded(!isExpanded)
  }

  const questionsOnUnit = unitStatistics[careUnitId].questionsOnUnit
  const questionsOnSubUnits = unitStatistics[careUnitId].questionsOnSubUnits
  const draftsOnUnit = unitStatistics[careUnitId].draftsOnUnit
  const draftsOnSubUnits = unitStatistics[careUnitId].draftsOnSubUnits

  const getTotal = (x: number, y: number) => {
    return units.length > 0 && `(total ${x + y})`
  }

  return (
    <Fragment key={careUnitId}>
      <tr>
        <td>
          {units.length > 0 && (
            <StyledArrow icon={isExpanded ? faAngleUp : faAngleDown} className="iu-color-cta-dark iu-mr-300" onClick={toggleOpen} />
          )}
          <button className="ic-link iu-text-left" type="button" id={careUnitId} onClick={handleChooseUnit}>
            {careUnit}
          </button>
        </td>
        <td>
          {questionsOnUnit} {getTotal(questionsOnUnit, questionsOnSubUnits)}
        </td>
        <td>
          {draftsOnUnit} {getTotal(draftsOnUnit, draftsOnSubUnits)}
        </td>
      </tr>
      {units.length > 0 &&
        units.map((unit, idx) => (
          <ExpandedUnit
            isExpanded={isExpanded}
            unit={unit}
            handleChooseUnit={handleChooseUnit}
            statistics={unitStatistics[unit.unitId]}
            key={idx}
          />
        ))}
    </Fragment>
  )
}
