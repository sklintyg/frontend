import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUnitStatistics as selectUnitStatistics, getUser } from '../../store/user/userSelectors'
import { setUnit } from '../../store/user/userActions'
import { CareUnit, ExpandableTableRow, SimpleTable, Unit } from '@frontend/common'

export const CareProviderModalContent: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser)
  const unitStatistics = useSelector(selectUnitStatistics)

  const getUnitStatistics = (amountOnUnit: number, amountOnOtherUnit?: number, careUnit?: CareUnit) => {
    const showTotal = careUnit?.units.length > 0 && amountOnOtherUnit !== undefined
    return `${amountOnUnit} ${showTotal ? `(total ${amountOnUnit + amountOnOtherUnit})` : ''}` 
  }

  const handleChooseUnit = (event: React.MouseEvent) => {
    const unitId = event.currentTarget.id

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
          <td>{getUnitStatistics(questionsOnUnit)}</td>
          <td>{getUnitStatistics(draftsOnUnit)}</td>
        </tr>
      )
    })
  }

  const statistics = (id: string) => {
    return {
      questionsOnUnit: unitStatistics[id].questionsOnUnit,
      questionsOnSubUnits: unitStatistics[id].questionsOnSubUnits,
      draftsOnUnit: unitStatistics[id].draftsOnUnit,
      draftsOnSubUnits: unitStatistics[id].draftsOnSubUnits,
    }
  }

  const renderRows = (careUnit: CareUnit) => {
    const getStatistics = statistics(careUnit.unitId)
    const isRowExpandable = careUnit.units.length > 0

    return isRowExpandable ? (
      <ExpandableTableRow
        rowContent={[
          careUnit.unitName,
          getUnitStatistics(getStatistics.questionsOnUnit, getStatistics.questionsOnSubUnits, careUnit),
          getUnitStatistics(getStatistics.draftsOnUnit, getStatistics.draftsOnSubUnits, careUnit),
        ]}
        id={careUnit.unitId}
        handleClick={handleChooseUnit}
        key={careUnit.unitId}>
        {getExpandedRows(careUnit.units)}
      </ExpandableTableRow>
    ) : (
      <tr key={careUnit.unitId}>
        <td>
          <button className="ic-link iu-text-left" type="button" id={careUnit.unitId} onClick={handleChooseUnit}>
            {careUnit.unitName}
          </button>
        </td>
        <td>{getUnitStatistics(getStatistics.questionsOnUnit, getStatistics.questionsOnSubUnits, careUnit)}</td>
        <td>{getUnitStatistics(getStatistics.draftsOnUnit, getStatistics.draftsOnSubUnits, careUnit)}</td>
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
            className="iu-mb-800">
            {careProvider.careUnits.map((careUnit) => renderRows(careUnit))}
          </SimpleTable>
        )
      })}
    </>
  )
}
