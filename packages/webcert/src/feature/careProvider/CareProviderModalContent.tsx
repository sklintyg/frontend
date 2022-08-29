import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getLoggedInUnit,
  getUnitStatistics as selectUnitStatistics,
  getUser,
  isCareAdministrator as selectIsCareAdministrator,
} from '../../store/user/userSelectors'
import { setUnit } from '../../store/user/userActions'
import { CareProvider, CareUnit, ExpandableTableRow, SimpleTable, Unit } from '@frontend/common'
import { useHistory } from 'react-router-dom'
import { START_URL_FOR_ADMINISTRATORS, START_URL_FOR_DOCTORS } from '../../constants'
import styled from 'styled-components'

const StyledButton = styled.button`
  text-indent: 1.2em;
`

export const CareProviderModalContent: React.FC = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector(getUser)
  const isCareAdministrator = useSelector(selectIsCareAdministrator)
  const unitStatistics = useSelector(selectUnitStatistics)
  const loggedInUnit = useSelector(getLoggedInUnit)

  const getUnitStatisticsLiteral = (amountOnUnit: number, amountOnOtherUnit = 0, careUnit?: CareUnit) => {
    const showTotal = careUnit && careUnit?.units.length > 0 && amountOnOtherUnit > 0
    return `${amountOnUnit} ${showTotal ? `(totalt ${amountOnUnit + amountOnOtherUnit})` : ''}`
  }

  const handleChooseUnit = (event: React.MouseEvent) => {
    const unitId = event.currentTarget.id
    dispatch(setUnit(unitId))

    history.push(isCareAdministrator ? START_URL_FOR_ADMINISTRATORS : START_URL_FOR_DOCTORS)
  }

  const isLoggedInUnit = (unit: Unit) => {
    return unit.unitId === loggedInUnit?.unitId
  }

  const getExpandedRows = (units: Unit[]) => {
    return units.map((unit) => {
      const questionsOnUnit = unitStatistics[unit.unitId].questionsOnUnit
      const draftsOnUnit = unitStatistics[unit.unitId].draftsOnUnit

      return (
        <tr key={unit.unitId}>
          <td>
            <button
              className={`ic-link iu-ml-700 iu-text-left iu-border-white ${isLoggedInUnit(unit) && 'iu-color-muted ic-button--disabled'}`}
              type="button"
              id={unit.unitId}
              onClick={handleChooseUnit}
              disabled={isLoggedInUnit(unit)}>
              {getUnitName(unit)}
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

  const getUnitName = (unit: Unit) => {
    if (isLoggedInUnit(unit)) {
      return `${unit.unitName} (vald enhet)`
    }

    return unit.unitName
  }

  const renderRows = (careUnit: CareUnit) => {
    const statistics = getStatistics(careUnit.unitId)
    const careUnitHasUnits = careUnit.units.length > 0

    return careUnitHasUnits ? (
      <ExpandableTableRow
        rowContent={[
          getUnitName(careUnit),
          getUnitStatisticsLiteral(statistics.questionsOnUnit, statistics.questionsOnSubUnits, careUnit),
          getUnitStatisticsLiteral(statistics.draftsOnUnit, statistics.draftsOnSubUnits, careUnit),
        ]}
        id={careUnit.unitId}
        handleClick={handleChooseUnit}
        key={careUnit.unitId}
        disabled={isLoggedInUnit(careUnit)}>
        {getExpandedRows(careUnit.units)}
      </ExpandableTableRow>
    ) : (
      <tr key={careUnit.unitId}>
        <td>
          <StyledButton
            className={`ic-link iu-text-left iu-border-white ${isLoggedInUnit(careUnit) && 'iu-color-muted ic-button--disabled'}`}
            type="button"
            id={careUnit.unitId}
            onClick={handleChooseUnit}
            disabled={isLoggedInUnit(careUnit)}>
            {getUnitName(careUnit)}
          </StyledButton>
        </td>
        <td>{getUnitStatisticsLiteral(statistics.questionsOnUnit, statistics.questionsOnSubUnits, careUnit)}</td>
        <td>{getUnitStatisticsLiteral(statistics.draftsOnUnit, statistics.draftsOnSubUnits, careUnit)}</td>
      </tr>
    )
  }

  const checkSubscription = (careProvider: CareProvider) => {
    return careProvider.missingSubscription ? careProvider.name + ' (Abonnemang saknas)' : careProvider.name
  }

  return (
    <>
      {user?.careProviders.map((careProvider) => {
        return (
          <SimpleTable
            headings={[
              { title: checkSubscription(careProvider), adjustCellToText: false },
              { title: 'Ej hanterade ärenden', adjustCellToText: true },
              { title: 'Ej signerade utkast', adjustCellToText: true },
            ]}
            key={careProvider.id}
            className="iu-mb-800">
            {careProvider.careUnits.map((careUnit) => renderRows(careUnit))}
          </SimpleTable>
        )
      })}
    </>
  )
}
