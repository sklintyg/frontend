import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGetSickLeavesMutation, useGetUserQuery } from '../../store/api'
import { RootState, useAppDispatch } from '../../store/store'
import { Filters } from './components/Filters'
import { TableBodyRows } from './components/TableBodyRows'
import { TableHeaderRow } from './components/TableHeaderRow'
import { TableInfo } from './components/TableInfo'
import { reset, sortOnColumn, toggleAscending, updateShowPersonalInformation } from './sickLeaveSlice'
import { getSortedSickLeaves } from './utils/getSortedSickLeaves'

export function CurrentSickLeaves() {
  const [triggerGetSickLeaves, { isLoading: currentSickLeaveLoading, data: currentSickLeaves }] = useGetSickLeavesMutation()
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const { showPersonalInformation, ascending, currentColumn } = useSelector((state: RootState) => state.sickLeave)
  const dispatch = useAppDispatch()
  const isLoading = userLoading || currentSickLeaveLoading

  useEffect(
    () => () => {
      dispatch(reset())
    },
    [dispatch]
  )

  return (
    <div className="ids-content py-10">
      <h1 className="ids-heading-2">Pågående sjukfall</h1>
      <h2 className="ids-heading-3 mb-10">{user && user.valdVardenhet ? user.valdVardenhet.namn : ''}</h2>
      <hr className="opacity-40" />

      <Filters
        onSearch={() => triggerGetSickLeaves()}
        onReset={() => {
          dispatch(reset())
        }}
      />

      <TableInfo
        onShowPersonalInformationChange={(checked) => {
          dispatch(updateShowPersonalInformation(checked))
        }}
        showPersonalInformation={showPersonalInformation}
        totalNumber={(currentSickLeaves ?? []).length}
        listLength={(currentSickLeaves ?? []).length}
        daysAfterSickLeaveEnd={user?.preferences?.maxAntalDagarMellanIntyg ?? ''}
        daysBetweenCertificates={user?.preferences?.maxAntalDagarSedanSjukfallAvslut ?? ''}
      />

      <table className="ids-table overflow-visible rounded-md">
        <thead>
          <TableHeaderRow
            ascending={ascending}
            currentColumn={currentColumn}
            showPersonalInformation={showPersonalInformation}
            onColumnSort={(column) => {
              if (currentColumn !== column) {
                dispatch(sortOnColumn(column))
              } else {
                dispatch(toggleAscending())
              }
            }}
          />
        </thead>
        <tbody>
          <TableBodyRows
            isLoading={isLoading}
            showPersonalInformation={showPersonalInformation}
            sickLeaves={currentSickLeaves ? getSortedSickLeaves(currentSickLeaves ?? [], ascending, currentColumn) : undefined}
          />
        </tbody>
      </table>
    </div>
  )
}
