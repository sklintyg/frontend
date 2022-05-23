import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../store/user/userSelectors'
import { setUnit } from '../../store/user/userActions'
import { SimpleTable } from '@frontend/common'
import { ExpandableTableRow } from './ExpandableTableRow'

export const CareProviderModalContent: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector(getUser)

  const handleChooseUnit = (event: React.MouseEvent) => {
    const unitId = event.currentTarget.id

    dispatch(setUnit(unitId))
  }

  return (
    <>
      {user?.careProviders.map((careProvider, idx) => {
        const headings = [careProvider.name, 'Ej hanterade ärenden', 'Ej signerade utkast']

        return (
          <SimpleTable headings={headings} key={idx}>
            {careProvider.careUnits.map((careUnit) => {
              return (
                <ExpandableTableRow
                  careUnit={careUnit.unitName}
                  careUnitId={careUnit.unitId}
                  units={careUnit.units}
                  handleChooseUnit={handleChooseUnit}
                  key={careUnit.unitId}
                />
              )
            })}
          </SimpleTable>
        )
      })}
    </>
  )
}
