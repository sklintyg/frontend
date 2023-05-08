import { useEffect, useRef } from 'react'
import { ModifyTableColumns } from '../../../components/Table/ModifyTableColumns'
import { useGetUserQuery, useUpdateTableColumnsMutation } from '../../../store/api'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { allSickLeaveColumns, sickLeaveColumnsString } from '../../../store/slices/sickLeaveTableColumns.selector'
import { hideColumn, moveColumn, showAllColumns, showColumn } from '../../../store/slices/sickLeaveTableColumns.slice'

export function ModifySicknessTableColumns() {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const columns = useAppSelector(allSickLeaveColumns)
  const columnString = useAppSelector(sickLeaveColumnsString)
  const [updateTableColumns] = useUpdateTableColumnsMutation()
  const lastRequest = useRef<ReturnType<typeof updateTableColumns>>()

  useEffect(() => {
    lastRequest.current?.abort()
    if (user && columnString !== user?.preferences.sjukfallTableColumns) {
      lastRequest.current = updateTableColumns({ sjukfallTableColumns: columnString })
    }
  }, [columnString, updateTableColumns, user])

  return (
    <ModifyTableColumns
      columns={columns}
      onChecked={(column, visible) => dispatch(visible ? showColumn(column) : hideColumn(column))}
      onMove={(column, direction) => {
        dispatch(moveColumn({ column, direction }))
      }}
      onShowAll={() => {
        dispatch(showAllColumns())
      }}
    />
  )
}
