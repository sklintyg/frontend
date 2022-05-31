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
    return (
      amountOnUnit +
      (careUnit && careUnit.units.length > 0 && amountOnOtherUnit !== undefined ? ` (total ${amountOnUnit + amountOnOtherUnit})` : '')
    ).toString()
  }

  const getRows = (units: Unit[]) => {
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

  const handleChooseUnit = (event: React.MouseEvent) => {
    const unitId = event.currentTarget.id

    dispatch(setUnit(unitId))
  }

  return (
    <>
      {user?.careProviders.map((careProvider) => {
        const headings = [careProvider.name, 'Ej hanterade ärenden', 'Ej signerade utkast']

        return (
          <SimpleTable headings={headings} key={careProvider.id} className="iu-mb-800">
            {careProvider.careUnits.map((careUnit) => {
              const questionsOnUnit = unitStatistics[careUnit.unitId].questionsOnUnit
              const questionsOnSubUnits = unitStatistics[careUnit.unitId].questionsOnSubUnits
              const draftsOnUnit = unitStatistics[careUnit.unitId].draftsOnUnit
              const draftsOnSubUnits = unitStatistics[careUnit.unitId].draftsOnSubUnits

              return careUnit.units.length > 0 ? (
                <ExpandableTableRow
                  rowContent={[
                    careUnit.unitName,
                    getUnitStatistics(questionsOnUnit, questionsOnSubUnits, careUnit),
                    getUnitStatistics(draftsOnUnit, draftsOnSubUnits, careUnit),
                  ]}
                  id={careUnit.unitId}
                  handleClick={handleChooseUnit}
                  key={careUnit.unitId}>
                  {getRows(careUnit.units)}
                </ExpandableTableRow>
              ) : (
                <tr key={careUnit.unitId}>
                  <td>
                    <button className="ic-link iu-text-left" type="button" id={careUnit.unitId} onClick={handleChooseUnit}>
                      {careUnit.unitName}
                    </button>
                  </td>
                  <td>{getUnitStatistics(questionsOnUnit, questionsOnSubUnits, careUnit)}</td>
                  <td>{getUnitStatistics(draftsOnUnit, draftsOnSubUnits, careUnit)}</td>
                </tr>
              )
            })}
          </SimpleTable>
        )
      })}
    </>
  )
}
