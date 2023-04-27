import { useEffect, useRef } from 'react'
import { ModifyTableColumns } from '../../../components/Table/ModifyTableColumns'
import { useGetUserQuery, useUpdateTableColumnsMutation } from '../../../store/api'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { allSjukfallColumns, sjukfallColumnsString } from '../../../store/slices/sjukfallTableColumnsSelectors'
import { checkAllColumns, hideColumn, moveColumn, showColumn } from '../../../store/slices/sjukfallTableColumnsSlice'

export function ModifySicknessTableColumns() {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const columns = useAppSelector(allSjukfallColumns)
  const columnString = useAppSelector(sjukfallColumnsString)
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
        dispatch(checkAllColumns())
      }}
    />
  )
}
