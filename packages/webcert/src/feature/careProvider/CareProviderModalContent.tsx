import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUnitStatistics as selectUnitStatistics, getUser, isCareAdministrator, isDoctor } from '../../store/user/userSelectors'
import { setUnit, updateSwitchTab } from '../../store/user/userActions'
import { CareUnit, ExpandableTableRow, SimpleTable, Unit } from '@frontend/common'
import styled from 'styled-components'

const StyledButton = styled.button<{ careUnitHasUnits: boolean }>`
  text-indent: ${(props) => (props.careUnitHasUnits ? '18px' : '0px')};
`

export const CareProviderModalContent: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser)
  const unitStatistics = useSelector(selectUnitStatistics)

  const getUnitStatisticsLiteral = (amountOnUnit: number, amountOnOtherUnit = 0, careUnit?: CareUnit) => {
    const showTotal = careUnit && careUnit?.units.length > 0 && amountOnOtherUnit > 0
    return `${amountOnUnit} ${showTotal ? `(totalt ${amountOnUnit + amountOnOtherUnit})` : ''}`
  }

  const handleChooseUnit = (event: React.MouseEvent) => {
    const unitId = event.currentTarget.id

    dispatch(updateSwitchTab(0))
    dispatch(setUnit(unitId))
  }

  const getExpandedRows = (units: Unit[]) => {
    return units.map((unit) => {
      const questionsOnUnit = unitStatistics[unit.unitId].questionsOnUnit
      const draftsOnUnit = unitStatistics[unit.unitId].draftsOnUnit

      return (
        <tr key={unit.unitId}>
          <td>
            <button className="ic-link iu-ml-700 iu-text-left" type="button" id={unit.unitId} onClick={handleChooseUnit}>
              {unit.unitName}
            </button>
          </td>
          <td>{getUnitStatisticsLiteral(questionsOnUnit)}</td>
          <td>{getUnitStatisticsLiteral(draftsOnUnit)}</td>
        </tr>
      )
    })
  }

  const getStatistics = (id: string) => {
    return {
      questionsOnUnit: unitStatistics[id].questionsOnUnit,
      questionsOnSubUnits: unitStatistics[id].questionsOnSubUnits,
      draftsOnUnit: unitStatistics[id].draftsOnUnit,
      draftsOnSubUnits: unitStatistics[id].draftsOnSubUnits,
    }
  }

  const renderRows = (careUnit: CareUnit) => {
    const statistics = getStatistics(careUnit.unitId)
    const careUnitHasUnits = careUnit.units.length > 0

    return careUnitHasUnits ? (
      <ExpandableTableRow
        rowContent={[
          careUnit.unitName,
          getUnitStatisticsLiteral(statistics.questionsOnUnit, statistics.questionsOnSubUnits, careUnit),
          getUnitStatisticsLiteral(statistics.draftsOnUnit, statistics.draftsOnSubUnits, careUnit),
        ]}
        id={careUnit.unitId}
        handleClick={handleChooseUnit}
        key={careUnit.unitId}>
        {getExpandedRows(careUnit.units)}
      </ExpandableTableRow>
    ) : (
      <tr key={careUnit.unitId}>
        <td>
          <StyledButton
            careUnitHasUnits={careUnitHasUnits}
            className="ic-link iu-text-left"
            type="button"
            id={careUnit.unitId}
            onClick={handleChooseUnit}>
            {careUnit.unitName}
          </StyledButton>
        </td>
        <td>{getUnitStatisticsLiteral(statistics.questionsOnUnit, statistics.questionsOnSubUnits, careUnit)}</td>
        <td>{getUnitStatisticsLiteral(statistics.draftsOnUnit, statistics.draftsOnSubUnits, careUnit)}</td>
      </tr>
    )
  }

  return (
    <>
      {user?.careProviders.map((careProvider) => {
        return (
          <SimpleTable
            headings={[careProvider.name, 'Ej hanterade ärenden', 'Ej signerade utkast']}
            key={careProvider.id}
            className="iu-mb-800"
            adjustColumnsToText>
            {careProvider.careUnits.map((careUnit) => renderRows(careUnit))}
          </SimpleTable>
        )
      })}
    </>
  )
}
