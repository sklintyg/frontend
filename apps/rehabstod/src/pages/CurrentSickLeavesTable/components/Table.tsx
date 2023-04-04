import { useGetSickLeavesQuery, useGetUserQuery } from '../../../store/api'
import { sortOnColumn, toggleAscending } from '../../../store/sickLeaveSlice'
import { getSortedSickLeaves } from '../utils/getSortedSickLeaves'
import { TableBodyRows } from './TableBodyRows'
import { TableHeaderRow } from './TableHeaderRow'

export function Table() {
  const { data: currentSickLeaves } = useGetSickLeavesQuery()
  const { data: user } = useGetUserQuery()
  const isDoctor = !!user && !!user.roles.LAKARE

  return (
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
  )
}
