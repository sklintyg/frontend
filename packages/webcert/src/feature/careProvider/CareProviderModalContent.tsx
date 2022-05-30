import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUnitStatistics as selectUnitStatistics, getUser } from '../../store/user/userSelectors'
import { setUnit } from '../../store/user/userActions'
import { CareUnit, ExpandableTableRow, SimpleTable, Unit } from '@frontend/common'

export const CareProviderModalContent: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser)
  const unitStatistics = useSelector(selectUnitStatistics)

  const getUnitStatistics = (unit: CareUnit | Unit, typeOfStatistic: string) => {
    if (unit.hasOwnProperty('units')) {
      switch (typeOfStatistic) {
        case 'questions':
          return (
            unitStatistics[unit.unitId].questionsOnUnit +
            ` (total ${unitStatistics[unit.unitId].questionsOnUnit + unitStatistics[unit.unitId].questionsOnSubUnits})`
          ).toString()
        case 'drafts':
          return (
            unitStatistics[unit.unitId].draftsOnUnit +
            ` (total ${unitStatistics[unit.unitId].draftsOnUnit + unitStatistics[unit.unitId].draftsOnSubUnits})`
          ).toString()
        default:
          return ''
      }
    } else {
      switch (typeOfStatistic) {
        case 'questions':
          return unitStatistics[unit.unitId].questionsOnUnit.toString()
        case 'drafts':
          return unitStatistics[unit.unitId].draftsOnUnit.toString()
        default:
          return ''
      }
    }
  }

  const getRows = (units: Unit[]) => {
    return units.map((unit) => (
      <tr key={unit.unitId}>
        <td>
          <button className="ic-link iu-ml-700 iu-text-left" type="button" id={unit.unitId} onClick={handleChooseUnit}>
            {unit.unitName}
          </button>
        </td>
        <td>{getUnitStatistics(unit, 'questions')}</td>
        <td>{getUnitStatistics(unit, 'drafts')}</td>
      </tr>
    ))
  }

  const handleChooseUnit = (event: React.MouseEvent) => {
    const unitId = event.currentTarget.id

    dispatch(setUnit(unitId))
  }

  return (
    <>
      {user?.careProviders.map((careProvider, idx) => {
        const headings = [careProvider.name, 'Ej hanterade ärenden', 'Ej signerade utkast']

        return (
          <SimpleTable headings={headings} key={idx} className="iu-mb-800">
            {careProvider.careUnits.map((careUnit) =>
              careUnit.units.length > 0 ? (
                <ExpandableTableRow
                  rowContent={[careUnit.unitName, getUnitStatistics(careUnit, 'questions'), getUnitStatistics(careUnit, 'drafts')]}
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
                  <td>{getUnitStatistics(careUnit, 'questions')}</td>
                  <td>{getUnitStatistics(careUnit, 'drafts')}</td>
                </tr>
              )
            )}
          </SimpleTable>
        )
      })}
    </>
  )
}
