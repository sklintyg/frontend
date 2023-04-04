import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import { useGetSickLeavesQuery, useGetUserQuery } from '../../store/api'
import { reset, resetFilters, sortOnColumn, toggleAscending, updateFilter, updateShowPersonalInformation } from '../../store/sickLeaveSlice'
import { RootState, useAppDispatch } from '../../store/store'
import { Filters } from './components/Filters'
import { TableBodyRows } from './components/TableBodyRows'
import { TableHeaderRow } from './components/TableHeaderRow'
import { TableInfo } from './components/TableInfo'
import { getSortedSickLeaves } from './utils/getSortedSickLeaves'

export function CurrentSickLeaves() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const { showPersonalInformation, ascending, currentColumn, filter } = useSelector((state: RootState) => state.sickLeave)
  const { isLoading: currentSickLeaveLoading, data: currentSickLeaves } = useGetSickLeavesQuery(filter ? undefined : skipToken)
  const { patientId } = useParams()
  const dispatch = useAppDispatch()
  const isLoading = userLoading || currentSickLeaveLoading
  const isDoctor = !!user && !!user.roles.LAKARE

  useEffect(
    () => () => {
      dispatch(reset())
    },
    [dispatch]
  )

  if (patientId) {
    return <Outlet />
  }

  return (
    <div className="ids-content py-10">
      <h1 className="ids-heading-2">Pågående sjukfall</h1>
      <h2 className="ids-heading-3 mb-10">{user && user.valdVardenhet ? user.valdVardenhet.namn : ''}</h2>
      <hr className="opacity-40" />

      <Filters
        onSearch={() => dispatch(updateFilter('filter'))}
        onReset={() => {
          dispatch(resetFilters())
        }}
        isDoctor={isDoctor}
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
        <tbody style={{ overflowWrap: 'anywhere' }}>
          <TableBodyRows
            isDoctor={isDoctor}
            isLoading={isLoading}
            showPersonalInformation={showPersonalInformation}
            sickLeaves={currentSickLeaves ? getSortedSickLeaves(currentSickLeaves, ascending, currentColumn) : undefined}
            unitId={user && user.valdVardenhet ? user.valdVardenhet.namn : ''}
          />
        </tbody>
      </table>
    </div>
  )
}
