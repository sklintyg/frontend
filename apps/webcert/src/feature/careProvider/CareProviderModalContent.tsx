import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { START_URL_FOR_ADMINISTRATORS, START_URL_FOR_DOCTORS } from '../../constants'
import { clearPatient } from '../../store/patient/patientActions'
import { setUnit } from '../../store/user/userActions'
import {
  getLoggedInUnit,
  getUser,
  isCareAdministrator as selectIsCareAdministrator,
  getUnitStatistics as selectUnitStatistics,
} from '../../store/user/userSelectors'
import ExpandableTableRow from '../../components/Table/ExpandableTableRow'
import SimpleTable from '../../components/Table/SimpleTable'
import { CareUnit, Unit, CareProvider } from '../../types'

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
    dispatch(clearPatient())
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
              disabled={isLoggedInUnit(unit)}
            >
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
        disabled={isLoggedInUnit(careUnit)}
      >
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
            disabled={isLoggedInUnit(careUnit)}
          >
            {getUnitName(careUnit)}
          </StyledButton>
        </td>
        <td>{getUnitStatisticsLiteral(statistics.questionsOnUnit, statistics.questionsOnSubUnits, careUnit)}</td>
        <td>{getUnitStatisticsLiteral(statistics.draftsOnUnit, statistics.draftsOnSubUnits, careUnit)}</td>
      </tr>
    )
  }

  const checkSubscription = (careProvider: CareProvider) => {
    return careProvider.missingSubscription ? `${careProvider.name} (Abonnemang saknas)` : careProvider.name
  }

  return (
    <>
      {user?.careProviders.map((careProvider, index) => {
        return (
          <div key={index} className="iu-mb-800">
            <SimpleTable
              headings={[
                { title: checkSubscription(careProvider), adjustCellToText: false },
                { title: 'Ej hanterade ärenden', adjustCellToText: true },
                { title: 'Ej signerade utkast', adjustCellToText: true },
              ]}
              key={careProvider.id}
            >
              {careProvider.careUnits.map((careUnit) => renderRows(careUnit))}
            </SimpleTable>
          </div>
        )
      })}
    </>
  )
}
