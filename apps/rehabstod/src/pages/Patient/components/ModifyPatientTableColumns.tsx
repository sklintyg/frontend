import { useEffect, useRef } from 'react'
import { ModifyTableColumns } from '../../../components/Table/ModifyTableColumns'
import { useGetUserQuery, useUpdateTableColumnsMutation } from '../../../store/api'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { allPatientColumns, patientColumnsString } from '../../../store/slices/patientTableColumnsSelectors'
import { hideColumn, moveColumn, PatientColumn, showAllColumns, showColumn } from '../../../store/slices/patientTableColumnsSlice'

export function ModifyPatientTableColumns() {
  const dispatch = useAppDispatch()
  const { data: user } = useGetUserQuery()
  const columns = useAppSelector(allPatientColumns)
  const columnString = useAppSelector(patientColumnsString)
  const [updateTableColumns] = useUpdateTableColumnsMutation()
  const lastRequest = useRef<ReturnType<typeof updateTableColumns>>()

  useEffect(() => {
    lastRequest.current?.abort()
    if (user && columnString !== user?.preferences.patientTableColumns) {
      lastRequest.current = updateTableColumns({ patientTableColumns: columnString })
    }
  }, [columnString, updateTableColumns, user])

  return (
    <ModifyTableColumns
      columns={columns.filter(({ name }) => name !== PatientColumn.Intyg)}
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
